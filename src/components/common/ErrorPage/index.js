import React from "react";

const ErrorPage = () => {
  return (
    <>
      <div className="row mt-5">
        <div className="col-md-12 error-main">
          <img className="err-img" src="/images/error.jpg" alt="" />
          <div className="err-txt bigone">Error 404</div>
          <div className="err-txt">Oops!! Page Not Found</div>
          {/* <marquee behavior="" direction="right" scrollamount="10">
            <img className="cycle-img" src="/images/cycle.gif" alt="" />
          </marquee> */}
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
