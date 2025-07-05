import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import API_URL from "../../config";


const Career = (() => {
    const { handleSubmit, register, formState: { errors } } = useForm();
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
                <img src="/images/career.jpg" className="career-img" alt="" />
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 career-right">
                <h1>CAREER COUNTER</h1>
                <p className="form-title">We’re looking for passionate, energetic and creative individuals to join us. Do you see a profile that would be perfect for you?</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="formBasicName">
                        <div className="col-md-12 mb-4 inputmain">
                            <label className="field-lbl">Name</label>
                            <input
                                required
                                type="text"
                                className="form-control input-field"
                                {...register("name", {
                                    required: 'Required',
                                    pattern: {
                                        message: "invalid Name"
                                    }
                                })}
                            />
                        </div>
                        {errors.name && errors.name.message}
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <div className="col-md-12 mb-4 inputmain">
                            <label className="field-lbl">Email Address</label>
                            <input
                                required
                                type="email"
                                className="form-control input-field"
                                {...register("email", {
                                    required: 'Required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: "invalid Email"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && errors.email.message}
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone">
                        <div className="col-md-12 mb-4 inputmain">
                            <label className="field-lbl">Mobile Number</label>
                            <input
                                required
                                type="number"
                                className="form-control input-field"
                                {...register("phone", {
                                    required: 'Required',
                                    pattern: {
                                        message: "invalid phone Number"
                                    }
                                })}
                            />
                        </div>
                        {errors.phone && errors.phone.message}
                    </Form.Group>
                    <Form.Group controlId="formBasicMessage">
                        <div className="col-md-12 mb-4 inputmain">
                            <label className="field-lbl">Message</label>
                            <textarea
                                as="textarea"
                                rows="4"
                                className="form-control input-field"
                                {...register("message", {
                                    pattern: {
                                        message: "invalid message"
                                    }
                                })}
                            />
                        </div>
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