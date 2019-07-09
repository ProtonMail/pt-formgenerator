import { h } from 'preact';

import Select from './select';

const getClassNames = (start, extend) => [start, extend].filter(Boolean).join(' ');

function labelInputField({ label, children, domains, classNameInput, className, ...attributes }) {
    return (
        <div className={getClassNames('field', className)}>
            <div className="group-username flex">
                <label for={attributes.name} className="pm-label sr-only">
                    {label}
                </label>
                <input
                    {...attributes}
                    id={attributes.name}
                    className={getClassNames('pm-field input', classNameInput)}
                    aria-invalid={classNameInput.includes('invalid')}
                />

                {domains ? (
                    <Select {...domains} className={classNameInput.includes('invalid') ? 'invalid' : ''} />
                ) : null}
            </div>

            {children}
        </div>
    );
}

export default labelInputField;
