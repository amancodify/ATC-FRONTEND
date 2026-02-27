import React, { useState } from 'react';
import ReactExport from '../../../utils/excelExport';

const ExcelReport = ({ fetchedData }) => {
    const { ExcelFile, ExcelFile: { ExcelSheet } } = ReactExport;

    const getCellValue = (value) => (value > 0 ? parseFloat(value.toFixed(2)) : '');
    
    const reportData = fetchedData.map((item) => {
        const { outstanding, partyData, productWiseData, totalAdvance, totalPending } = item;
        const { ppc, psc, lppc, cc, opc, marble } = productWiseData;
        const ccHDPEProductCode = productWiseData['Cc HDPE'];

        return [
            { value: partyData.party_code },
            { value: partyData.firm_name },
            { value: partyData.dealer_area },
            { value: getCellValue(ppc.pending) },
            { value: getCellValue(psc.pending) },
            { value: getCellValue(lppc.pending) },
            { value: getCellValue(opc.pending) },
            { value: getCellValue(cc.pending) },
            { value: getCellValue(marble.pending) },
            { value: getCellValue(ccHDPEProductCode.pending) },
            { value: getCellValue(ppc.advance) },
            { value: getCellValue(psc.advance) },
            { value: getCellValue(lppc.advance) },
            { value: getCellValue(opc.advance) },
            { value: getCellValue(cc.advance) },
            { value: getCellValue(marble.advance) },
            { value: getCellValue(ccHDPEProductCode.advance) },
            { value: parseFloat(totalAdvance.toFixed(2)) },
            { value: parseFloat(totalPending.toFixed(2)) },
            { value: parseFloat(outstanding) === 0 ? '' : parseFloat(outstanding.toFixed(2)) },
        ].map((cell) => ({ ...cell, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } }));
    });

    const atcReportData = [
        {
            columns: [
                { title: 'Party Code', width: { wpx: 90 } },
                { title: 'Firm Name', width: { wpx: 200 } },
                { title: 'Area', width: { wpx: 120 } },
                { title: 'PPC Pending', width: { wpx: 120 } },
                { title: 'PSC Pending', width: { wpx: 120 } },
                { title: 'LPPC Pending', width: { wpx: 120 } },
                { title: 'OPC Pending', width: { wpx: 120 } },
                { title: 'CC Pending', width: { wpx: 120 } },
                { title: 'Marble Pending', width: { wpx: 120 } },
                { title: 'CCHDPE Pending', width: { wpx: 120 } },
                { title: 'PPC Advance', width: { wpx: 120 } },
                { title: 'PSC Advance', width: { wpx: 120 } },
                { title: 'LPPC Advance', width: { wpx: 120 } },
                { title: 'OPC Advance', width: { wpx: 120 } },
                { title: 'CC Advance', width: { wpx: 120 } },
                { title: 'Marble Advance', width: { wpx: 120 } },
                { title: 'CCHDPE Advance', width: { wpx: 120 } },
                { title: 'Total Advance', width: { wpx: 120 } },
                { title: 'Total Pending', width: { wpx: 120 } },
                { title: 'Outstanding', width: { wpx: 120 } },
            ].map((col) => ({
                ...col,
                style: {
                    alignment: { horizontal: 'center' },
                    font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                    fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                },
            })),
            data: reportData,
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