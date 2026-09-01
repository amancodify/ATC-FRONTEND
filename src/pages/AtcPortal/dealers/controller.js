import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faWarehouse,
    faChartPie,
    faBoxOpen,
    faRobot,
    faUserPlus,
    faCirclePlus,
    faBars,
} from "@fortawesome/free-solid-svg-icons";
import CompLogo from "../../../assets/logo.png";
import { useOnClickOutside } from './outsideClick';

const ControllerSection = ({
    loginName,
    companyName,
    accountStatus,
    aiChatEnabled,
    logoutHandler
}) => {
    const location = useLocation();
    const [showLogout, setShowLogout] = useState(false);

    const getTabFromPath = (pathname) => {
        const normalizedPath = pathname.replace(/\/$/, '');

        if (normalizedPath === '/atcportal' || normalizedPath === '/atcportal/dealers') return 1;
        if (
            normalizedPath.startsWith('/atcportal/dealer') ||
            normalizedPath.startsWith('/atcportal/transactions') ||
            normalizedPath.startsWith('/atcportal/editprofile')
        ) return 1;

        if (
            normalizedPath.startsWith('/atcportal/godown') ||
            normalizedPath.startsWith('/atcportal/viewgodown') ||
            normalizedPath.startsWith('/atcportal/godownrefilltransactions') ||
            normalizedPath.startsWith('/atcportal/godownpartytransaction') ||
            normalizedPath.startsWith('/atcportal/godownpartyreturns')
        ) return 3;

        if (normalizedPath.startsWith('/atcportal/reports')) return 4;
        if (normalizedPath.startsWith('/atcportal/products')) return 9;
        if (normalizedPath.startsWith('/atcportal/createdealer')) return 5;
        if (normalizedPath.startsWith('/atcportal/creategodown')) return 7;
        if (normalizedPath.startsWith('/atcportal/addproduct')) return 8;
        if (normalizedPath.startsWith('/atcportal/ai-chat')) return 10;

        return -1;
    };

    const [currentTab, setCurrentTab] = useState(() => getTabFromPath(location.pathname));

    const ref = useRef(null);
    useOnClickOutside(ref, () => setShowLogout(false));

    useEffect(() => {
        setCurrentTab(getTabFromPath(location.pathname));
        setShowLogout(false);
    }, [location.pathname]);

    const isCurrentTab = (tab) => tab === currentTab;

    const initials = loginName
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const viewItems = [
        { id: 1, to: "/atcportal/dealers", icon: faUsers, label: "Dealers" },
        { id: 3, to: "/atcportal/godown", icon: faWarehouse, label: "Godowns" },
        { id: 4, to: "/atcportal/reports", icon: faChartPie, label: "Reports" },
        { id: 9, to: "/atcportal/products", icon: faBoxOpen, label: "Products" },
    ];

    const createItems = [
        { id: 5, to: "/atcportal/createdealer", icon: faUserPlus, label: "Add Dealer" },
        { id: 7, to: "/atcportal/creategodown", icon: faCirclePlus, label: "Add Godown" },
        { id: 8, to: "/atcportal/addproduct", icon: faCirclePlus, label: "Add Product" },
    ];

    const renderItem = (item) => (
        <Link key={item.id} to={item.to} className="sb-item-link">
            <div
                className={`sb-item ${isCurrentTab(item.id) ? "is-active" : ""}`}
                onClick={() => setCurrentTab(item.id)}
                aria-current={isCurrentTab(item.id) ? "page" : undefined}
            >
                <FontAwesomeIcon icon={item.icon} className="sb-ic" fixedWidth />
                <span className="sb-txt">{item.label}</span>
            </div>
        </Link>
    );

    const aiItem = aiChatEnabled && renderItem({ id: 10, to: "/atcportal/ai-chat", icon: faRobot, label: "AI Chat" });

    return (
        <div className="col-md-3 controller-section">
            <div className="sb-user" ref={ref}>
                <div className="sb-avatar" aria-hidden="true">{initials}</div>
                <div className="sb-usermeta">
                    <div className="sb-username" title={loginName}>{loginName}</div>
                    <div className="sb-company" title={companyName}>{companyName}</div>
                </div>
                <button
                    type="button"
                    className="sb-gear"
                    onClick={() => setShowLogout(!showLogout)}
                    aria-label="Account options"
                    aria-expanded={showLogout}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                {showLogout && (
                    <div className="sb-menu" role="menu">
                        <div className="sb-menu-head">
                            <div className="sb-menu-name">{loginName}</div>
                            <div className="sb-menu-sub">{companyName}</div>
                        </div>
                        <button type="button" className="sb-menu-item" role="menuitem" onClick={() => logoutHandler()}>
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <nav className="sb-nav" aria-label="Portal navigation">
                <div className="sb-label"><span>View</span></div>
                {viewItems.map(renderItem)}
                {aiItem}
                <div className="sb-label"><span>Create</span></div>
                {createItems.map(renderItem)}
            </nav>

            <div className="sb-footer">
                <div className="sb-footer-top">
                    <span className="sb-dot" aria-hidden="true" />
                    <span className="sb-footer-txt" title={companyName}>{companyName}</span>
                    {accountStatus && (
                        <span className={`sb-status ${accountStatus === "ACTIVE" ? "ok" : "bad"}`}>
                            {accountStatus === "ACTIVE" ? "Active" : "Suspended"}
                        </span>
                    )}
                </div>
                <Link to="/" className="sb-footer-brand" title="Visit website">
                    <img className="sb-brand-logo" src={CompLogo} alt="ATC logo" />
                    <span className="sb-brand-txt">Powered by ATC</span>
                    <span className="sb-brand-arrow" aria-hidden="true">↗</span>
                </Link>
            </div>
        </div>
    );
};

export default ControllerSection;
