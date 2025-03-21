import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Popup from '../../../components/common/PopUp';
import API_URL from '../../../config';
import { useOnClickOutside } from '../dealers/outsideClick';
import GraphComp from '../../../components/common/graph';
import { getStoredProducts } from "../utils";

const ViewConsignee = (props) => {
    let partyCode = props.match.params.id;
    let [singleDealersData, setSingleDealersData] = useState({});
    let [loading, setLoading] = useState(true);
    let [menuShow, setMenuShow] = useState(false);
    const [showPartGraph, setShowPartyGraph] = useState(false);
    const [productCounts, setProductCounts] = useState({});

    const ref = useRef(null);
    useOnClickOutside(ref, () => setMenuShow(false));
    console.log(menuShow);

    const PRODUCTS = getStoredProducts();

    useEffect(() => {
        axios
            .get(`${API_URL}/dealers/${partyCode}`)
            .then((response) => {
                setSingleDealersData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .post(`${API_URL}/getpartystatus`, { partyCode })
            .then((response) => {
                setProductCounts(response.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [partyCode]);

    let { name, party_code, address, firm_name, dealer_area, mobile, email, photo } = singleDealersData || {};

    let totalbaltxt = productCounts.outstanding >= 0 ? '[Pending]' : '[Advance]';
    if (productCounts.outstanding === 0) {
        totalbaltxt = '[NIL]';
    }

    return (
        <>
            {loading && (
                <div className="loading">
                    <i className="fa fa-cog fa-spin"></i>
                    <span className="ml-3 pb-1">Loading...</span>
                </div>
            )}
            <div className="col-md-12 dealerview-section">
                <div className="row dealerview-main">
                    <div className="col-md-2 d-flex flex-column align-items-center justify-content-center">
                        <img className="userimg mt-1" src={photo} alt="" />
                        <div className="text-center c-pointer mt-2 graph-text" onClick={() => setShowPartyGraph(true)}>
                            <i className="fa fa-bar-chart mr-1" aria-hidden="true"></i>Show Graph
                        </div>
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
                                <i className="fa fa-map-marker iconwidth" aria-hidden="true"></i> Area
                            </div>
                            <span className="dash">:</span>
                            {dealer_area}
                        </div>
                        <div className="party-details-text">
                            <div className="boldtxt">
                                <i className="fa fa-phone iconwidth" aria-hidden="true"></i> Contact
                            </div>
                            <span className="dash">:</span>
                            <a href={`tel:${mobile}`}>+91-{mobile}</a>
                        </div>
                        <div className="party-details-text">
                            <div className="boldtxt">
                                <i className="fa fa-envelope sizeadjust iconwidth" aria-hidden="true"></i> E-mail
                            </div>
                            <span className="dash">:</span>
                            <a href={`mailto:${email}`}>{email}</a>
                        </div>
                        <div className="party-details-text">
                            <div className="boldtxt">
                                <i className="fa fa-address-card-o sizeadjust iconwidth" aria-hidden="true"></i> Address
                            </div>
                            <span className="dash">:</span>
                            {address}
                        </div>
                    </div>

                </div>
                <div className="row product-view-main">
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
                                <div className="col-md-12 product-value" key={`atcprodscount_${inx}`}>
                                    <span className="hd1">{PRODUCTS[item.productcode].name}</span>
                                    <span className="hd2">{item.delivered.toFixed(2)}</span>
                                    <span className="hd3">{item.billed.toFixed(2)}</span>
                                    <span className="hd4">{calculatedVal > 0 ? calculatedVal : 0}</span>
                                    <span className="hd5">{calculatedVal < 0 ? calculatedVal * -1 : 0}</span>
                                </div>
                            );
                        })}

                    <div className="col-md-12 heading">
                        <span className="hd1">Sub-Total</span>
                        <span className="hd2">{productCounts.totaldelivered && productCounts.totaldelivered.toFixed(2)}</span>
                        <span className="hd3">{productCounts.totaldelivered && productCounts.totalbilled.toFixed(2)}</span>
                    </div>
                    <div className="col-md-12 party-total-grid">
                        {(productCounts.outstanding || productCounts.outstanding === 0) && (
                            <div className="hd1">
                                <span>Total Outstanding: </span>&nbsp;
                                <b>{productCounts.outstanding.toFixed(2)}</b> mt <span className="txtappended">{totalbaltxt}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

export default ViewConsignee;
