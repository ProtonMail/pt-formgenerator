import { h, render } from 'preact';
import App from './App';
// import './App.scss';

const node = document.getElementById('app');

const matchIframe = (name) => {
    const url = window.location.search || '';
    return url.includes(`name=${name}`);
};

const cb = ({ data: { type, data = {} } = {} }) => {
    if (type === 'create.form' && matchIframe(data.name)) {
        console.log('[CONFIG]', data.config);
        render(<App config={data.config} name={data.name} />, node, node.lastChild);
        node.setAttribute('data-name', data.name);
        window.removeEventListener('message', cb, false);
    }
};

window.addEventListener('message', cb, false);

// window.postMessage({
//     type: 'create.form',
//     data: {
//         name: 'bottom',
//         config: [
//             {
//                 component: 'email',
//                 label: 'Add a recovery email',
//                 placeholder: 'Recovery Email',
//                 type: 'email',
//                 name: 'notificationEmail'
//             },
//             {
//                 component: 'signupSubmit',
//                 messages: {
//                     agreeLabel: 'By clicking Create Account, you agree to abide by',
//                     agreeLink: "ProtonMail's Terms and Conditions",
//                     alreadyUser: 'Already have an account?'
//                 },
//                 button: {
//                     label: 'Create Account'
//                 }
//             }
//         ]
//     }
// });

window.postMessage({
    type: 'create.form',
    data: {
        name: 'top',
        config: [
            {
                component: 'username',
                label: 'Choose a username',
                placeholder: 'Jean Valjean',
                maxlength: 10,
                minlength: 3,
                required: true,
                name: 'username',
                api: {
                    url: 'https://mail.protonmail.com/api/users/available',
                    headers: {
                        'x-pm-apiversion': 3,
                        'x-pm-appversion': 'Web_3.15.13'
                    }
                },
                domains: {
                    component: 'domains',
                    label: 'Select a domain',
                    name: 'domain',
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
            }
        ]
    }
});
