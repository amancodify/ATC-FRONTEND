import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import cookie from "js-cookie";
import CompLogo from "../../assets/logo.png";
import { useOnClickOutside } from "./dealers/outsideClick";

/**
 * PortalTopBar
 * ─────────────
 * Replaces the marketing navbar inside the portal:
 *   left  → company branding (logo + company name)
 *   right → avatar user menu (logout)
 */
const PortalTopBar = ({ logoutHandler }) => {
    const loginName = cookie.get("_loginname") || "User";
    const companyName = cookie.get("_companyname") || "Portal";
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setOpen(false));

    const initials = loginName
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="ptop-bar">
            <Link to="/atcportal" className="ptop-brand">
                <img src={CompLogo} alt="Company logo" />
                <span className="ptop-company" title={companyName}>{companyName}</span>
            </Link>
            <div className="ptop-user" ref={ref}>
                <button
                    type="button"
                    className="ptop-trigger"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    aria-label="Account menu"
                >
                    <span className="ptop-avatar" aria-hidden="true">{initials}</span>
                    <span className="ptop-name">{loginName}</span>
                    <FontAwesomeIcon icon={faBars} className="ptop-caret" />
                </button>
                {open && (
                    <div className="sb-menu" role="menu">
                        <div className="sb-menu-head">
                            <div className="sb-menu-name">{loginName}</div>
                            <div className="sb-menu-sub">{companyName}</div>
                        </div>
                        <button
                            type="button"
                            className="sb-menu-item"
                            role="menuitem"
                            onClick={() => logoutHandler()}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortalTopBar;
