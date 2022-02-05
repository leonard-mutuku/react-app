import { useState } from 'react';
import { Container, Form, FormGroup, Label, Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import AppNavbar from './AppNavbar';
import RightBottom from './components/RightBottom';
import { TextField } from './components/TextField';
import { validateField, validateForm } from './components/Validate';
import { trackPromise } from 'react-promise-tracker';
import { useAlert } from './hooks/useAlert';

const CreateAccount = () => {
    const obj = {firstName: "", lastName: "", idNumber: "", phoneNumber: "", emailAddress: "", password: "", confirmPassword: "", terms: false};
    const showPassObj = {password: false, confirmPassword: false};

    const [formData, setFormData] = useState(obj);
    const [errors, setErrors] = useState(obj);
    const [showPass, setShowPass] = useState(showPassObj);
    const [registerMsg, setRegisterMsg] = useState(null);

    const inputData = [formData, setFormData, errors, setErrors, showPass, setShowPass];

    const alert = useAlert();

    const handleCheck = (event) => {
        const target = event.target;
        const value = target.checked;
        const name = target.id;
        setFormData({...formData, [name]: value});
        if (errors[name]) validateField(name, value, setErrors);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateForm(formData, setErrors);
        if(isValid) {
            trackPromise(
                fetch('/user/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(res => res.json())
                .then(res => {
                    const cls = (res.code === 0) ? 'success' : 'danger';
                    setRegisterMsg({cls: cls, msg: res.msg});
                })
                .catch(err => {
                    console.log(err);
                    alert({class: 'danger', msg: 'Error encountered while Creating Your Account!'});
                })
            );
        }
    }

    const handleClose = () => {
        setRegisterMsg(null);
    }

    return <div className="fill">
        <div className="flex-column">
            <AppNavbar/>
            <div className="flex-1 tbl-dsp">
                <Container className="tbl-cell-dsp">
                    <div className="form-div pnl">
                        <h2 className="form-hdr flex text-center">
                            <div><Button color="default" className="btn-icon" tag={Link} to="/login"><ArrowLeft /></Button></div>
                            <div className="flex-1"><span className="linear-cl txt-clip">Create Account</span></div>
                        </h2>
                        <Form onSubmit={handleSubmit}>
                            <TextField
                                type="text" name="firstName" label="First Name" inputData={inputData} required={true} autoFocus={true}
                            />
                            <TextField
                                type="text" name="lastName" label="Last Name" inputData={inputData} required={true}
                            />
                            <TextField
                                type="number" name="idNumber" label="ID Number" inputData={inputData} required={true}
                            />
                            <TextField
                                type="number" name="phoneNumber" label="Phone Number" inputData={inputData} required={true}
                            />
                            <TextField
                                type="text" name="emailAddress" label="Email Address" placeholder="user@domain.com" inputData={inputData} required={true}
                            />
                            <TextField
                                type="password" name="password" label="Password" inputData={inputData} required={true}
                            />
                            <TextField
                                type="password" name="confirmPassword" label="Confirm Password" inputData={inputData} required={true}
                            />
                            <FormGroup className="text-center">
                                <div className="flex-center">
                                    <input type="checkbox" id="terms" onChange={handleCheck} /><Label for="terms"> I have read and accept the </Label><Link to="/" className="tca">Terms and Conditions</Link>
                                </div>
                                {errors.terms && <span className="form-errors">{errors.terms}</span>}
                            </FormGroup>
                            <FormGroup className="text-center">
                                {registerMsg && <div className={"alert alert-"+registerMsg.cls+" flex"}>
                                    <div className="flex-1">{registerMsg.msg}</div>
                                    <Button color="default" onClick={handleClose} className="btn-close btn-icon"></Button>
                                </div>}
                                <Button color="success" type="submit">CREATE ACCOUNT</Button>
                            </FormGroup>
                        </Form>
                    </div>
                </Container>
            </div>
            <RightBottom />
        </div>
    </div>
}

export default CreateAccount;