import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from "../../../config";


const CreateGodown = (() => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    let [formSent, setFormSent] = useState(false);
    const onSubmit = values => {
        let godownCreationData = {
            "godownCode": values.godownCode,
            "godownName": values.godownName,
            "godownLocation": values.godownLocation,
            "address": values.address,
            "inchargeName": values.inchargeName,
            "inchargeMobile": values.inchargeMobile
        };
        axios.post(`${API_URL}/godowns/create`, godownCreationData)
            .then(response => {
                if (response.status === 200) {
                    setFormSent(true);
                    setTimeout(()=> {navigate(`/atcportal/viewgodown/${values.godownCode}`)}, 700);
                }
            })
    }
    return (
        <div className="col-md-12 createparty-main">
            <div className="godown-title-main">
                <img className="godown-vector" src="images/create_godown.png" alt="" />
                <p className="title-godown">Add New Godown</p>
            </div>
            <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
                <Form onSubmit={handleSubmit(onSubmit)} className="container">
                    <div className="row justify-content-center">
                        <Form.Group controlId="godownCode" className="col-md-5">
                            <Form.Label>Godown Code*</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Godown Code"
                                {...register("godownCode", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Godown Code"
                                    }
                                })}
                            />
                            {errors.godownCode && errors.godownCode.message}
                        </Form.Group>
                        <Form.Group controlId="godownName" className="col-md-5">
                            <Form.Label>Godown Name*</Form.Label>
                            <Form.Control required type="text" placeholder="Godown Name"
                                {...register("godownName", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Godown Name"
                                    }
                                })}
                            />
                            {errors.godownName && errors.godownName.message}
                        </Form.Group>
                        <Form.Group controlId="inchargeName" className="col-md-10">
                            <Form.Label>Incharge Name*</Form.Label>
                            <Form.Control required type="text" placeholder="Godown Incharge Name"
                                {...register("inchargeName", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Incharge Name"
                                    }
                                })}
                            />
                            {errors.inchargeName && errors.inchargeName.message}
                        </Form.Group>
                        <Form.Group controlId="inchargeMobile" className="col-md-5">
                            <Form.Label>Godown Incharge Mobile*</Form.Label>
                            <Form.Control required type="number" placeholder="Enter Incharge Mobile"
                                {...register("inchargeMobile", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Mobile"
                                    }
                                })}
                            />
                            {errors.inchargeMobile && errors.inchargeMobile.message}
                        </Form.Group>
                        <Form.Group controlId="godownLocation" className="col-md-5">
                            <Form.Label>Godown Location*</Form.Label>
                            <select defaultValue="" className="form-control"
                                {...register("godownLocation", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Value Must be Selected"
                                    }
                                })}
                                required
                            >
                                <option value="" disabled>Select Option</option>
                                <option value="Siwan">Siwan</option>
                                <option value="Chapra">Chapra</option>
                                <option value="Gopalganj">Gopalganj</option>
                            </select>
                            {errors.godownLocation && errors.godownLocation.message}
                        </Form.Group>
                        <Form.Group controlId="address" className="col-md-10">
                            <Form.Label>Address*</Form.Label>
                            <Form.Control required as="textarea" placeholder="Enter Godown Address" rows="4"
                                {...register("address", {
                                    pattern: {
                                        message: "Invalid Address"
                                    }
                                })}
                            />
                            {errors.address && errors.address.message}
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <i onClick={() => navigate(0)} className="fa fa-refresh refresh-btn-gdn" aria-hidden="true"></i>
                        <button type="submit" className="creategdn-btn px-4" disabled={formSent}>Create Godown</button>
                    </div>
                </Form>
                {
                    (formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                        Godown Created Successfully !!</div>)
                }
            </div>
        </div>
    );
});

export default CreateGodown;