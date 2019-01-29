import { h, render, Component } from 'preact';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import 'unfetch/polyfill';

import LabelInputField from './labelInputField';
import Select from './select';
import bridge from '../../lib/bridge';

const COMPONENT_CLASSNAME = 'field-usernameInput';

let request = {};

const getUserName = (value) => {
    const { url, headers } = request;

    return fetch(url + `?Name=${value}`, { headers }).then((response) => {
        return response.json().then((data) => {
            return {
                success: response.ok,
                data
            };
        });
    });
};

const callBridge = bridge('usernameInput.info', ({ suggestions = [], isError, isAvailable } = {}) => {
    return { suggestions, isError, isAvailable };
});

function validator(value, { required, maxlength, minlength, data: { success, data: requestData = {} } = {} }) {
    const state = {
        value,
        isError: false,
        isAvailable: false,
        errors: [],
        classNames: [],
        suggestions: undefined
    };

    if (required && !value) {
        state.errors.push('You must set a username');
        state.classNames.push('input-error-required');
        return {
            ...state,
            isError: true
        };
    }

    if (success === false) {
        return {
            ...state,
            isError: true,
            errors: [requestData.Error],
            classNames: ['input-error-username'],
            suggestions: (requestData.Details || {}).Suggestions
        };
    }

    if (maxlength && maxlength < value.length) {
        state.errors.push(`Max length for a username is ${maxlength}`);
        state.classNames.push('input-error-maxlength');
    }
    if (minlength && minlength > value.length) {
        state.errors.push(`Min length for a username is ${minlength}`);
        state.classNames.push('input-error-minlength');
    }

    if (!/^((\w|\d)+(-|\w|\d)+)/.test(value)) {
        state.errors.push(`It must contains only letters/digits or - and start with a letter/digit`);
        state.classNames.push('input-error-pattern');
    }
    state.isError = !!state.errors.length;
    state.isAvailable = success === true && !state.isError;
    return state;
}

export default class UsernameInput extends Component {
    constructor(props) {
        super();

        if (!props.api) {
            throw new Error(
                'You configure a custom API for this component\n\n --> { url:<String>, headers:<Object> }\n'
            );
        }

        request = props.api;
    }
    validate(value, data) {
        const { required, maxlength, minlength } = this.props;
        return validator(value, { required, maxlength, minlength, data });
    }

    oninput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);

        // Reset custom value if you type something else
        if (this.state.custom !== value) {
            state.custom = '';
        }

        if (this.state.isError !== state.isError) {
            callBridge(state, this.props);
        }

        return this.setState(state);
    }
    onchange({ target }) {
        const value = target.value || '';

        // Don't perform the validation of the username if no changes or already isError
        if (this.state.custom === value || this.state.isError) {
            return console.log('--- no change --');
        }

        getUserName(value).then((data) => {
            const state = this.validate(value, data);

            // Always inform the parent that we made a change
            callBridge(state, this.props);

            // Erase old custom value if success
            this.setState({
                isAvailable: data.success,
                // custom: data.success ? '' : this.state.custom,
                ...state
            });
        });
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
        callBridge(state, this.props);
        this.setState(state);
    }

    render({ domains, ...props }) {
        return (
            <LabelInputField
                {...omit(props, ['maxlength', 'minlength', 'api'])}
                value={this.state.custom || this.state.value}
                className={COMPONENT_CLASSNAME}
                classNameInput={(this.state.classNames || []).join(' ')}
                oninput={debounce(this.oninput.bind(this), 200)}
                onchange={debounce(this.onchange.bind(this), 300)}
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
                            <button type="button" onclick={() => this.chooseSuggestion(name)}>
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
