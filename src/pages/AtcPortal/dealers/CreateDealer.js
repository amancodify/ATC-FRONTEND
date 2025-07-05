import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckboxComp from '../../../components/common/Form/Checkbox';
import API_URL from "../../../config";

const CreateDealer = (() => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    let [formSent, setFormSent] = useState(false);
    let [formResponse, setFormResponse] = useState({});
    let [filename, setFileName] = useState("");
    let [fileData, setFileData] = useState({});
    let [loadingScr, setLoadingScr] = useState(false);


    const onSubmit = (values, e) => {
        setLoadingScr(true);
        let formData = new FormData();
        formData.append('name', values.ownerName)
        formData.append('party_code', values.firmCode)
        formData.append('address', values.address)
        formData.append('firm_name', values.firmName)
        formData.append('gender', values.gender)
        formData.append('dealer_area', values.dealerArea)
        formData.append('mobile', values.mobile)
        formData.append('email', values.email)
        formData.append('fileData', fileData)
        formData.append('is_damage_dealer', values.damagedealer)
        
        axios.post(`${API_URL}/dealers/create`, formData)
            .then(response => {
                setLoadingScr(false);
                setFormResponse(response.data);
                if (response.data.status === 200) {
                    setFormSent(true);
                    setFileName("");
                    setTimeout(()=> {navigate("/atcportal/")}, 700);
                }
            })
    }

    const onFileUpload = (e) => {
        setFileData(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    return (
        <div className="col-md-12 createparty-main">
            <div className={loadingScr ? "loading" : "no-loading"}>
                <img style={{ display: "block" }} src="/images/loading3.gif" alt="" />
            </div>
            <p className="title-createdealer">Add Dealer/Party</p>
            <img className="add-vector" src="/images/addillis.png" alt="" />
            <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
                <Form onSubmit={handleSubmit(onSubmit)} className="container">
                    <div className="row">
                        <Form.Group controlId="formBasicName" className="col-md-6 col-sm-12">
                            <Form.Label>Dealer Code*</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Dealer Code"
                                {...register("firmCode", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Dealer Code"
                                    }
                                })}
                            />
                            {errors.firmCode && errors.firmCode.message}
                        </Form.Group>
                        <Form.Group controlId="firmname" className="col-md-6 col-sm-12">
                            <Form.Label>Firm Name*</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Firm Name"
                                {...register("firmName", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Firm Name"
                                    }
                                })}
                            />
                            {errors.firmName && errors.firmName.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="gender" className="col-md-6 col-sm-12">
                            <Form.Label>Gender*</Form.Label>
                            <select defaultValue="Select Option" className="form-control"
                                {...register("gender", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Value Must be Selected"
                                    }
                                })}
                                required
                            >
                                <option disabled>Select Option</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && errors.gender.message}
                        </Form.Group>
                        <Form.Group controlId="dealerArea" className="col-md-6 col-sm-12">
                            <Form.Label>Dealer's Area*</Form.Label>
                            <select defaultValue="" className="form-control"
                                {...register("dealerArea", {
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
                            {errors.dealerArea && errors.dealerArea.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="ownerName" className="col-md-6 col-sm-12">
                            <Form.Label>Owner Name*</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Owner's Fullname "
                                {...register("ownerName", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Name"
                                    }
                                })}
                            />
                            {errors.ownerName && errors.ownerName.message}
                        </Form.Group>
                        <Form.Group controlId="formBasicPhone" className="col-md-6 col-sm-12">
                            <Form.Label>Mobile*</Form.Label>
                            <Form.Control required type="tel" placeholder="Enter Mobile"
                                {...register("mobile", {
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Mobile Number"
                                    }
                                })}
                            />
                            {errors.mobile && errors.mobile.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formBasicEmail" className="col-md-6 col-sm-12">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email Address"
                                {...register("email", {
                                    pattern: {
                                        message: "invalid Email Address"
                                    }
                                })}
                            />
                            {errors.email && errors.email.message}
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail" className="col-md-6 col-sm-12">
                            <Form.Label>Dealer Photo (Optional)</Form.Label>
                            <div className="custom-file">
                                <input onChange={onFileUpload} type="file" className="custom-file-input" id="customFile" />
                                <label className="file-uploader-field custom-file-label" htmlFor="customFile">{filename}</label>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formBasicAddress" className="col-md-12 col-sm-12">
                            <Form.Label>Address*</Form.Label>
                            <Form.Control required as="textarea" placeholder="Enter Permanent Address" rows="2"
                                {...register("address", {
                                    pattern: {
                                        message: "Invalid Address"
                                    }
                                })}
                            />
                            {errors.address && errors.address.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formBasicAddress" className="col-md-12 col-sm-12">
                            <CheckboxComp
                                text="This dealer buys damage products as well"
                                name="damagedealer"
                                checked={false}
                                className=""
                                refdata={register("damagedealer", {
                                    pattern: {
                                        message: "Select the Checkbox"
                                    }
                                })}
                                required={false}
                            />
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <i onClick={() => navigate(0)} className="fa fa-refresh refresh-btn" aria-hidden="true"></i>
                        <Button variant="primary" type="submit" className="create-btn px-4" >Create Dealer</Button>
                    </div>
                </Form>
                {
                    (formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                        Dealer Created Successfully !!</div>)
                }
                {
                    formResponse.status === 11000 && <div className="mt-3 text-center error-text">Duplicate Error: User with this code already present, try putting unique Firm Code</div>
                }
            </div>
        </div>
    );
});

export default CreateDealer;