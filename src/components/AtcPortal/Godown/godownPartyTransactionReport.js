import React from 'react';
import ReactExport from 'react-data-export';
import { convertDate } from '../../../utils/dateConverter';

const GodownPartyTransReport = ({ godownData, transactionData }) => {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

    let reportData = [];

    if (godownData) {
        reportData.push(
            [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
            [
                {
                    value: 'Godown Code',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${godownData.godowncode}`,
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [
                {
                    value: 'Godown Name',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${godownData.godownname}`,
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [
                {
                    value: 'Godown Location',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${godownData.godownlocation}`,
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [{ value: '' }]
        );
    }

    if (transactionData && transactionData.length > 0) {
        transactionData.map((item) => {
            let dataToPush = [
                { value: convertDate(item.transactiondate, 0, true), style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.productdetails.productname, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.quantity, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.partycode, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.userdetails.firm_name, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.producttype, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.transactiontype, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.transactiondata.vehiclenumber, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
            ];
            reportData.push(dataToPush);
            return true;
        });
    }

    const atcReportData = [
        {
            columns: [
                {
                    title: 'Date',
                    width: { wpx: 90 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Product',
                    width: { wpx: 80 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Quantity',
                    width: { wpx: 80 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Party Code',
                    width: { wpx: 100 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Firm Name',
                    width: { wpx: 100 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Product Type',
                    width: { wpx: 150 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Transaction Type',
                    width: { wpx: 150 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Vehicle Number',
                    width: { wpx: 150 },
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
        <ExcelFile
            element={
                <div className="d-flex align-items-center cursor-pointer">
                    <i className="print-pdf-icon fa fa-download mr-2" aria-hidden="true"></i>
                    <span className="report-title">
                        <u>Download Godown Party Transactions Report</u>
                    </span>
                </div>
            }
            filename={`Godown Party Transactions - ${godownData.godownname}`}
        >
            <ExcelSheet dataSet={atcReportData} name="ATC_Godown_Party_Trans_Report" />
        </ExcelFile>
    );
};

export default GodownPartyTransReport;
