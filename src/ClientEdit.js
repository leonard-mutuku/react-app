import { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup } from 'reactstrap';
import { trackPromise } from 'react-promise-tracker';
import LeftNav from './components/LeftNav';
import RightTop from './components/RightTop';
import RightBottom from './components/RightBottom';
import { TextField } from './components/TextField';
import { validateForm } from './components/Validate';
import { useFetch } from './hooks/useFetch';
import { useAlert } from './hooks/useAlert';

const ClientEdit = (props) => {
    let obj = {firstName: '', lastName: '', email: '', phoneNumber: ''};
    const [formData, setFormData] = useState(obj);
    const [errors, setErrors] = useState(obj);

    const inputData = [formData, setFormData, errors, setErrors];

    const id = props.match.params.id;
    const edit = (id === 'new') ? false : true;
    const { handleResponse, handleError } = useFetch();
    const alert = useAlert();
    
    useEffect(() => {
        if (edit) {
            fetchClient(id);
        }
    }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

    const fetchClient = (id) => {
        trackPromise(
            fetch(`/clients/${id}`)
            .then(res => handleResponse(res, true))
            .then(client => {
                setFormData(client);
            })
            .catch(handleError)
        );
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateForm(formData, setErrors);
        if (isValid) {
            await trackPromise(
            fetch('/clients' + (edit ? '/' +formData.id : ''), {
                    method: (edit) ? 'PUT' : 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(res => handleResponse(res, true))
                .then(res => {
                    handleSuccess(res);
                })
                .catch(handleError)
            );
        }
    }

    const handleSuccess = (res) => {
        const pref = edit ? 'saved' : 'added';
        const msg = formData.firstName + ' successfully ' + pref;
        alert({class: 'success', msg: msg});
        setTimeout(() => {
            props.history.push('/clients');
        }, 2500);
    }

    const title = edit ? 'Edit ' + formData.firstName : 'Add Client';

    return (
    <div className="fill flex">
        <LeftNav />
        <div className="wrapper-right flex-1 animate">
            <div className="flex-column">
                <RightTop title="clients" />
                <div id="right-middle" className="flex-1 tbl-dsp">
                    <div className="tbl-cell-dsp">
                        <Container>
                            <div className="form-div pnl">
                                <h2 className="form-hdr flex">
                                    <div className="flex-1 txt-clip text-center"><span className="linear-cl">{title}</span></div>
                                    <div><Button color="default" className="btn-close btn-icon" tag={Link} to="/clients"></Button></div>
                                </h2>
                                <Form onSubmit={handleSubmit}>
                                    <TextField
                                        type="text" name="firstName" label="First Name" inputData={inputData} required={true} autoFocus={true}
                                    />
                                    <TextField
                                        type="text" name="lastName" label="Last Name" inputData={inputData} required={true}
                                    />
                                    <TextField
                                        type="text" name="email" label="Email Address" inputData={inputData} required={true}
                                    />
                                    <TextField
                                        type="text" name="phoneNumber" label="Phone Number" inputData={inputData} required={true}
                                    />
                                    <FormGroup className="text-center">
                                        <Button color="success" type="submit">Save</Button>
                                    </FormGroup>
                                </Form>
                            </div>
                        </Container>
                    </div>
                </div>
                <RightBottom />
            </div>
        </div>
    </div>
    );
};

export default withRouter(ClientEdit);