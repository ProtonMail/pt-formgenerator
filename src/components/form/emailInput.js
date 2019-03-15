import { h, render, Component } from 'preact';
import debounce from 'lodash/debounce';

import LabelInputField from './labelInputField';
import bridge from '../../lib/bridge';
import emailValidator from './validators/email';

const COMPONENT_CLASSNAME = 'field-email';
const callBridgeStateInput = bridge('emailInput.info', ({ isError }) => ({ isError }));

export default class EmailInput extends Component {
    constructor(props) {
        super();
        this.validator = emailValidator(props.errors);
    }

    validate(value) {
        return this.validator(value);
    }

    onInput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);
        callBridgeStateInput(state, this.props);
        return this.setState(state);
    }

    render({ domains, ...props }) {
        return (
            <LabelInputField
                {...props}
                value={this.state.value}
                className={COMPONENT_CLASSNAME}
                classNameInput={(this.state.classNames || []).join(' ')}
                onInput={debounce(this.onInput.bind(this), 300)}
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
