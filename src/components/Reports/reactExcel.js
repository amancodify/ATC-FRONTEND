import React from 'react';
import ReactExport from 'react-data-export';

const ExcelReport = ({ fetchedData }) => {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

    let reportData = [
        [
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
            { value: '' },
        ],
    ];

    fetchedData.forEach((item) => {
        // let { partyCode, firmName, area, ppcAdvance, ppcPending, pscAdvance, pscPending, lppcAdvance, lppcPending, opcAdvance, opcPending, totalAdvance, totalPending, outstanding } = item;
        let { outstanding, partyData, productWiseData, totalAdvance, totalPending } = item;
        let { ppc, psc, lppc, cc, opc } = productWiseData;
        let ccHDPEProductCode = productWiseData["Cc HDPE"];

        reportData.push([
            { value: partyData.party_code, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: partyData.firm_name, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: partyData.dealer_area, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },

            { value: ppc.pending > 0 ? parseFloat(ppc.pending.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: psc.pending > 0 ? parseFloat(psc.pending.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            {
                value: lppc.pending > 0 ? parseFloat(lppc.pending.toFixed(2)) : '',
                style: { font: { sz: '12' }, alignment: { horizontal: 'center' } },
            },
            { value: opc.pending > 0 ? parseFloat(opc.pending.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: cc.pending > 0 ? parseFloat(cc.pending.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: ccHDPEProductCode.pending > 0 ? parseFloat(ccHDPEProductCode.pending.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },


            { value: ppc.advance > 0 ? parseFloat(ppc.advance.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: psc.advance > 0 ? parseFloat(psc.advance.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            {
                value: lppc.advance > 0 ? parseFloat(lppc.advance.toFixed(2)) : '',
                style: { font: { sz: '12' }, alignment: { horizontal: 'center' } },
            },
            { value: opc.advance > 0 ? parseFloat(opc.advance.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: cc.advance > 0 ? parseFloat(cc.advance.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: ccHDPEProductCode.advance > 0 ? parseFloat(ccHDPEProductCode.advance.toFixed(2)) : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },

            { value: parseFloat(totalAdvance.toFixed(2)), style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            { value: parseFloat(totalPending.toFixed(2)), style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            {
                value: parseFloat(outstanding) === 0 ? '' : parseFloat(outstanding.toFixed(2)),
                style: { font: { sz: '12' }, alignment: { horizontal: 'center' } },
            },
        ]);
    });

    const atcReportData = [
        {
            columns: [
                {
                    title: 'Party Code',
                    width: { wpx: 90 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Firm Name',
                    width: { wpx: 200 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Area',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'PPC Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FFFF0000' } },
                    },
                },
                {
                    title: 'PSC Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FFFF0000' } },
                    },
                },
                {
                    title: 'LPPC Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FFFF0000' } },
                    },
                },
                {
                    title: 'OPC Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FFFF0000' } },
                    },
                },
                {
                    title: 'CC Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FFFF0000' } },
                    },
                },
                {
                    title: 'CCHDPE Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FFFF0000' } },
                    },
                },
                {
                    title: 'PPC Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF32CD32' } },
                    },
                },
                {
                    title: 'PSC Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF32CD32' } },
                    },
                },
                {
                    title: 'LPPC Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF32CD32' } },
                    },
                },
                {
                    title: 'OPC Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF32CD32' } },
                    },
                },
                {
                    title: 'CC Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF32CD32' } },
                    },
                },
                {
                    title: 'CCHDPE Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF32CD32' } },
                    },
                },
                {
                    title: 'Total Advance',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Total Pending',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Outstanding',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
            ],
            data: reportData,
        },
    ];

    return (
        <div>
            <ExcelFile
                element={
                    <div className="d-flex">
                        <img className="excel-img" src="images/excel-download.png" alt="" />
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
