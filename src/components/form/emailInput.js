import { h, render, Component } from 'preact';
import debounce from 'lodash/debounce';

import LabelInputField from './labelInputField';
import bridge from '../../lib/bridge';

const REGEX_EMAIL = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i;

const callBridge = bridge('emailInput.info', ({ isError }) => ({ isError }));

function createValidator(errors = {}) {
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
                errors: [errors.PATTERN],
                classNames: ['input-error-email']
            };
        }

        return state;
    }

    return validator;
}
const COMPONENT_CLASSNAME = 'field-email';

export default class EmailInput extends Component {
    constructor(props) {
        super();
        this.validator = createValidator(props.errors);
    }
    validate(value, data) {
        return this.validator(value);
    }

    oninput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);
        callBridge(state, this.props);
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
