import { h, Component } from 'preact';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

import LabelInputField from './labelInputField';
import usernameValidator from './validators/username';
import bridge, { testOrigin } from '../../lib/bridge';

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
const callBridgeStateInput = bridge(
    'usernameInput.info',
    ({ isError, isAvailable, isLoading, isEnter, value } = {}) => ({
        isError,
        isLoading,
        isAvailable,
        isEnter,
        value
    })
);

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

    componentWillMount() {
        if (typeof this.state.value === 'undefined' && this.props.value) {
            this.onInput({ target: this.props });
        }
    }

    onMessage({ origin, data: { type, data = {}, value } }) {
        if (!testOrigin(origin)) {
            throw new Error('Wrong targetOrigin set' + origin);
        }

        /*
            Force validation if we need to when we try to create the user
                - untouch form
                - add password
                - press enter
                - we need to validate the form inside the iframe
         */
        if (type === 'submit.broadcast') {
            const state = this.validate(this.state.value, {
                success: this.state.isAvailable // Keep success state if available
            });

            console.log('----', { state, data }, this.state);

            const newState = { ...state, isLoading: !!this.state.value, isError: false };

            // No username no need to perform a request
            if (!newState.isLoading) {
                const state = this.validate(this.state.value);
                this.setState(state);
                console.log('----2', state, data);
                return callBridgeStateInput(state, this.props);
            }

            // Make a request and inform the app about the UI change we need
            this.setState(newState);
            callBridgeUserName({ value: this.state.value }, this.props);
            callBridgeStateInput(newState, this.props);
            console.log('----3', state, newState);
        }

        if (type === 'usernameInput.query') {
            const state = this.validate(value, data, true);

            // Always inform the parent that we made a change
            callBridgeStateInput(state, this.props);

            // Erase old custom value if success
            this.setState({
                isAvailable: data.success,
                isLoading: false,
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
     * @param  {Boolean} omitValue  True to don't attach the value
     * @return {Object}
     */
    validate(value, data, omitValue) {
        const { required, maxlength, minlength } = this.props;
        return this.validator(value, { required, maxlength, minlength, data }, omitValue);
    }

    onKeyDown({ key }) {
        if (key === 'Enter') {
            const state = this.validate(this.state.value);

            if (!this.state.isError && !this.state.value) {
                this.setState(state);
            }

            callBridgeStateInput(
                {
                    ...this.state, // source of truth
                    isEnter: true
                },
                this.props
            );
        }
    }

    onInput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);

        /*
            Inform the webapp about the current state of the input.
            we resize the iframe, so if we have an error or not we need to know
         */

        this.setState(state);
        callBridgeStateInput(state, this.props);
    }

    getClassNamesInput() {
        return [this.state.isError && 'invalid', ...(this.state.classNames || [])].filter(Boolean).join(' ');
    }

    render({ domains, ...props }) {
        // pattern support for :valid is 100%, minlength not supported on IE11
        const pattern = `.{${props.minlength || 1},${props.maxlength}}`;
        return (
            <LabelInputField
                {...omit(props, ['errors', 'maxlength', 'minlength', 'api', 'value'])}
                pattern={pattern}
                value={this.state.value}
                className={COMPONENT_CLASSNAME}
                classNameInput={this.getClassNamesInput()}
                domains={domains}
                onInput={this.onInput.bind(this)}
                onKeyDown={debounce(this.onKeyDown.bind(this), 200)}
            >
                {this.state.isError && (
                    <div className="error error-zone">
                        {this.state.errors.map((error) => (
                            <p className="color-global-warning error-zone m0">{error}</p>
                        ))}
                    </div>
                )}

                {this.state.isAvailable && (
                    <div className="block-info-standard-success mt1 success">
                        <p className="p0-5 m0">{props.messages.username.AVAILABLE}</p>
                    </div>
                )}
                {this.state.isLoading && (
                    <div className="loaderContainer info flex flex-items-center mt1">
                        <p className="p0 m0 italic">{props.messages.username.CHECKING}</p>
                        <div class="loader ml1" aria-busy="true"></div>
                    </div>
                )}
            </LabelInputField>
        );
    }
}
