import React, { useState } from "react";
import { login, isLoggedIn } from "../../../utils/auth";
import axios from "axios";
import { Redirect } from "react-router-dom";
import API_URL from "../../../config";

const UserLogin = () => {
  const [formData, setFormData] = useState({});
  const [errMsg, setErrMsg] = useState("");

  const onChangeHandler = (event) => {
    const formDataCopy = { ...formData };
    if (event.hasOwnProperty("target")) {
      formDataCopy[event.target.name] = event.target.value;
    }
    setFormData(formDataCopy);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${API_URL}/login`, formData)
      .then((response) => {
        let fetchedData = response.data.data;
        if (fetchedData) {
          let { age, token, name, email } = fetchedData;
          login({ token, age, name, email });
        } else {
          setErrMsg("Invalid Credentials !!");
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
                    <input
                      placeholder="Password"
                      className="mb-4 atc-input"
                      type="password"
                      name="password"
                      onChange={onChangeHandler}
                      value={formData["password"]}
                      required
                    />
                  </div>
                  <button className="atc-btn mt-2" type="submit">Login</button>
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
  }
  else {
    return <Redirect to="/atcportal" />
  }
};

export default UserLogin;
