import { h, render } from 'preact';
/* START.IE_ONLY */
import '@babel/polyfill';
/* END.IE_ONLY */
import App from './App';
import bridge, { setEnvUrl, setAppEnvUrl, testOrigin } from './lib/bridge';

/* START.DEV_ONLY */
import envTest from './dev/env';
/* END.DEV_ONLY */

const node = document.getElementById('app');

/**
 * Create custom config with <name> => value based on inputs/select etc.
 * @param  {Array} nodes Array of nodes
 * @return {Object}      { inputs: <Object>, selects: <Object> }
 */
const getConfig = (nodes) => {
    return nodes.reduce(
        (acc, node) => {
            if (node.nodeName === 'SELECT') {
                acc.selects[node.name] = node[node.selectedIndex].value;
                return acc;
            }
            acc.inputs[node.name] = node.value;
            return acc;
        },
        {
            inputs: Object.create(null),
            selects: Object.create(null)
        }
    );
};

const matchIframe = (name) => {
    const url = window.location.search || '';
    return url.indexOf(`name=${name}`) > -1;
};

const cb = ({ origin, data: { type, data = {}, fallback = false } = {} }) => {
    if (type === 'create.form' && matchIframe(data.name)) {
        if (!origin) {
            throw new Error('You must define a [targetOrigin] in order to scope postMessage()');
        }

        if (!testOrigin(origin)) {
            throw new Error('Wrong targetOrigin set' + origin);
        }

        setEnvUrl(origin);
        setAppEnvUrl(data.targetOrigin);
        render(<App config={data.config} name={data.name} fallback={fallback} />, node, node.lastChild);
        node.setAttribute('data-name', data.name);
        !fallback && window.removeEventListener('message', cb, false);

        // Give to the parent app, we're ready. ex: to have a loader
        const callBridge = bridge('app.loaded', (item) => item);
        callBridge({}, { iframeName: node.getAttribute('data-name') });
    }

    // Fallback mode, we extract the values from iframes and sent it back to the app
    if (type === 'submit.broadcast' && fallback) {
        const callBridge = bridge('child.message.data', (item) => item);

        // Error is a convention all error classNames on input must have error inside.
        callBridge(
            {
                id: '{{id}}',
                form: getConfig([...document.querySelectorAll(':not([class*="error"]), select')])
            },
            { iframeName: node.getAttribute('data-name') }
        );
        setTimeout(() => window.removeEventListener('message', cb, false), 100);
    }
};

window.addEventListener('message', cb, false);

/* START.DEV_ONLY */
envTest();
/* END.DEV_ONLY */
