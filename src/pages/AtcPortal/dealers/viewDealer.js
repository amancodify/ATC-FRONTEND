import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Popup from "../../../components/common/PopUp";
import DealerTransaction from "./newTransaction";
import OpeningBal from "./openingBal";
import AddCommentComp from "./addComment";
import API_URL from "../../../config";
import { useOnClickOutside } from "./outsideClick";
import GraphComp from "../../../components/common/graph";
import Button from "@mui/material/Button";
import { getStoredProducts } from "../utils";

const PRODUCTS = getStoredProducts();

const ViewDealer = () => {
    const { id: partyCode } = useParams();
    const navigate = useNavigate();
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
            navigate("/atcportal/");
        } catch (err) {
            console.error(err);
        }
    };

    let disabledCss = opening_bal_done ? "" : "disable-btn-action";
    let cursorCss = opening_bal_done ? "" : "cursor-nodrop";

    const dealerDataToDisplay = [
        {
            title: "Owner",
            titleIcon: "fa fa-user",
            value: name,
        },
        {
            title: "Area",
            titleIcon: "fa fa-map-marker",
            value: dealer_area,
        },
        {
            title: "Contact",
            titleIcon: "fa fa-phone",
            value: "+91" + mobile,
        },
        {
            title: "E-mail",
            titleIcon: "fa fa-envelope",
            value: email,
        },
        {
            title: "Address",
            titleIcon: "fa fa-address-card-o",
            value: address,
        },
    ];

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
                                    src="/images/default_avatar.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="col-md-8">
                                <div className="firmname" style={{ lineHeight: "35px" }}>
                                    {firm_name} - {party_code}
                                </div>
                                <table>
                                    {dealerDataToDisplay.map((item, inx) => {
                                        return (
                                            <>
                                                <tr
                                                    className="party-details-text"
                                                    key={`dealer_data_${inx}`}
                                                >
                                                    <td className="boldtxt d-flex align-items-center">
                                                        <i
                                                            className={`${item.titleIcon} iconwidth`}
                                                        />
                                                        <span>{item.title}</span>
                                                    </td>
                                                    <td className="dash">:</td>
                                                    <td>{item.value}</td>
                                                </tr>
                                            </>
                                        );
                                    })}
                                </table>
                            </div>

                            <div className="col-md-2 dealers-menu-main">
                                <div onClick={() => setMenuShow(!menuShow)}>
                                    <div className="menu-dots">...</div>
                                    {menuShow && (
                                        <div className="menu-list" ref={ref}>
                                            <div className="pointer"></div>
                                            <Link
                                                className="d-flex align-items-center justify-content-end edit-main"
                                                to={`/atcportal/editprofile/${partyCode}`}
                                            >
                                                <span className="edit-label">
                                                    Edit Party Details
                                                </span>
                                            </Link>
                                            <div className="saperator" />
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
                                                {PRODUCTS[item.productcode]?.name}
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

                                <Link to={`/atcportal/transactions/${partyCode}`}>
                                    <Button
                                        style={{ textTransform: "none" }}
                                        variant="contained"
                                        className={`action-link ${disabledCss}`}
                                    >
                                        View Transactions
                                    </Button>
                                </Link>
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
