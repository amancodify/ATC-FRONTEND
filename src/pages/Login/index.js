import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { login, isLoggedIn } from "../../utils/auth";
import API_URL from "../../config";

const UserLogin = () => {
    const [formData, setFormData] = useState({});
    const [errMsg, setErrMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChangeHandler = (event) => {
        if (errMsg) {
            setErrMsg("");
        }
        const formDataCopy = { ...formData };
        if (event.hasOwnProperty("target")) {
            formDataCopy[event.target.name] = event.target.value;
        }
        setFormData(formDataCopy);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${API_URL}/login`, formData).then((response) => {
            let fetchedData = response.data.data;
            if (fetchedData) {
                let { age, token, name, email } = fetchedData;
                login({ token, age, name, email });
                setLoading(false);
            } else {
                setErrMsg("Invalid Credentials !!");
                setLoading(false);
            }
        });
    };

    let validUser = isLoggedIn();

    if (!validUser) {
        return (
            <>
                <div className="loginpage container">
                    <div className="row">
                        <div className="loginform-main col-md-5 col-sm-12">
                            <div className="">
                                <h2 className="login-title">Login - ATC Portal</h2>
                                <div className="login-img">
                                    <img src="/images/loginuser.png" alt="" />
                                </div>
                                <form className="d-flex flex-column" onSubmit={onSubmit}>
                                    <div className="input-container">
                                        <i className="fa fa-user icon" aria-hidden="true"></i>
                                        <input
                                            placeholder="Username"
                                            className="mb-2 atc-input"
                                            type="email"
                                            name="email"
                                            onChange={onChangeHandler}
                                            value={formData["email"]}
                                            required
                                        />
                                    </div>

                                    <div className="input-container">
                                        <i className="fa fa-unlock-alt icon" aria-hidden="true"></i>
                                        <div className="d-flex">
                                            <input
                                                placeholder="Password"
                                                className="mb-4 atc-input"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                onChange={onChangeHandler}
                                                value={formData["password"]}
                                                required
                                            />
                                            <i
                                                style={{
                                                    right: "10px",
                                                    top: "12px",
                                                    cursor: "pointer",
                                                    position: "absolute",
                                                }}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                                                aria-hidden="true"
                                            ></i>
                                        </div>
                                    </div>
                                    <button className="atc-btn mt-2" type="submit">
                                       {loading ? "Loading..." : "Login"}
                                    </button>
                                </form>
                                {errMsg && <div className="errorText">{errMsg}</div>}
                            </div>
                        </div>
                        <div class="col-lg-7 col-md-12 col-sm-12 img-section">
                            <img src="./images/loginbg.png" alt="" />
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return <Navigate to="/atcportal" replace />;
    }
};

export default UserLogin;
