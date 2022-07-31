import React from 'react';

const WhyLoveAtc = () => {
    return (
        <div className="whyloveatc-main position-relative">
            <div className="row">
                <div className="col-md-12 d-flex flex-column justify-content-center align-items-center">
                    <div className="title">Here's why you'll love ATC</div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cards-container">
                                    <div className="wl-card">
                                        <img src="/images/wlcard1.png" className="wl-icon" alt="" />
                                        <div className="wl-title">Superquick and Easy Trades</div>
                                        <div className="wl-description">
                                            Now you don't have to wonder how things will flow, Dedicated Team of Experts will be assigned to handle
                                            and monitor till end which makes your trade superfast!
                                        </div>
                                    </div>
                                    <div className="wl-card">
                                        <img src="/images/wlcard2.png" className="wl-icon" alt="" />
                                        <div className="wl-title">Reliable & Trustworthy</div>
                                        <div className="wl-description">
                                            Our Customers are the priority, we constantly assess the needs, realities and values of the customer and
                                            set goals to satisfy their needs.
                                        </div>
                                    </div>
                                    <div className="wl-card">
                                        <img src="/images/wlcard3.png" className="wl-icon" alt="" />
                                        <div className="wl-title">Incredible Profits & Benifits</div>
                                        <div className="wl-description">
                                            We gurentee the best profit available in the market, we belive in the both way profits, so that company
                                            and customers both grow together.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyLoveAtc;
