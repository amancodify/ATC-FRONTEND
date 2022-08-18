import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import CheckboxComp from '../../../components/common/Form/Checkbox';
import API_URL from '../../../config';
import { Dropdown } from 'semantic-ui-react';

const AddConsignee = () => {
    const { handleSubmit, register, errors } = useForm();
    let [formSent, setFormSent] = useState(false);
    let [formResponse, setFormResponse] = useState({});
    let [filename, setFileName] = useState('');
    let [imgUrl, setImgUrl] = useState('');
    let [loadingScr, setLoadingScr] = useState(false);
    let [allParties, setAllParties] = useState([]);
    let [currentParty, setCurrentParty] = useState('');

    useEffect(() => {
        axios
            .get(`${API_URL}/dealers`)
            .then((response) => {
                setAllParties(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onSubmit = (values, e) => {
        setLoadingScr(true);
        let formData = new FormData();
        formData.append('consigneecode', values.consigneeCode);
        formData.append('firmname', values.firmName);
        formData.append('partycode', currentParty);
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('mobile', values.mobile);
        formData.append('address', values.address);
        formData.append('photo', imgUrl);
        formData.append('buydamage', values.buydamage);

        axios.post(`${API_URL}/addconsignee`, formData).then((response) => {
            setLoadingScr(false);
            setFormResponse(response.data);
            if (response.data.status === '200') {
                setFileName('');
                setFormSent(true);
                setTimeout(() => {
                    window.location.replace('#/consignees');
                }, 700);
            }
        });
    };

    const onFileUpload = (e) => {
        let formData = new FormData();
        formData.append('usercode', 'con');
        formData.append('usertype', 'consignee');
        formData.append('fileData', e.target.files[0]);

        setFileName(e.target.files[0].name);

        axios.post(`${API_URL}/fileupload`, formData).then((response) => {
            setImgUrl(response.data);
        });
    };

    let partiesOprions = allParties.map((item) => {
        return {
            key: item.party_code,
            value: item.party_code,
            text: `${item.firm_name} (${item.party_code})`,
        };
    });

    return (
        <div className="col-md-12 createparty-main">
            <div className={loadingScr ? 'loading' : 'no-loading'}>
                <img style={{ display: 'block' }} src="/images/loading3.gif" alt="" />
            </div>
            <p className="title-createdealer add-consignee-img">Add Consignee</p>
            <img
                className="add-vector"
                src="https://img.freepik.com/free-vector/sign-documents-confirm-receiving-order_80802-797.jpg?size=626&ext=jpg"
                alt=""
            />
            <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
                <Form onSubmit={handleSubmit(onSubmit)} className="container">
                    <div className="row">
                        <Form.Group controlId="formBasicName" className="col-md-6 col-sm-12">
                            <Form.Label>Consignee Code*</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter Consignee Code"
                                name="consigneeCode"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: 'Invalid Consignee Code',
                                    },
                                })}
                            />
                            {errors.consigneeCode && errors.consigneeCode.message}
                        </Form.Group>
                        <Form.Group controlId="firmname" className="col-md-6 col-sm-12">
                            <Form.Label>Consignee Firm Name*</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter Firm Name"
                                name="firmName"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: 'Invalid Firm Name',
                                    },
                                })}
                            />
                            {errors.firmName && errors.firmName.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="partycode" className="col-md-12 col-sm-12">
                            <Form.Label>Linked Party*</Form.Label>
                            <Dropdown
                                clearable
                                fluid
                                search
                                selection
                                options={partiesOprions}
                                placeholder="Select Party"
                                onChange={(e, data) => setCurrentParty(data.value)}
                            />

                            {errors.partyCode && errors.partyCode.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="name" className="col-md-6 col-sm-12">
                            <Form.Label>Consignee Owner Name*</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter Owner's Fullname "
                                name="name"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: 'Invalid Name',
                                    },
                                })}
                            />
                            {errors.ownerName && errors.ownerName.message}
                        </Form.Group>
                        <Form.Group controlId="formBasicPhone" className="col-md-6 col-sm-12">
                            <Form.Label>Consignee Mobile*</Form.Label>
                            <Form.Control
                                required
                                type="tel"
                                placeholder="Enter Mobile"
                                name="mobile"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: 'Invalid Mobile Number',
                                    },
                                })}
                            />
                            {errors.mobile && errors.mobile.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formBasicEmail" className="col-md-6 col-sm-12">
                            <Form.Label>Consignee Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email Address"
                                name="email"
                                ref={register({
                                    pattern: {
                                        message: 'invalid Email Address',
                                    },
                                })}
                            />
                            {errors.email && errors.email.message}
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail" className="col-md-6 col-sm-12">
                            <Form.Label>Consignee Photo (Optional)</Form.Label>
                            <div className="custom-file">
                                <input onChange={onFileUpload} type="file" className="custom-file-input" id="customFile" />
                                <label className="file-uploader-field custom-file-label" htmlFor="customFile">
                                    {filename}
                                </label>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formBasicAddress" className="col-md-12 col-sm-12">
                            <Form.Label>Consignee Address*</Form.Label>
                            <Form.Control
                                required
                                as="textarea"
                                placeholder="Enter Permanent Address"
                                rows="2"
                                name="address"
                                ref={register({
                                    pattern: {
                                        message: 'Invalid Address',
                                    },
                                })}
                            />
                            {errors.address && errors.address.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="formBasicAddress" className="col-md-12 col-sm-12">
                            <CheckboxComp
                                text="This Consignee buys damage products as well"
                                name="buydamage"
                                checked={false}
                                className=""
                                refdata={register({
                                    pattern: {
                                        message: 'Select the Checkbox',
                                    },
                                })}
                                required={false}
                            />
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <i onClick={() => window.location.reload()} className="fa fa-refresh refresh-btn" aria-hidden="true"></i>
                        <Button variant="primary" type="submit" className="create-btn px-4">
                            Add Consignee
                        </Button>
                    </div>
                </Form>
                {formSent && (
                    <div className="form-thankyou-text">
                        <i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                        Consignee Created Successfully !!
                    </div>
                )}
                {formResponse.status === 11000 && (
                    <div className="mt-3 text-center error-text">
                        Duplicate Error: Consignee with this code already present, try putting unique Consignee Code
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddConsignee;
