import { useState } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { validateField } from './Validate';

export const TextField = ({type, name, label, placeholder, inputData, required, autoFocus}) => {

    const [formData, setFormData, errors, setErrors, showPass, setShowPass] = inputData;
    const txtLimit = 160;
    const [msgCount, setMsgCount] = useState(null);

    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormData({...formData, [name]: value});
        if (errors[name]) validateField(name, value, setErrors);
        if (target.type === 'textarea') handleMessage(value);
    }

    const handleMessage = (value) => {
        const txtLength = value.length + 15;
        const msgLength = Math.ceil(txtLength / txtLimit);
        const msg = (txtLength > 15) ? msgLength + ' sms(s)' : null;
        setMsgCount(msg);
    }

    const handleShowPass = (event) => {
        const name = event.currentTarget.id.split('-')[1];
        setShowPass({...showPass, [name]: !showPass[name]});
    }

    return (
        <FormGroup className={formData[name] ? 'animate-div' : ''}>
            <Input
                type={(type === 'password' && showPass[name]) ? 'text' : type}
                name={name}
                id={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                autoComplete={name}
                required={required}
                autoFocus={autoFocus ? true : false}
                maxLength={type === 'textarea' ? 800 : null}
            />
            <Label for={name} className="focus-input">{label}</Label>
            {type === 'password' &&
                <Button color="default" id={"show-" + name} className="btn-icon show-pass" onClick={handleShowPass}>{showPass[name] ? <EyeSlashFill /> : <EyeFill />}</Button>
            }
            {msgCount && <span className="tca">{msgCount}</span>}
            {errors[name] && <span className="form-errors">{errors[name]}</span>}
        </FormGroup>
    );
}
