import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../../config";

const GODOWN_BANNERS = {
    "Siwan": "/images/siwan_godown.png",
    "Chapra": "/images/chapra_godown.png",
    "Gopalganj": "/images/godown-blank.png"
}


const Godown = (() => {
    const [allGodowons, setAllGodowns] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/godowns`)
            .then(response => {
                setAllGodowns(response.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <>
            <div className="col-md-12">
                <div className="row godown-main">
                    {
                        allGodowons.length > 0 && allGodowons.map((item, inx) => {
                            return (
                                <div className="col-md-4 submain-img" key={`godown_${inx}`}>
                                    <a className="banner-container text-align-center" href={`viewgodown/${item.godowncode}`}>
                                        <img className="godown-img" src={GODOWN_BANNERS[item.godownlocation]} alt="" />
                                        <span>{item.godownname}</span>
                                    </a>
                                </div>
                            )
                        })

                    }
                </div>
            </div>
        </>
    )
});

export default Godown;