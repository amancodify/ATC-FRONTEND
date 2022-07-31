import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Popup from "../../common/PopUp";
import AtcRefillGodown from "./RefillGodown";
import GodownDamageForm from "./godownDamage";
import API_URL from "../../../config";

const ViewGodwon = ((props) => {
    let godownCode = props.match.params.id;
    let [godownData, setGodownData] = useState({});
    let [godownCountData, setGodownCountData] = useState({});
    let [showTransPopup, setShowTransPopup] = useState(false);
    let [showdeletPopup, setShowDeletePopup] = useState(false);
    let [showGodownDamagePopup, setShowGodownDamagePopup] = useState(false);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/godowns/${godownCode}`)
            .then(response => {
                setGodownData(response.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                window.location.replace("#/godown");
                window.location.reload();
            });

        axios.get(`${API_URL}/godowns/getgodownstats/${godownCode}`)
            .then(response => {
                setGodownCountData(response.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, [godownCode]);


    const deletegodown = () => {
        axios.delete(`${API_URL}/godowns/delete/${godownCode}`)
            .then(response => {
                window.history.back();
            })
            .catch(err => {
                console.log(err);
            })
    }

    let { address, godowncode, inchargename, inchargemobile, godownname } = godownData || {};

    return (
        <>
            {
                loading &&
                <div className="loading">
                    <i className="fa fa-spinner fa-pulse"></i>
                    <span className="ml-3 pb-1">Loading...</span>
                </div>
            }
            <div className="col-md-12">
                <div className="viewgodown-main">
                    <a href={`#/godown`} className="back-btn back-btn-godown "><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</a>
                    <div className="row">
                        <div className="col-md-6">
                            <img className="vector-img" src="images/godown_vector1.jpg" alt="" />
                        </div>
                        <div className="col-md-5 godown-description">
                            <div className="title">{godownname}</div>
                            <div className="address"><b>Godown Code</b> - {godowncode}</div>
                            <div className="address"><b>Address</b> - {address}</div>
                            <div className="address"><b>Incharge</b> - {inchargename}</div>
                            <div className="address"><b>Mobile</b> - {inchargemobile}</div>
                        </div>
                        <div className="god-icons-del-edit col-md-2 d-flex justify-content-end">
                            {/* <div><i onClick={() => setShowDeletePopup(true)} className="delete-icon fa fa-trash" aria-hidden="true"></i></div> */}
                            <a className="d-flex align-items-center edit-godown-main" href={`#/editgodown/${godownCode}`}>
                                <i className="edit-icon mr-1 fa fa-edit"></i> <span className="edit-label"> Edit Godown </span>
                            </a>
                        </div>
                    </div>

                    <div className="row datashow-main">
                        <div className="col-md-12 heading">
                            <span className="hd1">Products</span>
                            <span className="hd2">Fresh Stock (mt)</span>
                            <span className="hd3">Damage Stock (mt)</span>
                        </div>

                        {godownCountData.products && godownCountData.products.map((item, inx) => {
                            return (
                                <div className="col-md-12 product-value" key={`godowncount${inx}`}>
                                    <span className="hd1">{item.productname}</span>
                                    <span className="hd2">{item.fresh.toFixed(2)}</span>
                                    <span className="hd3">{item.damage.toFixed(2)}</span>
                                </div>
                            )
                        })}

                        {godownCountData.totalFresh &&
                            <div className="col-md-12 heading">
                                <span className="hd1">Total</span>
                                <span className="total-fresh hd2">{godownCountData.totalFresh.toFixed(2)} mt</span>
                                <span className="total-damage hd3">{godownCountData.totalDamage.toFixed(2)} mt</span>
                            </div>
                        }
                        <div className="col-md-12 actions">
                            <div onClick={() => setShowTransPopup(true)} className="action-link create-txt">Refill Godwon</div>
                            <a className="action-link view-txt" href={`#/godownrefilltransactions/${godownCode}`}>Refill Transactions</a>
                            <a className="action-link view-txt" href={`#/godownpartytransaction/${godownCode}`}>Party Transactions</a>
                        </div>
                    </div>
                </div>
            </div>
            {
                showTransPopup &&
                <Popup
                    show={showTransPopup}
                    onHide={() => setShowTransPopup(false)}
                    hideFooter={false}
                    footerContent={() => "* Please fill the details correctly & carefully !!"}
                    title={`Godown Refill - ${godownname}`}
                    headerImg="/images/refill.png"
                >
                    <AtcRefillGodown
                        godownCode={godownCode}
                    />
                </Popup>
            }

            {
                showdeletPopup &&
                <Popup
                    show={showdeletPopup}
                    onHide={() => setShowDeletePopup(false)}
                    hideFooter={false}
                    footerContent={() => "Caution : Deleting Godown is permanent & cannot be reversed"}
                    title="Confirm Godown Deletion"
                    size="md"
                    headerImg="/images/warning.png"
                >
                    <div className="popupdel d-flex align-items-center justify-content-center">
                        <div className="mr-3">Are you sure you want to delete Godown ? </div>
                        <button className="deletebtn" onClick={deletegodown}>Yes! delete</button>
                    </div>
                </Popup>
            }

            {
                showGodownDamagePopup &&
                <Popup
                    show={showGodownDamagePopup}
                    onHide={() => setShowGodownDamagePopup(false)}
                    hideFooter={false}
                    footerContent={() => "Only add Damage Quantity of the Respective Prodcuts"}
                    title={`Add Damage Quantity - ${godowncode}`}
                    size="md"
                    headerImg="/images/damageprod.png"
                >
                    <GodownDamageForm
                        godownCode={godownCode}
                    />
                </Popup>
            }
        </>
    )
})

export default ViewGodwon;