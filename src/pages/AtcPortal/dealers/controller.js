import React, { useState, useRef } from "react";
import { useOnClickOutside } from './outsideClick';

const ControllerSection = ({
    loginName,
    logoutHandler
}) => {
    const [showLogout, setShowLogout] = useState(false);
    const [currentTab, setCurrentTab] = useState(1);

    const ref = useRef(null);
    useOnClickOutside(ref, () => setShowLogout(false));

    const isCurrentTab = (tab) => tab === currentTab;
    return (
        <>
            <div className="col-md-3 controller-section">
                <div className="d-flex flex-column">
                    <a href="#/" className="brand-name">AMAN TRADING COMPANY</a>
                </div>
                <hr className="hr-line" />
                <div className="showloggedinuser">
                    <img className="userimg" src="./images/aman.jpg" alt="" />
                    <div className="loginname">Hi, {loginName.split(" ")[0]}</div>
                    <div className="settings-main" ref={ref}>
                        <img onClick={() => setShowLogout(!showLogout)} src="https://www.materialui.co/materialIcons/navigation/arrow_drop_down_white_192x192.png" alt="" className="iconvector" />
                        {
                            showLogout &&
                            <div className="settings-options">
                                <div className="pointer"></div>
                                <div className="option">Edit Profile</div>
                                <div className="dropdown-divider"></div>
                                <div className="option" onClick={() => logoutHandler()}>Logout</div>
                            </div>
                        }
                    </div>

                </div>
                <div className="options">
                    <div className="viewcontrols">
                        <div className="titles-section pl-4">View </div>
                        <a href="#/" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(1) ? "active-tab" : ""}`} onClick={() => setCurrentTab(1)}>
                                <img
                                    src="/images/home-white.png"
                                    className="icon"
                                    alt=""
                                />
                                <div className="text">Dealers</div>
                            </div>
                        </a>
                        {/* <a href="#/consignees" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(2) ? "active-tab" : ""}`} onClick={() => setCurrentTab(2)} >
                                <img
                                    src="/images/home-white.png"
                                    className="icon"
                                    alt=""
                                />
                                <div className="text">Consignees</div>
                            </div>
                        </a> */}
                        <a href="#/godown" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(3) ? "active-tab" : ""}`} onClick={() => setCurrentTab(3)}>
                                <img
                                    src="/images/addgodwon-white.png"
                                    className="icon"
                                    alt=""
                                />
                                <div className="text">Godowns</div>
                            </div>
                        </a>
                        <a href="#/reports" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(4) ? "active-tab" : ""}`} onClick={() => setCurrentTab(4)}>
                                <img
                                    src="/images/addgodwon-white.png"
                                    className="icon"
                                    alt=""
                                />
                                <div className="text">Reports</div>
                            </div>
                        </a>
                    </div>
                    <div className="createcontrols">
                        <div className="titles-section pl-4">Create</div>
                        <a href="#/createdealer" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(5) ? "active-tab" : ""}`} onClick={() => setCurrentTab(5)}>
                                <img src="/images/adduser-white.png" className="icon" alt="" />
                                <div className="text">Add Dealer</div>
                            </div>
                        </a>
                        {/* <a href="#/addconsignee" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(6) ? "active-tab" : ""}`} onClick={() => setCurrentTab(6)}>
                                <img src="/images/adduser-white.png" className="icon" alt="" />
                                <div className="text">Add Consignee</div>
                            </div>
                        </a> */}
                        <a href="#/creategodown" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(7) ? "active-tab" : ""}`} onClick={() => setCurrentTab(7)}>
                                <img src="/images/addgodwon-white.png" className="icon" alt="" />
                                <div className="text">Add Godown</div>
                            </div>
                        </a>
                        <a href="#/addproduct" className="add">
                            <div className={`add d-flex align-items-center pl-4 ${isCurrentTab(8) ? "active-tab" : ""}`} onClick={() => setCurrentTab(8)}>
                                <img src="/images/addgodwon-white.png" className="icon" alt="" />
                                <div className="text">Add Product</div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="poweredby-txt">
                    Powered By{" "}
                    <span>
                        <img
                            className="logo-poweredby"
                            src="/images/atc-logo-white.png"
                            alt=""
                        />
                    </span>
                </div>
            </div>
        </>
    )
}

export default ControllerSection;