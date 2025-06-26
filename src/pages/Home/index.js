import Bangur from './bangur';
import WhatWeDo from './whatwedo';
import Header from './header';
import Career from './Career';
import FQ from './FQ';
import Achievement from '../Home/achievement';
import Footer2 from "../../components/common/Footer2";
import WhyLoveAtc from './whyloveatc';

function Home() {
    return (
        <>
            <head>
                <title>ATC | Aman Trading Company</title>
                <meta
                    name="description"
                    content="The mission of ATC is to become the leading business firm that is synonymous with simple, efficient trade and operations. Every customer dealing with ATC should be left with an experience that reflects our tagline - 'Trade simplified.'"
                />
                <meta
                    name="keywords"
                    content="Atc, Aman trading company, latest business, latest business in 2020, best cement, best cement business, best business in bihar, atc"
                />
            </head>
            <div className="remove-overflow">
                <Header />
                <WhatWeDo />
                <WhyLoveAtc />
                <Achievement />
                <Bangur />
                <FQ />
                <Career />
            </div>
            <Footer2 />
        </>
    );
}

export default Home;
