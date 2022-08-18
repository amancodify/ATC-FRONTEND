import React from 'react';

function WhatWeDo() {
    return (
        <div className="container position-relative">
            <div id="our-story"></div>
            <div className="row section-margin">
                <div className="sec">
                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-left text">
                        <h3 className="pl-5 story-title">The Atc Story</h3>
                        <p className="px-5 py-3 story-text">
                            Ever since 1996, when ATC comprised of a handful of people,
                            it has been committed to delivering customer satisfaction without any compromise.
                            Be it simple consultation or end-to-end delivery, we pride ourselves on fulfilling
                            our commitments above and beyond industry standards. With a team of around 30 people
                            now, our goals still haven't changed. Our ensemble of experts are still as committed to
                            excellence and customer satisfaction, while working hard for the development of the organization. <br /><br />
                            Aligned with and a trusted partner of Bangur Cement and ACE Construction Equipment, we aim to provide holistic
                            help and guidance in every contract and project we undertake. Time and again we have excelled the status quo of sales,
                            service and satisfaction across the state and have been awarded for the same multiple times.
                        </p>
                    </div>
                    <div className="col-md-6 my-md-5 image">
                        <img src="images/story.jpg" className="homeb1" alt="" />
                    </div>
                </div>
                <div className="sec mt-5">
                    <div className="col-md-6 mt-md-5 image ">
                        <img src="images/mission.jpg" className="homeb2" alt="" />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-left text">
                        <h3 className="pl-5 story-title">Our Mission</h3>
                        <p className="px-5 py-3 story-text">
                            We are committed to provide structured work schedules, clear duties, and spheres of rights and responsibilities for each team member. Our mission is to become the leading business company where customers can say proudly that <span className="font-weight-bold"> "Yes ! My trade is Simplified !". </span> Our values are heavily anchored in customer satisfaction and impeccable service delivery.<br /><br /> Every consultation and project of ATC is aimed at providing the most suitable products and services keeping in mind the needs of the customer. We welcome all branding companies to tieup with us and do their business expansion.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhatWeDo;