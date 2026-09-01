import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";
import { logout, clearCookie } from "./utils/auth";
import "./utils/api";
import AtcNav from "./components/common/NavBar";
import API_URL from "./config";

import AboutUS from "./pages/About";
import Home from "./pages/Home";
import AtcPortal from "./pages/AtcPortal";
import LoginComp from "./pages/Login";
import ErrorComp from "./pages/ErrorPage";
import AtcEvents from "./pages/Events";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// The marketing navbar is hidden on portal routes - the portal renders its
// own top bar (company branding + avatar user menu).
const Shell = () => {
    const location = useLocation();
    const isPortal = location.pathname.startsWith("/atcportal");
    return (
        <>
            {!isPortal && <AtcNav />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUS />} />
                <Route path="/events" element={<AtcEvents />} />
                <Route path="/atcportal/*" element={<AtcPortal />} />
                <Route path="/login" element={<LoginComp />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<ErrorComp />} />
            </Routes>
        </>
    );
};

const App = () => {
    useEffect(() => {
        const tokenData = cookie.get("_rtok");
        if (tokenData) {
            axios.post(`${API_URL}/verifytoken`, { token: tokenData }).then((response) => {
                let userData = response.data;
                if (userData.status === "200") {
                    cookie.set("verifiedSession", true, { expires: 200 });
                    // Refresh tenant/admin context cookies from the token payload
                    const d = userData.data || {};
                    if (d.role) cookie.set("_role", d.role, { expires: 200 });
                    if (d.companyCode) cookie.set("_companycode", d.companyCode, { expires: 200 });
                    if (d.companyName) cookie.set("_companyname", d.companyName, { expires: 200 });
                    if (d.accountStatus) cookie.set("_accountstatus", d.accountStatus, { expires: 200 });
                    if (typeof d.aiChatEnabled === "boolean") {
                        cookie.set("_aichat", d.aiChatEnabled ? "1" : "0", { expires: 200 });
                    }
                } else {
                    logout();
                }
            }).catch((error) => {
                console.error("Token verification failed:", error);
                logout();
            });
        } else {
            clearCookie();
        }
    }, []);

    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    );
};

export default App;
