import { useState } from 'react';
import AppNavbar from './AppNavbar';
import RightBottom from './components/RightBottom';
import { Container, Form, FormGroup, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { ArrowLeft, TelephoneFill, EnvelopeFill, GeoAltFill } from 'react-bootstrap-icons';
import { TextField } from './components/TextField';
import { validateForm } from './components/Validate';
import { trackPromise } from 'react-promise-tracker';
import { useFetch } from './hooks/useFetch';
import { useAlert } from './hooks/useAlert';

export default function ContactUs() {
    const obj = {name: "", email: "", subject: "", message: ""};
    const [formData, setFormData] = useState(obj);
    const [errors, setErrors] = useState(obj);
    const [contactUsMsg, setContactUsMsg] = useState(null);

    const inputData = [formData, setFormData, errors, setErrors];

    const { handleResponse } = useFetch();
    const alert = useAlert();

    const history = useHistory();
    const handleBack = () => {
        history.goBack();
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validateForm(formData, setErrors);
        if (isValid) {
            trackPromise(
                fetch('/user/contact-us', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(res => handleResponse(res, true))
                .then(res => {
                    const cls = (res.code === 0) ? 'success' : 'danger';
                    setContactUsMsg({cls: cls, msg: res.msg});
                })
                .catch(err => {
                    console.log(err);
                    alert({class: 'danger', msg: 'Error encountered while Submitting your Message!'});
                })
            );
        }
    }

    const handleClose = () => {
        setContactUsMsg(null);
    }

    return (
        <div className="fill">
            <div className="flex-column">
                <AppNavbar />
                <div className="flex-1 tbl-dsp">
                    <Container className="tbl-cell-dsp">
                        <div className="form-div pnl flex contact-us">
                            <div className="contact-bg text-center flex-1 flex-center">
                                <div style={{width: '100%'}}>
                                    <h2>Contact Information</h2>
                                    <ul>
                                        <li><a href="tel:+254722000600"><i><TelephoneFill /></i> <span>+254 722 000 600</span></a></li>
                                        <li><a href="mailto:info@mail.com"><i><EnvelopeFill /></i> <span>info@mail.com</span></a></li>
                                        <li><a href="/"><i><GeoAltFill /></i> <span>city, state, Country</span></a></li>
                                    </ul>
                                    <div>
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.636510448736!2d-122.08627838421054!3d37.42206557982515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2ske!4v1650136599161!5m2!1sen!2ske"
                                        title="Google HQ" width="100%" height="180" style={{display: 'block'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1" style={{padding: '15px'}}>
                                <h2 className="form-hdr flex text-center">
                                    <Button color="default" title="go back" className="btn-icon pointer" onClick={handleBack}><ArrowLeft /></Button>
                                    <div className="flex-1"><span className="linear-cl txt-clip">Send us a message</span></div>
                                </h2>
                                <Form onSubmit={handleSubmit}>
                                    <TextField
                                        type="text" name="name" label="Name" inputData={inputData} required={true} autoFocus={true}
                                    />
                                    <TextField
                                        type="text" name="email" label="Email Address" inputData={inputData} required={true}
                                    />
                                    <TextField
                                        type="text" name="subject" label="subject" inputData={inputData} required={true}
                                    />
                                    <TextField
                                        type="textarea" name="message" label="Message" inputData={inputData} required={true}
                                    />
                                    <FormGroup className="text-center">
                                        {contactUsMsg && <div className={"alert alert-"+contactUsMsg.cls+" flex"}>
                                            <div className="flex-1">{contactUsMsg.msg}</div>
                                            <Button color="default" className="btn-close btn-icon" onClick={handleClose}></Button>
                                        </div>}
                                        <Button type="submit" color="success">SEND</Button>
                                    </FormGroup>
                                </Form>
                            </div>
                        </div>
                    </Container>
                </div>
                <RightBottom />
            </div>
        </div>
    );
}