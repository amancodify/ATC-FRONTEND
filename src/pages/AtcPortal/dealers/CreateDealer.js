import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faCloudArrowUp,
    faCircleCheck,
    faCircleExclamation,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../../config";

const CreateDealer = (() => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [formSent, setFormSent] = useState(false);
    const [formResponse, setFormResponse] = useState({});
    const [filename, setFileName] = useState("");
    const [fileData, setFileData] = useState({});
    const [loadingScr, setLoadingScr] = useState(false);

    const onSubmit = (values, e) => {
        setLoadingScr(true);
        let formData = new FormData();
        formData.append('name', values.ownerName)
        formData.append('party_code', values.firmCode)
        formData.append('address', values.address)
        formData.append('firm_name', values.firmName)
        formData.append('gender', values.gender)
        formData.append('dealer_area', values.dealerArea)
        formData.append('mobile', values.mobile)
        formData.append('email', values.email)
        formData.append('fileData', fileData)
        formData.append('is_damage_dealer', values.damagedealer)

        axios.post(`${API_URL}/dealers/create`, formData)
            .then(response => {
                setLoadingScr(false);
                setFormResponse(response.data);
                if (response.data.status === 200) {
                    setFormSent(true);
                    setFileName("");
                    setTimeout(() => { navigate("/atcportal/") }, 700);
                }
            })
            .catch(() => {
                setLoadingScr(false);
                setFormResponse({ status: 500, message: "Something went wrong. Please try again." });
            })
    }

    const onFileUpload = (e) => {
        setFileData(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const err = (key) => errors[key] && <span className="cp-err">{errors[key].message}</span>;
    const inputClass = (key) => "cp-input" + (errors[key] ? " has-err" : "");

    return (
        <div className="create-page">
            <div className="cp-head">
                <span className="cp-ic" aria-hidden="true"><FontAwesomeIcon icon={faUserPlus} /></span>
                <div>
                    <div className="cp-eyebrow">Create</div>
                    <h1 className="cp-title">Add Dealer / Party</h1>
                    <div className="cp-sub">Register a new dealer with their firm and contact details.</div>
                </div>
            </div>

            <form className="cp-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="cp-grid">
                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="firmCode">Dealer Code</label>
                        <input id="firmCode" type="text" placeholder="e.g. ATCBC-014" className={inputClass("firmCode")}
                            {...register("firmCode", {
                                required: 'Dealer Code is required',
                                validate: {
                                    noSpaces: v => !/\s/.test(v) || "No spaces allowed in Dealer Code",
                                }
                            })}
                        />
                        {err("firmCode")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="firmName">Firm Name</label>
                        <input id="firmName" type="text" placeholder="Enter firm name" className={inputClass("firmName")}
                            {...register("firmName", { required: 'Firm name is required' })}
                        />
                        {err("firmName")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="gender">Gender</label>
                        <select id="gender" defaultValue="" className={inputClass("gender") + " cp-select"}
                            {...register("gender", { required: 'Please select a gender' })}
                        >
                            <option value="" disabled>Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {err("gender")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="dealerArea">Dealer's Area</label>
                        <select id="dealerArea" defaultValue="" className={inputClass("dealerArea") + " cp-select"}
                            {...register("dealerArea", { required: 'Please select an area' })}
                        >
                            <option value="" disabled>Select area</option>
                            <option value="Siwan">Siwan</option>
                            <option value="Chapra">Chapra</option>
                            <option value="Gopalganj">Gopalganj</option>
                        </select>
                        {err("dealerArea")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="ownerName">Owner Name</label>
                        <input id="ownerName" type="text" placeholder="Enter owner's full name" className={inputClass("ownerName")}
                            {...register("ownerName", { required: 'Owner name is required' })}
                        />
                        {err("ownerName")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="mobile">Mobile</label>
                        <input id="mobile" type="tel" placeholder="10-digit mobile number" className={inputClass("mobile")}
                            {...register("mobile", {
                                required: 'Mobile number is required',
                                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" }
                            })}
                        />
                        {err("mobile")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label" htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="Optional email address" className={inputClass("email")}
                            {...register("email", {
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" }
                            })}
                        />
                        {err("email")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label" htmlFor="dealerPhoto">Dealer Photo (optional)</label>
                        <label className={"cp-file" + (filename ? " has-file" : "")} htmlFor="dealerPhoto">
                            <FontAwesomeIcon icon={faCloudArrowUp} />
                            <span>{filename || "Upload dealer photo"}</span>
                        </label>
                        <input id="dealerPhoto" type="file" accept="image/*" onChange={onFileUpload} />
                    </div>

                    <div className="cp-field cp-full">
                        <label className="cp-label cp-req" htmlFor="address">Address</label>
                        <textarea id="address" rows="2" placeholder="Enter permanent address" className={inputClass("address") + " cp-textarea"}
                            {...register("address", { required: 'Address is required' })}
                        />
                        {err("address")}
                    </div>

                    <div className="cp-field cp-full">
                        <label className="cp-check">
                            <input type="checkbox" {...register("damagedealer")} />
                            <span>This dealer buys damage products as well</span>
                        </label>
                    </div>
                </div>

                <div className="cp-actions">
                    <button type="button" className="cp-reset" onClick={() => navigate(0)} disabled={loadingScr}>
                        <FontAwesomeIcon icon={faRotateRight} /> Reset
                    </button>
                    <button type="submit" className="cp-btn" disabled={loadingScr} aria-busy={loadingScr}>
                        {loadingScr ? (
                            <><span className="cp-spin" /> Creating…</>
                        ) : (
                            <><FontAwesomeIcon icon={faUserPlus} /> Create Dealer</>
                        )}
                    </button>
                </div>
            </form>

            {formSent && (
                <div className="cp-banner cp-ok">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    Dealer Created Successfully !!
                </div>
            )}
            {formResponse.status && formResponse.status !== 200 && (
                <div className="cp-banner cp-err-bg">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {formResponse.status === 11000
                        ? "Duplicate Error: A dealer with this code already exists. Please use a unique Firm Code."
                        : (formResponse.message || "Could not create the dealer. Please try again.")}
                </div>
            )}
        </div>
    );
});

export default CreateDealer;
