import { h, render, Component } from 'preact';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

import LabelInputField from './labelInputField';

const getUserName = (value) => {
    const URL = 'https://dev.protonmail.com/api/users/available';
    const headers = new Headers({
        'x-pm-apiversion': 3,
        'x-pm-appversion': 'Web_3.15.13'
    });
    return fetch(URL + `?Name=${value}`, {
        headers
    }).then((response) => {
        return response.json().then((data) => {
            return {
                success: response.ok,
                data
            };
        });
    });
};

function validator(value, { required, maxlength, minlength, data: { success, data: requestData = {} } = {} }) {
    const errors = [];
    const classNames = [];

    const state = {
        value,
        isError: false,
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
    return state;
}

export default class UsernameInput extends Component {
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
        console.log('INPUT', state);
        return this.setState(state);
    }
    onchange({ target }) {
        const value = target.value || '';
        console.log('CHANGE', value);

        // Don't perform the validation of the username if no changes or already isError
        if (this.state.custom === value || this.state.isError) {
            return console.log('--- no change --');
        }

        getUserName(value).then((data) => {
            const state = this.validate(value, data);
            console.log('[VALID]', state);

            // Erase old custom value if success
            this.setState({
                custom: data.success ? '' : this.state.custom,
                ...state
            });
        });
    }

    chooseSuggestion(value) {
        this.setState({
            custom: value,
            Suggestions: undefined,
            errors: [],
            isError: false
        });
    }

    render(props) {
        return (
            <LabelInputField
                {...omit(props, ['maxlength', 'minlength'])}
                value={this.state.custom || this.state.value}
                className={(this.state.classNames || []).join(' ')}
                oninput={debounce(this.oninput.bind(this), 300)}
                onchange={debounce(this.onchange.bind(this), 300)}
            >
                {this.state.isError && (
                    <div class="error">
                        {this.state.errors.map((error) => (
                            <p>{error}</p>
                        ))}
                    </div>
                )}

                {this.state.isError && this.state.suggestions && (
                    <div class="suggestions">
                        {this.state.suggestions.map((name) => (
                            <button type="button" onclick={() => this.chooseSuggestion(name)}>
                                {name}
                            </button>
                        ))}
                    </div>
                )}
            </LabelInputField>
        );
    }
}
