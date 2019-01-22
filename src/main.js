import { h, render } from 'preact';
import App from './App';

const node = document.getElementById('app');

const config = [
    {
        component: 'username',
        label: 'Choose a username',
        placeholder: 'Jean Valjean',
        maxlength: 10,
        minlength: 3,
        required: true,
        name: 'username'
    },
    {
        component: 'domains',
        label: 'Select a domain',
        name: 'domains',
        options: ['protonmail.com', 'protonmail.ch']
    }
];
// window.addEventListener('message', cb, false);

render(<App config={JSON.parse(JSON.stringify(config))} />, node, node.lastChild);
