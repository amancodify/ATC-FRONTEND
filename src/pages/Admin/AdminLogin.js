import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faCircleExclamation,
  faArrowRight,
  faShieldHalved,
  faUserPlus,
  faDatabase,
  faBuilding,
  faUsers,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import cookie from "js-cookie";
import { login, isLoggedIn } from "../../utils/auth";
import CompLogo from "../../assets/logo.png";
import API_URL from "../../config";

// ─── Decorative admin illustration (pure SVG) ────────────────────────────────
const AdminArt = () => (
  <svg
    className="login-art"
    viewBox="0 0 560 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Admin console illustration"
  >
    <defs>
      <linearGradient id="aaGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd971" />
        <stop offset="1" stopColor="#f5a623" />
      </linearGradient>
      <linearGradient id="aaViolet" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#6d5ce6" />
      </linearGradient>
      <linearGradient id="aaTeal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6ee7b7" />
        <stop offset="1" stopColor="#10b981" />
      </linearGradient>
    </defs>

    {/* orbit rings + satellites */}
    <circle cx="280" cy="176" r="150" stroke="rgba(124,92,255,0.22)" strokeDasharray="5 8" />
    <circle cx="280" cy="176" r="184" stroke="rgba(245,197,66,0.14)" strokeDasharray="3 8" />
    <circle cx="118" cy="94" r="8" fill="#7c5cff" opacity="0.85" />
    <circle cx="452" cy="262" r="9" fill="#f5c542" opacity="0.8" />
    <circle cx="452" cy="262" r="17" fill="rgba(245,197,66,0.18)" />

    {/* shield */}
    <g>
      <path
        d="M280 62 C 318 84, 352 96, 392 100 L 392 188 C 392 244, 346 284, 280 306 C 214 284, 168 244, 168 188 L 168 100 C 208 96, 242 84, 280 62 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
      />
      <path
        d="M280 92 C 308 108, 332 116, 360 119 L 360 186 C 360 226, 326 256, 280 274 C 234 256, 200 226, 200 186 L 200 119 C 228 116, 252 108, 280 92 Z"
        fill="rgba(124,92,255,0.16)"
      />
      {/* keyhole */}
      <circle cx="280" cy="170" r="20" fill="url(#aaGold)" />
      <circle cx="280" cy="170" r="9" fill="#221a05" />
      <rect x="274" y="176" width="12" height="34" rx="6" fill="url(#aaGold)" />
      <rect x="277.5" y="182" width="5" height="24" rx="2.5" fill="#221a05" />
    </g>

    {/* floating access card */}
    <g>
      <rect x="416" y="66" width="110" height="74" rx="16" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" />
      <circle cx="442" cy="92" r="13" fill="url(#aaViolet)" />
      <rect x="462" y="84" width="48" height="7" rx="3.5" fill="rgba(255,255,255,0.34)" />
      <rect x="434" y="114" width="70" height="8" rx="4" fill="url(#aaTeal)" />
    </g>

    {/* floating tenant list card */}
    <g>
      <rect x="34" y="196" width="104" height="92" rx="16" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" />
      <circle cx="56" cy="220" r="8" fill="url(#aaGold)" />
      <rect x="72" y="214" width="48" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="56" cy="244" r="8" fill="url(#aaViolet)" />
      <rect x="72" y="238" width="42" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="56" cy="268" r="8" fill="url(#aaTeal)" />
      <rect x="72" y="262" width="52" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
    </g>

    {/* sparkles */}
    <circle cx="212" cy="44" r="4" fill="#ffd971" opacity="0.9" />
    <circle cx="500" cy="180" r="4" fill="#a78bfa" opacity="0.7" />
    <circle cx="66" cy="140" r="3.4" fill="#6ee7b7" opacity="0.8" />
  </svg>
);

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = isLoggedIn() && cookie.get("_role") === "SUPER_ADMIN";

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errMsg) setErrMsg("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setErrMsg("Please enter email and password.");
      return;
    }
    setLoading(true);
    setErrMsg("");
    try {
      const response = await axios.post(`${API_URL}/admin/login`, formData, {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data && response.data.data;
      if (response.data.status === "200" && data && data.token) {
        login({
          token: data.token,
          age: data.age,
          name: data.name,
          email: data.email,
          tenant: { role: "SUPER_ADMIN" },
          redirectUrl: "/admin",
        });
        return;
      }
      setErrMsg(response.data.message || "Login failed. Please try again.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrMsg(
        (error.response && error.response.data && error.response.data.message) ||
          "Server error. Please try again later."
      );
    }
  };

  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="loginpage login-split login-admin">
      {/* ── Left: admin sign-in ────────────────────────────────────────── */}
      <div className="login-left">
        <div className="login-brand">
          <img src={CompLogo} alt="ATC logo" />
          <span className="login-brand-txt">ATC Admin Console</span>
        </div>

        <div className="login-head">
          <h1 className="login-title">Platform access</h1>
          <p className="login-sub">Sign in to manage customer workspaces</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="admin-email-input">Admin Email</label>
          <div className="input-container">
            <i className="fa fa-user icon" aria-hidden="true" />
            <input
              id="admin-email-input"
              type="email"
              name="email"
              placeholder="admin@company.com"
              className="atc-input"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              autoComplete="email"
              autoFocus
              aria-label="Admin email"
              required
            />
          </div>

          <label className="field-label" htmlFor="admin-password-input">Password</label>
          <div className="input-container password-container">
            <i className="fa fa-lock icon" aria-hidden="true" />
            <input
              id="admin-password-input"
              type="password"
              name="password"
              placeholder="Your password"
              className="atc-input"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              autoComplete="current-password"
              aria-label="Password"
              required
            />
          </div>

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
                Admin sign in
                <FontAwesomeIcon icon={faArrowRight} className="btn-arrow" />
              </>
            )}
          </button>
        </form>

        <div className="login-alt">
          Customer login? <Link to="/login">Go to portal sign-in</Link>
        </div>
        <div className="login-help">
          Admin access is restricted to platform operators only.
        </div>
      </div>

      {/* ── Right: admin visual ────────────────────────────────────────── */}
      <div className="login-right" aria-hidden="true">
        <span className="login-glow login-glow-1" />
        <span className="login-glow login-glow-2" />

        <AdminArt />

        <div className="login-copy">
          <h2>The platform control center</h2>
          <p>
            Onboard customers, manage workspaces and monitor storage — all from
            one console.
          </p>
          <ul className="login-points">
            <li>
              <span className="lp-ic lp-ic-gold"><FontAwesomeIcon icon={faUserPlus} /></span>
              Onboard new customers in seconds
            </li>
            <li>
              <span className="lp-ic lp-ic-violet"><FontAwesomeIcon icon={faSliders} /></span>
              Manage users, suspend or activate workspaces
            </li>
            <li>
              <span className="lp-ic lp-ic-teal"><FontAwesomeIcon icon={faDatabase} /></span>
              Live storage &amp; usage insights
            </li>
          </ul>
        </div>

        <div className="login-chips">
          <span className="login-chip"><FontAwesomeIcon icon={faBuilding} /> Tenants</span>
          <span className="login-chip"><FontAwesomeIcon icon={faUsers} /> Users</span>
          <span className="login-chip"><FontAwesomeIcon icon={faDatabase} /> Storage</span>
          <span className="login-chip login-chip-ai"><FontAwesomeIcon icon={faShieldHalved} /> Security</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
