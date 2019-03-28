// eslint-disable-next-line
const REGEX_EMAIL = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i;

function createValidator(errors = {}) {
    function validator(value) {
        const state = {
            value,
            isError: false,
            errors: [],
            classNames: []
        };

        if (value && !REGEX_EMAIL.test(value)) {
            return {
                ...state,
                isError: true,
                errors: [errors.PATTERN],
                classNames: ['input-error-email']
            };
        }

        return state;
    }

    return validator;
}

export default createValidator;
