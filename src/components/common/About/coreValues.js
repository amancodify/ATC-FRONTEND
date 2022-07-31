import React from 'react';

const CoreValues = (() => {
    return (
        <div className="coreval-main">
            <div className="row">
                <div className="col-md-6">
                    <img className="coreval-banner" src="/images/settings.png" alt="" />
                </div>
                <div className="col-md-6">
                    <p className="title">Our Core Values & Vision</p>
                    <div className="core-element">
                        <div className="d-flex flex-column justify-content-left align-items-center">
                            <div className="ce1"><img className="coreval-img" src="/images/respect.png" alt="" /></div>
                            <div className="text">Respect</div>
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="ce1"><img className="coreval-img" src="/images/curiosity.png" alt="" /></div>
                            <div className="text">Innovation</div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="ce1"><img className="coreval-img" src="/images/impact.png" alt="" /></div>
                            <div className="text">Impact</div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="ce1"><img className="coreval-img" src="/images/ownership.png" alt="" /></div>
                            <div className="text">Ownership</div>
                        </div>
                    </div>
                    <div className="coreval-description">
                        We work hard every day to <span className="atc-letter">a</span>ccelerate the <span className="atc-letter">t</span>rade's transition & provide <span className="atc-letter">c</span>ustomer satisfaction
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CoreValues;
