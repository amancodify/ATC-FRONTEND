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

const GodownDamage = ({ godownCode }) => {
  const { handleSubmit, register } = useForm();
  let [formSent, setFormSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [godownData, setGodownData] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/godwons/${godownCode}`)
      .then((response) => {
        setGodownData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [godownCode]);

  const onSubmit = (values) => {
  let { total_stock } = godownData || {};
    let nullcount = 0;
    for (var key in values) {
      if (values[key] === "0") {
        nullcount++;
      }
    }
    let { ppc, psc, lppc } = total_stock;
    let cur_ppc = ppc.fresh;
    let cur_psc = psc.fresh;
    let cur_lppc = lppc.fresh;

    if (nullcount !== 3) {
      setErrorMsg("");
      let ppcval = parseFloat(values.ppc);
      let pscval = parseFloat(values.psc);
      let lppcval = parseFloat(values.lppc);

      if (ppcval <= cur_ppc && pscval <= cur_psc && lppcval <= cur_lppc) {
        let newDamageData = {
          ppc: ppcval,
          psc: pscval,
          lppc: lppcval,
          damage_report_date: new Date(values.damage_report_date),
          godown_code: godownCode,
        };
        axios
          .put(
            `${API_URL}/reportgodowndamage`,
            newDamageData
          )
          .then((response) => {
            if (response.data.nModified === 1) {
              setFormSent(true);
            }
            window.location.reload();
          });
      } else {
        setErrorMsg("Quantity can't be greater than currect Quantity");
      }
    } else {
      setErrorMsg("All values can't be 0");
    }
  };

  return (
    <>
      <div className="row justify-content-center refill-form mt-4">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex datemargin">
              <div>Date: </div>
              <input
                defaultValue={convertDate()}
                required
                name="damage_report_date"
                ref={register({
                  pattern: {
                    message: "Cannot be empty",
                  },
                })}
                className="ml-2 popup-date date-picker"
                type="date"
              />
            </div>
            <Form.Group className="col-md-12 d-flex justify-content-center align-items-center">
              <Form.Label className="productlbl w-50">Damage PPC</Form.Label>
              <Form.Control
                defaultValue={0}
                className="transaction-fields"
                type="number"
                name="ppc"
                step="0.001"
                min="0.0"
                ref={register({
                  required: "Required",
                  pattern: {
                    message: "Cannot be empty",
                  },
                })}
              />
            </Form.Group>

            <Form.Group className="col-md-12 d-flex justify-content-center align-items-center">
              <Form.Label className="productlbl w-50">Damage PSC</Form.Label>
              <Form.Control
                defaultValue={0}
                className="transaction-fields"
                type="number"
                name="psc"
                step="0.001"
                min="0.0"
                ref={register({
                  required: "Required",
                  pattern: {
                    message: "Cannot be empty",
                  },
                })}
              />
            </Form.Group>

            <Form.Group className="col-md-12 d-flex justify-content-center align-items-center">
              <Form.Label className="productlbl w-50">Damage LPPC</Form.Label>
              <Form.Control
                defaultValue={0}
                className="transaction-fields"
                type="number"
                name="lppc"
                step="0.001"
                min="0.0"
                ref={register({
                  required: "Required",
                  pattern: {
                    message: "Cannot be empty",
                  },
                })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="submit-btn">
              Refill
            </Button>
          </Form>
        </div>
      </div>
      {formSent && (
        <div className="form-thankyou-text">
          <i className="thumb-up mr-2 fa fa-thumbs-up"></i>
          Godown Refill Successful !!
        </div>
      )}
      {errorMsg !== "" && <div className="form-err-txt mt-4">{errorMsg}</div>}
    </>
  );
};

export default GodownDamage;
