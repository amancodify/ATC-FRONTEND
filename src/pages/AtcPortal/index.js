import React from "react";
import cookie from "js-cookie";
import { Routes, Route, Navigate } from "react-router-dom";
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
import ATCReports from "./Reports";
import ControllerSection from "./dealers/controller";
import AtcAddProduct from "./dealers/addProduct";
import ConsigneeHome from "./consignee";
import ViewConsignee from "./consignee/viewConsignee";
import ViewConsigneeTrans from "./consignee/viewConsigneeTrans";

const AtcPortalMain = () => {
    let validUser = isLoggedIn();

    if (validUser) {
        const loginname = cookie.get("_loginname");
        return (
            <div className="atcportal-main">
                <ControllerSection loginName={loginname} logoutHandler={logout} />
                <div className="view-section-main">
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="createdealer" element={<CreateDealer />} />
                        <Route path="addconsignee" element={<AddConsignee />} />
                        <Route path="godown" element={<Atcgodown />} />
                        <Route path="creategodown" element={<AtcCreategodown />} />
                        <Route path="addproduct" element={<AtcAddProduct />} />
                        <Route path="viewgodown/:id" element={<AtcViewgodown />} />
                        <Route path="dealer/:id" element={<AtcViewDealer />} />
                        <Route path="editprofile/:id" element={<AtcEditDealer />} />
                        <Route path="editgodown/:id" element={<AtcEditGodown />} />
                        <Route path="transactions/:id" element={<AtcTransactionsView />} />
                        <Route path="godownrefilltransactions/:id" element={<AtcGodwonRefillTrans />} />
                        <Route path="godownpartytransaction/:id" element={<AtcGodwonPartyTrans />} />
                        <Route path="godownpartyreturns/:id" element={<ATCGodownpartyreturns />} />
                        <Route path="reports" element={<ATCReports />} />
                        <Route path="consignees" element={<ConsigneeHome />} />
                        <Route path="consignee/:id" element={<ViewConsignee />} />
                        <Route path="viewconsigneetransactions/:id" element={<ViewConsigneeTrans />} />
                    </Routes>
                </div>
            </div>
        );
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default AtcPortalMain;
