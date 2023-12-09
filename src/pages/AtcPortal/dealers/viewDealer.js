import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Popup from "../../../components/common/PopUp";
import DealerTransaction from "./newTransaction";
import OpeningBal from "./openingBal";
import AddCommentComp from "./addComment";
import API_URL from "../../../config";
import { useOnClickOutside } from "./outsideClick";
import GraphComp from "../../../components/common/graph";
import { PRODUCTS_TEXTS } from "./constants";
import Button from "@mui/material/Button";

const ViewDealer = (props) => {
    const partyCode = props.match.params.id;
    const [modelShow, setModelShow] = useState(false);
    const [showTransPopup, setShowTransPopup] = useState(false);
    const [showOpeningBal, setShowOpeningBal] = useState(false);
    const [showCommentsPopup, setShowCommentsPopup] = useState(false);
    const [singleDealersData, setSingleDealersData] = useState({});
    const [loading, setLoading] = useState(true);
    const [menuShow, setMenuShow] = useState(false);
    const [showPartGraph, setShowPartyGraph] = useState(false);
    const [productCounts, setProductCounts] = useState({});
    const ref = useRef(null);

    useOnClickOutside(ref, () => setMenuShow(false));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dealersResponse, statusResponse] = await Promise.all([
                    axios.get(`${API_URL}/dealers/${partyCode}`),
                    axios.post(`${API_URL}/getpartystatus`, { partyCode }),
                ]);
                setSingleDealersData(dealersResponse.data);
                setProductCounts(statusResponse.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [partyCode]);

    let {
        name,
        party_code,
        address,
        firm_name,
        dealer_area,
        mobile,
        email,
        opening_bal_done,
        is_damage_dealer,
    } = singleDealersData || {};

    let totalbaltxt = productCounts.outstanding >= 0 ? "[Pending]" : "[Advance]";
    if (productCounts.outstanding === 0) {
        totalbaltxt = "[NIL]";
    }
    const deleteUser = async () => {
        try {
          await axios.delete(`${API_URL}/dealers/delete/${partyCode}`);
          window.location.replace("#/");
        } catch (err) {
          console.error(err);
        }
      };

    let disabledCss = opening_bal_done ? "" : "disable-btn-action";
    let cursorCss = opening_bal_done ? "" : "cursor-nodrop";

    return (
        <>
            <div className="col-md-12 dealerview-section">
                {loading ? (
                    <div className="loading">
                        <i className="fa fa-cog fa-spin"></i>
                        <span className="ml-3 pb-1">Loading...</span>
                    </div>
                ) : (
                    <>
                        <div className="row dealerview-main">
                            <div className="col-md-2 d-flex flex-column align-items-center justify-content-center">
                                <img
                                    className="userimg mt-1"
                                    src= "https://www.w3schools.com/howto/img_avatar.png"
                                    alt=""
                                />
                                {/* <div
                                    className="text-center c-pointer mt-2 graph-text"
                                    onClick={() => setShowPartyGraph(true)}
                                >
                                    <i className="fa fa-bar-chart mr-1" aria-hidden="true"></i>Show Graph
                                </div> */}
                            </div>
                            <div className="col-md-8">
                                <div className="firmname">
                                    {firm_name} - {party_code}
                                </div>
                                <div className="party-details-text">
                                    <div className="boldtxt">
                                        <i className="fa fa-user iconwidth"></i> Owner
                                    </div>
                                    <span className="dash">:</span>
                                    <span>{name}</span>
                                </div>
                                <div className="party-details-text">
                                    <div className="boldtxt">
                                        <i
                                            className="fa fa-map-marker iconwidth"
                                            aria-hidden="true"
                                        ></i>{" "}
                                        Area
                                    </div>
                                    <span className="dash">:</span>
                                    {dealer_area}
                                </div>
                                <div className="party-details-text">
                                    <div className="boldtxt">
                                        <i className="fa fa-phone iconwidth" aria-hidden="true"></i>{" "}
                                        Contact
                                    </div>
                                    <span className="dash">:</span>
                                    <a href={`tel:${mobile}`}>+91-{mobile}</a>
                                </div>
                                <div className="party-details-text">
                                    <div className="boldtxt">
                                        <i
                                            className="fa fa-envelope sizeadjust iconwidth"
                                            aria-hidden="true"
                                        ></i>{" "}
                                        E-mail
                                    </div>
                                    <span className="dash">:</span>
                                    <a href={`mailto:${email}`}>{email}</a>
                                </div>
                                <div className="party-details-text">
                                    <div className="boldtxt">
                                        <i
                                            className="fa fa-address-card-o sizeadjust iconwidth"
                                            aria-hidden="true"
                                        ></i>{" "}
                                        Address
                                    </div>
                                    <span className="dash">:</span>
                                    {address}
                                </div>
                            </div>

                            <div className="col-md-2 dealers-menu-main">
                                <div onClick={() => setMenuShow(!menuShow)}>
                                    <div className="menu-dots">...</div>
                                    {menuShow && (
                                        <div className="menu-list" ref={ref}>
                                            <div className="pointer"></div>

                                            {/* <div
                                        className="d-flex align-items-center justify-content-end menu-option-grid"
                                        onClick={() => setModelShow(true)}
                                    >
                                        <span className="edit-label">Delete User</span>
                                    </div> */}
                                            <a
                                                className="d-flex align-items-center justify-content-end edit-main"
                                                href={`#/editprofile/${partyCode}`}
                                            >
                                                <span className="edit-label">
                                                    Edit Party Details
                                                </span>
                                            </a>
                                            <div className="saperator"></div>
                                            <div className="d-flex align-items-center justify-content-end menu-option-grid">
                                                <span className="edit-label">Add Consinee</span>
                                            </div>
                                            <div className="saperator"></div>
                                            <div
                                                onClick={() => setShowCommentsPopup(true)}
                                                className="d-flex align-items-center justify-content-end menu-option-grid"
                                            >
                                                <span className="edit-label">
                                                    View/Add Comments
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row product-view-main">
                            {!opening_bal_done && (
                                <div
                                    onClick={() => setShowOpeningBal(true)}
                                    className="opening-bal"
                                >
                                    Opening Balance
                                </div>
                            )}
                            <div className="col-md-12 heading">
                                <span className="hd1">Products</span>
                                <span className="hd2">Delivered (mt)</span>
                                <span className="hd3">Billed (mt)</span>
                                <span className="hd4">Bill Pending</span>
                                <span className="hd5">Delivery Pending</span>
                            </div>

                            {productCounts.products &&
                                productCounts.products.map((item, inx) => {
                                    let calculatedVal = (item.delivered - item.billed).toFixed(2);
                                    return (
                                        <div
                                            className="col-md-12 product-value"
                                            key={`atcprodscount_${inx}`}
                                        >
                                            <span className="hd1">
                                                {PRODUCTS_TEXTS[item.productcode]}
                                            </span>
                                            <span className="hd2">{item.delivered.toFixed(2)}</span>
                                            <span className="hd3">{item.billed.toFixed(2)}</span>
                                            <span className="hd4">
                                                {calculatedVal > 0 ? calculatedVal : 0}
                                            </span>
                                            <span className="hd5">
                                                {calculatedVal < 0 ? calculatedVal * -1 : 0}
                                            </span>
                                        </div>
                                    );
                                })}

                            <div className="col-md-12 heading">
                                <span className="hd1">Sub-Total</span>
                                <span className="hd2">
                                    {productCounts.totaldelivered &&
                                        productCounts.totaldelivered.toFixed(2)}
                                </span>
                                <span className="hd3">
                                    {productCounts.totaldelivered &&
                                        productCounts.totalbilled.toFixed(2)}
                                </span>
                            </div>
                            <div className="col-md-12 party-total-grid">
                                {(productCounts.outstanding || productCounts.outstanding === 0) && (
                                    <div className="hd1">
                                        <span>Total Outstanding: </span>&nbsp;
                                        <b>{productCounts.outstanding.toFixed(2)}</b> mt{" "}
                                        <span className="txtappended">{totalbaltxt}</span>
                                    </div>
                                )}
                            </div>
                            <div className="actions">
                                <div className={`${cursorCss}`}>
                                    <Button
                                        style={{ textTransform: "none" }}
                                        variant="contained"
                                        className={`action-link ${disabledCss}`}
                                        onClick={() => setShowTransPopup(true)}
                                    >
                                        New Transaction
                                    </Button>
                                </div>

                                <a href={`#/transactions/${partyCode}`}>
                                    <Button
                                        style={{ textTransform: "none" }}
                                        variant="contained"
                                        className={`action-link ${disabledCss}`}
                                    >
                                        View Transactions
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showTransPopup && (
                <Popup
                    show={showTransPopup}
                    onHide={() => setShowTransPopup(false)}
                    hideFooter={false}
                    footerContent={() => "* Please fill the details correctly & carefully!"}
                    title={`New Transaction - ${firm_name} [${party_code}]`}
                    headerImg="/images/trans.png"
                    size="xl"
                >
                    <DealerTransaction
                        partyCode={partyCode}
                        partyName={name}
                        firmName={firm_name}
                        email={email}
                        damageDealer={is_damage_dealer || false}
                    />
                </Popup>
            )}

            {modelShow && (
                <Popup
                    show={modelShow}
                    onHide={() => setModelShow(false)}
                    hideFooter={false}
                    footerContent={() => "Note: Deleting Party/Dealer is not reversable"}
                    title="Confirm Party Deletion"
                    size="md"
                    headerImg="/images/deleteicon.png"
                >
                    <div className="popupdel d-flex align-items-center justify-content-center">
                        <div className="mr-3">Are you sure you want to delete ? </div>
                        <button className="deletebtn" onClick={deleteUser}>
                            Yes! delete
                        </button>
                    </div>
                </Popup>
            )}

            {showOpeningBal && (
                <Popup
                    show={showOpeningBal}
                    onHide={() => setShowOpeningBal(false)}
                    hideFooter={false}
                    footerContent={() =>
                        "Note: This will be the first ever Opening Balance, update carefully !!"
                    }
                    title={`Opening Balance - ${firm_name}`}
                    size="lg"
                    headerImg="/images/openproduct.png"
                >
                    <OpeningBal partyCode={partyCode} openingDone={opening_bal_done} />
                </Popup>
            )}

            {showCommentsPopup && (
                <Popup
                    show={showCommentsPopup}
                    onHide={() => setShowCommentsPopup(false)}
                    hideFooter={false}
                    footerContent={() => "Note: Add Any Comments for this particular Party !! "}
                    title={`Add/View Comments - ${firm_name}`}
                    headerImg="/images/comments.png"
                >
                    <AddCommentComp partyCode={partyCode} />
                </Popup>
            )}

            {showPartGraph && (
                <Popup
                    show={showPartGraph}
                    onHide={() => setShowPartyGraph(false)}
                    hideFooter={true}
                    size="lg"
                    title={`Performance view - ${firm_name}`}
                >
                    <GraphComp partyCode={partyCode} />
                </Popup>
            )}
        </>
    );
};

export default ViewDealer;
