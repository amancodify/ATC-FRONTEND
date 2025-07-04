import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import Popup from "../../../components/common/PopUp";
import Return from "../dealers/Return";
import { convertDate } from "../../../utils/dateConverter";
import OverlayComp from "../../../components/common/overlay";
import API_URL from "../../../config";
import PartyReport from "../dealers/partyReport";
import EmptyDataBannerComp from "../dealers/emptyDataBanner";
import { getStoredProducts, getStoredTransMode } from "../utils";

const ConsigneeTransactions = () => {
    const { id: partyCode } = useParams();
    const navigate = useNavigate();
    const d = new Date();
    const currentDateFormatted = d.toISOString().split('T')[0]; // YYYY-MM-DD format
    const PRODUCTS = getStoredProducts();
    const [allTrans, setAllTrans] = useState([]);
    const [userData, setUserData] = useState({});
    const [loadingScr, setLoadingScr] = useState(false);
    const [loadingText, setLoadingText] = useState("Yes! Delete");
    const [fromDate, setFromDate] = useState(currentDateFormatted);
    const [toDate, setToDate] = useState(currentDateFormatted);
    const [modelShow, setModelShow] = useState(false);
    const [deleteModelShow, setDeleteModelShow] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [tranModes, setTransModes] = useState({});

    function getGodownsData() {
        let formattedGodownsList = getStoredTransMode();
        setTransModes(formattedGodownsList);
    }

    useEffect(() => {
        axios
            .get(`${API_URL}/partyalltransactions/${partyCode}`)
            .then((response) => {
                setAllTrans(response.data.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(`${API_URL}/dealers/${partyCode}`)
            .then((response) => {
                setUserData(response.data);
            })
            .catch((err) => {
                console.log(err);
            });

        getGodownsData();
    }, [partyCode]);

    const dateWiseTransactions = () => {
        setLoadingScr(true);
        let requestData = {
            id: partyCode,
            fromDate: `${convertDate(fromDate)}`,
            toDate: `${convertDate(toDate)}`,
        };
        axios.post(`${API_URL}/partydatewisetrans`, requestData).then((response) => {
            setAllTrans(response.data);
            setLoadingScr(false);
        });
    };

    const onReturnClick = (tid) => {
        setModelShow(true);
        setTransactionId(tid);
    };

    const onDeleteClick = (tid) => {
        setDeleteModelShow(true);
        setTransactionId(tid);
    };

    const deleteTrans = (tId) => {
        axios
            .put(`${API_URL}/deletepartytransaction`, { transactionId: tId })
            .then((response) => {
                setLoadingText("Deleting");
                setTimeout(() => {
                    window.location.reload();
                    setDeleteModelShow(false);
                }, 2500);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="col-md-12 pt-2">
                <div className={loadingScr ? "loading" : ""}></div>

                <div className="userdetails">
                    <div className="col-md-8">
                        <div className="firmname-big">
                            {userData.firm_name} - {userData.party_code}
                        </div>
                        <div className="party-details-text">
                            <div className="boldtxt">
                                <i className="fa fa-user iconwidth"></i> Owner
                            </div>
                            <span className="dash">:</span>
                            <span>{userData.name}</span>
                        </div>
                        <div className="party-details-text">
                            <div className="boldtxt">
                                <i className="fa fa-map-marker iconwidth" aria-hidden="true"></i>{" "}
                                Area
                            </div>
                            <span className="dash">:</span>
                            {userData.dealer_area}
                        </div>
                        <div className="party-details-text">
                            <div className="boldtxt">
                                <i className="fa fa-phone iconwidth" aria-hidden="true"></i> Contact
                            </div>
                            <span className="dash">:</span>
                            <a href={`tel:${userData.mobile}`}>+91-{userData.mobile}</a>
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
                            <a href={`mailto:${userData.email}`}>{userData.email}</a>
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
                            <span>{userData.address}</span>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="firmname report-icons d-flex">
                            <PartyReport partyCode={partyCode} />
                        </div>
                        <div className="d-flex portal-date-picker">
                            <i
                                onClick={() => window.location.reload()}
                                className="fa fa-refresh reset-trans"
                                aria-hidden="true"
                            ></i>
                            <div className="dp-from">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                />
                            </div>
                            <div className="dp-to">
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="form-control"
                                    style={{ fontSize: "12px" }}
                                />
                            </div>
                            <div onClick={dateWiseTransactions} className="fetchbtn">
                                Fetch
                            </div>
                        </div>
                    </div>
                </div>
                <div className="openingbal-show mb-2">
                    <div className="title">Opening Balance</div>
                    {userData.openingbalance && userData.openingbalance.length > 0 && (
                        <>
                            <div className="d-flex open-date">
                                <div className="sub-title">Opening Date - &nbsp;</div>
                                <div className="product">
                                    {convertDate(
                                        userData.openingbalance[0].manualopeningdate,
                                        0,
                                        true,
                                    )}
                                </div>
                            </div>
                            <div className="delivered-main d-flex">
                                <div className="sub-title">Delivered - &nbsp;</div>
                                {userData.openingbalance &&
                                    userData.openingbalance.map((item, inx) => {
                                        return (
                                            <div key={`obdel_${inx}`} className="product">
                                                {" "}
                                                {PRODUCTS[item.productcode].name} :{" "}
                                                {item.delivered.toFixed(2)}
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className="biiled-main d-flex">
                                <div className="sub-title">Billed - &nbsp;</div>
                                {userData.openingbalance &&
                                    userData.openingbalance.map((item, inx) => {
                                        return (
                                            <div key={`obproduct_${inx}`} className="product">
                                                {" "}
                                                {PRODUCTS[item.productcode].name} :{" "}
                                                {item.billed.toFixed(2)}
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </div>
                <div className="main-viewtrans mb-5">
                    {allTrans.allTransactions &&
                        allTrans.allTransactions.length > 0 &&
                        allTrans.allTransactions.map((data, inx) => {
                            let finalTransDate = data.transactiondate
                                ? data.transactiondate
                                : data.createdAt;
                            return (
                                <div className="d-flex flex-column" key={`dealertrans_${inx}`}>
                                    <div className="trans-card-main">
                                        <div className="d-flex flex-column justify-content-between trans-left-elems">
                                            <div>
                                                <div className="date">
                                                    <b className="mr-2">Date :</b>
                                                    {convertDate(
                                                        finalTransDate && finalTransDate.slice ? finalTransDate.slice(0, 10) : finalTransDate,
                                                        0,
                                                        true,
                                                    )}
                                                </div>
                                                <div
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title={data.vehicle_number}
                                                    className="date"
                                                >
                                                    <b className="mr-2">Vehicle No :</b>{" "}
                                                    {data.vehiclenumber}
                                                </div>
                                                <div
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title={data.consignee_name}
                                                    className="date"
                                                >
                                                    <b className="mr-2">Consignee :</b>{" "}
                                                    {data.consigneefirmname}
                                                </div>
                                            </div>

                                            <div className="transactionid">
                                                {data.returns && data.returns.length <= 0 && (
                                                    <div
                                                        className="returntxt c-pointer d-flex align-items-center"
                                                        onClick={() => onReturnClick(data._id)}
                                                    >
                                                        <span>
                                                            <i
                                                                className="fa fa-reply-all return-img"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </span>
                                                        <span>Return Items</span>
                                                    </div>
                                                )}

                                                <div
                                                    className="returntxt c-pointer redtxt d-flex align-items-center"
                                                    onClick={() => onDeleteClick(data._id)}
                                                >
                                                    <span>
                                                        <i
                                                            className="fa fa-trash del-icon"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </span>
                                                    <span>Delete Transaction</span>
                                                </div>
                                                {data.trans_comment !== "" && (
                                                    <div className="returntxt c-pointer redtxt commentspopup">
                                                        <OverlayComp comment={data.trans_comment} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="products-main">
                                            {data.products.length > 0 &&
                                                data.products.map((item, inx) => {
                                                    return (
                                                        <div
                                                            className="product"
                                                            key={`transprod_${inx}`}
                                                        >
                                                            <div className="title">
                                                                {PRODUCTS[item.productcode].name} :
                                                            </div>
                                                            <div className="values d-flex flex-column">
                                                                <span>
                                                                    <b>Delivered: </b>
                                                                    <span className="greentxt">
                                                                        {item.delivered.toFixed(2)}{" "}
                                                                        mt
                                                                    </span>
                                                                </span>
                                                                <span>
                                                                    <b>Billed: </b>
                                                                    <span className="redtxt">
                                                                        {item.billed.toFixed(2)} mt
                                                                    </span>
                                                                </span>
                                                                <span>
                                                                    <b>Mode :</b>{" "}
                                                                    {tranModes[item.mode.value]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    {data.returns.length > 0 && (
                                        <div className="return-main">
                                            <div className="return-submain">
                                                <b>Return: </b>
                                                {data.returns.map((item, inx) => {
                                                    return (
                                                        <span
                                                            key={`returnprod_${inx}`}
                                                            className="ml-3"
                                                        >
                                                            {PRODUCTS[item.productcode].name}:{" "}
                                                            {item.quantity} mt
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    {allTrans.allTransactions && allTrans.allTransactions.length <= 0 && (
                        <EmptyDataBannerComp />
                    )}
                </div>
                {allTrans.totalCount && (
                    <div className="finaltotalreport">
                        <button 
                            onClick={() => navigate(`/dealer/${partyCode}`)} 
                            className="back-btn"
                        >
                            <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
                        </button>
                        <div className="val">
                            <b>Delivered: </b>
                            {allTrans.totalCount.totaldelivered.toFixed(2)} mt
                        </div>
                        <div className="bttl">
                            <b>Billed: </b>
                            {allTrans.totalCount.totalbilled.toFixed(2)} mt
                        </div>
                        <div className="bttl">
                            <b>Outstanding: </b>
                            {allTrans.totalCount.outstanding.toFixed(2)} mt
                        </div>
                    </div>
                )}
            </div>

            {modelShow && (
                <Popup
                    show={modelShow}
                    onHide={() => setModelShow(false)}
                    hideFooter={false}
                    footerContent={() => "Warning: Enter the values correctly"}
                    title="Return Items"
                    size="lg"
                    headerImg="/images/return.png"
                >
                    <Return
                        party_code={partyCode}
                        tid={transactionId}
                        firm_name={userData.firm_name}
                        party_name={userData.name}
                    />
                </Popup>
            )}

            {deleteModelShow && (
                <Popup
                    show={deleteModelShow}
                    onHide={() => setDeleteModelShow(false)}
                    hideFooter={false}
                    footerContent={() => "Note: Enter the values correctly"}
                    title="Confirm Deletion"
                    size="md"
                    headerImg="/images/deleteicon.png"
                >
                    <div className="popupdel d-flex align-items-center justify-content-center">
                        <div className="mr-3">Are you sure you want to delete ? </div>
                        <button
                            disabled={loadingText === "Deleting" ? true : false}
                            className={`deletebtn ${
                                loadingText === "Deleting" ? "disable-btn" : ""
                            }`}
                            onClick={() => deleteTrans(transactionId)}
                        >
                            {loadingText === "Deleting" ? (
                                <img className="loading-gif" src="./images/loading.gif" alt="" />
                            ) : (
                                ""
                            )}
                            {loadingText}
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default ConsigneeTransactions;
