import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import API_URL from "../../../config";

const AddProduct = (() => {
    const { handleSubmit, register, errors } = useForm();
    let [formSent, setFormSent] = useState(false);
    let [formResponse, setFormResponse] = useState({});
    let [loadingScr, setLoadingScr] = useState(false);


    const onSubmit = (values) => {
        setLoadingScr(true);
        axios.post(`${API_URL}/products/create`, values)
            .then(response => {
                setLoadingScr(false);
                setFormResponse(response.data);
                if (response.data.status === 200) {
                    setFormSent(true);
                    setTimeout(() => { window.location.replace("#/") }, 300);
                }
            })
    }

    return (
        <div className="col-md-12 createparty-main">
            <div className={loadingScr ? "loading add-prod-loading" : "no-loading"}>
                <i className="fa fa-cog fa-spin"></i>
                <span> &nbsp; Adding Product...</span>
            </div>
            <p className="title-createdealer">Add Product</p>
            <img className="add-vector" src="images/product.png" alt="" />
            <div className="col-md-9 col-sm-12 col-xs-12 createdealer-main">
                <Form onSubmit={handleSubmit(onSubmit)} className="container">
                    <div className="row">
                        <Form.Group controlId="productname" className="col-md-12 col-sm-12">
                            <Form.Label>Product Name*</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Product Name" name="productname"
                                ref={register({
                                    required: 'Required',
                                    pattern: {
                                        message: "Invalid Product Name"
                                    }
                                })}
                            />
                            {errors.productname && errors.productname.message}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group controlId="productdetails" className="col-md-12 col-sm-12">
                            <Form.Label>Product Description*</Form.Label>
                            <Form.Control required as="textarea" placeholder="Enter Product Details" rows="2" name="productdetails"
                                ref={register({
                                    pattern: {
                                        message: "Invalid product details"
                                    }
                                })}
                            />
                            {errors.productdetails && errors.productdetails.message}
                        </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <i onClick={() => window.location.reload()} className="fa fa-refresh refresh-btn" aria-hidden="true"></i>
                        <Button variant="primary" type="submit" className="create-btn px-4" >Add Product</Button>
                    </div>
                </Form>
                {
                    (formSent && <div className="form-thankyou-text"><i className="thumb-up mr-2 fa fa-thumbs-up"></i>
                        Product Created Successfully !!</div>)
                }
                {
                    formResponse.status === 11000 && <div className="mt-3 text-center error-text">Duplicate Error: Product with this code already present, try putting unique Product Code</div>
                }
            </div>
        </div>
    );
});

export default AddProduct;