import { useState } from 'react';
import { Container, Form, FormGroup, Button } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import RightBottom from './components/RightBottom';
import { TextField } from './components/TextField';
import { validateForm, hashPassword } from './components/Validate';
import { useAuth } from './hooks/useAuth';
import { useAlert } from './hooks/useAlert';

const Login = (props) => {
    const obj = {username: '', password: ''};
    const showPassObj = {password: false};

    const [formData, setFormData] = useState(obj);
    const [errors, setErrors] = useState(obj);
    const [showPass, setShowPass] = useState(showPassObj);
    const [loginError, setLoginError] = useState(null);

    const inputData = [formData, setFormData, errors, setErrors, showPass, setShowPass];

    const { login } = useAuth();
    const { state } = useLocation();
    const alert = useAlert();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateForm(formData, setErrors);
        if (isValid) {
            const url = state?.from || "/dashboard";
            const password = hashPassword(formData.password);
            const data = {...formData, password};
            login(data, (res) => {
                if (res.loggedIn) {
                    props.history.push(url);
                } else {
                    (res.code === 253) ? alert({class: 'danger', msg : res.msg}) : setLoginError(res.msg);
                }
            });
        }
    }

    const handleClose = () => {
        setLoginError(null);
    }

    return <div className="fill">
        <div className="flex-column">
            <AppNavbar/>
            <div className="flex-1 tbl-dsp">
                <Container className="tbl-cell-dsp">
                    <div className="form-div pnl login">
                        <div className="text-center">
                            <img src="/avatar.png" alt="" style={{borderRadius: '50%'}} />
                            <h2 className="form-hdr txt-clip"><span><span className="linear-cl">Customer Login</span></span></h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <TextField
                                type="text" name="username" label="Username" inputData={inputData} required={true} autoFocus={true}
                            />
                            <TextField
                                type="password" name="password" label="Password" inputData={inputData} required={true}
                            />
                            <FormGroup className="text-center">
                                {loginError && <div className="alert alert-danger flex">
                                    <div className="flex-1">{loginError}</div>
                                    <Button color="default" onClick={handleClose} className="btn-close btn-icon"></Button>
                                </div>}
                                <Button color="success" type="submit">LOGIN</Button>
                            </FormGroup>
                        </Form>
                        <div className="flex">
                            <div className="flex-1">
                                <Link to="/forgot-password">Forgot password?</Link>
                            </div>
                            <div className="flex-1 text-end">
                                <Link to="/create-account">Create Account</Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <RightBottom />
        </div>
    </div>
}

export default Login;
