import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../config';
import { convertDate } from '../../../utils/dateConverter';
import EmptyDataBannerComp from '../dealers/emptyDataBanner';
import Popup from '../../../components/common/PopUp';
import RefillTransactionsReport from './refillGodownReport';
import { REFILL_MODE_TEXTS } from '../dealers/constants';

const GodownTransactions = () => {
    const { id: godownCode } = useParams();
    const navigate = useNavigate();
    let [godownData, setGodownData] = useState({});
    let [refillData, setRefillData] = useState([]);
    let [deleteConfirm, setDeleteConfirm] = useState(false);
    const [loadingText, setLoadingText] = useState('Yes! Delete');
    let [currentId, setCurrentId] = useState('');

    const d = new Date();
    const currentDateFormatted = d.toISOString().split('T')[0]; // YYYY-MM-DD format
    const [fromDate, setFromDate] = useState(currentDateFormatted);
    const [toDate, setToDate] = useState(currentDateFormatted);
    useEffect(() => {
        axios
            .get(`${API_URL}/godowns/refilltransactions/${godownCode}`)
            .then((response) => {
                setRefillData(response.data.data);
                let godownData = response.data.data[0].godowndetails;
                setGodownData(godownData);
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

    const onDeleteClick = (transId) => {
        axios.post(`${API_URL}/deletegodownrefilltransaction`, { id: transId }).then((response) => {
            if (response.data.status === '200') {
                setLoadingText('Deleting');
                setTimeout(() => {
                    window.location.reload();
                }, 2500);
            }
        });
    };

    return (
        <>
            <div className="col-md-12">
                <button
                    onClick={() => navigate(`/atcportal/viewgodown/${godownCode}`)} 
                    className="back-btn back-btn-gt"
                >
                    <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back To Godown
                </button>
                <div className="userdetails pt-3">
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
                            <div className="g-trans-title">Godown Refill Transactions</div>
                        </div>
                        <div className="mt-3">
                            <RefillTransactionsReport godownCode={godownCode} />
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
                                        style={{ fontSize: '12px', marginRight: '8px' }}
                                    />
                                </div>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="form-control"
                                    style={{ fontSize: '12px' }}
                                />
                            </div>
                            <div onClick={dateWiseTransactions} className="fetchbtn">
                                {' '}
                                Fetch{' '}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="godown-trans">
                    {refillData.length > 0 &&
                        refillData.map((data, inx) => {
                            let finalDate = data.refilldate ? data.refilldate : data.createdAt;
                            return (
                                <div key={`gtrans_${inx}`} className="trans-card-main">
                                    <div className="date">
                                        <b className="mr-2">Date :</b>
                                        {convertDate(finalDate && finalDate.slice ? finalDate.slice(0, 10) : finalDate, 0, true)}
                                        <div
                                            className="returntxt c-pointer redtxt d-flex align-items-center"
                                            onClick={() => {
                                                setDeleteConfirm(true);
                                                setCurrentId(data._id);
                                            }}
                                        >
                                            <span>
                                                <i className="fa fa-trash del-icon" aria-hidden="true"></i>
                                            </span>
                                            <span>Delete Transaction</span>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="product">
                                            <div className="title">{data.productdetails.productname} :</div>
                                            <div className="values d-flex flex-column">
                                                <span className="mx-2">
                                                    <b>Fresh:</b> {data.fresh.toFixed(2)} mt
                                                </span>
                                                <span className="mx-2">
                                                    <b>Damage:</b> {data.damage.toFixed(2)} mt
                                                </span>
                                                <span className="mx-2">
                                                    <b>Mode:</b> {REFILL_MODE_TEXTS[data.refillmode]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    {refillData.length <= 0 && <EmptyDataBannerComp />}
                </div>
            </div>

            {deleteConfirm && (
                <Popup
                    show={deleteConfirm}
                    onHide={() => setDeleteConfirm(false)}
                    hideFooter={false}
                    footerContent={() => 'Warning: This action will remove the transaction completely!!'}
                    title="Confirm Deletion"
                    size="md"
                    headerImg="/images/deleteicon.png"
                >
                    <div className="popupdel d-flex align-items-center justify-content-center">
                        <div className="mr-3">Are you sure you want to delete ? </div>
                        <button
                            disabled={loadingText === 'Deleting' ? true : false}
                            className={`deletebtn ${loadingText === 'Deleting' ? 'disable-btn' : ''}`}
                            onClick={() => onDeleteClick(currentId)}
                        >
                            {loadingText === 'Deleting' ? <img className="loading-gif" src="/images/loading.gif" alt="" /> : ''}
                            {loadingText}
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default GodownTransactions;
