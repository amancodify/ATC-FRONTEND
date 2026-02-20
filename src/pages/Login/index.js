import React, { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { login, isLoggedIn } from "../../utils/auth";
import API_URL from "../../config";

// Constants
const LOGIN_ENDPOINT = `${API_URL}/login`;
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please fill in all fields correctly.",
  MISSING_DATA: "Unable to process login. Please try again.",
};

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

/**
 * UserLogin Component
 * Handles user authentication for ATC Portal
 * Features: Form validation, error handling, password visibility toggle, loading states
 */
const UserLogin = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  const isUserLoggedIn = isLoggedIn();

  /**
   * Validates email format
   */
  const isValidEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Validates form data before submission
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password || !formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isValidEmail]);

  /**
   * Handles input field changes
   */
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    // Clear error messages when user starts typing
    if (errMsg) {
      setErrMsg("");
    }
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [errMsg, errors]);

  /**
   * Toggles password visibility
   */
  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Handles form submission with error handling
   */
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // Validate form before submission
      if (!validateForm()) {
        setErrMsg(ERROR_MESSAGES.VALIDATION_ERROR);
        return;
      }

      setLoading(true);
      setErrMsg("");

      try {
        const response = await axios.post(LOGIN_ENDPOINT, formData, {
          timeout: 10000, // 10 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        });

        const fetchedData = response.data?.data;

        if (!fetchedData) {
          setErrMsg(ERROR_MESSAGES.MISSING_DATA);
          setLoading(false);
          return;
        }

        const { age, token, name, email } = fetchedData;

        if (!token || !age || !name) {
          setErrMsg(ERROR_MESSAGES.MISSING_DATA);
          setLoading(false);
          return;
        }

        // Login successful - set cookies and redirect
        login({ token, age, name, email });
      } catch (error) {
        setLoading(false);

        if (error.response?.status === 401) {
          setErrMsg(ERROR_MESSAGES.INVALID_CREDENTIALS);
        } else if (error.code === "ECONNABORTED") {
          setErrMsg(ERROR_MESSAGES.NETWORK_ERROR);
        } else if (error.message === "Network Error") {
          setErrMsg(ERROR_MESSAGES.NETWORK_ERROR);
        } else if (error.response?.status >= 500) {
          setErrMsg(ERROR_MESSAGES.SERVER_ERROR);
        } else {
          setErrMsg(ERROR_MESSAGES.SERVER_ERROR);
        }

        // eslint-disable-next-line no-console
        console.error("Login error:", error.message);
      }
    },
    [formData, validateForm]
  );

  // Redirect to portal if user is already logged in
  if (isUserLoggedIn) {
    return <Navigate to="/atcportal" replace />;
  }

  return (
    <div className="loginpage container">
      <div className="row">
        {/* Login Form Section */}
        <div className="loginform-main col-md-5 col-sm-12">
          <div className="login-form-wrapper">
            <h1 className="login-title">Login - ATC Portal</h1>

            {/* User Icon */}
            <div className="login-img">
              <img src="/images/loginuser.png" alt="User icon" />
            </div>

            {/* Login Form */}
            <form className="d-flex flex-column" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="input-container">
                <i className="fa fa-user icon" aria-hidden="true" />
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={`mb-2 atc-input ${errors.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  aria-label="Email address"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <span id="email-error" className="field-error-text" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="input-container password-container">
                <i className="fa fa-unlock-alt icon" aria-hidden="true" />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`mb-4 atc-input ${errors.password ? "input-error" : ""}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  aria-label="Password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={handleTogglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={loading}
                >
                  <i
                    className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                    aria-hidden="true"
                  />
                </button>
                {errors.password && (
                  <span id="password-error" className="field-error-text" role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* General Error Message */}
              {errMsg && (
                <div className="error-message" role="alert" aria-live="polite">
                  {errMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                className="atc-btn mt-2"
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-icon" aria-hidden="true" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="col-lg-7 col-md-12 col-sm-12 img-section">
          <img src="./images/loginbg.png" alt="ATC Portal background" />
        </div>
      </div>
    </div>
  );
};

UserLogin.propTypes = {};

export default UserLogin;
