import { h } from 'preact';

function select({ label, children, options = [], className, ...attributes }) {
    return (
        <div class="field field-select onmobile-min-w100 flex">
            <label for={attributes.name} className="pm-label sr-only">
                {label}
            </label>
            <select
                {...attributes}
                id={attributes.name}
                className={[className, 'pm-field flex-item-fluid'].join(' ')}
                aria-invalid={className.includes('invalid')}
            >
                {options.map(({ label, ...option }) => (
                    <option {...option}>@{label || option.value}</option>
                ))}
            </select>
            {children}
        </div>
    );
}

export default select;
