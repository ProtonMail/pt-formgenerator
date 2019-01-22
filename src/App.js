import { h, Component } from 'preact';

import LabelInputField from './components/form/labelInputField';
import './App.css';

export default class App extends Component {
    submit({ target }) {
        const data = new FormData(target);
        for (const item of data.entries()) {
            console.log(item);
        }
    }
    render() {
        return (
            <div>
                <form onsubmit={(e) => (e.preventDefault(), this.submit(e))} novalidate>
                    <LabelInputField
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
                    <button>Send</button>
                </form>
            </div>
        );
    }
}
