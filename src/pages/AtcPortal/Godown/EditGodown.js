import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import API_URL from "../../../config";

const EditGodown = (props) => {
  let godownCode = props.match.params.id;
  const { handleSubmit, register, errors } = useForm();
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
          setTimeout(() => {window.location.replace(`#viewgodown/${godownCode}`)}, 500);
        }
      });
  };

  return (
    <div className="col-md-12 createparty-main">
      <a href={`#/viewgodown/${godownCode}`} className="back-btn backbtn-edit-godown"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</a>
      {singleGodownData && singleGodownData.godowncode && (
        <>
          <div className="godown-title-main">
            <img
              className="godown-vector"
              src="images/create_godown.png"
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
                    ref={register({
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
                    ref={register({
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
                    ref={register({
                      required: 'Required',
                      pattern: {
                        message: "Invalid Inchage Name"
                      }
                    })}
                  />
                  {errors.godownCode && errors.godownCode.message}
                </Form.Group>
                <Form.Group controlId="inchargemobile" className="col-md-5">
                  <Form.Label>Godown Incharge Mobile*</Form.Label>
                  <Form.Control required type="number" placeholder="Enter Incharge Mobile" name="inchargeMobile" defaultValue={singleGodownData.inchargemobile}
                    ref={register({
                      required: 'Required',
                      pattern: {
                        message: "Invalid Mobile"
                      }
                    })}
                  />
                  {errors.godownCode && errors.godownCode.message}
                </Form.Group>
                <Form.Group controlId="formBasicPhone" className="col-md-5">
                  <Form.Label>Godown Location*</Form.Label>
                  <select
                    name="godownLocation"
                    defaultValue={singleGodownData.godownLocation}
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
                  {errors.gender && errors.gender.message}
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
                    ref={register({
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
