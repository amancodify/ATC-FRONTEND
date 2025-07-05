import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import API_URL from "../../../config";

const EditGodown = () => {
  const { id: godownCode } = useParams();
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors } } = useForm();
  let [formSent, setFormSent] = useState(false);
  let [singleGodownData, setSingleGodownData] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/godowns/${godownCode}`)
      .then((response) => {
        setSingleGodownData(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [godownCode]);

  const onSubmit = (values) => {
    let godownCreationData = {
      godownName: values.godownName,
      godownLocation: values.godownLocation,
      address: values.address,
      inchargeName: values.inchargeName,
      inchargeMobile: values.inchargeMobile
    };
    axios
      .put(
        `${API_URL}/godowns/updategodown/${godownCode}`,
        godownCreationData
      )
      .then((response) => {
        if (response.status === 200) {
          setFormSent(true);
          setTimeout(() => {navigate(`/atcportal/viewgodown/${godownCode}`)}, 500);
        }
      });
  };

  return (
    <div className="col-md-12 createparty-main">
      <button 
        onClick={() => navigate(`/atcportal/viewgodown/${godownCode}`)} 
        className="back-btn backbtn-edit-godown"
      >
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
      </button>
      {singleGodownData && singleGodownData.godowncode && (
        <>
          <div className="godown-title-main">
            <img
              className="godown-vector"
              src="/images/create_godown.png"
              alt=""
            />
            <p className="title-godown">Update Godown</p>
          </div>
          <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
            <Form onSubmit={handleSubmit(onSubmit)} className="container">
              <div className="row justify-content-center">
                <Form.Group controlId="formBasicName" className="col-md-5">
                  <Form.Label>Godown Code*</Form.Label>
                  <Form.Control
                    defaultValue={singleGodownData.godowncode}
                    disabled
                    type="text"
                    placeholder="Enter Godown Code"
                    name="godownCode"
                    {...register("godownCode", {
                      required: "Required",
                      pattern: {
                        message: "Invalid Godown Code",
                      },
                    })}
                  />
                  {errors.godownCode && errors.godownCode.message}
                </Form.Group>
                <Form.Group controlId="godownName" className="col-md-5">
                  <Form.Label>Godown Name*</Form.Label>
                  <Form.Control required type="text" placeholder="Godown Name" name="godownName" defaultValue={singleGodownData.godownname}
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
                  <Form.Control required type="text" placeholder="Godown Incharge Name" name="inchargeName" defaultValue={singleGodownData.inchargename}
                    {...register("inchargeName", {
                      required: 'Required',
                      pattern: {
                        message: "Invalid Inchage Name"
                      }
                    })}
                  />
                  {errors.inchargeName && errors.inchargeName.message}
                </Form.Group>
                <Form.Group controlId="inchargemobile" className="col-md-5">
                  <Form.Label>Godown Incharge Mobile*</Form.Label>
                  <Form.Control required type="number" placeholder="Enter Incharge Mobile" name="inchargeMobile" defaultValue={singleGodownData.inchargemobile}
                    {...register("inchargeMobile", {
                      required: 'Required',
                      pattern: {
                        message: "Invalid Mobile"
                      }
                    })}
                  />
                  {errors.inchargeMobile && errors.inchargeMobile.message}
                </Form.Group>
                <Form.Group controlId="formBasicPhone" className="col-md-5">
                  <Form.Label>Godown Location*</Form.Label>
                  <select
                    name="godownLocation"
                    defaultValue={singleGodownData.godownLocation}
                    className="form-control"
                    {...register("godownLocation", {
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
                  {errors.godownLocation && errors.godownLocation.message}
                </Form.Group>
                <Form.Group controlId="formBasicPhone" className="col-md-10">
                  <Form.Label>Address*</Form.Label>
                  <Form.Control
                    defaultValue={singleGodownData.address}
                    required
                    as="textarea"
                    placeholder="Enter Godown Address"
                    rows="4"
                    name="address"
                    {...register("address", {
                      pattern: {
                        message: "Invalid Address",
                      },
                    })}
                  />
                  {errors.address && errors.address.message}
                </Form.Group>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4">
                <button
                  type="submit"
                  className="creategdn-btn px-4"
                  disabled={formSent}
                >
                  Update Godown
                </button>
              </div>
            </Form>
            {formSent && (
              <div className="form-thankyou-text">
                <i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                Godown Updated Successfully !!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditGodown;
