import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import API_URL from "../../../config";

function convertDate() {
  var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

const OpeningBalance = ({ partyCode, openingDone }) => {
  const { handleSubmit, register } = useForm();
  const [formSent, setFormSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(response => {
        let defaultFormData = {};
        response.data.data.map((item) => {
          defaultFormData[`${item.productcode}`] = {
            productCode: item.productcode,
            delivered: 0,
            billed: 0
          };
          return true;
        });
        setFormData(defaultFormData);
        setProducts(response.data.data);
      })
      .catch(err => {
        console.log(err);
        window.location.replace("#/godown");
      })
  }, []);

  const handleOnChange = (event, productCode) => {
    let value = event.target.value;
    let name = event.target.name;
    let formDataCopy = formData;
    formDataCopy[`${productCode}`][`${name}`] = parseFloat(value);
    setFormData(formDataCopy);
  }

  const onSubmit = (values) => {
    let { opening_balance_date } = values;
    let formattedData = [];

    Object.keys(formData).map((item) => {
      formattedData.push({
        productCode: formData[item].productCode,
        delivered: formData[item].delivered,
        billed: formData[item].billed,
        manualOpeningDate: opening_balance_date
      });
      return true;
    });

    let openingBalData = {
      productsData: formattedData,
      partyCode: partyCode
    };

    axios.post(`${API_URL}/dealers/openingbal`, openingBalData)
      .then((response) => {
        if (response.data) {
          setFormSent(true);
        }
        window.location.reload();
      })
      .catch((err) => {
        setErrorMsg(err);
      });
  };

  return (
    <>
      {
        !openingDone &&
        <div className="row justify-content-center newtrans-main mt-4">
          <div className="trans-main col-md-8 mb-3">
            <div className="title">Quantity(mt)</div>
            <div className="title">Billing(mt)</div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="transaction-date openingbal-date">
                <div>Date:</div>
                <input
                  defaultValue={convertDate()}
                  required
                  className="ml-2 date-picker"
                  type="date"
                  name="opening_balance_date"
                  ref={register({
                    pattern: {
                      message: "Cannot be empty",
                    },
                  })}
                />
              </div>
              {products.length > 0 && products.map((item, key) => {
                return (
                  <div key={`ob_${key}`}>
                    <Form.Group className="col-md-12 d-flex justify-content-center align-items-center">
                      <Form.Label className="productlbl">{item.productname}</Form.Label>
                      <Form.Control
                        defaultValue={0}
                        required
                        className="transaction-fields"
                        type="number"
                        placeholder="Enter Quantity"
                        name="delivered"
                        step="0.001"
                        min="0.0"
                        onChange={(e) => handleOnChange(e, item.productcode)}
                        ref={register({
                          pattern: {
                            message: "Cannot be empty",
                          },
                        })}
                      />
                      <Form.Control
                        defaultValue={0}
                        required
                        className="transaction-fields"
                        type="number"
                        placeholder="Enter Billing"
                        name="billed"
                        step="0.001"
                        min="0.0"
                        onChange={(e) => handleOnChange(e, item.productcode)}
                        ref={register({
                          pattern: {
                            message: "invalid phone Number",
                          },
                        })}
                      />
                    </Form.Group>
                  </div>
                )
              })
              }
              <Button variant="primary" type="submit" className="submit-btn">
                Submit
            </Button>
            </Form>
          </div>
        </div>
      }
      {formSent && (
        <div className="form-thankyou-text">
          <i className="thumb-up mr-2 fa fa-thumbs-up"></i>
          Opening Balance Updated Successfully !!
        </div>
      )}
      {errorMsg !== "" && <div className="form-err-txt">{errorMsg}</div>}
    </>
  );
};
export default OpeningBalance;
