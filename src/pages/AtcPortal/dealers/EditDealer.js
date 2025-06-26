import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CheckboxComp from '../../../components/common/Form/Checkbox';
import axios from "axios";
import API_URL from "../../../config";

const EditDealer = () => {
  const { id: partyCode } = useParams();
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors } } = useForm();
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
          navigate("/atcportal/");
        }
      });
  };

  const onFileUpload = (e) => {
    setFileData(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  return (
    <div className="col-md-12 createparty-main">
      <Link to={`/atcportal/dealer/${partyCode}`} className="back-btn back-btn-editform"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Link>
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
                    {...register("firmCode", {
                      required: "Required",
                      pattern: {
                        message: "Invalid Dealer Code",
                      },
                    })}
                  />
                  {errors.firmCode && <span className="error-message">{errors.firmCode.message}</span>}
                </Form.Group>
                <Form.Group controlId="firmName" className="col-md-6 col-sm-12">
                  <Form.Label>Firm Name*</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.firm_name}
                    required
                    type="text"
                    placeholder="Enter Firm Name"
                    {...register("firmName", {
                      required: "Required",
                      pattern: {
                        message: "Invalid Firm Name",
                      },
                    })}
                  />
                  {errors.firmName && <span className="error-message">{errors.firmName.message}</span>}
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group controlId="gender" className="col-md-6 col-sm-12">
                  <Form.Label>Gender*</Form.Label>
                  <select
                    defaultValue={singleDealersData.gender}
                    className="form-control"
                    {...register("gender", {
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
                  {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                </Form.Group>
                <Form.Group
                  controlId="dealerArea"
                  className="col-md-6 col-sm-12"
                >
                  <Form.Label>Dealer's Area*</Form.Label>
                  <select
                    defaultValue={singleDealersData.dealer_area}
                    className="form-control"
                    {...register("dealerArea", {
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
                  {errors.dealerArea && <span className="error-message">{errors.dealerArea.message}</span>}
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
                    {...register("ownerName", {
                      required: "Required",
                      pattern: {
                        message: "Invalid Name",
                      },
                    })}
                  />
                  {errors.ownerName && <span className="error-message">{errors.ownerName.message}</span>}
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
                    {...register("mobile", {
                      required: "Required",
                      pattern: {
                        message: "Invalid Mobile Number",
                      },
                    })}
                  />
                  {errors.mobile && <span className="error-message">{errors.mobile.message}</span>}
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group controlId="email" className="col-md-6 col-sm-12">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.email}
                    type="email"
                    placeholder="Enter Email Address"
                    {...register("email", {
                      pattern: {
                        message: "invalid Email Address",
                      },
                    })}
                  />
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                </Form.Group>
                <Form.Group controlId="address" className="col-md-6 col-sm-12">
                  <Form.Label>Address*</Form.Label>
                  <Form.Control
                    defaultValue={singleDealersData.address}
                    required
                    as="textarea"
                    placeholder="Enter Permanent Address"
                    rows="1"
                    {...register("address", {
                      pattern: {
                        message: "Invalid Address",
                      },
                    })}
                  />
                  {errors.address && <span className="error-message">{errors.address.message}</span>}
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
                    refdata={register("damagedealer", {
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
