import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

const Imagecrousal = ({ title, sliderImages }) => {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        console.log(e);
        setIndex(selectedIndex);
    };

    return (
        <div id="events" className="latest-events-main">
            <div class="event-title">Whats new in ATC ?</div>
            <div class="event-subtitle">{title}</div>
            <Carousel className="crousal-main" activeIndex={index} onSelect={handleSelect} controls={true} pauseOnHover={false}>
                {sliderImages.map((imgUrl, inx) => {
                    return (
                        <Carousel.Item key={`sliderhom_${inx}`}>
                            <img className="d-block w-100 slider-img" src={imgUrl} alt="" />
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Imagecrousal;
