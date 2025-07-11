import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import API_URL from "../../../config";
import { getCurrentDate } from "../../../utils/dateConverter";
import { getStoredProducts, getStoredTransMode } from "../utils";


const NewPartyTransaction = ({ partyCode, firmName, partyName }) => {
  const PRODUCTS = getStoredProducts();
  const TRANS_MODES = getStoredTransMode();
  const { handleSubmit, register } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingText, setLoadingText] = useState("Create Transactions");
  const [products, setProducts] = useState([]);
  const [usedProducts, setUsedProducts] = useState([]);
  const [currProductTrans, setCurrProductTrans] = useState({});
  const [finalProducts, setFinalProducts] = useState([]);
  const [addMore, setAddMore] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => setProducts(response.data.data))
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = (values) => {
    if (finalProducts.length === 0) {
      setErrorMsg("None of the Products added !!");
      return;
    }
    setLoadingText("Creating...");
    const transactionData = {
      products: finalProducts,
      partyCode,
      partyName,
      firmName,
      vehicleNumber: values.vehicle_no,
      consigneename: values.consigneename,
      transactiondate: values.trans_date,
      trans_comment: values.trans_comment,
    };
    axios
      .post(`${API_URL}/dealers/newtransaction`, transactionData)
      .then((response) => {
        if (response.data.data) window.location.reload();
      })
      .catch((err) => setErrorMsg(err?.message || "Error creating transaction"));
  };

  const addToProductsList = () => {
    const { delivered, billed, mode, producttype, productcode } = currProductTrans;
    let errorMessage = "";
    let hasError = false;
    if ((+delivered === 0 || !delivered) && (+billed === 0 || !billed)) {
      hasError = true;
      errorMessage = "Delivered & Billed both can't be 0";
    }
    if (!productcode) {
      hasError = true;
      errorMessage = "Select a product";
    }
    if (+delivered > 0 && !mode) {
      hasError = true;
      errorMessage = "Mode is required";
    }
    if (+delivered > 0 && !producttype) {
      hasError = true;
      errorMessage = "Product Type is required";
    }
    if (hasError) {
      setErrorMsg(errorMessage);
      return;
    }
    // Prepare product object
    const prodObj = {
      productcode,
      delivered: +delivered || 0,
      billed: +billed || 0,
      mode: mode || TRANS_MODES["NA"],
      producttype: producttype || "NA",
    };
    setFinalProducts([...finalProducts, prodObj]);
    setUsedProducts([...usedProducts, productcode]);
    setAddMore(false);
    setCurrProductTrans({});
    setErrorMsg("");
  };

  const handleCurrentTransChange = (event) => {
    setErrorMsg("");
    const { name, value } = event.target;
    setCurrProductTrans((prev) => {
      let updated = { ...prev };
      if (name === "mode") updated[name] = TRANS_MODES[value];
      else if (name === "delivered" || name === "billed") updated[name] = value;
      else updated[name] = value;
      return updated;
    });
  };

  const removeProduct = (productcode) => {
    setFinalProducts(finalProducts.filter((item) => item.productcode !== productcode));
    setUsedProducts(usedProducts.filter((item) => item !== productcode));
  };

  const isModeDisabled = false;

  return (
    <>
      <div className="row justify-content-center newtrans-main mt-4">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="dealertransdate transaction-date">
              <div>Date:</div>
              <input
                defaultValue={getCurrentDate()}
                required
                className="ml-2 date-picker"
                type="date"
                {...register("trans_date", { required: "Date cannot be empty" })}
              />
            </div>
            <div className="prodview-main trans-header">
              <span>PRODUCTS</span>
              <span>DELIVERED</span>
              <span>BILLED</span>
              <span>MODE</span>
              <span>PRODUCT TYPE</span>
            </div>
            {finalProducts.length === 0 && (
              <div className="noproducts-view-main">No Records added yet.</div>
            )}
            {finalProducts.length > 0 &&
              finalProducts.map((item, inx) => (
                <div className="prodview-main" key={item.productcode}>
                  <span>{PRODUCTS[item.productcode]?.name || item.productcode}</span>
                  <span>{item.delivered} mt</span>
                  <span>{item.billed} mt</span>
                  <span>{TRANS_MODES[item.mode.value]?.name || item.mode.value}</span>
                  <span>{item.producttype}</span>
                  <div
                    onClick={() => removeProduct(item.productcode)}
                    className="delete-trans"
                  >
                    &#10005;
                  </div>
                </div>
              ))}
            {addMore && (
              <Form.Group className="trans-fields-main mt-2 col-md-12 d-flex justify-content-center align-items-center">
                <select
                  onChange={handleCurrentTransChange}
                  required
                  value={currProductTrans.productcode || ""}
                  name="productcode"
                  className="form-control transaction-fields"
                >
                  <option disabled value="">
                    Select Product
                  </option>
                  {products &&
                    products.length > 0 &&
                    products.map((item, inx) => {
                      if (!usedProducts.includes(item.productcode)) {
                        return (
                          <option key={`productatc_${inx}`} value={item.productcode}>
                            {item.productname}
                          </option>
                        );
                      }
                      return null;
                    })}
                </select>
                <Form.Control
                  onChange={handleCurrentTransChange}
                  className="transaction-fields"
                  type="number"
                  placeholder="Delivery in MT"
                  name="delivered"
                  value={currProductTrans.delivered || ""}
                  step="0.001"
                  min="0.0"
                />
                <Form.Control
                  onChange={handleCurrentTransChange}
                  className="transaction-fields"
                  type="number"
                  placeholder="Billing in MT"
                  name="billed"
                  value={currProductTrans.billed || ""}
                  step="0.001"
                  min="0.0"
                />
                <select
                  onChange={handleCurrentTransChange}
                  disabled={isModeDisabled}
                  value={currProductTrans.mode?.value || ""}
                  name="mode"
                  className="form-control transaction-fields"
                >
                  <option disabled value="">
                    Select Mode
                  </option>
                  {Object.keys(TRANS_MODES).map((item) => (
                    <option key={`modes_val_${item}`} value={TRANS_MODES[item].value}>
                      {TRANS_MODES[item].name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={handleCurrentTransChange}
                  required
                  disabled={isModeDisabled}
                  value={currProductTrans.producttype || ""}
                  name="producttype"
                  className="form-control transaction-fields"
                >
                  <option disabled value="">
                    Product Type
                  </option>
                  <option value="FRESH">Fresh</option>
                  <option value="DAMAGE">Damage</option>
                </select>
                <div
                  onClick={addToProductsList}
                  className="btn add-prod-btn"
                >
                  +
                </div>
              </Form.Group>
            )}
            <div className="ml-4">{errorMsg}</div>
            <div className="d-flex justify-content-end">
              <div
                onClick={() => {
                  if (usedProducts.length < products.length) {
                    setAddMore(!addMore);
                    setErrorMsg("");
                  }
                }}
                className="btn add-btn"
              >
                {addMore ? "Remove" : "Add New Record +"}
              </div>
            </div>
            <Form.Group className="col-md-12 mt-5">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <Form.Label className="productlbl newtrans-cons-vechi">
                  Vehicle No.
                </Form.Label>
                <Form.Control
                  required
                  className="transaction-fields"
                  type="text"
                  placeholder="Enter Vehicle Number"
                  {...register("vehicle_no", { required: "Vehicle number cannot be empty" })}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <Form.Label className="productlbl newtrans-cons-vechi">
                  Consignee
                </Form.Label>
                <Form.Control
                  required
                  className="transaction-fields"
                  type="text"
                  placeholder="Enter Consignee Name"
                  {...register("consigneename", { required: "Consignee name cannot be empty" })}
                />
              </div>
            </Form.Group>
            <div className="mr-2">
              <Form.Group className="col-md-12">
                <Form.Label className="productlbl mb-3">Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Any comments here..."
                  rows="3"
                  {...register("trans_comment")}
                />
              </Form.Group>
            </div>
            <Button
              disabled={loadingText === "Creating"}
              className={`submit-btn ${loadingText === "Creating" ? "disable-btn" : ""}`}
              variant="primary"
              type="submit"
            >
              {loadingText === "Creating" ? (
                <img className="loading-gif" src="./images/loading.gif" alt="" />
              ) : null} {loadingText}
            </Button>
          </Form>
        </div>
      </div>
      {errorMsg && <div className="form-err-txt">{errorMsg}</div>}
    </>
  );
};

export default NewPartyTransaction;
