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
        options: [
            {
                selected: true,
                value: 'protonmail.com'
            },
            {
                value: 'protonmail.ch'
            }
        ]
    }
];

const cb = ({ data: { type, data = {} } = {} }) => {
    if (type === 'create.form') {
        console.log('[CONFIG]', config);
        render(<App config={data.config} />, node, node.lastChild);
        window.removeEventListener('message', cb, false);
    }
};
window.addEventListener('message', cb, false);

// window.postMessage({
//     type: 'create.form',
//     data: {
//         config
//     }
// });
