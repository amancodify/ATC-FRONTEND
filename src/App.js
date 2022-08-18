import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";
import { logout, clearCookie } from "./utils/auth";
import AtcNav from "./components/common/NavBar";
import API_URL from "./config";

import AboutUS from "./pages/About";
import Home from "./pages/Home";
import AtcPortal from "./pages/AtcPortal";
import LoginComp from "./pages/Login";
import ErrorComp from "./pages/ErrorPage";
import AtcEvents from "./pages/Events";

const App = () => {
    useEffect(() => {
        const tokenData = cookie.get("_rtok");
        if (tokenData) {
            axios.post(`${API_URL}/verifytoken`, { token: tokenData }).then((response) => {
                let userData = response.data;
                if (userData.status === "200") {
                    cookie.set("verifiedSession", true, { expires: 200 });
                } else {
                    logout();
                }
            });
        } else {
            clearCookie();
        }
    }, []);

    return (
        <>
            <AtcNav />
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={AboutUS} />
                    <Route path="/events" component={AtcEvents} />
                    <Route path="/atcportal" component={AtcPortal} />
                    <Route path="/login" component={LoginComp} />
                    <Route component={ErrorComp} />
                </Switch>
            </BrowserRouter>
        </>
    );
};

export default App;
