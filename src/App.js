import React, { useEffect } from "react";
import AtcNav from "./components/common/NavBar";
import AboutUS from "./components/common/About";
import cookie from 'js-cookie';
import Home from "./components/common/Home";
import AtcPortal from "./components/AtcPortal";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginComp from "./components/common/Login";
import ErrorComp from "./components/common/ErrorPage";
import AtcEvents from "./components/common/Events";
import axios from "axios";
import API_URL from "./config";
import { logout, clearCookie } from "./utils/auth";

const App = () => {
  useEffect(() => {
    const tokenData = cookie.get('_rtok');
    if (tokenData) {
      axios.post(`${API_URL}/verifytoken`, { token: tokenData })
        .then((response) => {
          let userData = response.data;
          if (userData.status === "200") {
            cookie.set('verifiedSession', true, { expires: 300 });
          } else {
            logout();
          }
        })
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
