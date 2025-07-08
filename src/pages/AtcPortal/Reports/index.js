import React, { useState } from "react";
import ExcelReportComp from "./reactExcel";
import axios from "axios";
import API_URL from "../../../config";
import { convertDate } from "../../../utils/dateConverter";

const AtcReports = () => {
    const [showLink, setShowLink] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [statusText, setStatusText] = useState("No Reports Generated !!");
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();

    const generateReport = () => {
        let requestData = {};
        if (fromDate && toDate) {
            requestData = {
                dateFilter: {
                    fromDate: `${convertDate(fromDate)}`,
                    toDate: `${convertDate(toDate)}`,
                },
            };
        }
        setStatusText("Generating report please wait...");
        axios
            .post(`${API_URL}/generatealldealersreport`, requestData)
            .then((response) => {
                setReportData(response.data);
                setShowLink(true);
                setStatusText("Report has been Generated !!");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="reports-main">
                <div className="row">
                    <div className="col-md-12 my-4 d-flex">
                        <input
                            onChange={(e) => setFromDate(e.target.value)}
                            type="date"
                            className="mr-3"
                        />
                        <input
                            onChange={(e) => setToDate(e.target.value)}
                            type="date"
                        />
                        <div onClick={() => generateReport()} className="generate-txt">
                            Generate Report
                        </div>
                    </div>
                    {!showLink && (
                        <div className="col-md-12 d-flex align-items-center justify-content-center report-link-main">
                            <img className="empty-img" src="/images/emptydata.gif" alt="" />
                            <div className="empty-text mb-3">
                                {statusText === "Generating report please wait..." ? (
                                    <i className="fa fa-cog fa-spin"></i>
                                ) : (
                                    ""
                                )}
                                &nbsp;&nbsp;{statusText}
                            </div>
                        </div>
                    )}
                    {showLink && (
                        <div className="col-md-12 report-link-main">
                            <img className="report-img" src="/images/download-report.jpg" alt="" />
                            <div className="text mb-3">{statusText}</div>
                            {reportData && <ExcelReportComp fetchedData={reportData} />}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AtcReports;
