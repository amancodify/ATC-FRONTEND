import React from "react";
import { photos } from "./photos";
import Footer2 from "../../components/common/Footer2";

const Events = () => {
    return (
        <>
            <div className="events-main header">
                <div className="container">
                    <div className="main-banner-content">
                        <p>
                            Are You <span>Ready</span> To Hunt ?
                        </p>
                        <h1>
                            Latest ATC Events And Activities in <b>2</b>
                            <b>0</b>
                            <b>2</b>
                            <b>0</b>
                        </h1>
                        <div className="place">
                            <i className="fa fa-compass compass-icon" aria-hidden="true"></i> Siwan, Bihar
                        </div>
                    </div>
                </div>
            </div>
            <div className="event-body d-flex">
                <div className="text-section col-md-7 col-sm-12">
                    <div className="grey-title">Sep 24, 2020</div>
                    <div className="main-title">Events, Activities & Culture</div>
                    <div className="text mt-4">
                        Culture is a vital and unique part of every organization. It’s what makes people decide to join
                        a team and is the biggest reason employees choose to stay or leave. <br />
                        <br />
                        Company culture at Aman Trading Company “culture crushes,” and one reason for that level of
                        success is a team dedicated to culture. That team means that a positive culture is on the
                        forefront, setting up fun lunches, events and programs. The company makes sure that there is
                        always an upcoming event so the entire team has something to look forward to, and it uses
                        methods to make sure the entire team works well together by insisting everyone helps keep break
                        areas clean or sending random employees out to lunch together.
                    </div>
                    <a href="/about" className="readmore-btn">{`Read More >>`}</a>
                </div>
                <div className="img-section col-md-5 col-sm-12">
                    <div className="circle-animation"></div>
                    <img
                        className="poster-img"
                        src="https://evnia-react.hibootstrap.com/static/media/about1.d21f485d.jpg"
                        alt=""
                    />
                    <img
                        className="poster-img2"
                        src="https://evnia-react.hibootstrap.com/static/media/about2.01166b2e.jpg"
                        alt=""
                    />
                </div>
            </div>
            {/* <div className="events-img-section">
                <ImageSlider sliderImages={sliderPics} />
            </div> */}
            <div className="spotlight">
                <div className="main-title">Spotlight</div>
                <div className="photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', padding: '20px' }}>
                    {photos.slice(0, 12).map((photo, index) => (
                        <div key={index} style={{ overflow: 'hidden', borderRadius: '8px' }}>
                            <img 
                                src={photo.src} 
                                alt={`Gallery ${index + 1}`}
                                style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer2 />
        </>
    );
};

export default Events;
