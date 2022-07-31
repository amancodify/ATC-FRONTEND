import React, { useState, useEffect } from "react";
import ConsigneeCard from "./consigneeCard";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import API_URL from "../../../config";

const ViewConsignee = () => {
  const [workingData, setWorkingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const triggerSearch = (searchString = "") => {
    let allFilters = {
      saerchText: searchString
    };
    axios
      .post(`${API_URL}/searchconsignee`, allFilters)
      .then((response) => {
        setWorkingData(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    triggerSearch();
  }, []);

  const onTextSearch = (event) => {
    let searchValue = event.target.value;
    triggerSearch(searchValue);
  };

  return (
    <>
      {
        loading &&
        <div className="loading">
          <i className="fa fa-cog fa-spin"></i>
          <span className="ml-3 pb-1">Loading...</span>
        </div>
      }
      <div className="col-md-12 view-section">
        <div className="searchbox">
          <DebounceInput
            minLength={1}
            debounceTimeout={300}
            name="searchText"
            onChange={(event) => onTextSearch(event)}
            className="searchbox-field"
            placeholder="Search by consignee code or firm name"
          />
          <i className="fa fa-search search-icon" aria-hidden="true"></i>
        </div>
        <div className="details-controller">
          <div className="dealers-count">
            Showing {workingData && workingData.length} Consignees
          </div>
        </div>

        <div className="scroll-section">
          <div class="row consg-card-container">
            {workingData && workingData.map((data, inx) => {
              return (
                <div key={`Dealer_card${inx}`}>
                  <ConsigneeCard
                    consigneeData={data}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewConsignee;
