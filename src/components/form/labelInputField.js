import { h, render } from 'preact';

function labelInputField({ labelText, name, oninput, placeholder, type }) {
    return (
        <div class="field">
            <label for={name}>{labelText}</label>
            <input type={type} placeholder={placeholder} name={name} oninput={oninput} id={name} />
        </div>
    );
}

export default labelInputField;
