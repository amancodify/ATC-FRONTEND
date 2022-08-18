import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Input from "../../components/common/Form/Input";
import TextArea from "../../components/common/Form/TextArea";
import API_URL from "../../config";


const Career = (() => {
    const { handleSubmit, register, errors } = useForm();
    let [formSent, setFormSent] = useState(false);
    const onSubmit = (values, e) => {
        axios.post(`${API_URL}/sendemail`, values)
            .then(response => {
                if (response.status === 200) {
                    setFormSent(true)
                    e.target.reset();
                }
            })
    }
    return (
        <div className="row justify-content-center section-padding px-5" id="career">
            <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 career-left">
                <img src="images/career.jpg" className="career-img" alt="" />
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 career-right">
                <h1>CAREER COUNTER</h1>
                <p className="form-title">We’re looking for passionate, energetic and creative individuals to join us. Do you see a profile that would be perfect for you?</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                        <Input
                            labeltxt="Name"
                            // placeholder="Enter Full Name"
                            inputType="text"
                            name="name"
                            inputref={register({
                                required: 'Required',
                                pattern: {
                                    message: "invalid Name"
                                }
                            })}
                        />
                        {errors.name && errors.name.message}
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Input
                            labeltxt="Email Address"
                            // placeholder="Enter email"
                            inputType="email"
                            name="email"
                            inputref={register({
                                required: 'Required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "invalid Name"
                                }
                            })}
                        />
                        {errors.email && errors.email.message}
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone">
                        <Input
                            labeltxt="Mobile Number"
                            // placeholder="Enter Mobile"
                            inputType="number"
                            name="phone"
                            inputref={register({
                                required: 'Required',
                                pattern: {
                                    message: "invalid phone Number"
                                }
                            })}
                        />
                        {errors.phone && errors.phone.message}
                    </Form.Group>
                    <Form.Group controlId="formBasicMessage">
                        <TextArea
                            labeltxt="Message"
                            TA_as="textarea"
                            TA_rows="4"
                            name="message"
                            inputref={register({
                                pattern: {
                                    message: "invalid email address"
                                }
                            })}
                        />
                        {errors.message && errors.message.message}
                    </Form.Group>
                    <Button variant="primary" type="submit" className="submit-btn" >Submit</Button>
                </Form>
                {
                    (formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                        Thankyou for reaching out to us. We'll get back to you shortly !!</div>)
                }
            </div>
        </div>
    );
});

export default Career;