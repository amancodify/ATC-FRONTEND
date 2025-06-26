import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { convertDate } from '../../../utils/dateConverter';
import API_URL from '../../../config';
import EmptyDataBannerComp from '../dealers/emptyDataBanner';
import GodownPartyTransactionsReport from './godownPartyTransactionReport';

const GodownPartyTrans = () => {
    const { id: godownCode } = useParams();
    const navigate = useNavigate();
    const d = new Date();
    const currentDateFormatted = d.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Helper function to format date as "time ago"
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffHours < 1) return "a few minutes ago";
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    };

    const [godownData, setGodownData] = useState({});
    const [partyTrans, setPartyTrans] = useState([]);
    const [fromDate, setFromDate] = useState(currentDateFormatted);
    const [toDate, setToDate] = useState(currentDateFormatted);

    useEffect(() => {
        axios
            .get(`${API_URL}/godowns/partytransactions/${godownCode}`)
            .then((response) => {
                setPartyTrans(response.data.data);
                setGodownData(response.data.data[0].godowndetails);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [godownCode]);

    const dateWiseTransactions = () => {
        let requestData = {
            id: godownCode,
            fromDate: `${convertDate(fromDate)}T00:00:00.000Z`,
            toDate: `${convertDate(toDate, 1)}T00:00:00.000Z`,
        };
        axios.post(`${API_URL}/`, requestData).then((response) => {});
    };

    return (
        <>
            <div className="col-md-12">
                <button 
                    onClick={() => navigate(`/viewgodown/${godownCode}`)} 
                    className="back-btn back-btn-gt"
                >
                    <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back To Godown
                </button>
                <div className="userdetails">
                    <div>
                        <div className="firmname">
                            <b>Godown: </b> {godownData.godownname}
                        </div>
                        <div className="firmname">
                            <b>Godown Code:</b> {godownData.godowncode}
                        </div>
                        <div className="firmname">
                            <b>Address:</b> {godownData.address}
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="firmname d-flex justify-content-between">
                            <div className="g-trans-title">Godown Party Transactions</div>
                        </div>
                        <div className="mt-3">
                            <GodownPartyTransactionsReport transactionData={partyTrans} godownData={godownData} />
                        </div>
                        <div className="date-range-main">
                            <div className="submain">
                                <i onClick={() => window.location.reload()} className="fa fa-refresh reset-trans" aria-hidden="true"></i>
                                <div className="d-flex flex-column">
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="form-control"
                                        style={{ fontSize: '12px' }}
                                    />
                                </div>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="form-control"
                                    style={{ fontSize: '12px', margin: '0px 10px' }}
                                />
                            </div>
                            <div onClick={dateWiseTransactions} className="fetchbtn">
                                Fetch
                            </div>
                        </div>
                    </div>
                </div>
                <div className="godown-trans">
                    {partyTrans.length > 0 &&
                        partyTrans.map((data, inx) => {
                            let finalDate = data.transactiondate ? data.transactiondate : data.createdAt;
                            return (
                                <div key={`trans_${inx}`} className="trans-card-main">
                                    <div className="date">
                                        <b className="mr-2">Date :</b>
                                        {convertDate(finalDate && finalDate.slice ? finalDate.slice(0, 10) : finalDate, 0, true)}
                                        <br /> (<b>{getTimeAgo(finalDate)}</b>)
                                    </div>
                                    {data.userdetails && (
                                        <div className="product d-flex flex-column partygodtrans-title">
                                            <div>
                                                <b>Party Code:</b> {data.userdetails.party_code}
                                            </div>
                                            <div>
                                                <b>Firm Name:</b> {data.userdetails.firm_name}
                                            </div>
                                            <div>
                                                <b>Owner:</b> {data.userdetails.name}
                                            </div>
                                        </div>
                                    )}
                                    <div className="product d-flex flex-column partygodtrans-title">
                                        <div>
                                            <b>{data.productdetails.productname}: &nbsp;</b>
                                            {data.quantity} mt
                                        </div>
                                        <div>
                                            <b>Type: &nbsp;</b>
                                            {data.producttype}
                                        </div>
                                        <div>
                                            <b>Transaction Type: &nbsp;</b>
                                            {data.transactiontype}
                                        </div>
                                    </div>
                                    <div className="product d-flex flex-column partygodtrans-title">
                                        <div>
                                            <b>Vehicle Number:</b> <span>{data.transactiondata && data.transactiondata.vehiclenumber}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    {partyTrans.length <= 0 && <EmptyDataBannerComp />}
                </div>
            </div>
        </>
    );
};

export default GodownPartyTrans;
