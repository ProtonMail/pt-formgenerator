import { h, render, Component } from 'preact';
import debounce from 'lodash/debounce';

import LabelInputField from './labelInputField';

const REGEX_EMAIL = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i;

function validator(value) {
    const state = {
        value,
        isError: false,
        errors: [],
        classNames: []
    };

    if (!value || !REGEX_EMAIL.test(value)) {
        return {
            ...state,
            isError: true,
            errors: ['Invalid email'],
            classNames: ['input-error-email']
        };
    }

    return state;
}
const COMPONENT_CLASSNAME = 'field-email';

export default class EmailInput extends Component {
    validate(value, data) {
        return validator(value);
    }

    oninput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);
        return this.setState(state);
    }

    render({ domains, ...props }) {
        return (
            <LabelInputField
                {...props}
                value={this.state.value}
                className={COMPONENT_CLASSNAME}
                classNameInput={(this.state.classNames || []).join(' ')}
                oninput={debounce(this.oninput.bind(this), 300)}
            >
                {this.state.isError && (
                    <div class="error">
                        {this.state.errors.map((error) => (
                            <p>{error}</p>
                        ))}
                    </div>
                )}
            </LabelInputField>
        );
    }
}
