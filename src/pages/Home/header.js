import React from 'react';
import Button from "@mui/material/Button";

const Header = () => {
    return (
        <div className="home-main">
            <div className="row mb-md-8 align-items-center sub-container">
                <div className="col-md-7">
                    <div className="home-banner-img">
                        <img className="banner-img" src="/images/homeBanner.jpg" alt="" />
                    </div>
                </div>
                <div className="col-md-5 home-left">
                    <h1 className="atcfull">Aman Trading Company</h1>
                    <div className="tagline">Trade Simplified</div>
                    <div className="d-flex btns-cover mt-4">
                        <a href="tel:+917260995387">
                            <Button variant="contained" className="contactbar mr-4">
                                <i className="fa fa-phone" aria-hidden="true"></i>
                                <span className="ml-3 text">Call Us</span>
                            </Button>
                        </a>
                        <a href="mailto:amantrading.company13@gmail.com">
                            <Button variant="contained" className="contactbar">
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                <span className="ml-3 text">Email Us</span>
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
