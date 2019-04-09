import { h } from 'preact';

import Select from './select';

const getClassNames = (start, extend) => [start, extend].filter(Boolean).join(' ');

function labelInputField({ label, children, domains, classNameInput, className, ...attributes }) {
    return (
        <div className={getClassNames('field', className)}>
            <div className="group-username">
                <label for={attributes.name}>{label}</label>
                <input {...attributes} id={attributes.name} className={getClassNames('input', classNameInput)} />

                {domains ? <Select {...domains} /> : null}
            </div>

            {children}
        </div>
    );
}

export default labelInputField;
