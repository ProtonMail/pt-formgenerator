Tested with:
- Node.js `v11.6.0`
- npm `6.7.0`

Before you start: `$ npm i`.

## Dev

- `$ npm start`

That's it. Now you can test:
- URL: `http://localhost:1234/?name=bottom`
- URL: `http://localhost:1234/?name=top`

### Conventions

When there is an error on an input it must have a className/error with `error` inside. Why ?
Because we need `input:not([class*="error"])` to check the validity.

### About dev env

- URL: `http://localhost:1234/?name=bottom`

> cf the key **name** inside data.

```javascript
window.postMessage({
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
        targetOrigin: '*',
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

> For this component you can see a custom config for the API, with a route and custom headers.

:warning: **You must set a key `targetOrigin` inside the config, as we use [postMessage() API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). It's important for the security.**
`

## Build

- `$ npm run build`

It will create 3 files:
- `dist/main.ie11.js`: _App bundle for IE11_
- `dist/main.ie11.js.map`: __Sourcemap__
- `dist/main.js`: _App bundle_
- `dist/main.js.map`: _Sourcemap_
- `dist/main.css`: _Stylesheet_

### Dev build

- `$ npm run dev`

> :warning: _It won't build the version for IE_

### New version

- `$ npm run version <patch|minor|major>` 
and :popcorn: it will do everything else.
