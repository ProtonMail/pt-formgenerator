import { h, render } from 'preact';
import App from './App';
// import './dev/env';

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
