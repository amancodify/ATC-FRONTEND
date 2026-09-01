import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleNotch,
  faCircleQuestion,
  faArrowRight,
  faCircleExclamation,
  faUsers,
  faWarehouse,
  faChartPie,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { login, isLoggedIn } from "../../utils/auth";
import CompLogo from "../../assets/logo.png";
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
  companyCode: "",
  email: "",
  password: "",
};

// ─── Decorative product illustration (pure SVG, no external assets) ─────────
const LoginArt = () => (
  <svg
    className="login-art"
    viewBox="0 0 560 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="ATC portal illustration"
  >
    <defs>
      <linearGradient id="laGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd971" />
        <stop offset="1" stopColor="#f5a623" />
      </linearGradient>
      <linearGradient id="laViolet" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#6d5ce6" />
      </linearGradient>
      <linearGradient id="laTeal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6ee7b7" />
        <stop offset="1" stopColor="#10b981" />
      </linearGradient>
    </defs>

    {/* orbit + satellite */}
    <circle cx="480" cy="52" r="34" stroke="rgba(124,92,255,0.35)" strokeDasharray="4 6" />
    <circle cx="480" cy="52" r="9" fill="#7c5cff" opacity="0.85" />
    <circle cx="64" cy="300" r="26" stroke="rgba(245,197,66,0.3)" strokeDasharray="3 5" />
    <circle cx="64" cy="300" r="7" fill="#f5c542" opacity="0.8" />

    {/* floating verified badge */}
    <g>
      <rect x="30" y="86" width="62" height="62" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" />
      <circle cx="61" cy="117" r="16" fill="url(#laGold)" />
      <path d="M54 117.5l5 5 10-11" stroke="#221a05" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>

    {/* main dashboard window */}
    <rect x="108" y="36" width="336" height="268" rx="22" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.16)" />
    <circle cx="134" cy="62" r="5" fill="#f87171" opacity="0.75" />
    <circle cx="154" cy="62" r="5" fill="#fbbf24" opacity="0.75" />
    <circle cx="174" cy="62" r="5" fill="#34d399" opacity="0.75" />
    <rect x="368" y="54" width="56" height="10" rx="5" fill="rgba(255,255,255,0.14)" />

    {/* sidebar */}
    <rect x="128" y="84" width="82" height="200" rx="12" fill="rgba(255,255,255,0.06)" />
    <rect x="142" y="102" width="54" height="9" rx="4.5" fill="url(#laGold)" />
    <rect x="142" y="126" width="52" height="7" rx="3.5" fill="rgba(255,255,255,0.26)" />
    <rect x="142" y="144" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.26)" />
    <rect x="142" y="162" width="56" height="7" rx="3.5" fill="rgba(255,255,255,0.26)" />
    <rect x="142" y="180" width="40" height="7" rx="3.5" fill="rgba(255,255,255,0.26)" />
    <circle cx="169" cy="252" r="20" fill="rgba(124,92,255,0.25)" />
    <path d="M161 252l6 6 11-12" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    {/* stat cards */}
    <rect x="226" y="84" width="100" height="58" rx="12" fill="rgba(255,255,255,0.06)" />
    <rect x="238" y="98" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.3)" />
    <rect x="238" y="114" width="66" height="13" rx="6.5" fill="url(#laGold)" />
    <rect x="338" y="84" width="86" height="58" rx="12" fill="rgba(255,255,255,0.06)" />
    <rect x="350" y="98" width="38" height="7" rx="3.5" fill="rgba(255,255,255,0.3)" />
    <rect x="350" y="114" width="56" height="13" rx="6.5" fill="url(#laViolet)" />

    {/* bar chart */}
    <g>
      <rect x="238" y="216" width="18" height="42" rx="6" fill="rgba(255,255,255,0.16)" />
      <rect x="264" y="192" width="18" height="66" rx="6" fill="url(#laViolet)" opacity="0.9" />
      <rect x="290" y="204" width="18" height="54" rx="6" fill="rgba(255,255,255,0.16)" />
      <rect x="316" y="178" width="18" height="80" rx="6" fill="url(#laGold)" />
      <rect x="238" y="276" width="96" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
    </g>

    {/* sparkline panel */}
    <path
      d="M238 322 C 262 306, 280 326, 304 314 S 344 296, 372 306 S 412 290, 436 300"
      stroke="url(#laTeal)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0"
    />
    <g>
      <path
        d="M238 122 C 258 108, 272 126, 292 116 S 326 100, 348 110 S 386 96, 408 104"
        stroke="url(#laTeal)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="348" cy="110" r="5" fill="#10b981" />
      <circle cx="348" cy="110" r="10" fill="rgba(16,185,129,0.25)" />
    </g>

    {/* floating insight card */}
    <g>
      <rect x="452" y="140" width="88" height="70" rx="16" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" />
      <rect x="466" y="156" width="36" height="7" rx="3.5" fill="rgba(255,255,255,0.32)" />
      <rect x="466" y="172" width="58" height="10" rx="5" fill="url(#laViolet)" />
      <rect x="466" y="190" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.22)" />
    </g>

    {/* sparkles */}
    <circle cx="230" cy="30" r="4" fill="#ffd971" opacity="0.9" />
    <circle cx="520" cy="240" r="5" fill="#a78bfa" opacity="0.7" />
    <circle cx="40" cy="212" r="3.4" fill="#6ee7b7" opacity="0.8" />
  </svg>
);

