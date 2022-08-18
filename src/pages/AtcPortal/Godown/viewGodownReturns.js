import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
import { convertDate } from "../../../utils/dateConverter";
import API_URL from "../../../config";

const GodownPartyReturns = (props) => {
    let godownCode = props.match.params.id;
    let [godownData, setGodownData] = useState({});
    const d = new Date();
    const currentdateYDM = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const [fromDate, setFromDate] = useState(Date(currentdateYDM));
    const [toDate, setToDate] = useState(Date(currentdateYDM));
    useEffect(() => {
        axios.get(`${API_URL}/godwons/${godownCode}`)
            .then(response => {
                setGodownData(response.data);
            })
            .catch(err => {
                console.log(err)
            })
    }, [godownCode]);

    const dateWiseTransactions = () => {
        let requestData = {
            "id": godownCode,
            "fromDate": `${convertDate(fromDate)}T00:00:00.000Z`,
            "toDate": `${convertDate(toDate, 1)}T00:00:00.000Z`
        };
        axios.post(`${API_URL}/`, requestData)
            .then(response => {

            })
    }
    return (
        <>
            <div className="col-md-12">
                <a href={`#/viewgodown/${godownCode}`} className="back-btn back-btn-gt"><i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back To Godown</a>

                <div className="userdetails">
                    <div>
                        <div className="firmname"><b>Godown: </b> {godownData.godwon_location}</div>
                        <div className="firmname"><b>Godown Code:</b> {godownData.godwon_code}</div>
                        <div className="firmname"><b>Address:</b> {godownData.address}</div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="firmname d-flex justify-content-between">
                            <div className="g-trans-title">Godown Return Transactions</div>
                        </div>
                        <div className="date-range-main">
                            <div className="submain">
                                <i onClick={() => window.location.reload()} className="fa fa-refresh reset-trans" aria-hidden="true"></i>
                                <div className="d-flex flex-column">
                                    <DayPickerInput
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        placeholder={"MM/DD/YYYY - From"}
                                        onDayChange={(date) => setFromDate(date)}
                                        style={{ "fontSize": "12px", marginRight: "8px" }}
                                    />
                                </div>
                                <DayPickerInput
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    placeholder={"MM/DD/YYYY - To"}
                                    onDayChange={(date) => setToDate(date)}
                                    style={{ "fontSize": "12px" }}
                                />
                            </div>
                            <div onClick={dateWiseTransactions} className="fetchbtn">Fetch</div>
                        </div>
                    </div>
                </div>
                <div className="godown-trans">
                    {godownData.party_returns &&
                        godownData.party_returns.map((data, inx) => {
                            let { transaction_id, firm_name, party_name } = data;
                            return (
                                <div key={`trans_${inx}`} className="trans-card-main">
                                    <div className="date d-flex flex-column justify-content-between">
                                        <div className="date"><b className="mr-2">Date :</b>{convertDate(data.return_date.slice(0, 10), 0, true)}</div>
                                        <div className="transactionid"><b>Tid:</b> <span className="colortxt">{transaction_id}</span></div>
                                    </div>
                                    <div className="product d-flex flex-column partygodtrans-title">
                                        <div><b>Party Code:</b> {data.party_code}</div>
                                        <div><b>Firm Name:</b> {firm_name}</div>
                                        <div><b>Owner:</b> {party_name}</div>
                                    </div>
                                    <div className="product d-flex flex-column partygodtrans-title">
                                        <div><b>PPC - </b> <span className="greentxt">Fresh: </span>{data.ppc.fresh.toFixed(2)} <span className="ml-2 redtxt"> Damage: </span>{data.ppc.damage.toFixed(2)}</div>
                                        <div><b>PSC - </b> <span className="greentxt">Fresh: </span>{data.psc.fresh.toFixed(2)} <span className="ml-2 redtxt"> Damage: </span>{data.psc.damage.toFixed(2)}</div>
                                        <div><b>LPPC - </b> <span className="greentxt">Fresh: </span>{data.lppc.fresh.toFixed(2)} <span className="ml-2 redtxt"> Damage: </span>{data.lppc.damage.toFixed(2)}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default GodownPartyReturns;