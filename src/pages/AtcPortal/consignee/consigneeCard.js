import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../dealers/outsideClick';
import MenuOptions from '../../../components/common/MenuOptions';
import axios from 'axios';
import API_URL from '../../../config';
import Popup from '../../../components/common/PopUp';

const ConsigneeCard = ({ consigneeData }) => {
    let { firmname, partycode, name, email, mobile, consigneecode, lastupdated, partydata, photo, createddate, address, buydamage } = consigneeData;
    if (!photo) {
        photo = 'https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png';
    }

    const [showContactCard, setShowContactCard] = useState(false);
    const [showInfoCard, setShowInfoCard] = useState(false);
    const [modelShow, setModelShow] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const clickRefContactCard = useRef(null);
    useOnClickOutside(clickRefContactCard, () => setShowContactCard(false));

    const clickRefInfoCard = useRef(null);
    useOnClickOutside(clickRefInfoCard, () => setShowInfoCard(false));

    const deleteUser = () => {
        axios
            .post(`${API_URL}/deleteconsignee`, { consigneeCode: consigneecode })
            .then((response) => {
                if (response.data) {
                    window.location.replace('#/');
                } else {
                    setErrMsg('Delete not allowed! This consignee transactions exist!');
                    setModelShow(false);
                }
            })
            .catch((err) => {
                setErrMsg(err.message);
                setModelShow(false);
            });
    };

    return (
        <div className="col-md-3 col-sm-10 consg-card-main">
            <MenuOptions
                mainOptionsCSS="consignee-menu-main"
                menuListCSS="consignee-menu-list"
                optionsNode={
                    <>
                        <div className="d-flex align-items-center justify-content-end menu-option-grid" onClick={() => setModelShow(true)}>
                            <span className="edit-label">Delete User</span>
                        </div>
                    </>
                }
            />
            {buydamage && (
                <img
                    data-toggle="tooltip"
                    title="This consignee buys damage products as well"
                    className="damage-icon"
                    src="https://icons.veryicon.com/png/o/internet--web/collection-and-payment/damage.png"
                    alt=""
                />
            )}
            <div className="avatar">
                <img src={photo} alt="" />
            </div>
            <div data-toggle="tooltip" data-placement="top" title={firmname} className="title-text">
                {firmname}
            </div>
            <div className="subtitle-text green-color-text">#{consigneecode}</div>
            <hr />
            <div className="associated-dealer" data-toggle="tooltip" data-placement="top" title={partydata.firm_name}>
                <div className="label">Associated Dealer</div>
                <a className="dealer-link" href={`#/dealer/${partycode}`}>
                    [{partycode}] {partydata.firm_name}
                </a>
            </div>
            <div className="last-updated">Last Updated - {lastupdated}</div>
            <div className="mt-2 actions">
                <div className="icons">
                    {showContactCard && (
                        <div class="contact-card" ref={clickRefContactCard}>
                            <img onClick={() => setShowContactCard(false)} src="https://image.flaticon.com/icons/png/512/59/59836.png" alt="" />
                            <div class="subtitle-text">
                                <b>Contact Card</b>
                            </div>
                            <div class="details">
                                <div class="data">
                                    <i className="fa fa-user"></i>
                                    <span className="text">{name}</span>
                                </div>
                                <div class="data">
                                    <i className="fa fa-phone" aria-hidden="true"></i>
                                    <span className="text">+91-{mobile}</span>
                                </div>
                                {email && (
                                    <div class="data">
                                        <i className="fa fa-envelope"></i>
                                        <a className="text" href={`mailto:${email}`}>
                                            {email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {showInfoCard && (
                        <div class="contact-card info-card" ref={clickRefInfoCard}>
                            <img onClick={() => setShowInfoCard(false)} src="https://image.flaticon.com/icons/png/512/59/59836.png" alt="" />
                            <div class="subtitle-text">
                                <b>Info Card</b>
                            </div>
                            <div class="details">
                                <div class="data">
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                    <span className="text">Created: {createddate}</span>
                                </div>
                                <div class="data align-items-start mt-2">
                                    <i class="fa fa-address-book pt-1" aria-hidden="true"></i>
                                    <span className="address">Address - {address}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <i
                        className="fa fa-info-circle mr-2 cursor-pointer info-icon"
                        aria-hidden="true"
                        onClick={() => setShowInfoCard(!showInfoCard)}
                    ></i>
                    <i className="fa fa-address-card cursor-pointer" onClick={() => setShowContactCard(!showContactCard)}></i>
                    {buydamage && <i className="fas fa-house-damage ml-2"></i>}
                </div>
                <a className="text" href={`#/consignee/${consigneecode}`}>
                    View Consignee <i class="ml-1 fa fa-arrow-right"></i>
                </a>
            </div>
            {modelShow && (
                <Popup
                    show={modelShow}
                    onHide={() => setModelShow(false)}
                    hideFooter={false}
                    footerContent={() => 'Note: Deleting Consignee is not reversable'}
                    title="Confirm Consignee Deletion"
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
            <div className="err-msg">
                {errMsg}
            </div>
        </div>
    );
};

export default ConsigneeCard;
