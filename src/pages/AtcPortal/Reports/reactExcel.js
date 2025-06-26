import React from 'react';
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

    return (
        <div>
            <ExcelFile
                element={
                    <div className="d-flex">
                        <img className="excel-img" src="/images/excel-download.png" alt="Download" />
                        <div className="generate-txt">Download Report</div>
                    </div>
                }
                filename="Dealers_Total_Report"
            >
                <ExcelSheet dataSet={atcReportData} name="ATC_Report" />
            </ExcelFile>
        </div>
    );
};

export default ExcelReport;