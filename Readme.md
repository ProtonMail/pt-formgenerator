Tested with:
- Node.js `v11.6.0`
- npm `6.5.0-next.0` ┐(‘～`；)┌

Before you start: `$ npm i`.

## Dev

- `$ npm start`

You can test forms by adding inside the console by hand/inside `main.js` an event:

- URL: `http://localhost:1234/?name=bottom`

> cf the key **name** inside data.

```javascript
window.postMessage({
    type: 'create.form',
    data: {
        name: 'bottom',
        config: [
            {
                component: 'email',
                label: 'Add a recovery email',
                placeholder: 'Recovery Email',
                type: 'email',
                name: 'notificationEmail'
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
});
```

- URL: `http://localhost:1234/?name=top`

> cf the key **name** inside data.

```javascript
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
```


## Build

- `$ npm run build`

It will create 3 files:
- `dist/main.js`: _App bundle_
- `dist/main.js.map`: _Sourcemap_
- `dist/main.css`: _Stylesheet_
