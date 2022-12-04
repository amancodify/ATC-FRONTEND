/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import DealerCard from "./PartyCard";
import CheckboxComp from "../../../components/common/Form/Checkbox";
import { DebounceInput } from "react-debounce-input";
import API_URL from "../../../config";
import { useOnClickOutside } from "./outsideClick";
// import NoDataVector from "../../../assets/no-data.jpg";
import { Facebook } from "react-content-loader";
const MyFacebookLoader = () => <Facebook />;

const Home = () => {
    const [allDealers, setAllDealers] = useState([]);
    const [godownFilters, setGodownFilters] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [damageUserFilter, setDamageUserFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDealersCount, setTotalDealersCount] = useState(0);

    const clickRef = useRef(null);
    useOnClickOutside(clickRef, () => setShowFilters(false));

    const triggerSearch = (searchString, godownFilters, isDamageDealer) => {
        setLoading(true);
        let allFilters = {
            saerchText: searchString,
            godowns: godownFilters,
            isDamageDealer: isDamageDealer,
            page: currentPage,
            size: 20,
        };
        axios
            .post(`${API_URL}/searchatcdealer`, allFilters)
            .then((response) => {
                let { dealers, totalCount } = response.data.data;
                let formattedDealers = [...allDealers, ...dealers];
                setAllDealers(formattedDealers);
                setLoading(false);
                setTotalDealersCount(totalCount);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    useEffect(() => {
        triggerSearch(searchText, godownFilters, damageUserFilter); 
    }, [searchText, godownFilters, damageUserFilter, currentPage]);

    const onTextSearch = (event) => {
        setAllDealers([]);
        let searchValue = event.target.value;
        setSearchText(searchValue);
        setCurrentPage(1);
    };

    const onGodownFilterChangeHandler = (e) => {
        let currentName = e.target.name;
        let currentValue = e.target.checked;
        let godownFiltersCopy = godownFilters;

        if (!currentValue && godownFiltersCopy.includes(currentName)) {
            godownFiltersCopy = godownFiltersCopy.filter((item) => {
                return item !== currentName;
            });
        }

        if (currentValue && !godownFiltersCopy.includes(currentName)) {
            godownFiltersCopy = [...godownFiltersCopy, currentName];
        }

        setGodownFilters(godownFiltersCopy);
        setCurrentPage(1);
        setAllDealers([]);
    };

    const onDamageFilterChangeHandler = (e) => {
        let isDamageDealer = e.target.checked;
        setDamageUserFilter(isDamageDealer);
        setCurrentPage(1);
        setAllDealers([]);
    };

    return (
        <>
            <div className="col-md-12 view-section">
                <div className="searchbox">
                    <DebounceInput
                        value={searchText}
                        minLength={1}
                        debounceTimeout={300}
                        name="searchText"
                        onChange={(event) => onTextSearch(event)}
                        className="searchbox-field"
                        autoComplete="off"
                        placeholder="Search by Party code or Firm name"
                    />
                    {searchText ? (
                        <i
                            onClick={() => {
                                setSearchText("");
                                setCurrentPage(1);
                                setAllDealers([]);
                            }}
                            className="fa fa-times search-icon"
                            aria-hidden="true"
                        ></i>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="details-controller">
                    <div className="dealers-count">
                        Showing {allDealers && allDealers.length} of {totalDealersCount} dealers
                    </div>
                    <div className="filter-main ml-4">
                        <div className="filterby-text" onClick={() => setShowFilters(!showFilters)}>
                            Filters <i className="fa fa-angle-down down-arrow ml-1"></i>
                        </div>
                        {showFilters && (
                            <div className="all-filters-cb-main" ref={clickRef}>
                                {/* <div className="pointer"></div> */}
                                <CheckboxComp
                                    className="filtercb"
                                    text="Siwan"
                                    name="Siwan"
                                    checked={godownFilters.includes("Siwan")}
                                    onChangeHandler={(e) => onGodownFilterChangeHandler(e)}
                                />
                                <CheckboxComp
                                    text="Chapra"
                                    name="Chapra"
                                    checked={godownFilters.includes("Chapra")}
                                    className="filtercb"
                                    onChangeHandler={(e) => onGodownFilterChangeHandler(e)}
                                />
                                <CheckboxComp
                                    text="Gopalganj"
                                    name="Gopalganj"
                                    checked={godownFilters.includes("Gopalganj")}
                                    className="filtercb"
                                    onChangeHandler={(e) => onGodownFilterChangeHandler(e)}
                                />
                                <CheckboxComp
                                    text="Damage Dealer"
                                    name="damage"
                                    checked={damageUserFilter}
                                    className="filtercb"
                                    onChangeHandler={(e) => onDamageFilterChangeHandler(e)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="scroll-section">
                    <>
                        {allDealers && allDealers.length > 0 ? (
                            allDealers.map((data, inx) => {
                                return (
                                    <div key={`Dealer_card${inx}`}>
                                        <DealerCard
                                            firmName={data.firm_name}
                                            OwnerName={data.name}
                                            Mobile={data.mobile}
                                            value={data.total_balance}
                                            imgUrl={data.photo}
                                            partyCode={data.party_code}
                                            dealerArea={data.dealer_area}
                                            isDamageDealer={data.is_damage_dealer || false}
                                            email={data.email}
                                            updatedAt={data.updatedAt}
                                            outstanding={data.outstanding}
                                            createdAt={data.dealer_creation_Date}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                {/* <img className="no-data-vector" src={NoDataVector} alt="" />
                                <div className="no-data-title">No Dealers Found!</div> */}
                            </>
                        )}
                        {totalDealersCount !== allDealers.length ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: "40px",
                                    marginBottom: "40px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                }}
                            >
                                {loading ? (
                                    <div style={{ heigh: "70vh", width: "100%" }}>
                                        <MyFacebookLoader />
                                        <MyFacebookLoader />
                                        <MyFacebookLoader />
                                    </div>
                                ) : (
                                    <span
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="d-flex align-items-center justify-content-center load-more"
                                    >
                                        Load More{" "}
                                        <i
                                            style={{ fontSize: "22px", marginLeft: "10px" }}
                                            class="fa fa-angle-down"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </>
                </div>
            </div>
        </>
    );
};

export default Home;
