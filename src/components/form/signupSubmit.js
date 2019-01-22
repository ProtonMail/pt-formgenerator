import { h, render } from 'preact';

const submit = () => {
    window.parent.postMessage({
        type: 'submit.init'
    });
};

function signupSubmit({ messages, button }) {
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

            <button type="submit" onclick={() => submit()} class="btn btn-submit">
                {button.label}
            </button>

            <a href="/login" class="link">
                {messages.alreadyUser}
            </a>
        </footer>
    );
}

export default signupSubmit;
