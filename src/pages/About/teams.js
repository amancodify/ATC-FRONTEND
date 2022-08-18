import React from 'react';

const team_data = [
    {
        name: 'Sitanshu',
        title: '#TheChillGuy',
        img_url: '/images/sitanshu.jpg',
        designation: 'Senior Manager',
    },
    {
        name: 'Vicky',
        title: '#FunLoving',
        img_url: '/images/vicky.jpg',
        designation: 'Sales-Manager (Chapra)',
    },
    {
        name: 'Vikesh',
        title: '#CheerfulChamp',
        img_url: '/images/vikesh.jpg',
        designation: 'Sales-Manager (Gopalganj)',
    },
    {
        name: 'Rajkumar Tiwari',
        title: '#StylishDude',
        img_url: '/images/tiwari.jpg',
        designation: 'IT Specialist',
    },
    {
        name: 'Yashwant',
        title: '#TechGeek',
        img_url: '/images/yash.jpeg',
        designation: 'Software Handler',
    },
    {
        name: 'Salendar',
        title: '#MrController',
        img_url: '/images/salendar.jpg',
        designation: 'Transport & Payment Manager',
    },
    {
        name: 'H.S Bharti',
        title: '#MrAllRounder',
        img_url: '/images/bharti.jpeg',
        designation: 'Transport & Payment Manager',
    },
    {
        name: 'Sanjay Shri.',
        title: '#DataDragon',
        img_url: '/images/sanjay.jpg',
        designation: 'Data Manager',
    },
];

const Teams = () => {
    return (
        <>
            <div className="teams-main">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-12 title-main">Our Team</div>
                        <div className="col-md-12 ceo-text text-center">Founder & Chairman</div>
                        <div className="col-md-3 col-sm-6 founder-element-main">
                            <div className="our-team">
                                <div className="pic">
                                    <img className="" src="/images/sunil.jpg" alt="" />
                                    <ul className="social">
                                        <a href="https://www.facebook.com/sunil.shrivastav.739">
                                            {' '}
                                            <li className="social-icons-founder facebook fa fa-facebook-f"></li>
                                        </a>
                                        <a href="https://www.linkedin.com/in/aman-raj-46770595/">
                                            {' '}
                                            <li className="social-icons-founder linkedin fa fa-linkedin"></li>
                                        </a>
                                        <a href="mailto:amantrading.company13@gmail.com">
                                            {' '}
                                            <li className="social-icons-founder gmail fa fa-google"></li>
                                        </a>
                                    </ul>
                                </div>
                                <div className="team-content">
                                    <div className="team-info">
                                        <h3 className="founder-title">Sunil Kr. Shrivastava</h3>
                                        <span className="post">CEO @ATC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 founder-element-main">
                            <div className="our-team">
                                <div className="pic">
                                    <img className="" src="/images/pratik.jpeg" alt="" />
                                    <ul className="social">
                                        <a href="https://www.facebook.com/sunil.shrivastav.739">
                                            {' '}
                                            <li className="social-icons-founder facebook fa fa-facebook-f"></li>
                                        </a>
                                        <a href="https://www.linkedin.com/in/aman-raj-46770595/">
                                            {' '}
                                            <li className="social-icons-founder linkedin fa fa-linkedin"></li>
                                        </a>
                                        <a href="mailto:amantrading.company13@gmail.com">
                                            {' '}
                                            <li className="social-icons-founder gmail fa fa-google"></li>
                                        </a>
                                    </ul>
                                </div>
                                <div className="team-content">
                                    <div className="team-info">
                                        <h3 className="founder-title">Pratik Raj</h3>
                                        <span className="post">CO - Founder @ATC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-6">
                            <blockquote className="blockquote blockquote-custom p-5 shadow rounded foundertext-main">
                                <div className="blockquote-custom-icon bg-info shadow-sm"><i className="fa fa-quote-left text-white"></i></div>
                                <p className="mb-0 mt-2 font-italic">
                                    "We at ATC are conserned about Accomplishment Trade and Customer satisfaction,
                                    I believe that success follows those who follow their heart,
                                    the hard work & uncountable no. of hours spent for your business will surely gonna pay you back,
                                    <a href="/#" className="text-info"> @ATC</a> welcomes the hard-nut crackers to our family."
                                </p>
                                <footer className="blockquote-footer pt-4 mt-4 border-top">Sunil Kumar Shrivastava
                                <cite title="Source Title">, Founder & CEO @Aman Trading Company</cite>
                                </footer>
                            </blockquote>
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="col-md-12 ceo-text text-center">Core Team</div>
                        <div className="core-team-main">
                            {team_data.map((data, inx) => {
                                return (
                                    <>
                                        <div className="col-md-2 col-sm-10 coreteam-element-main" key={`teamdata_${inx}`}>
                                            <div className="our-team">
                                                <div className="pic">
                                                    <img src={data.img_url} alt="" />
                                                    <ul className="social">
                                                        <li className="text-white">{data.designation}</li>
                                                    </ul>
                                                </div>
                                                <div className="team-content">
                                                    <div className="team-info">
                                                        <h3 className="title">{data.name}</h3>
                                                        <span className="post">{data.title}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Teams;
