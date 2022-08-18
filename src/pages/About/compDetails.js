import React from 'react';

const CompDetails = (() => {
    return (
        <>
            <div className="compdetails-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 title">
                            What we do ?
                        </div>
                        <div className="col-md-12 desc">
                            <p className="font-italic">We believe in solving the business needs of the indviduals and make them belive that there trade is simplified</p>
                            <p className="">ATC works to provide the best sutaible service and products based upon the customer's need We also believe it is important to have quality and innovation in our each move, We value the time, skills, and expert opinions of our staff.</p>
                            <p className=""><br />  The ultimate mission of ATC is to become the leading business firm that is synonymous with simple,
                            efficient trade and operations. Every customer dealing with ATC should be left with an
                            experience that reflects our tagline - 'Trade simplified.' Our vision is to redefine the way customer satisfaction is measured across construction and restoration sectors by means of excellent service delivery and fulfillment.
                            </p>
                        </div>
                        <div className="row stevejobs">
                            <div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
                                <p>I don't believe in taking right decisions. I take decisions and then make them right.</p>
                                <p className="author">-Ratan Tata</p>
                            </div>
                            <div className="col-md-4">
                                <img className="earth" src="/images/earth.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default CompDetails;