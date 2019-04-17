function createValidator(errors = {}) {
    function validator(
        value = '',
        { required, maxlength, minlength = 1, data: { success, data: requestData = {} } = {} },
        omitValue
    ) {
        const state = {
            ...(!omitValue && { value }),
            isError: false,
            isLoading: false,
            isAvailable: false,
            errors: [],
            classNames: [],
            suggestions: undefined
        };

        if (required && !value) {
            state.errors.push(errors.REQUIRED);
            state.classNames.push('input-error-required');
            return {
                ...state,
                isError: true
            };
        }

        if (success === false) {
            // too many requests
            const error = requestData.Code === 429 ? errors.TOO_MUCH : requestData.Error;
            return {
                ...state,
                isError: true,
                errors: [error],
                classNames: ['input-error-username'],
                suggestions: (requestData.Details || {}).Suggestions
            };
        }

        const isValidMinLength = value.length >= minlength;
        const isValidMaxLength = maxlength && maxlength < value.length;

        if (maxlength && maxlength < value.length) {
            state.errors.push(errors.MAXLENGTH);
            state.classNames.push('input-error-maxlength');
            state.isError = true;
            state.isAvailable = success === true && !state.isError;
            return state;
        }

        if (!/^((\w|\d)+(-|\w|\d)+)/.test(value) && value.length > minlength) {
            state.errors.push(errors.PATTERN);
            state.classNames.push('input-error-pattern');
            state.isError = true;
            state.isAvailable = success === true && !state.isError;
            return state;
        }
        state.isError = !!state.errors.length;
        state.isAvailable = success === true && !state.isError;
        return state;
    }

    return validator;
}
export default createValidator;
