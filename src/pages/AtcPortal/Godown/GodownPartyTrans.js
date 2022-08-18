import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
import { convertDate } from '../../../utils/dateConverter';
import API_URL from '../../../config';
import EmptyDataBannerComp from '../dealers/emptyDataBanner';
import GodownPartyTransactionsReport from './godownPartyTransactionReport';
import moment from 'moment';

const GodownPartyTrans = (props) => {
    const godownCode = props.match.params.id;
    const d = new Date();
    const currentdateYDM = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    const [godownData, setGodownData] = useState({});
    const [partyTrans, setPartyTrans] = useState([]);
    const [fromDate, setFromDate] = useState(Date(currentdateYDM));
    const [toDate, setToDate] = useState(Date(currentdateYDM));

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
                <a href={`#/viewgodown/${godownCode}`} className="back-btn back-btn-gt">
                    <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back To Godown
                </a>
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
                                    <DayPickerInput
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        placeholder={'MM/DD/YYYY - From'}
                                        onDayChange={(date) => setFromDate(date)}
                                        style={{ fontSize: '12px' }}
                                    />
                                </div>
                                <DayPickerInput
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    placeholder={'MM/DD/YYYY - To'}
                                    onDayChange={(date) => setToDate(date)}
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
                                        {convertDate(finalDate.slice(0, 10), 0, true)}
                                        <br /> (<b>{moment(finalDate).fromNow()}</b>)
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
