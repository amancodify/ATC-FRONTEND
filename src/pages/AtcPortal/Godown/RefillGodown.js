import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import API_URL from "../../../config";

function convertDate() {
    var date = new Date(),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + (date.getDate())).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

const RefillGodown = ({ godownCode }) => {
    const { handleSubmit, register } = useForm();
    let [formSent, setFormSent] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/products`)
            .then(response => {
                setProducts(response.data.data);
            })
            .catch(err => {
                console.log(err);
                window.location.reload();
            })
    }, []);

    const onSubmit = values => {
        let refillData = {
            productCode: values.productCode,
            fresh: parseFloat(values.fresh),
            damage: parseFloat(values.damage),
            godownCode: godownCode,
            refillDate: values.refilldate,
            refillMode: values.refillMode
        };

        axios.post(`${API_URL}/godowns/stockrefill`, refillData)
            .then(response => {
                if (response.data.status === "200") {
                    setFormSent(true);
                }
                setTimeout(() => window.location.reload(), 500)

            })
    }
    return (
        <>
            <div className="row justify-content-center refill-form px-2 py-5 mt-4">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="d-flex transaction-date"><div>Date:</div> <input defaultValue={convertDate()} required name="refilldate" ref={register({
                            pattern: {
                                message: "Cannot be empty"
                            }
                        })} className="ml-2 popup-date date-picker" type="date" /></div>


                        <Form.Group className="col-md-12 d-flex justify-content-center align-items-center">
                            <select
                                name="productCode"
                                defaultValue=""
                                className="form-control transaction-fields"
                                ref={register({
                                    required: "Required",
                                    pattern: {
                                        message: "Value Must be Selected",
                                    },
                                })}
                                required
                            >
                                <option value="" disabled>Select Product</option>
                                {
                                    products && products.length > 0 && products.map((item, inx) => {
                                        return (
                                            <option key={`pc_${inx}`} value={item.productcode}>{item.productname}</option>
                                        )
                                    })
                                }
                            </select>

                            <Form.Control placeholder="Fresh Quantity" className="transaction-fields" type="number" name="fresh" step="0.001" min="0.0"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: "Cannot be empty"
                                    }
                                })}
                            />
                            <Form.Control placeholder="Damage Quantity" className="transaction-fields" type="number" name="damage" step="0.001" min="0.0"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: "invalid phone Number"
                                    }
                                })}
                            />

                            <select
                                name="refillMode"
                                defaultValue=""
                                className="form-control transaction-fields"
                                ref={register({
                                    required: "Required",
                                    pattern: {
                                        message: "Value Must be Selected",
                                    },
                                })}
                                required
                            >
                                <option value="" disabled>Select Mode</option>
                                <option value="RAIL">Railway</option>
                                <option value="STOCKTRANSFER">Stock Transfer</option>
                            </select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="submit-btn" >Refill</Button>
                    </Form>
                </div>
            </div>
            {
                (formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                    Godown Refill Successful !!</div>)
            }
        </>
    )
}

export default RefillGodown;