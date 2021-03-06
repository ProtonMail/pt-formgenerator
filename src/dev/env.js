import '../App.scss';

// With Cypress 3.2.0 it loads Electron 59 without support of AbortControll
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

const ERRORS = {
    USERNAME: {
        REQUIRED: 'You must set a username',
        MAXLENGTH: 'Max length for a username is 40',
        PATTERN: 'It must contains only letters/digits or - and start with a letter/digit',
        TOO_MUCH: 'You are doing this too much, please try again later',
        OFFLINE: 'No Internet connection found.',
        REQUEST: 'The request failed'
    },
    EMAIL: {
        PATTERN: 'Invalid email'
    }
};

const getQueryParams = () => {
    return window.location.search.split('&').reduce((acc, item = '') => {
        const [key = '', value = ''] = item.split('=');
        acc[key.replace(/\?|&/, '').trim()] = value.trim();
        return acc;
    }, {});
};

const generateRequest = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    return { controller, signal };
};

async function main() {
    let REQUEST = generateRequest();

    async function query(url) {
        try {
            if (REQUEST.active) {
                REQUEST.controller.abort();
                REQUEST = generateRequest();
            }

            REQUEST.active = true;

            const res = await fetch(`https://mail.protonmail.com/api/users/${url}`, {
                signal: REQUEST.signal,
                headers: {
                    'x-pm-apiversion': '3',
                    'x-pm-appversion': 'Web_3.16.3',
                    Accept: 'application/vnd.protonmail.v1+json'
                }
            });
            REQUEST.active = false;
            const data = await res.json();
            return { data, success: res.ok };
        } catch (e) {
            if (REQUEST.active) {
                return;
            }

            return {
                data: e.data,
                success: false
            };
        }
    }

    console.log('[queryParams]', getQueryParams());

    // Else e2e won't work
    window.parent.addEventListener(
        'message',
        async (e) => {
            console.log('message', e.data);
            if (e.data.type === 'usernameInput.request') {
                const { name, queryParam = {} } = e.data.data || {};
                const data = await query(`available?Name=${queryParam.Name}`);

                data &&
                    window.postMessage(
                        {
                            type: 'usernameInput.query',
                            data,
                            value: queryParam.Name,
                            targetOrigin: '*'
                        },
                        '*'
                    );
            }
        },
        true
    );

    window.addEventListener(
        'message',
        async (e) => {
            console.log('message', e.data);
            if (e.data.type === 'usernameInput.request') {
                const { name, queryParam = {} } = e.data.data || {};
                const data = await query(`available?Name=${queryParam.Name}`);

                data &&
                    window.postMessage(
                        {
                            type: 'usernameInput.query',
                            data,
                            value: queryParam.Name,
                            targetOrigin: '*'
                        },
                        '*'
                    );
            }
        },
        true
    );

    window.postMessage(
        {
            type: 'create.form',
            data: {
                name: 'bottom',
                targetOrigin: '*',
                config: [
                    {
                        component: 'email',
                        label: 'Add a recovery email',
                        placeholder: 'Recovery Email',
                        type: 'email',
                        name: 'notificationEmail',
                        errors: ERRORS.EMAIL
                    },
                    {
                        component: 'signupSubmit',
                        messages: {
                            agreeLabel: 'By clicking Create Account, you agree to abide by',
                            agreeLink: "ProtonMail's Terms and Conditions",
                            alreadyUser: 'Already have an account?'
                        },
                        button: {
                            label: 'Create Account'
                        }
                    }
                ]
            }
        },
        '*'
    );

    window.postMessage(
        {
            type: 'create.form',
            data: {
                name: 'top',
                targetOrigin: '*',
                config: [
                    {
                        component: 'username',
                        label: 'Choose a username',
                        placeholder: 'Thomas A. Anderson',
                        maxlength: 40,
                        required: true,
                        name: 'username',
                        value: getQueryParams().username,
                        errors: ERRORS.USERNAME,
                        messages: {
                            username: {
                                AVAILABLE: 'Username available',
                                CHECKING: 'Checking username'
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
        },
        '*'
    );
}

export default main;
