/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "react-day-picker/lib/style.css";
import axios from "axios";
import moment from "moment";
import DayPickerInput from "react-day-picker/DayPickerInput";
import Popup from "../../../components/common/PopUp";
import Return from "./Return";
import OverlayComp from "../../../components/common/overlay";
import API_URL from "../../../config";
import PartyReport from "../dealers/partyReport";
import EmptyDataBannerComp from "./emptyDataBanner";
import { formatDate, parseDate } from "react-day-picker/moment";
import { convertDate } from "../../../utils/dateConverter";
import { useOnClickOutside } from "../dealers/outsideClick";
import { getStoredProducts, getStoredTransMode } from "../utils";

const AllTransactions = (props) => {
    const partyCode = props.match.params.id;
    const [allTrans, setAllTrans] = useState([]);
    const [userData, setUserData] = useState({});
    const [loadingScr, setLoadingScr] = useState(false);
    const [loadingText, setLoadingText] = useState("Yes! Delete");
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [modelShow, setModelShow] = useState(false);
    const [deleteModelShow, setDeleteModelShow] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [expandOB, setExpandOB] = useState(false);
    const [tranModes, setTransModes] = useState({});

    const PRODUCTS = getStoredProducts();

    const dealerDataToDisplay = [
        {
            title: "Owner",
            titleIcon: "fa fa-user",
            value: userData.name,
        },
        {
            title: "Area",
            titleIcon: "fa fa-map-marker",
            value: userData.dealer_area,
        },
        {
            title: "Contact",
            titleIcon: "fa fa-phone",
            value: "+91" + userData.mobile,
        },
        {
            title: "E-mail",
            titleIcon: "fa fa-envelope",
            value: userData.email,
        },
        {
            title: "Address",
            titleIcon: "fa fa-address-card-o",
            value: userData.address,
        },
    ];

    const fetchPartyTransaction = () => {
        setLoadingScr(true);
        let requestData = {
            partyCode: partyCode,
        };
        if (fromDate && toDate) {
            requestData["dateFilter"] = {
                fromDate: `${convertDate(fromDate)}`,
                toDate: `${convertDate(toDate)}`,
            };
        }
        axios
            .post(`${API_URL}/partyalltransactions`, requestData)
            .then((response) => {
                setAllTrans(response.data.data);
                setUserData(response.data.data.partydata);
                setLoadingScr(false);
            })
            .catch((err) => {
                console.log(err);
                setLoadingScr(false);
            });
    };

    function getGodownsData() {
        let formattedGodownsList = getStoredTransMode();
        setTransModes(formattedGodownsList);
    }

    useEffect(() => {
        fetchPartyTransaction();
        getGodownsData();
    }, []);

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

    const Actions = ({ data }) => {
        const [action, setAction] = useState(false);
        const ref = useRef(null);
        useOnClickOutside(ref, () => setAction(false));
        return (
            <>
                <div className="trans-actions" onClick={() => setAction(!action)} ref={ref}>
                    <span>...</span>
                    {action && (
                        <div className="actions-menu-main">
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
                                    <i className="fa fa-trash del-icon" aria-hidden="true"></i>
                                </span>
                                <span>Delete Transaction</span>
                            </div>
                            {data.trans_comment !== "" && (
                                <div className="returntxt c-pointer redtxt commentspopup">
                                    <OverlayComp comment={data.trans_comment} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            {loadingScr ? (
                <div className="loading">
                    <i className="fa fa-cog fa-spin"></i>
                    <span className="ml-3 pb-1">Loading...</span>
                </div>
            ) : (
                <div className="col-md-12 pt-2">
                    <div className="userdetails">
                        <div className="col-md-8">
                            <div className="firmname-big">
                                {userData.firm_name} - {userData.party_code}
                            </div>
                            <table>
                                {dealerDataToDisplay.map((item, inx) => {
                                    return (
                                        <>
                                            <tr
                                                className="party-details-text"
                                                key={`dealer_data_trans_${inx}`}
                                            >
                                                <td className="boldtxt d-flex align-items-center">
                                                    <i className={`${item.titleIcon} mr-2`} />
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
                        <div className="d-flex flex-column">
                            <div className="firmname report-icons d-flex">
                                <PartyReport allTrans={allTrans} partyData={userData} />
                            </div>
                            <div className="d-flex align-items-center portal-date-picker">
                                <i
                                    onClick={() => window.location.reload()}
                                    className="fa fa-refresh reset-trans"
                                    aria-hidden="true"
                                ></i>
                                <div className="dp-from">
                                    <DayPickerInput
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        placeholder={"MM/DD/YYYY - From"}
                                        onDayChange={(date) => setFromDate(date)}
                                        style={{ fontSize: "12px" }}
                                        value={fromDate}
                                    />
                                </div>
                                <div className="dp-to">
                                    <DayPickerInput
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        placeholder={"MM/DD/YYYY - To"}
                                        onDayChange={(date) => setToDate(date)}
                                        style={{ fontSize: "12px" }}
                                        value={toDate}
                                    />
                                </div>
                                <div onClick={() => fetchPartyTransaction()} className="fetchbtn">
                                    {loadingScr ? "Fetching..." : "Fetch"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="openingbal-show mb-2" onClick={() => setExpandOB(!expandOB)}>
                        <div className="headers-cont">
                            <div className="title">View Opening Balance</div>
                            <img
                                className={expandOB ? "up-arrow-icon" : "down-icon"}
                                src="https://www.freeiconspng.com/thumbs/white-arrow-png/white-down-arrow-png-2.png"
                                alt=""
                            />
                        </div>
                        {expandOB &&
                            userData.openingbalance &&
                            userData.openingbalance.length > 0 && (
                                <div className="mt-2">
                                    <div className="d-flex align-items-center open-date">
                                        <div className="sub-title">Opening Date - &nbsp;</div>
                                        <div className="product">
                                            {convertDate(
                                                userData.openingbalance[0].manualopeningdate,
                                                0,
                                                true,
                                            )}
                                        </div>
                                    </div>
                                    <div className="delivered-main d-flex align-items-center">
                                        <div className="sub-title">Delivered - &nbsp;</div>
                                        {userData.openingbalance &&
                                            userData.openingbalance.map((item, inx) => {
                                                return (
                                                    <div
                                                        key={`obdel_${inx}`}
                                                        className="product mx-4"
                                                    >
                                                        {PRODUCTS[item.productcode].name} :{" "}
                                                        {item.delivered.toFixed(2)}
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    <div className="biiled-main d-flex align-items-center">
                                        <div className="sub-title">Billed - &nbsp;</div>
                                        {userData.openingbalance &&
                                            userData.openingbalance.map((item, inx) => {
                                                return (
                                                    <div
                                                        key={`obproduct_${inx}`}
                                                        className="product mx-4"
                                                    >
                                                        {" "}
                                                        {PRODUCTS[item.productcode].name} :{" "}
                                                        {item.billed.toFixed(2)}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
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
                                                <div style={{ lineHeight: "17px" }}>
                                                    <div className="date">
                                                        <b className="mr-2">Date :</b>
                                                        {moment(finalTransDate).format("ll")}
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
                                                                <div
                                                                    className="values d-flex flex-column"
                                                                    style={{ lineHeight: "17px" }}
                                                                >
                                                                    <span>
                                                                        <b>Delivered: </b>
                                                                        <span className="greentxt">
                                                                            {item.delivered.toFixed(
                                                                                2,
                                                                            )}{" "}
                                                                            mt
                                                                        </span>
                                                                    </span>
                                                                    <span>
                                                                        <b>Billed: </b>
                                                                        <span className="redtxt">
                                                                            {item.billed.toFixed(2)}{" "}
                                                                            mt
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
                                            <Actions data={data} />
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
                            <a href={`#/dealer/${partyCode}`} className="back-btn">
                                <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
                            </a>
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
            )}

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

export default AllTransactions;
