import React from 'react';

const Bangur = () => {
    return (
        <>
            <div className="bangur-main py-5" id="partners">
                <div class="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="title">Business Partner</div>
                            <div className="row align-items-center">
                                <div className="col-md-8 descriptions">
                                    <div className="d-title">Business with BANGUR CEMENT</div>
                                    <div className="d-text">
                                        ATC is continuously working with Bangur Cement (A Unit of Shree Cement) from last 15 years, we relies on the
                                        fact that it is a very trustworthy and a market leading company, Specially in Bihar where development is on
                                        its peak, many other competitors are there in the area and we together still leading the market and selling
                                        highest numbers of bags per month. <br /> <br />
                                        <iframe
                                            className="mb-2 bangur-video"
                                            title="Bangur Ad"
                                            height="250"
                                            src="https://www.youtube.com//embed/IeFTUjF077Y"
                                        ></iframe>
                                        Bangur Cement is a product of Shree Cement which has three main brands -{' '}
                                        <b>Shree Ultra, Bangur Cement & Rockstrong.</b> It is among the top five cement groups in India. It is the
                                        first Cement Company and one of the three Indian companies who were listed as New Sustainability Champion by
                                        World Economic Forum in September 2011. We have a world record in fastest completion of 1.0 MTPA clinker
                                        capacity in 330 Days as compared to the standard 630 Days time.
                                    </div>
                                </div>
                                <div className="col-md-4 bangur-bag">
                                    <img src="./images/bangur.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Bangur;
