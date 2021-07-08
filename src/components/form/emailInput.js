import { h, Component } from 'preact';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

import LabelInputField from './labelInputField';
import bridge from '../../lib/bridge';
import emailValidator from './validators/email';

const COMPONENT_CLASSNAME = 'field-email';
const callBridgeStateInput = bridge('emailInput.info', ({ isError, isEnter }) => ({ isError, isEnter }));

export default class EmailInput extends Component {
    constructor(props) {
        super();
        this.validator = emailValidator(props.errors);
    }

    validate(value) {
        return this.validator(value);
    }

    onKeyDown({ key }) {
        if (key === 'Enter') {
            const state = this.validate(this.state.value);
            !this.state.value && this.setState(state);
            callBridgeStateInput(
                {
                    ...state,
                    isEnter: true
                },
                this.props
            );
        }
    }

    onInput({ target }) {
        const value = target.value || '';
        const state = this.validate(value);
        callBridgeStateInput(state, this.props);
        return this.setState(state);
    }

    getClassNamesInput() {
        return [this.state.isError && 'invalid', ...(this.state.classNames || []), 'w100'].filter(Boolean).join(' ');
    }

    render({ domains, ...props }) {
        return (
            <LabelInputField
                {...omit(props, ['errors'])}
                value={this.state.value}
                className={COMPONENT_CLASSNAME}
                classNameInput={this.getClassNamesInput()}
                onInput={debounce(this.onInput.bind(this), 300)}
                onKeyDown={debounce(this.onKeyDown.bind(this), 200)}
            >
                {this.state.isError && (
                    <div class="error error-zone">
                        {this.state.errors.map((error) => (
                            <p className="color-global-warning error-zone m0">{error}</p>
                        ))}
                    </div>
                )}
            </LabelInputField>
        );
    }
}
