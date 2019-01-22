import { h, render } from 'preact';

function labelInputField({ label, children, ...attributes }) {
    return (
        <div class="field">
            <label for={name}>{label}</label>
            <input {...attributes} id={attributes.name} />
            {children}
        </div>
    );
}

export default labelInputField;
