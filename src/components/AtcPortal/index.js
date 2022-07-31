import React from "react";
import cookie from "js-cookie";
import { Route, HashRouter, Redirect } from "react-router-dom";
import { isLoggedIn, logout } from "../../utils/auth";
import Home from "./dealers/Home";
import CreateDealer from "./dealers/CreateDealer";
import AddConsignee from "./consignee/addConsignee";
import Atcgodown from "./Godown";
import AtcCreategodown from "./Godown/CreateGodown";
import AtcViewgodown from "./Godown/viewGodown";
import AtcViewDealer from "./dealers/viewDealer";
import AtcEditDealer from "./dealers/EditDealer";
import AtcEditGodown from "./Godown/EditGodown";
import AtcTransactionsView from "./dealers/viewDealerTrans";
import AtcGodwonRefillTrans from "./Godown/viewGodownTrans";
import AtcGodwonPartyTrans from "./Godown/GodownPartyTrans";
import ATCGodownpartyreturns from "./Godown/viewGodownReturns";
import ATCReports from "../Reports";
import ControllerSection from "./dealers/controller";
import AtcAddProduct from "./dealers/addProduct";
import ConsigneeHome from "./consignee";
import ViewConsignee from "./consignee/viewConsignee";
import viewConsigneeTrans from "./consignee/viewConsigneeTrans";

const AtcPortalMain = () => {
  let validUser = isLoggedIn();

  if (validUser) {
    const loginname = cookie.get("_loginname");
    return (
      <HashRouter>
        <div className="atcportal-main">
          <div className="row">
            <ControllerSection
              loginName={loginname}
              logoutHandler={logout}
            />
            <div className="view-section-main">
              <Route exact path="/" component={Home} />
              <Route path="/createdealer" component={CreateDealer} />
              <Route path="/addconsignee" component={AddConsignee} />              
              <Route path="/godown" component={Atcgodown} />
              <Route path="/creategodown" component={AtcCreategodown} />
              <Route path="/addproduct" component={AtcAddProduct} />
              <Route path="/viewgodown/:id" component={AtcViewgodown} />
              <Route path="/dealer/:id" component={AtcViewDealer} />
              <Route path="/editprofile/:id" component={AtcEditDealer} />
              <Route path="/editgodown/:id" component={AtcEditGodown} />
              <Route path="/transactions/:id" component={AtcTransactionsView} />
              <Route path="/godownrefilltransactions/:id" component={AtcGodwonRefillTrans} />
              <Route path="/godownpartytransaction/:id" component={AtcGodwonPartyTrans} />
              <Route path="/godownpartyreturns/:id" component={ATCGodownpartyreturns} />
              <Route path="/reports" component={ATCReports} />
              <Route path="/consignees" component={ConsigneeHome} />
              <Route path="/consignee/:id" component={ViewConsignee} />
              <Route path="/viewconsigneetransactions/:id" component={viewConsigneeTrans} />
            </div>
          </div>
        </div>
      </HashRouter>
    );
  } else {
    return <Redirect to="/login" />;
  }
};

export default AtcPortalMain;
