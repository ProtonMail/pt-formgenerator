import { h, render } from 'preact';
import App from './App';

const node = document.getElementById('app');

const cb = ({ data: { type, data = {} } = {} }) => {
    if (type === 'create.form') {
        console.log('[CONFIG]', data.config);
        render(<App config={data.config} />, node, node.lastChild);
        node.setAttribute('data-name', data.name);
        window.removeEventListener('message', cb, false);
    }
};
window.addEventListener('message', cb, false);

// window.postMessage({
//     type: 'create.form',
//     data: {
//         name: 'dew',
//         config: [
//             {
//                 component: 'username',
//                 label: 'Choose a username',
//                 placeholder: 'Jean Valjean',
//                 maxlength: 10,
//                 minlength: 3,
//                 required: true,
//                 name: 'username'
//             },
//             {
//                 component: 'domains',
//                 label: 'Select a domain',
//                 name: 'domain',
//                 options: [
//                     {
//                         selected: true,
//                         value: 'protonmail.com'
//                     },
//                     {
//                         value: 'protonmail.ch'
//                     }
//                 ]
//             }
//         ]
//     }
// });