/**
 * UserLogin Component
 * Handles user authentication for the company portal.
 * Features: company lookup preview, form validation, error handling,
 * password visibility toggle, loading states.
 */
const UserLogin = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState({ state: "idle", company: null });

  // Check if user is already logged in
  const isUserLoggedIn = isLoggedIn();

  /**
   * Validates company ID format (A-Z, 0-9, 3-12 chars)
   */
  const isValidCompanyCode = useCallback((code) => {
    return /^[A-Za-z0-9]{3,12}$/.test(code);
  }, []);

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

    if (!formData.companyCode || !formData.companyCode.trim()) {
      newErrors.companyCode = "Company ID is required";
    } else if (!isValidCompanyCode(formData.companyCode.trim())) {
      newErrors.companyCode = "Company ID must be 3-12 letters/numbers";
    }

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
  }, [formData, isValidEmail, isValidCompanyCode]);

  // Look up the company as the user types the Company ID (debounced)
  useEffect(() => {
    const code = formData.companyCode.trim().toUpperCase();
    if (!code || !isValidCompanyCode(code)) {
      setLookup({ state: "idle", company: null });
      return undefined;
    }
    setLookup({ state: "checking", company: null });
    const timer = setTimeout(() => {
      axios
        .get(`${API_URL}/tenant/info?code=${encodeURIComponent(code)}`)
        .then((response) => {
          if (response.data && response.data.status === "200") {
            setLookup({ state: "found", company: response.data.data });
          } else {
            setLookup({ state: "notfound", company: null });
          }
        })
        .catch(() => setLookup({ state: "notfound", company: null }));
    }, 450);
    return () => clearTimeout(timer);
  }, [formData.companyCode, isValidCompanyCode]);

  /**
   * Handles input field changes
   */
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    // Company ID is always stored uppercase for consistency
    const nextValue = name === "companyCode" ? value.toUpperCase() : value;

    if (errMsg) setErrMsg("");
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
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

      if (!validateForm()) {
        setErrMsg(ERROR_MESSAGES.VALIDATION_ERROR);
        return;
      }

      setLoading(true);
      setErrMsg("");

      try {
        const response = await axios.post(LOGIN_ENDPOINT, {
          companyCode: formData.companyCode.trim().toUpperCase(),
          email: formData.email.trim(),
          password: formData.password,
        }, {
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
        });

        const fetchedData = response.data && response.data.data;

        if (!fetchedData) {
          setErrMsg(
            (response.data && response.data.message) || ERROR_MESSAGES.MISSING_DATA
          );
          setLoading(false);
          return;
        }

        const { age, token, name, email, role, companyCode, companyName } = fetchedData;

        if (!token || !age || !name) {
          setErrMsg(ERROR_MESSAGES.MISSING_DATA);
          setLoading(false);
          return;
        }

        login({
          token,
          age,
          name,
          email,
          tenant: { role: role || "TENANT_USER", companyCode, companyName },
        });
      } catch (error) {
        setLoading(false);

        if (error.response && error.response.status === 404) {
          const msg = (error.response.data && error.response.data.message) || "";
          if (msg.includes("Company")) {
            setErrMsg("We couldn't find that Company ID. Please check and try again.");
          } else {
            setErrMsg(ERROR_MESSAGES.INVALID_CREDENTIALS);
          }
        } else if (error.response && error.response.status === 403) {
          setErrMsg(
            (error.response.data && error.response.data.message) ||
              ERROR_MESSAGES.INVALID_CREDENTIALS
          );
        } else if (error.code === "ECONNABORTED") {
          setErrMsg(ERROR_MESSAGES.NETWORK_ERROR);
        } else if (error.message === "Network Error") {
          setErrMsg(ERROR_MESSAGES.NETWORK_ERROR);
        } else if (error.response && error.response.status >= 500) {
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

  const renderCompanyFeedback = () => {
    if (lookup.state === "checking") {
      return (
        <div className="company-preview is-checking" role="status">
          <FontAwesomeIcon icon={faCircleNotch} spin className="cp-ic" />
          <span>Checking company…</span>
        </div>
      );
    }
    if (lookup.state === "found" && lookup.company) {
      return (
        <div className="company-preview is-found">
          <FontAwesomeIcon icon={faCircleCheck} className="cp-ic" />
          <span title={lookup.company.companyName}>{lookup.company.companyName}</span>
        </div>
      );
    }
    if (lookup.state === "notfound") {
      return (
        <div className="company-preview is-missing">
          <FontAwesomeIcon icon={faCircleQuestion} className="cp-ic" />
          <span>No company found with this ID</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="loginpage login-split">
      {/* ── Left: sign-in form ─────────────────────────────────────────── */}
      <div className="login-left">
        <div className="login-brand">
          <img src={CompLogo} alt="ATC logo" />
          <span className="login-brand-txt">ATC Portal</span>
        </div>

        <div className="login-head">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to your company workspace</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Company ID */}
          <label className="field-label" htmlFor="companycode-input">Company ID</label>
          <div className={`input-container ${errors.companyCode ? "has-error" : ""}`}>
            <i className="fa fa-building icon" aria-hidden="true" />
            <input
              id="companycode-input"
              type="text"
              name="companyCode"
              placeholder="e.g. ATCBC"
              className={`atc-input ${errors.companyCode ? "input-error" : ""}`}
              value={formData.companyCode}
              onChange={handleInputChange}
              disabled={loading}
              autoComplete="organization"
              autoFocus
              aria-label="Company ID"
              aria-describedby={errors.companyCode ? "companycode-error" : undefined}
              required
            />
          </div>
          {errors.companyCode && (
            <span id="companycode-error" className="field-error-text" role="alert">
              {errors.companyCode}
            </span>
          )}
          {renderCompanyFeedback()}

          {/* Email */}
          <label className="field-label" htmlFor="email-input">Email</label>
          <div className={`input-container ${errors.email ? "has-error" : ""}`}>
            <i className="fa fa-user icon" aria-hidden="true" />
            <input
              id="email-input"
              type="email"
              name="email"
              placeholder="you@company.com"
              className={`atc-input ${errors.email ? "input-error" : ""}`}
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              autoComplete="email"
              aria-label="Email address"
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
          </div>
          {errors.email && (
            <span id="email-error" className="field-error-text" role="alert">
              {errors.email}
            </span>
          )}

          {/* Password */}
          <label className="field-label" htmlFor="password-input">Password</label>
          <div className={`input-container password-container ${errors.password ? "has-error" : ""}`}>
            <i className="fa fa-lock icon" aria-hidden="true" />
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Your password"
              className={`atc-input ${errors.password ? "input-error" : ""}`}
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              autoComplete="current-password"
              aria-label="Password"
              aria-describedby={errors.password ? "password-error" : undefined}
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
              <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} aria-hidden="true" />
            </button>
          </div>
          {errors.password && (
            <span id="password-error" className="field-error-text" role="alert">
              {errors.password}
            </span>
          )}

          {/* General error */}
          {errMsg && (
            <div className="error-message" role="alert" aria-live="polite">
              <FontAwesomeIcon icon={faCircleExclamation} />
              <span>{errMsg}</span>
            </div>
          )}

          <button className="atc-btn login-submit" type="submit" disabled={loading} aria-busy={loading}>
            {loading ? (
              <>
                <span className="spinner-icon" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <FontAwesomeIcon icon={faArrowRight} className="btn-arrow" />
              </>
            )}
          </button>
        </form>

        <div className="login-alt">
          Administrator? <Link to="/admin/login">Sign in to the Admin Console</Link>
        </div>
        <div className="login-help">
          Don&apos;t have access yet? Your company admin creates accounts.
        </div>
      </div>

      {/* ── Right: brand visual ────────────────────────────────────────── */}
      <div className="login-right" aria-hidden="true">
        <span className="login-glow login-glow-1" />
        <span className="login-glow login-glow-2" />

        {lookup.state === "found" && lookup.company && (
          <div className="login-welcome">
            <div className="lw-eyebrow">Signing in to</div>
            <div className="lw-name" title={lookup.company.companyName}>
              {lookup.company.companyName}
            </div>
            <div className="lw-check">
              <FontAwesomeIcon icon={faCircleCheck} /> Verified workspace
            </div>
          </div>
        )}

        <LoginArt />

        <div className="login-copy">
          <h2>Run your trade business in one place</h2>
          <p>
            Dealers, godowns, transactions and reports — one clean workspace for
            your whole team.
          </p>
          <ul className="login-points">
            <li>
              <span className="lp-ic lp-ic-gold"><FontAwesomeIcon icon={faUsers} /></span>
              Dealer ledger &amp; outstanding tracking
            </li>
            <li>
              <span className="lp-ic lp-ic-violet"><FontAwesomeIcon icon={faWarehouse} /></span>
              Godown stock, refills &amp; damage returns
            </li>
            <li>
              <span className="lp-ic lp-ic-teal"><FontAwesomeIcon icon={faChartPie} /></span>
              One-click monthly &amp; all-dealer reports
            </li>
          </ul>
        </div>

        <div className="login-chips">
          <span className="login-chip"><FontAwesomeIcon icon={faUsers} /> Dealers</span>
          <span className="login-chip"><FontAwesomeIcon icon={faWarehouse} /> Godowns</span>
          <span className="login-chip"><FontAwesomeIcon icon={faChartPie} /> Reports</span>
          <span className="login-chip login-chip-ai"><FontAwesomeIcon icon={faRobot} /> AI Insights</span>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
