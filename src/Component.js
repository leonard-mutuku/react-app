//import React, { useState } from 'react'

export const validateField = (name, value) => {
//     const [errors, setErrors] = useState({});
     let errors = {...this.state.errors};
     let error = null;
     if (!value) {
         if (name === 'terms') {
             error = 'Terms and conditions not accepted!';
         } else {
             const field = this.fieldName(name);
             error = field + ' required!';
         }
     } else if (name === 'emailAddress') {
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
         if (value !== this.state.user.password) {
             error = 'Passwords entered do not Match!';
         }
     }
     errors[name] = error;
//     setErrors({...errors, errors});
     this.setState({errors});
 }

 export const validateForm = (object, errors) => {
     let isValid = true;
     for (let key in object) {
         this.validateField(key, object[key]);
     }
     for (let key in errors) {
         if (errors[key] && errors[key].length > 0) {
             isValid = false;
             break;
         }
     }
     return isValid;
 }

function fieldName(name) {
    let str = name.split(/(?=[A-Z])/).join(' ');
    str = this.Capitalize(str);
    return str;
}

function Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}