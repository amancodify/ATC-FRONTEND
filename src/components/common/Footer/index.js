import React from 'react';

function Footer() {
  return (
    <div className="footer-main text-center pt-5">
      <div className="footer-submain">
        <div className="row">
          <div className="social-group text-left">
            <a className="mx-2" target="blank" href="https://www.facebook.com/amantradingofficial"><span><i className="fa fa-lg fa-facebook-square social-btn" aria-hidden="true"></i></span></a>
            <a className="mx-2" target="blank" href="https://www.linkedin.com/company/aman-trading-co"><span><i className="fa fa-lg fa-linkedin social-btn" aria-hidden="true"></i></span></a>
            <a className="mx-2" target="blank" href="https://www.twitter.com/amantradingco"><span><i className="fa fa-lg fa-twitter-square social-btn" aria-hidden="true"></i></span></a>
            <div className="pt-3 pl-2 pp-tac">Privacy Policy | Terms and Condition</div>
            <div className="pt-1 pl-2 copyright-txt">© Aman Trading Comp. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
