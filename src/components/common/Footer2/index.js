import React from 'react';

const Footer = () => {
    return (
        <>
            <div className="footermain">
                <div className="container sub-main">
                    <div className="row">
                        <div className="col-md-2 logo">
                            <a href="/"><img src="./images/atc-logo-white.png" alt="" /></a>
                        </div>

                        <div className="d-flex col-md-4">
                            <div className="f-items">
                                <a href="#s" className="item">Blog</a>
                                <a href="/about" className="item">About</a>
                                <a href="/#career" className="item">Career</a>
                                <a href="#s" className="item">Privacy Policy</a>
                                <a href="/events" className="item">Events</a>
                            </div>
                            <div className="ml-5 services d-flex flex-column">
                                <div className="item-title">Services</div>
                                <a href="/#products" className="item">Products</a>
                                <a href="#s" className="item">Cement</a>
                                <a href="#s" className="item">Dealers</a>
                            </div>
                        </div>

                        <div className="col-md-3 services">
                            <div className="item-title">Address</div>
                            <div className="item">
                                <a href="https://goo.gl/maps/6RfsDBaNTk6ZHo5i6" target="blank">Bangur Cement Office, Transport Gali, Rajendra Path, Chapra Road, Siwan, Bihar - 841226, India</a>
                            </div>
                            <br />
                            <div className="item-title">Contact</div>
                            <a href="mailto: amantrading.company13@gmail.com" className="item">amantrading.company13@gmail.com</a>
                            <br />
                            <a href="tel: +919771090705" className="item">+91-9771090705</a>
                        </div>

                        <div className="col-md-3 services">
                            <div className="item-title">Follow Us on</div>
                            <div className="item socials">
                                <a target="blank" href="https://www.facebook.com/amantradingofficial"><i className="fa fa-facebook-f mr-3"></i></a>
                                <a target="blank" href="https://twitter.com/amantradingco"><i className="fa fa-twitter mr-3"></i></a>
                                <a target="blank" href="#coming-soon"><i className="fa fa-instagram mr-3"></i></a>
                                <a target="blank" href="https://www.linkedin.com/company/aman-trading-co"><i className="fa fa-linkedin mr-3"></i></a>
                                <a target="blank" href="#coming-soon"><i className="fa fa-youtube mr-3"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <div className="text">© 2020 copyrights @ AMAN TRADING COMPANY | Developed by <a className="developer-name" target="blank" href="https://www.linkedin.com/in/aman-raj-46770595/"> Aman </a></div>
                </div>
            </div>
        </>
    )
}

export default Footer;