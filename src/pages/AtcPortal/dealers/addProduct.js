import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faCloudArrowUp,
    faCircleCheck,
    faCircleExclamation,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../../config";

const AddProduct = (() => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [formSent, setFormSent] = useState(false);
    const [formResponse, setFormResponse] = useState({});
    const [loadingScr, setLoadingScr] = useState(false);

    const onSubmit = (values) => {
        setLoadingScr(true);
        axios.post(`${API_URL}/products/create`, values)
            .then(response => {
                setLoadingScr(false);
                setFormResponse(response.data);
                if (response.data.status === 200) {
                    setFormSent(true);
                    setTimeout(() => { navigate("/atcportal/") }, 300);
                }
            })
            .catch(() => {
                setLoadingScr(false);
                setFormResponse({ status: 500, message: "Something went wrong. Please try again." });
            })
    }

    const err = (key) => errors[key] && <span className="cp-err">{errors[key].message}</span>;
    const inputClass = (key) => "cp-input" + (errors[key] ? " has-err" : "");

    return (
        <div className="create-page">
            <div className="cp-head">
                <span className="cp-ic" aria-hidden="true"><FontAwesomeIcon icon={faBoxOpen} /></span>
                <div>
                    <div className="cp-eyebrow">Create</div>
                    <h1 className="cp-title">Add Product</h1>
                    <div className="cp-sub">Define a new product for your transactions and reports.</div>
                </div>
            </div>

            <form className="cp-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="cp-grid">
                    <div className="cp-field cp-full">
                        <label className="cp-label cp-req" htmlFor="productname">Product Name</label>
                        <input id="productname" type="text" placeholder="e.g. Premium Cement Bag" className={inputClass("productname")}
                            {...register("productname", { required: 'Product name is required' })}
                        />
                        {err("productname")}
                    </div>

                    <div className="cp-field cp-full">
                        <label className="cp-label cp-req" htmlFor="productdetails">Product Description</label>
                        <textarea id="productdetails" rows="3" placeholder="Describe the product — grade, packaging, usage…" className={inputClass("productdetails") + " cp-textarea"}
                            {...register("productdetails", { required: 'Product description is required' })}
                        />
                        {err("productdetails")}
                    </div>
                </div>

                <div className="cp-actions">
                    <button type="button" className="cp-reset" onClick={() => navigate(0)} disabled={loadingScr}>
                        <FontAwesomeIcon icon={faRotateRight} /> Reset
                    </button>
                    <button type="submit" className="cp-btn" disabled={loadingScr} aria-busy={loadingScr}>
                        {loadingScr ? (
                            <><span className="cp-spin" /> Adding…</>
                        ) : (
                            <><FontAwesomeIcon icon={faBoxOpen} /> Add Product</>
                        )}
                    </button>
                </div>
            </form>

            {formSent && (
                <div className="cp-banner cp-ok">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    Product Created Successfully !!
                </div>
            )}
            {formResponse.status && formResponse.status !== 200 && (
                <div className="cp-banner cp-err-bg">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {formResponse.status === 11000
                        ? "Duplicate Error: A product with this code already exists."
                        : (formResponse.message || "Could not create the product. Please try again.")}
                </div>
            )}
        </div>
    );
});

export default AddProduct;
