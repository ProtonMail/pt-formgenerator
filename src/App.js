import { h, Component } from 'preact';

import LabelInputField from './components/form/labelInputField';
import UsernameInput from './components/form/usernameInput';
import EmailInput from './components/form/emailInput';
import SignupSubmit from './components/form/signupSubmit';
import Select from './components/form/select';

export default class App extends Component {
    render({ config, name }) {
        return (
            <div class="formList">
                {config.map(({ component, ...input }) => {
                    if (component === 'username') {
                        return <UsernameInput {...input} iframeName={name} />;
                    }
                    if (component === 'domains') {
                        return <Select {...input} iframeName={name} />;
                    }
                    if (input.type === 'email') {
                        return <EmailInput {...input} iframeName={name} />;
                    }
                    if (component === 'signupSubmit') {
                        return <SignupSubmit {...input} iframeName={name} />;
                    }
                    return <LabelInputField {...input} iframeName={name} />;
                })}
            </div>
        );
    }
}
