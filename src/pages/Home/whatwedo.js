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
                            Since 1996, ATC has been driven by one unwavering mission — delivering uncompromised customer satisfaction.<br /><br />
                            What began as a small team of dedicated professionals has grown into a dynamic organization of nearly 30 experts, each deeply committed to excellence. Whether it's a straightforward consultation or comprehensive project execution, we consistently go above and beyond industry standards to honor our promises and exceed expectations.<br /><br />
                            Over the years, our core values have remained unchanged. Our team continues to uphold the same dedication, working tirelessly to drive organizational growth while ensuring our clients’ success remains at the forefront.<br /><br />
                            As a proud and trusted partner of Bangur Cement and ACE Construction Equipment, ATC offers end-to-end support and expert guidance in every project we undertake. Our consistent performance in sales, service, and customer satisfaction has not only earned us accolades across the state but also reaffirmed our position as a benchmark in the industry.
                        </p>
                    </div>
                    <div className="col-md-6 my-md-5 image">
                        <img src="/images/story.jpg" className="homeb1" alt="" />
                    </div>
                </div>
                <div className="sec mt-5">
                    <div className="col-md-6 mt-md-5 image ">
                        <img src="/images/mission.jpg" className="homeb2" alt="" />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-left text">
                        <h3 className="pl-5 story-title">Our Mission</h3>
                        <p className="px-5 py-3 story-text">
                            We are committed to provide structured work schedules, clear duties, and spheres of rights and responsibilities for each team member. Our mission is to become the leading business company where customers can say proudly that 
                            <span className="font-weight-bold">"Yes! My trade is Simplified!"</span>. Our values are heavily anchored in customer satisfaction and impeccable service delivery.<br /><br />
                            Every consultation and project of ATC is aimed at providing the most suitable products and services keeping in mind the needs of the customer. We welcome all branding companies to tie up with us and do their business expansion.

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhatWeDo;