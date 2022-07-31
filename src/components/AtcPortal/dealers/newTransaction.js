import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import API_URL from "../../../config";
import { getCurrentDate } from "../../../utils/dateConverter";
import { PRODUCTS_TEXTS, TRANSACTION_MODES } from "./variablesMapping";
import { Dropdown } from 'semantic-ui-react';

const NewPartyTransaction = (({ partyCode, firmName, partyName, email, damageDealer }) => {
    const { handleSubmit, register } = useForm();
    const [errorMsg, setErrorMsg] = useState("");
    const [loadingText, setLoadingText] = useState("Submit");
    const [products, setProducts] = useState([]);
    const [godowns, setGodowns] = useState([]);
    const [usedProducts, setUsedProducts] = useState([]);
    const [currenctProductTrans, setCurrentProductTrans] = useState({});
    const [finalProducts, setFinalProducts] = useState([]);
    const [addMore, setAddMore] = useState(true);
    const [consignee, setConsignee] = useState([]);
    const [selectedConsignee, setSelectedConsignee] = useState("");

    useEffect(() => {
        axios.get(`${API_URL}/products`)
            .then(response => {
                setProducts(response.data.data);
            })
            .catch(err => {
                console.log(err);
            })

        axios.get(`${API_URL}/godowns`)
            .then(response => {
                setGodowns(response.data.data);
            })
            .catch(err => {
                console.log(err);
            })

        axios.post(`${API_URL}/getpartyconsignees`, { partycode: partyCode })
            .then(response => {
                setConsignee(response.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [partyCode]);

    const onSubmit = values => {
        if (finalProducts.length > 0) {
            setLoadingText("Creating");
            console.log(selectedConsignee)
            let transactionData = {
                products: finalProducts,
                partyCode: partyCode,
                partyName: partyName,
                firmName: firmName,
                vehicleNumber: values.vehicle_no,
                consigneeCode: `${selectedConsignee}`,
                transactiondate: values.trans_date
            };

            axios.post(`${API_URL}/dealers/newtransaction`, transactionData)
                .then((response) => {
                    if (response.data.data) {
                        window.location.reload();
                    }
                })
                .catch((err) => {
                    setErrorMsg(err);
                });
        } else {
            setErrorMsg("None of the Products added !!");
        }
    }


    const addToProductsList = () => {
        let { delivered, billed, mode, producttype } = currenctProductTrans;
        let errorMessage = "";
        let hasError = false;
        if (delivered === 0 && billed === 0) {
            hasError = true;
            errorMessage = "Delivered & Billed both can't be 0";
        }

        let length = Object.keys(currenctProductTrans).length;

        if (length < 2) {
            hasError = true;
            errorMessage = "Missing Fields Required";
        }

        if (delivered > 0 && !mode) {
            hasError = true;
            errorMessage = "Mode is required";
        }

        if (delivered > 0 && !producttype) {
            hasError = true;
            errorMessage = "Product Type is required";
        }

        if (!hasError) {
            let currentUsedProduct = currenctProductTrans.productcode;
            let usedProductsCopy = usedProducts;
            if (!usedProductsCopy.includes(currentUsedProduct)) {
                let finalUsedProducts = [...usedProductsCopy, currentUsedProduct];
                setUsedProducts(finalUsedProducts);
            }

            if (!currenctProductTrans["mode"] || delivered === 0) {
                currenctProductTrans["mode"] = TRANSACTION_MODES["NA"];
            }

            if (!billed) {
                currenctProductTrans["billed"] = 0;
            }

            if (!delivered) {
                currenctProductTrans["delivered"] = 0;
            }

            if (!producttype) {
                currenctProductTrans['producttype'] = "NA";
            }

            let allFinalProductsCopy = finalProducts;
            let productsToPush = [...allFinalProductsCopy, currenctProductTrans];
            setFinalProducts(productsToPush);
            setAddMore(false);
            setCurrentProductTrans({});
        } else {
            setErrorMsg(errorMessage);
        }
    }

    const handleCurrentTransChange = (event) => {
        setErrorMsg("");
        let { name, value } = event.target;
        let currenctDataCopy = { ...currenctProductTrans };
        currenctDataCopy[name] = value;

        switch (name) {
            case "mode":
                currenctDataCopy[name] = TRANSACTION_MODES[value];
                break;
            case "delivered":
                currenctDataCopy[name] = parseFloat(value);
                break;
            case "billed":
                currenctDataCopy[name] = parseFloat(value);
                break;
            default:
                currenctDataCopy[name] = value;
        }
        setCurrentProductTrans(currenctDataCopy);
    }

    const removeProduct = (productcode) => {
        let finalProductsCopy = [...finalProducts];
        finalProductsCopy = finalProductsCopy.filter((item) => {
            return item.productcode !== productcode
        });

        setFinalProducts(finalProductsCopy);

        let usedProductsCopy = [...usedProducts];
        usedProductsCopy = usedProductsCopy.filter((item) => {
            return item !== productcode;
        });

        setUsedProducts(usedProductsCopy);
    }

    let isModeDisabled = (currenctProductTrans.delivered && currenctProductTrans.delivered > 0) ? false : true;

    let consigneeOptions = consignee.map((item) => {
        return {
            key: item.consigneecode,
            value: item.consigneecode,
            text: `${item.firmname} (${item.consigneecode})`
        }
    })

    return (
        <>
            <div className="row justify-content-center newtrans-main mt-4">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="dealertransdate transaction-date"><div>Date:</div>
                            <input defaultValue={getCurrentDate()} required className="ml-2 date-picker" type="date" name="trans_date"
                                ref={register({
                                    pattern: {
                                        message: "Cannot be empty"
                                    }
                                })}
                            />
                        </div>
                        <div className="prodview-main trans-header">
                            <span>PRODUCTS</span>
                            <span>DELIVERED</span>
                            <span>BILLED</span>
                            <span>MODE</span>
                            <span>PRODUCT TYPE</span>
                        </div>
                        {
                            finalProducts.length <= 0 &&
                            <>
                                <div className="noproducts-view-main">
                                    No Products added yet.
                                </div>
                            </>
                        }
                        {
                            finalProducts.length > 0 && finalProducts.map((item, inx) => {
                                return (
                                    <>
                                        <div className="prodview-main">
                                            <span>{PRODUCTS_TEXTS[item.productcode]}</span>
                                            <span>{item.delivered} mt</span>
                                            <span>{item.billed} mt</span>
                                            <span>{item.mode.value}</span>
                                            <span>{item.producttype}</span>

                                            <div onClick={() => removeProduct(item.productcode)} className="delete-trans">&#10005;</div>
                                        </div>
                                    </>
                                )
                            })
                        }

                        {
                            addMore &&
                            <Form.Group className="trans-fields-main mt-2 col-md-12 d-flex justify-content-center align-items-center">
                                <select onChange={handleCurrentTransChange} required defaultValue="" name="productcode" className="form-control transaction-fields"
                                    ref={register({
                                        pattern: {
                                            message: "Value Must be Selected"
                                        }
                                    })}
                                >
                                    <option disabled value="">Select Product</option>
                                    {
                                        products && products.length > 0 && products.map((item, inx) => {
                                            if (!usedProducts.includes(item.productcode)) {
                                                return (
                                                    <option key={`productatc_${inx}`} value={item.productcode}>{item.productname}</option>
                                                )
                                            }
                                            return ""
                                        })
                                    }
                                </select>
                                <Form.Control onChange={handleCurrentTransChange} className="transaction-fields" type="number" placeholder="Delivery in MT" name="delivered" step="0.001" min="0.0"
                                    ref={register({
                                        pattern: {
                                            message: "Invalid Quantity Amount"
                                        }
                                    })}
                                />
                                <Form.Control onChange={handleCurrentTransChange} className="transaction-fields" type="number" placeholder="Billing in MT" name="billed" step="0.001" min="0.0"
                                    ref={register({
                                        pattern: {
                                            message: "Invalid Billing Amount"
                                        }
                                    })}
                                />
                                <select onChange={handleCurrentTransChange} disabled={isModeDisabled} defaultValue="" name="mode" className="form-control transaction-fields"
                                    ref={register({
                                        pattern: {
                                            message: "Value Must be Selected"
                                        }
                                    })}
                                >
                                    <option disabled value="">Select Mode</option>

                                    {
                                        godowns.length > 0 && godowns.map((item, inx) => {
                                            return (
                                                <option key={`godownoption_${inx}`} value={item.godowncode}>{item.godownname}</option>
                                            )
                                        })
                                    }

                                    <option value="RAIL">Rail</option>
                                    <option value="ST">Stock Transfer(ST)</option>
                                    <option value="ROAD">Direct</option>
                                </select>

                                <select onChange={handleCurrentTransChange} required disabled={isModeDisabled} defaultValue="" name="producttype" className="form-control transaction-fields"
                                    ref={register({
                                        pattern: {
                                            message: "Value Must be Selected"
                                        }
                                    })}
                                >
                                    <option disabled value="">Product Type</option>
                                    <option value="FRESH">Fresh</option>
                                    <option value="DAMAGE">Damage</option>
                                </select>
                                <div onClick={() => addToProductsList()} className="btn add-prod-btn">+</div>
                            </Form.Group>
                        }
                        <div className="ml-4">{errorMsg}</div>
                        <div className="d-flex justify-content-end">
                            <div onClick={() => { if (usedProducts.length < products.length) { setAddMore(!addMore); setErrorMsg(""); } }} className="btn add-btn">{addMore ? "Remove" : "Add New Product +"}</div>
                        </div>

                        <Form.Group className="col-md-12 mt-5">
                            <div className="d-flex justify-content-center align-items-center mb-3">
                                <Form.Label className="productlbl newtrans-cons-vechi">Vehicle No. </Form.Label>
                                <Form.Control required className="transaction-fields" type="text" placeholder="Enter Vehicle Number" name="vehicle_no"
                                    ref={register({
                                        pattern: {
                                            message: "Cannot be empty"
                                        }
                                    })}
                                />
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <Form.Label className="productlbl newtrans-cons-vechi">Consignee </Form.Label>
                                <Dropdown
                                    clearable
                                    fluid
                                    search
                                    selection
                                    options={consigneeOptions}
                                    placeholder='Select Consignee'
                                    onChange={(e, data) => setSelectedConsignee(data.value)}
                                    className= "party-select-dd"
                                />
                            </div>
                        </Form.Group>
                        <div className="mr-2">
                            <Form.Group className="col-md-12">
                                <Form.Label className="productlbl mb-3">Comments</Form.Label>
                                <Form.Control as="textarea" placeholder="Any comments here..." rows="3" name="trans_comment"
                                    ref={register({
                                        pattern: {
                                            message: "Invalid Address"
                                        }
                                    })}
                                />
                            </Form.Group>
                        </div>
                        <Button disabled={loadingText === "Creating" ? true : false} className={`submit-btn ${loadingText === "Creating" ? "disable-btn" : ""}`} variant="primary" type="submit" >
                            {loadingText === "Creating" ? <img className="loading-gif" src="./images/loading.gif" alt="" /> : ""}  {loadingText}
                        </Button>
                    </Form>
                </div>
            </div>
            {
                errorMsg !== "" && <div className="form-err-txt">{errorMsg}</div>
            }
        </>
    )
});

export default NewPartyTransaction;