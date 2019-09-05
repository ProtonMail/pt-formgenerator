const noop = () => {};

const CONFIG = {
    APP_URL_ENV: '',
    URL_ENV: '*'
};

/**
 * Check if we talk to the right iframe
 *   - subdomain of protonmail
 *   - localhost dev server (ex: localhost:8080)
 * @param  {String} sourceUrl
 * @return {Boolean}           True if it's ok
 */
export function testOrigin(sourceUrl = '') {
    if (/localhost:\d{4}$/.test(sourceUrl)) {
        return true;
    }
    return /protonmail/.test(sourceUrl);
}

// Wrapper for E2E to work as expected
const sendMessage = (config, env) => {
    /* START.DEV_ONLY */
    return window.postMessage(config, env);
    /* END.DEV_ONLY */
    window.parent.postMessage(config, env);
};

/**
 * Create a bridge to pass some informations to the parent of the iframe
 * based on state and props.
 *     - Reserved name inside the output of formatState: name.
 * It's built-in as the scope of the event, iframe's name.
 * @param  {String} type        Type of event
 * @param  {Function} formatState Format the state(state+ props) -> returns an Object
 * @return {Function}             (<state:Object>, <props:Object>)
 */
const callApp = (type, formatState = noop) => {
    // Always extrat the name from the iframe as a scope.
    const extratIframeName = ({ iframeName: name } = {}) => ({ name });

    return (state = {}, props = {}) => {
        if (window.location.origin !== CONFIG.URL_ENV) {
            return console.error('You try to contact the wrong URL', CONFIG.URL_ENV);
        }
        sendMessage(
            {
                type,
                data: {
                    fallback: CONFIG.fallback,
                    ...extratIframeName(props),
                    ...formatState(state, props)
                }
            },
            CONFIG.APP_URL_ENV
        );
    };
};

/* START.DEV_ONLY */
window.haQueCoucou = callApp;
/* END.DEV_ONLY */

export const setFallback = (test) => (CONFIG.fallback = test);
export const setEnvUrl = (url) => (CONFIG.URL_ENV = url);
export const setAppEnvUrl = (url) => (CONFIG.APP_URL_ENV = url);

export default callApp;
