import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWarehouse,
    faCircleCheck,
    faCircleExclamation,
    faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../../config";

const CreateGodown = (() => {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [formSent, setFormSent] = useState(false);
    const [formResponse, setFormResponse] = useState({});
    const [loadingScr, setLoadingScr] = useState(false);

    const onSubmit = values => {
        setLoadingScr(true);
        let godownCreationData = {
            "godownCode": values.godownCode,
            "godownName": values.godownName,
            "godownLocation": values.godownLocation,
            "address": values.address,
            "inchargeName": values.inchargeName,
            "inchargeMobile": values.inchargeMobile
        };
        axios.post(`${API_URL}/godowns/create`, godownCreationData)
            .then(response => {
                setLoadingScr(false);
                if (response.status === 200) {
                    setFormSent(true);
                    setTimeout(() => { navigate(`/atcportal/viewgodown/${values.godownCode}`) }, 700);
                } else {
                    setFormResponse(response.data || {});
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
                <span className="cp-ic" aria-hidden="true"><FontAwesomeIcon icon={faWarehouse} /></span>
                <div>
                    <div className="cp-eyebrow">Create</div>
                    <h1 className="cp-title">Add Godown</h1>
                    <div className="cp-sub">Set up a warehouse with its incharge and location details.</div>
                </div>
            </div>

            <form className="cp-card" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="cp-grid">
                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="godownCode">Godown Code</label>
                        <input id="godownCode" type="text" placeholder="e.g. SV001" className={inputClass("godownCode")}
                            {...register("godownCode", {
                                required: 'Godown code is required',
                                validate: { noSpaces: v => !/\s/.test(v) || "No spaces allowed in Godown Code" }
                            })}
                        />
                        {err("godownCode")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="godownName">Godown Name</label>
                        <input id="godownName" type="text" placeholder="Enter godown name" className={inputClass("godownName")}
                            {...register("godownName", { required: 'Godown name is required' })}
                        />
                        {err("godownName")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="inchargeName">Incharge Name</label>
                        <input id="inchargeName" type="text" placeholder="Godown incharge name" className={inputClass("inchargeName")}
                            {...register("inchargeName", { required: 'Incharge name is required' })}
                        />
                        {err("inchargeName")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="inchargeMobile">Incharge Mobile</label>
                        <input id="inchargeMobile" type="tel" placeholder="10-digit mobile number" className={inputClass("inchargeMobile")}
                            {...register("inchargeMobile", {
                                required: 'Mobile number is required',
                                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" }
                            })}
                        />
                        {err("inchargeMobile")}
                    </div>

                    <div className="cp-field">
                        <label className="cp-label cp-req" htmlFor="godownLocation">Godown Location</label>
                        <select id="godownLocation" defaultValue="" className={inputClass("godownLocation") + " cp-select"}
                            {...register("godownLocation", { required: 'Please select a location' })}
                        >
                            <option value="" disabled>Select location</option>
                            <option value="Siwan">Siwan</option>
                            <option value="Chapra">Chapra</option>
                            <option value="Gopalganj">Gopalganj</option>
                        </select>
                        {err("godownLocation")}
                    </div>

                    <div className="cp-field cp-full">
                        <label className="cp-label cp-req" htmlFor="address">Address</label>
                        <textarea id="address" rows="3" placeholder="Enter godown address" className={inputClass("address") + " cp-textarea"}
                            {...register("address", { required: 'Address is required' })}
                        />
                        {err("address")}
                    </div>
                </div>

                <div className="cp-actions">
                    <button type="button" className="cp-reset" onClick={() => navigate(0)} disabled={loadingScr}>
                        <FontAwesomeIcon icon={faRotateRight} /> Reset
                    </button>
                    <button type="submit" className="cp-btn" disabled={loadingScr || formSent} aria-busy={loadingScr}>
                        {loadingScr ? (
                            <><span className="cp-spin" /> Creating…</>
                        ) : (
                            <><FontAwesomeIcon icon={faWarehouse} /> Create Godown</>
                        )}
                    </button>
                </div>
            </form>

            {formSent && (
                <div className="cp-banner cp-ok">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    Godown Created Successfully !!
                </div>
            )}
            {formResponse.status && formResponse.status !== 200 && (
                <div className="cp-banner cp-err-bg">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    {formResponse.message || "Could not create the godown. Please try again."}
                </div>
            )}
        </div>
    );
});

export default CreateGodown;
