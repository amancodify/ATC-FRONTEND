import React from 'react';

const OTP = () => {
  return (
    <div className="otp-main" id="products">
      <div className="container">
        <div className="row ">
          <div className="col-md-5 otp-cont">
            <div className="title-ourpart"> Our <br /> Trusted <br /> Partners</div>
            <div className="title-ourpart-mob"> Our Trusted Partners </div>
          </div>
          <div className="col-md-7 partners-cards-main">
            <div className="partner-card pc-color d-flex flex-column justify-content-center align-items-center">
              <a href="https://www.linkedin.com/showcase/bangur-cement/?originalSubdomain=in" target="blank">
                <img src="images/bangur-logo.png" className="partners-img1" alt="" />
                <div className="comp-desc">
                  <img src="images/bangur-logo.png" className="bangur-logo" alt="" />
                  <div className="card-title">Bangur Cement</div>
                  At Bangur, we give prime importance to the accountability of our operations. We aim at producing high-quality products for our customers by utilizing the latest technologies, in order to ensure the minimal hazardous impact on the environment
                 <div className="readmore">&#8594; Read More</div>
                  <img className="stamp-img" src="images/trusted-stamp.png" alt="" />
                </div>
              </a>
            </div>
            <div className="partner-card pc-color d-flex flex-column justify-content-center align-items-center">
              <a href="https://www.ace-cranes.com/" target="blank">
                <img src="images/ace.png" className="partners-img2" alt="" />
                <div className="comp-desc">
                  <img src="images/ace.png" className="ace-logo" alt="" />
                  <div className="card-title2">Ace Tractors</div>
                  ACE is India’s leading material handling and construction equipment manufacturing company with a majority market share in Mobile Cranes and Tower Cranes segment.
                 <div className="readmore">&#8594; Read More</div>
                  <img className="stamp-img" src="images/trusted-stamp.png" alt="" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTP;