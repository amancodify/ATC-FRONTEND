import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import API_URL from "../../../config";
import { getCurrentDate } from "../../../utils/dateConverter";
import { getStoredProducts, getStoredTransMode } from "../utils";

const PRODUCTS = getStoredProducts();
const TRANS_MODES = getStoredTransMode();

const ReturnBags = ({ tid, party_code, firm_name, party_name }) => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const [formSent, setFormSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [products, setProducts] = useState({});
    const [godowns, setGodowns] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}/transaction/${tid}`)
            .then((response) => {
                let transaction = response.data.data;
                let finalProducts = transaction.products.filter((item) => {
                    return item.delivered > 0;
                })
                setProducts(finalProducts);
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get(`${API_URL}/godowns`)
            .then(response => {
                setGodowns(response.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [tid]);

    const onReturnSubmit = values => {
        try {
            let prodLength = products.length;
            let finalProducts = [];

            for (let i = 0; i < prodLength; i++) {
                if (values[`quantity_${i}`] > 0) {
                    if (values[`mode_${i}`] === "") {
                        setErrorMsg("Mode is required");
                    } else if (values[`productcode_${i}`] === "") {
                        setErrorMsg("Product is required");
                    } else if (values[`producttype_${i}`] === "") {
                        setErrorMsg("Producttype is required");
                    } else {
                        let formattedData = {
                            quantity: parseFloat(values[`quantity_${i}`]),
                            producttype: values[`producttype_${i}`],
                            productcode: values[`productcode_${i}`],
                            returnmode: TRANS_MODES[values[`mode_${i}`]],
                            partycode: party_code,
                            reason: values['reason']
                        };

                        finalProducts.push(formattedData);
                    }
                }
            }

            if (finalProducts.length > 0) {
                let returnData = {
                    products: finalProducts,
                    transactionId: tid
                }
                axios.post(`${API_URL}/partyreturn`, returnData)
                    .then(response => {
                        if (response.data.status === "200") {
                            setFormSent(true);
                            setErrorMsg("");
                            window.location.reload();
                        }
                        else if (response.data.status === 500) {
                            setErrorMsg(response.data.message)
                        }
                    })
            }
        } catch (err) {
            console.log(err);
        }

    }

    const onChangeHandler = () => {
        setErrorMsg("");
    }

    return (
        <>
            <div className="row justify-content-center refill-form">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    {
                        products && products.length > 0 &&
                        <Form onSubmit={handleSubmit(onReturnSubmit)}>
                            <div className="returndate transaction-date">
                                <div>Date:</div>
                                <input 
                                    defaultValue={getCurrentDate()} 
                                    className="ml-2 mt-2 date-picker" 
                                    type="date" 
                                    {...register("trans_date", {
                                        required: "Date cannot be empty"
                                    })}
                                />
                            </div>
                            {errors.trans_date && <div className="error-text">{errors.trans_date.message}</div>}
                            <Form.Label className="mb-3 ml-3"><b>Items to be Returned</b></Form.Label>
                            {
                                products && products.length > 0 && products.map((item, inx) => {
                                    return (
                                        <Form.Group className=" mt-2 col-md-12 d-flex justify-content-center align-items-center" key={`returnmain${inx}`}>
                                            {/* <div class="product-text">{item.productcode}</div> */}
                                            <select onChange={onChangeHandler} defaultValue="" className="form-control transaction-fields"
                                                {...register(`productcode_${inx}`, {
                                                    required: "Product must be selected"
                                                })}
                                            >
                                                <option disabled value="">Select Product</option>
                                                <option value={item.productcode}>{PRODUCTS[item.productcode].name}</option>
                                            </select>
                                            {errors[`productcode_${inx}`] && <div className="error-text">{errors[`productcode_${inx}`].message}</div>}
                                            <Form.Control onChange={onChangeHandler} className="transaction-fields" type="number" placeholder={`Qty(max ${item.delivered} mt)`} step="0.001" min="0.0" max={item.delivered}
                                                {...register(`quantity_${inx}`, {
                                                    valueAsNumber: true,
                                                    min: { value: 0, message: "Quantity must be greater than 0" },
                                                    max: { value: item.delivered, message: `Quantity cannot exceed ${item.delivered}` }
                                                })}
                                            />
                                            {errors[`quantity_${inx}`] && <div className="error-text">{errors[`quantity_${inx}`].message}</div>}
                                            <select onChange={onChangeHandler} defaultValue="" className="form-control transaction-fields"
                                                {...register(`mode_${inx}`, {
                                                    required: "Mode must be selected"
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
                                            </select>
                                            {errors[`mode_${inx}`] && <div className="error-text">{errors[`mode_${inx}`].message}</div>}

                                            <select onChange={onChangeHandler} defaultValue="" className="form-control transaction-fields"
                                                {...register(`producttype_${inx}`, {
                                                    required: "Product type must be selected"
                                                })}
                                            >
                                                <option disabled value="">Product Type</option>
                                                <option value="FRESH">Fresh</option>
                                                <option value="DAMAGE">Damage</option>
                                            </select>
                                            {errors[`producttype_${inx}`] && <div className="error-text">{errors[`producttype_${inx}`].message}</div>}
                                        </Form.Group>
                                    )
                                })
                            }
                            <Form.Group className="col-md-12">
                                <Form.Label className="productlbl mb-3">Reason for Return</Form.Label>
                                <Form.Control as="textarea" placeholder="Any comments here..." rows="3"
                                    {...register("reason", {
                                        required: "Reason is required"
                                    })}
                                />
                                {errors.reason && <div className="error-text">{errors.reason.message}</div>}
                            </Form.Group>
                            <div className="err-msg">{errorMsg}</div>
                            <Button variant="primary" type="submit" className="submit-btn" >Return</Button>
                        </Form>
                    }
                    {
                        products && products.length <= 0 &&
                        <div className="d-flex flex-column justify-content-center align-items-center return-trans-not-found">
                            <img src="https://image.freepik.com/free-vector/no-data-concept-illustration_203587-28.jpg" alt="" />
                            <span>No Valid Return Transactions Available</span>
                        </div>
                    }
                </div>
            </div>
            {
                formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                    Return Successful !!</div>
            }
        </>
    )
}

export default ReturnBags;