import React from 'react';
import Header from "./aboutHeader";
import CoreVal from "./coreValues";
import CompDetails from "./compDetails";
import Teams from "./teams";
import Events from "../../components/common/Crousal";
import Footer2 from "../../components/common/Footer2";

var sliderImages = [
  "/images/6.jpg",
  "/images/7.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/1.jpg",
];

const AboutUs =(() => {
  return (
    <>
      <head>
        <title>ATC | About Us</title>
        <meta
          name="description"
          content="The mission of ATC is to become the leading business firm that is synonymous with simple, efficient trade and operations. Every customer dealing with ATC should be left with an experience that reflects our tagline - 'Trade simplified.'"
        />
        <meta
          name="keywords"
          content="Atc, Aman trading company, latest business, latest business in 2020, best cement, best cement business, best business in bihar, atc"
        />
      </head>
      <Header />
      <CompDetails />
      <CoreVal />
      <Teams />
      <Events
        sliderImages = {sliderImages}
      />
      <Footer2 />
    </>
  );
})

export default AboutUs;
