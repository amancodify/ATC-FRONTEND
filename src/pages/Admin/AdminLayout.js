import React, { useState, useRef } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { ThemeProvider } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faBuilding,
  faUserPlus,
  faSliders,
  faArrowRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn, logout } from "../../utils/auth";
import adminTheme, { initials } from "./adminTheme";
import { useOnClickOutside } from "../AtcPortal/dealers/outsideClick";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: faGaugeHigh, end: true }],
  },
  {
    label: "Manage",
    items: [
      { to: "/admin/customers", label: "Customers", icon: faBuilding },
      { to: "/admin/onboard", label: "Onboard Customer", icon: faUserPlus },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/admin/settings", label: "Settings", icon: faSliders }],
  },
];

/**
 * AdminLayout — application shell for the admin console:
 * dark left nav panel + main content view (routes render via <Outlet />).
 */
const AdminLayout = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);
  useOnClickOutside(userRef, () => setMenuOpen(false));

  if (!(isLoggedIn() && cookie.get("_role") === "SUPER_ADMIN")) {
    return <Navigate to="/admin/login" replace />;
  }

  const adminName = cookie.get("_loginname") || "Admin";
  const adminEmail = cookie.get("_loginemail") || "";

  return (
    <ThemeProvider theme={adminTheme}>
      <div className="admin-shell">
        {/* ── Left nav panel ─────────────────────────────────────────── */}
        <aside className="admin-sidebar">
          <NavLink to="/admin" className="as-brand">
            <span className="as-mark" aria-hidden="true">A</span>
            <span className="as-brand-txt">ATC Admin</span>
          </NavLink>

          <nav className="as-nav" aria-label="Admin navigation">
            {NAV_SECTIONS.map((section) => (
              <React.Fragment key={section.label}>
                <div className="as-label"><span>{section.label}</span></div>
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `as-item ${isActive ? "is-active" : ""}`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="as-ic" fixedWidth />
                    <span className="as-txt">{item.label}</span>
                  </NavLink>
                ))}
              </React.Fragment>
            ))}
          </nav>

          <div className="as-user" ref={userRef}>
            <span className="as-avatar" aria-hidden="true">{initials(adminName)}</span>
            <div className="as-usermeta">
              <div className="as-username" title={adminName}>{adminName}</div>
              <div className="as-useremail" title={adminEmail}>{adminEmail}</div>
            </div>
            <button
              type="button"
              className="as-usermenu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            {menuOpen && (
              <div className="sb-menu" role="menu">
                <div className="sb-menu-head">
                  <div className="sb-menu-name">{adminName}</div>
                  <div className="sb-menu-sub">{adminEmail}</div>
                </div>
                <button
                  type="button"
                  className="sb-menu-item"
                  role="menuitem"
                  onClick={() => logout("/admin/login")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content view ──────────────────────────────────────── */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default AdminLayout;
