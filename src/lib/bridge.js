const noop = () => {};

const CONFIG = {
    URL_ENV: '*'
};

export function testOrigin(sourceUrl) {
    const keys = sourceUrl.split('.');
    const values = keys.length === 2 ? keys[0] : keys[1];
    if (/localhost:\d{4}$/.test(sourceUrl)) {
        return true;
    }
    return /protonmail/.test(sourceUrl);
}

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
        window.parent.postMessage(
            {
                type,
                data: {
                    ...extratIframeName(props),
                    ...formatState(state, props)
                }
            },
            CONFIG.URL_ENV
        );
    };
};

export const setEnvUrl = (url) => (CONFIG.URL_ENV = url);

export default callApp;
