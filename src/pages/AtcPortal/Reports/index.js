import React, { useState } from "react";
import ExcelReportComp from "./reactExcel";
import axios from "axios";
import API_URL from "../../../config";
import { convertDate } from "../../../utils/dateConverter";

const AtcReports = () => {
    const [useDateRange, setUseDateRange] = useState(false);
    const [showLink, setShowLink] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [statusText, setStatusText] = useState("No reports generated yet.");
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const generateReport = () => {
        let requestData = {};
        if (useDateRange && fromDate && toDate) {
            requestData = {
                dateFilter: {
                    fromDate: `${convertDate(fromDate)}`,
                    toDate: `${convertDate(toDate)}`,
                },
            };
        }

        setLoading(true);
        setStatusText("Generating report — please wait...");
        axios
            .post(`${API_URL}/generatealldealersreport`, requestData)
            .then((response) => {
                setReportData(response.data);
                setShowLink(true);
                setStatusText("Report generated successfully.");
            })
            .catch((err) => {
                console.error(err);
                setStatusText("Failed to generate report. Try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div
            className="reports-main container py-4"
            style={{ minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: 1100,
                    maxHeight: '92vh',
                    borderRadius: 14,
                    border: '1.5px solid rgba(15, 23, 42, 0.18)',
                    boxShadow: '0 18px 48px rgba(2,6,23,0.12), 0 0 0 6px rgba(79,70,229,0.03)',
                    overflow: 'hidden',
                    background: '#ffffff',
                }}
            >
                <div
                    className="card-body"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', overflow: 'hidden' }}
                >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h4 className="mb-0">Dealer Reports</h4>
                        <div className="text-muted small">Generate consolidated dealer reports</div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <div className="form-check form-switch mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="useDateRange"
                                    checked={useDateRange}
                                    onChange={(e) => setUseDateRange(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="useDateRange">
                                    Filter by custom date range (optional)
                                </label>
                            </div>

                            {useDateRange && (
                                <div className="d-flex flex-wrap gap-2">
                                    <div className="form-group mr-2">
                                        <label className="small text-muted">From</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="small text-muted">To</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-md-5 d-flex justify-content-end">
                            <button
                                className="btn btn-primary"
                                onClick={generateReport}
                                disabled={loading || (useDateRange && (!fromDate || !toDate))}
                                style={{
                                    padding: "0.6rem 1.2rem",
                                    fontSize: "0.95rem",
                                    minWidth: 160,
                                    borderRadius: 8,
                                    background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
                                    border: "none",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Report"
                                )}
                            </button>
                        </div>
                    </div>

                    <hr />

                    <div className="report-result mt-3" style={{ flex: 1, overflow: 'auto' }}>
                        {!showLink ? (
                            <div className="text-center py-4" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <img src="/images/emptydata.gif" alt="no data" style={{ maxWidth: '60%', height: 'auto', maxHeight: 300 }} />
                                <div className="mt-3 text-muted">
                                    {loading ? (
                                        <span>
                                            <i className="fa fa-cog fa-spin" />&nbsp;{statusText}
                                        </span>
                                    ) : (
                                        <span>{statusText}</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center py-4" style={{ width: '100%' }}>
                                <img src="/images/download-report.jpg" alt="report" style={{ maxWidth: 420, width: '45%', height: 'auto' }} />
                                <div className="mt-3 mb-2">{statusText}</div>
                                {reportData && (
                                    <div style={{ marginTop: 12 }}>
                                        <ExcelReportComp fetchedData={reportData} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtcReports;
