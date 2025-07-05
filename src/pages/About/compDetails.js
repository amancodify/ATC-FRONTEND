import React from "react";

const CompDetails = () => {
    return (
        <>
            <div className="compdetails-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 title">What we do ?</div>
                        <div className="col-md-12 desc">
                            <p className="font-italic">
                                We believe in addressing the real business needs of individuals and
                                making them believe that their trade is truly simplified.
                            </p>

                            <p>
                                ATC is dedicated to delivering the most suitable services and
                                products tailored to each customer's unique needs.
                                <br />
                                We emphasize quality and innovation in every step we take, and we
                                deeply value the time, skills, and expert insights of our team.
                            </p>
                            <p>
                                <br />
                                The ultimate mission of ATC is to become a leading business firm
                                that stands for simplicity, efficiency, and excellence in trade and
                                operations.
                                <br />
                                Every customer interaction with ATC should leave behind an
                                experience that embodies our tagline —{" "}
                                <strong>‘Trade Simplified.’</strong>
                                <br />
                                Our vision is to transform the standards of customer satisfaction in
                                the construction and restoration industries through unmatched
                                service delivery and commitment.
                            </p>
                        </div>

                        <div className="row stevejobs">
                            <div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
                                <p>
                                    I don't believe in taking right decisions. I take decisions and
                                    then make them right.
                                </p>
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
};

export default CompDetails;
