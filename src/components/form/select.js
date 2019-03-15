import { h } from 'preact';

function select({ label, children, options = [], ...attributes }) {
    return (
        <div class="field field-select">
            <label for={attributes.name}>{label}</label>
            <div class="select-mask">
                <select {...attributes} id={attributes.name}>
                    {options.map(({ label, ...option }) => (
                        <option {...option}>{label || option.value}</option>
                    ))}
                </select>
                <i>▼</i>
            </div>
            {children}
        </div>
    );
}

export default select;
