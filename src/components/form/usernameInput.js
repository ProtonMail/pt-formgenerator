import { h, Component } from 'preact';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

import LabelInputField from './labelInputField';
import usernameValidator from './validators/username';
import Select from './select';
import bridge from '../../lib/bridge';

const COMPONENT_CLASSNAME = 'field-usernameInput';

/**
 * Call the app to ask for a network request.
 * @param  {String} 'usernameInput.request' name of the event
 */
const callBridgeUserName = bridge('usernameInput.request', ({ value }) => ({
    type: 'available',
    queryParam: { Name: value }
}));

/**
 * Inform the app about the input's state
 * @param  {String} 'usernameInput.info' name of the event
 */
const callBridgeStateInput = bridge('usernameInput.info', ({ suggestions = [], isError, isAvailable } = {}) => ({
    suggestions,
    isError,
    isAvailable
}));

export default class UsernameInput extends Component {
    constructor(props) {
        super();
        this.validator = usernameValidator(props.errors);
        this.onMessage = this.onMessage.bind(this);
    }

    componentDidMount() {
        window.addEventListener('message', this.onMessage, false);
    }

    componentWillUnmount() {
        window.rempoveEventListener('message', this.onMessage, false);
    }

    onMessage({ data: { type, data = {}, value } }) {
        // Coming from the webapp
        if (type === 'usernameInput.query') {
            const state = this.validate(value, data);

            // Always inform the parent that we made a change
            callBridgeStateInput(state, this.props);

            // Erase old custom value if success
            this.setState({
                isAvailable: data.success,
                // custom: data.success ? '' : this.state.custom,
                ...state
            });
        }
    }

    /**
     * Validate an input value
     *     You can pass an API response as 2sd arg to provide more informations:
     *     ({ data: Object, success: true }))
     *     -> data = Response object from api request
     * @param  {String} value Input's value
     * @param  {Object} data  API response from the app
     * @return {Object}
     */
    validate(value, data) {
        const { required, maxlength, minlength } = this.props;
        return this.validator(value, { required, maxlength, minlength, data });
    }

    onInput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);

        // Reset custom value if you type something else
        if (this.state.custom !== value) {
            state.custom = '';
        }

        if (this.state.isError !== state.isError) {
            callBridgeStateInput(state, this.props);
        }

        return this.setState(state);
    }
    onChange({ target }) {
        const value = target.value || '';

        // Don't perform the validation of the username if no changes or already isError
        if (this.state.custom === value || this.state.isError) {
            return console.log('--- no change --');
        }

        callBridgeUserName({ value }, this.props);
    }

    chooseSuggestion(value) {
        const state = {
            custom: value,
            isAvailable: true,
            suggestions: undefined,
            errors: [],
            classNames: [],
            isError: false
        };
        callBridgeStateInput(state, this.props);
        this.setState(state);
    }

    render({ domains, ...props }) {
        return (
            <LabelInputField
                {...omit(props, ['errors', 'maxlength', 'minlength', 'api'])}
                value={this.state.custom || this.state.value}
                className={COMPONENT_CLASSNAME}
                classNameInput={(this.state.classNames || []).join(' ')}
                onInput={debounce(this.onInput.bind(this), 200)}
                onChange={debounce(this.onChange.bind(this), 300)}
            >
                <Select {...domains} />

                {this.state.isError && (
                    <div class="error">
                        {this.state.errors.map((error) => (
                            <p>{error}</p>
                        ))}
                    </div>
                )}

                {this.state.isError && this.state.suggestions && (
                    <div class="suggestions">
                        <h4>Available usernames:</h4>
                        {this.state.suggestions.map((name) => (
                            <button type="button" onClick={() => this.chooseSuggestion(name)}>
                                {name}
                            </button>
                        ))}
                    </div>
                )}
                {this.state.isAvailable && (
                    <div class="success">
                        <p>Username available</p>
                    </div>
                )}
            </LabelInputField>
        );
    }
}
