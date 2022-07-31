import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const Header = () => {
    useEffect(() => {
        gsap.to('.atcfull', { x: 0, duration: 1.5, opacity: 1 });
    }, []);

    return (
        <div className="home-main">
            <div className="row mb-md-8 align-items-center sub-container">
                <div className="col-md-7">
                    <div className="home-banner-img">
                        <img className="banner-img" src="/images/home-banner-business.png" alt="" />
                    </div>
                </div>
                <div className="col-md-5 home-left">
                    <h1 className="atcfull">Aman Trading Company</h1>
                    <div className="tagline">Trade Simplified</div>
                    <div className="d-flex btns-cover">
                        <a href="tel:+917260995387">
                            <div className="contactbar mr-4">
                                <i className="fa fa-phone" aria-hidden="true"></i>
                                <span className="ml-3 text">Call Us</span>
                            </div>
                        </a>
                        <a href="mailto:amantrading.company13@gmail.com">
                            <div className="contactbar">
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                <span className="ml-3 text">Email Us</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
