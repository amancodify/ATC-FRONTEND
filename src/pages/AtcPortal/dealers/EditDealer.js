import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CheckboxComp from '../../../components/common/Form/Checkbox';
import axios from "axios";
import API_URL from "../../../config";

const EditDealer = (props) => {
  let partyCode = props.match.params.id;
  const { handleSubmit, register, errors } = useForm();
  let [formSent, setFormSent] = useState(false);
  let [singleDealersData, setSingleDealersData] = useState({});
  let [filename, setFileName] = useState("");
  let [fileData, setFileData] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/dealers/${partyCode}`)
      .then((response) => {
        setSingleDealersData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [partyCode]);

  const onSubmit = (values) => {
    let formData = new FormData();
    formData.append("name", values.ownerName);
    formData.append("party_code", values.firmCode);
    formData.append("address", values.address);
    formData.append("firm_name", values.firmName);
    formData.append("gender", values.gender);
    formData.append("dealer_area", values.dealerArea);
    formData.append("mobile", values.mobile);
    formData.append("email", values.email);
    formData.append("fileData", fileData);
    formData.append('is_damage_dealer', values.damagedealer);

    axios
      .put(`${API_URL}/dealers/updateuser/${partyCode}`, formData)
      .then((response) => {
        if (response.data.nModified === 1) {
          setFormSent(true);
          window.location.replace("#/");
        }
      });
  };

  const onFileUpload = (e) => {
    setFileData(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  return (
    <div className="col-md-12 createparty-main">
      <a href={`#/dealer/${partyCode}`} className="back-btn back-btn-editform"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</a>
      {singleDealersData.gender && (
        <>
          <p className="title-createdealer">Update Dealer/Party</p>
          <img className="add-vector" src="images/addillis.png" alt="" />
          <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
            <Form onSubmit={handleSubmit(onSubmit)} className="container">
              <div className="row">
                <Form.Group controlId="firmCode" className="col-md-6 col-sm-12">
                  <Form.Label>Dealer Code*</Form.Label>
                  <Form.Control
                    disabled
                    defaultValue={singleDealersData.party_code}
                    required
                    type="text"
                    placeholder="Enter Dealer Code"
                    name="firmCode"
                    ref={register({
                      required: "Required",
                      pattern: {
                        message: "Invalid Dealer Code",
                      },
                    })}
                  />
                  {errors.firmCode && errors.firmCode.message}
                </Form.Group>
                <Form.Group controlId="firmName" className="col-md-6 col-sm-12">
                  <Form.Label>Firm Name*</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.firm_name}
                    required
                    type="text"
                    placeholder="Enter Firm Name"
                    name="firmName"
                    ref={register({
                      required: "Required",
                      pattern: {
                        message: "Invalid Firm Name",
                      },
                    })}
                  />
                  {errors.firmName && errors.firmName.message}
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group controlId="gender" className="col-md-6 col-sm-12">
                  <Form.Label>Gender*</Form.Label>
                  <select
                    defaultValue={singleDealersData.gender}
                    name="gender"
                    className="form-control"
                    ref={register({
                      required: "Required",
                      pattern: {
                        message: "Value Must be Selected",
                      },
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
                <Form.Group
                  controlId="dealerArea"
                  className="col-md-6 col-sm-12"
                >
                  <Form.Label>Dealer's Area*</Form.Label>
                  <select
                    defaultValue={singleDealersData.dealer_area}
                    name="dealerArea"
                    className="form-control"
                    ref={register({
                      required: "Required",
                      pattern: {
                        message: "Value Must be Selected",
                      },
                    })}
                    required
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="Siwan">Siwan</option>
                    <option value="Chapra">Chapra</option>
                    <option value="Gopalganj">Gopalganj</option>
                  </select>
                  {errors.dealerArea && errors.dealerArea.message}
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group
                  controlId="ownerName"
                  className="col-md-6 col-sm-12"
                >
                  <Form.Label>Owner Name*</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.name}
                    required
                    type="text"
                    placeholder="Enter Owner's Fullname "
                    name="ownerName"
                    ref={register({
                      required: "Required",
                      pattern: {
                        message: "Invalid Name",
                      },
                    })}
                  />
                  {errors.ownerName && errors.ownerName.message}
                </Form.Group>
                <Form.Group
                  controlId="formBasicPhone"
                  className="col-md-6 col-sm-12"
                >
                  <Form.Label>Mobile*</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.mobile}
                    required
                    type="tel"
                    placeholder="Enter Mobile"
                    name="mobile"
                    ref={register({
                      required: "Required",
                      pattern: {
                        message: "Invalid Mobile Number",
                      },
                    })}
                  />
                  {errors.mobile && errors.mobile.message}
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group controlId="email" className="col-md-6 col-sm-12">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.email}
                    type="email"
                    placeholder="Enter Email Address"
                    name="email"
                    ref={register({
                      pattern: {
                        message: "invalid Email Address",
                      },
                    })}
                  />
                  {errors.email && errors.email.message}
                </Form.Group>
                <Form.Group controlId="address" className="col-md-6 col-sm-12">
                  <Form.Label>Address*</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.address}
                    required
                    as="textarea"
                    placeholder="Enter Permanent Address"
                    rows="1"
                    name="address"
                    ref={register({
                      pattern: {
                        message: "Invalid Address",
                      },
                    })}
                  />
                  {errors.address && errors.address.message}
                </Form.Group>
              </div>
              <Form.Label>Dealer Photo (Optional)</Form.Label>
              <div className="custom-file">
                <input
                  onChange={onFileUpload}
                  type="file"
                  defaultValue={null}
                  className="custom-file-input"
                  id="customFile"
                />
                <label className="custom-file-label" htmlFor="customFile">
                  {filename}
                </label>
              </div>
              <div className="row mt-3">
                <Form.Group
                  controlId="formBasicAddress"
                  className="col-md-12 col-sm-12"
                >
                  <CheckboxComp
                    text="This dealer buys damage products as well"
                    name="damagedealer"
                    checked={singleDealersData.is_damage_dealer}
                    className=""
                    refdata={register({
                      pattern: {
                        message: "Select the Checkbox",
                      },
                    })}
                    required={false}
                  />
                </Form.Group>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  className="create-btn px-4"
                  disabled={formSent}
                >
                  Update
                </Button>
              </div>
            </Form>
            {formSent && (
              <div className="form-thankyou-text">
                <i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                Dealer Updated Successfully !!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditDealer;
