import { h, render } from 'preact';

import App from './App';
import { setEnvUrl } from './lib/bridge';

/* START.DEV_ONLY */
import envTest from './dev/env';
/* END.DEV_ONLY */

const node = document.getElementById('app');

const matchIframe = (name) => {
    const url = window.location.search || '';
    return url.includes(`name=${name}`);
};

const cb = ({ data: { type, data = {} } = {} }) => {
    if (type === 'create.form' && matchIframe(data.name)) {
        console.log('[CONFIG]', data.config);

        if (!data.targetOrigin) {
            throw new Error('You must define a [targetOrigin] in order to scope postMessage()');
        }

        setEnvUrl(data.targetOrigin);
        render(<App config={data.config} name={data.name} />, node, node.lastChild);
        node.setAttribute('data-name', data.name);
        window.removeEventListener('message', cb, false);
    }
};

window.addEventListener('message', cb, false);

/* START.DEV_ONLY */
envTest();
/* END.DEV_ONLY */
