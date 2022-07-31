import React, { useState } from 'react';
import { getFancyDateFormat } from '../../../utils/dateConverter';
import axios from 'axios';
import API_URL from '../../../config';

const PartyCard = ({ firmName, OwnerName, Mobile, imgUrl, partyCode, dealerArea, isDamageDealer, email, updatedAt, createdAt, outstanding = 0 }) => {
    if (!updatedAt) {
        updatedAt = createdAt;
    }

    let colorcss = outstanding > 0 ? 'redtxt' : 'greentxt';
    let totaltext = outstanding > 0 ? 'Pending' : 'Advance';
    let partyArea,
        totalBalance = 0,
        tagcolor;

    switch (dealerArea) {
        case 'Gopalganj': {
            partyArea = 'Gopalganj';
            tagcolor = 'tag-blue';
            break;
        }
        case 'Chapra': {
            partyArea = 'Chapra';
            tagcolor = 'tag-red';
            break;
        }
        case 'Siwan': {
            partyArea = 'Siwan';
            tagcolor = 'tag-yellow';
            break;
        }
        default: {
            partyArea = '';
        }
    }
    if (outstanding < 0) {
        totalBalance = outstanding * -1;
    } else {
        totalBalance = outstanding;
    }

    if (outstanding === 0) {
        totaltext = '';
        colorcss = 'yellow-text';
    }
    let todaysDate = getFancyDateFormat(Date.now());
    let updatedDate = getFancyDateFormat(updatedAt);

    const [nudgeSent, setNudgeSent] = useState(false);

    const nudgeUser = () => {
        let sendData = {
            partyCode,
            type: 'ACCOUNT_STATUS',
        };

        axios.post(`${API_URL}/nudgeuser`, sendData).then((response) => {
            if (response.data) {
                setNudgeSent(true);
            }
        });
    };

    return (
        <>
            <div className="row justify-content-center align-items-center data-card-main">
                <div className="col-md-10 col-sm-10 data-card">
                    <div className={`display-letter ${tagcolor}`}>{partyArea}</div>
                    <div className="createdon">
                        {nudgeSent && <span className="nudge-sent-text">The user has been Nudged!</span>}
                        {!nudgeSent && (
                            <span onClick={() => nudgeUser()} className="mr-2 nudge-main">
                                <i className="fa fa-hand-o-right nudge-icon" aria-hidden="true"></i> <span className="text">Nudge User</span>
                            </span>
                        )}
                        <span>
                            Last Updated: <em>{todaysDate === updatedDate ? 'Today' : updatedDate}</em>
                        </span>
                    </div>
                    <a className="card-full" href={`#/dealer/${partyCode}`}>
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={imgUrl ? imgUrl : "https://www.w3schools.com/howto/img_avatar.png"} className="icon" alt="" />
                            <div className="info">
                                <div className="firmname">
                                    {firmName} - {partyCode}
                                </div>
                                {isDamageDealer ? <i class="fa fa-bolt d-letter" aria-hidden="true"></i> : ''}
                                <div className="ownername">
                                    <i className="fa fa-user iconwidth"></i> {OwnerName}
                                </div>
                                <div className="ownername">
                                    <i className="fa fa-phone" aria-hidden="true"></i> +91-{Mobile}
                                </div>
                                {email && (
                                    <div className="ownername">
                                        <i className="fa fa-envelope" aria-hidden="true"></i> {email}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="datashow">
                            <div className="title">
                                Outstanding:
                                <span className={`value ${colorcss}`}>
                                    {totalBalance.toFixed(2)}
                                    <span className="mt-unit">mt</span>
                                    {totaltext}
                                </span>
                            </div>
                            <img src="images/arrowright.png" alt="" className="viewbtn"></img>
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
};

export default PartyCard;
