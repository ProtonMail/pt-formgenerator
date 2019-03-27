import { h } from 'preact';

import bridge from '../../lib/bridge';

const callBridgeSubmit = bridge('submit.init', (item) => item);

function signupSubmit({ messages, button, iframeName, baseUrl, fallback }) {
    const onClick = () => callBridgeSubmit({ fallback }, { iframeName });

    return (
        <footer class="signupSubmit">
            <p>
                <span>{messages.agreeLabel}</span>
                <br />
                <a href="https://protonmail.com/terms-and-conditions" target="_blank">
                    {messages.agreeLink}
                </a>
                .
            </p>

            <button type="submit" class="btn btn-submit" name="submitBtn" onClick={onClick}>
                {button.label}
            </button>

            <a href={`${baseUrl}/login`} class="link" target="_parent">
                {messages.alreadyUser}
            </a>
        </footer>
    );
}

export default signupSubmit;
