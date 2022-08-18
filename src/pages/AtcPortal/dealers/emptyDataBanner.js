import React from "react";

const EmptyDataBanner = () => {
    return (
        <>
            <div className="row emptydatabanner-main">
                <div className="col-md-12 container-main">
                    <img className="banner" src="https://cdn.dribbble.com/users/3349387/screenshots/8249095/222222.gif" alt="" />
                    <span>No Transactions Yet !!</span> 
                </div>
            </div>
        </>
    )
}

export default EmptyDataBanner;