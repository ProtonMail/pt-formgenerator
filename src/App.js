import { h, Component } from 'preact';

import LabelInputField from './components/form/labelInputField';
import UsernameInput from './components/form/usernameInput';
import './App.css';

export default class App extends Component {
    submit({ target }) {
        const data = new FormData(target);
        for (const item of data.entries()) {
            console.log(item);
        }
    }
    render({ config }) {
        console.log('[CONFIG]', config);
        return (
            <div>
                <form name="dew" onsubmit={(e) => (e.preventDefault(), this.submit(e))} novalidate>
                    {config.map(({ component, ...input }) => {
                        if (component === 'username') {
                            return <UsernameInput {...input} />;
                        }
                        return <LabelInputField {...input} />;
                    })}

                    <button>Send</button>
                </form>
            </div>
        );
    }
}

/*
<LabelInputField
    name="username"
    placeholder="Jean Valjean"
    labelText="Select your username"
    oninput={({ target }) => console.log(target.value)}
/>
<UsernameInput
    name="username"
    placeholder="Jean Valjean"
    labelText="Select your username"
    oninput={({ target }) => console.log(target.value)}
/>

<LabelInputField
    name="password"
    type="password"
    placeholder="*******"
    labelText="Your password"
    oninput={({ target }) => console.log(target.value)}
/>
 */
