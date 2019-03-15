import { h } from 'preact';

const getClassNames = (start, extend) => [start, extend].filter(Boolean).join(' ');

function labelInputField({ label, children, classNameInput, className, ...attributes }) {
    return (
        <div className={getClassNames('field', className)}>
            <label for={attributes.name}>{label}</label>
            <input {...attributes} id={attributes.name} className={getClassNames('input', classNameInput)} />
            {children}
        </div>
    );
}

export default labelInputField;
