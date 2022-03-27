import bcrypt from 'bcryptjs';

const fieldName = (name) => {
    let str = name.split(/(?=[A-Z])/).join(' ');
    str = Capitalize(str);
    return str;
}

const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const validateField = (name, value, setErrors, formData) => {
    let error = null;
    if (!value) {
        if (name === 'terms') {
            error = 'Terms and conditions not accepted!';
        } else {
            const field = fieldName(name);
            error = field + ' required!';
        }
    } else if (name === 'emailAddress' || name === 'email') {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!regex.test(value)) {
            error = 'Email Address is invalid!';
        }
    } else if (name === 'password') {
        const numRegex = /[0-9]/;
        const lcRegex = /[a-z]/;
        const ucRegex = /[A-Z]/;
        if (value.length < 6) {
            error = 'Password must contain at least six characters!';
        } else if (!numRegex.test(value)) {
            error = 'Password must contain at least one number!';
        } else if (!lcRegex.test(value)) {
            error = 'Password must contain at least one lowercase letter!';
        } else if (!ucRegex.test(value)) {
            error = 'Password must contain at least one uppercase letter!';
        }
    } else if (name === 'confirmPassword') {
        if (value !== formData.password) {
            error = 'Passwords entered do not Match!';
        }
    }
    setErrors(errors => ({...errors, [name]: error}));
    return error;
}

const validateForm = (formData, setErrors) => {
    let isValid = true;
    for (let key in formData) {
        const error = validateField(key, formData[key], setErrors, formData);
        if (error) isValid = false;
    }
    return isValid;
}

const hashPassword = (password) => {
    const salt = '$2a$10$gOMB4WvF9tGBk6KgAUGFfO';
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

export { validateField, validateForm, hashPassword };