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

const RefillGodown = () => {
    const { handleSubmit, register, formState: { errors } } = useForm();
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

    const onSubmit = (values) => {
        let refillData = {
            productCode: values.productCode,
            fresh: parseFloat(values.fresh),
            damage: parseFloat(values.damage),
            godownCode: values.godownCode || '',
            refillDate: values.refilldate,
            refillMode: values.refillMode
        };

        axios.post(`${API_URL}/godowns/stockrefill`, refillData)
            .then(response => {
                if (response.data.status === "200" || response.data.status === 200) {
                    setFormSent(true);
                }
                setTimeout(() => window.location.reload(), 500)
            })
    }
    return (
        <>
            <div className="col-md-12 createparty-main">
                <p className="title-createdealer">Refill Godown</p>
                <img className="add-vector" src="/images/godown_vector1.jpg" alt="" />
                <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
                    <Form onSubmit={handleSubmit(onSubmit)} className="container">
                        <div className="row">
                            <Form.Group className="col-md-12 col-sm-12">
                                <Form.Label>Date*</Form.Label>
                                <Form.Control
                                    defaultValue={convertDate()}
                                    required
                                    type="date"
                                    placeholder="Select Date"
                                    {...register("refilldate", {
                                        required: 'Required',
                                        pattern: {
                                            message: "Cannot be empty"
                                        }
                                    })}
                                />
                                {errors.refilldate && errors.refilldate.message}
                            </Form.Group>
                        </div>
                        <div className="row">
                            <Form.Group className="col-md-12 col-sm-12">
                                <Form.Label>Product*</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="productCode"
                                    defaultValue=""
                                    className="transaction-fields"
                                    {...register("productCode", {
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
                                </Form.Control>
                                {errors.productCode && errors.productCode.message}
                            </Form.Group>
                        </div>
                        <div className="row">
                            <Form.Group className="col-md-6 col-sm-12">
                                <Form.Label>Fresh Quantity*</Form.Label>
                                <Form.Control
                                    placeholder="Fresh Quantity"
                                    type="number"
                                    name="fresh"
                                    step="0.001"
                                    min="0.0"
                                    {...register("fresh", {
                                        required: 'Required',
                                        pattern: {
                                            message: "Cannot be empty"
                                        }
                                    })}
                                />
                                {errors.fresh && errors.fresh.message}
                            </Form.Group>
                            <Form.Group className="col-md-6 col-sm-12">
                                <Form.Label>Damage Quantity*</Form.Label>
                                <Form.Control
                                    placeholder="Damage Quantity"
                                    type="number"
                                    name="damage"
                                    step="0.001"
                                    min="0.0"
                                    {...register("damage", {
                                        required: 'Required',
                                        pattern: {
                                            message: "Cannot be empty"
                                        }
                                    })}
                                />
                                {errors.damage && errors.damage.message}
                            </Form.Group>
                        </div>
                        <div className="row">
                            <Form.Group className="col-md-12 col-sm-12">
                                <Form.Label>Refill Mode*</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="refillMode"
                                    defaultValue=""
                                    className="transaction-fields"
                                    {...register("refillMode", {
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
                                </Form.Control>
                                {errors.refillMode && errors.refillMode.message}
                            </Form.Group>
                        </div>
                        <div className="d-flex justify-content-center align-items-center mt-4">
                            <Button variant="primary" type="submit" className="create-btn px-4" >Refill</Button>
                        </div>
                    </Form>
                    {
                        (formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                            Godown Refill Successful !!</div>)
                    }
                </div>
            </div>
        </>
    )
}

export default RefillGodown;