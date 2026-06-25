import React, { useState } from 'react';
import ReactExport from '../../../utils/excelExport';
import { buildExcelReportData } from './reportUtils';

const ExcelReport = ({ fetchedData }) => {
    const { ExcelFile, ExcelFile: { ExcelSheet } } = ReactExport;

    const { columns, data } = buildExcelReportData(fetchedData);

    const atcReportData = [
        {
            columns: columns.map((col) => ({
                ...col,
                style: {
                    alignment: { horizontal: 'center' },
                    font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                    fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                },
            })),
            data,
        },
    ];

    const [isDownloading, setIsDownloading] = useState(false);

    const handleClick = () => {
        setIsDownloading(true);
        // Keep spinner for a short time to indicate action; ExcelFile triggers download immediately.
        setTimeout(() => setIsDownloading(false), 1400);
    };

    return (
        <div>
            <ExcelFile
                element={
                    <button
                        type="button"
                        onClick={handleClick}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0.45rem 0.8rem",
                            background: "linear-gradient(90deg,#16a34a,#06b6d4)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            boxShadow: "0 6px 18px rgba(6,182,212,0.12)",
                        }}
                    >
                        <img src="/images/excel-download.png" alt="Download" style={{ width: 18, height: 18, objectFit: "contain" }} />
                        <span style={{ fontWeight: 600 }}>{isDownloading ? 'Preparing...' : 'Download Report'}</span>
                        {isDownloading && (
                            <span className="ml-2" style={{ marginLeft: 8 }}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: 16, height: 16 }}></span>
                            </span>
                        )}
                    </button>
                }
                filename="Dealers_Total_Report"
            >
                <ExcelSheet dataSet={atcReportData} name="ATC_REPORT" />
            </ExcelFile>
        </div>
    );
};

export default ExcelReport;