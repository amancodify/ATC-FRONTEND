import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactExport from 'react-data-export';
import API_URL from '../../../config';
import { convertDate } from '../../../utils/dateConverter';

const PartyReport = ({ partyCode }) => {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const [partyData, setPartyData] = useState({});
    const [allTrans, setAllTrans] = useState({});

    useEffect(() => {
        axios
            .get(`${API_URL}/dealers/${partyCode}`)
            .then((response) => {
                setPartyData(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .get(`${API_URL}/partyalltransactions/${partyCode}`)
            .then((response) => {
                setAllTrans(response.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [partyCode]);

    // For border add this style below
    // border: {top: { style: "thin", color: "FF00FFFF" }, left: { style: "thin", color: "FF00FFFF" }, right: { style: "thin", color: "FF00FFFF" }, bottom: { style: "thin", color: "FF00FFFF" }}

    let reportData = [];

    if (partyData.openingbalance) {
        let openingBalData = partyData.openingbalance.map((item) => {
            let result = [];
            result.push(
                {
                    value: `${item.productcode} Delivered`,
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: item.delivered + ' mt',
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${item.productcode} Billed`,
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: item.billed + ' mt',
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                }
            );
            return result;
        });

        reportData = [
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
            ],
            [
                {
                    value: 'Firm Name',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: partyData.firm_name,
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [
                {
                    value: 'Owner',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: partyData.name,
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [
                {
                    value: 'Party Code',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: partyData.party_code,
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [{ value: '' }],
            [
                {
                    value: 'Opening Balance',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FFD60056' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            ...openingBalData,
            [{ value: '' }],
        ];
    }

    if (allTrans.totalCount) {
        reportData.push(
            [
                {
                    value: 'Total Delivered',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${allTrans.totalCount.totaldelivered.toFixed(2)} mt`,
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [
                {
                    value: 'Total Billed',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${allTrans.totalCount.totalbilled.toFixed(2)} mt`,
                    style: {
                        alignment: { horizontal: 'left' },
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
            ],
            [
                {
                    value: 'Total Outstanding',
                    style: {
                        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
                    },
                },
                {
                    value: `${allTrans.totalCount.outstanding.toFixed(2)} mt`,
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

    if (allTrans.allTransactions && allTrans.allTransactions.length > 0) {
        allTrans.allTransactions.map((item) => {
            let totalReturns = {};
            item.returns.map((data) => {
                return (totalReturns[`${data.productcode}`] = data.quantity);
            });

            item.products.map((data) => {
                let returnValue = totalReturns[data.productcode] ? totalReturns[data.productcode] : 0;
                let dataToPush = [
                    { value: convertDate(item.transactiondate, 0, true), style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.productcode, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.delivered, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.billed, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.mode.value, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: item.vehiclenumber, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: item.consigneename ? item.consigneename : '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: returnValue, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: item.trans_comment || '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                ];
                reportData.push(dataToPush);
                return true;
            });
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
                    title: 'Delivered',
                    width: { wpx: 80 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Billed',
                    width: { wpx: 100 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Mode',
                    width: { wpx: 100 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Vehicle No',
                    width: { wpx: 100 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Consignee',
                    width: { wpx: 100 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Total Return',
                    width: { wpx: 120 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Comments',
                    width: { wpx: 100 },
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
        <>
            <div>
                <ExcelFile
                    element={
                        <div className="d-flex align-items-center cursor-pointer">
                            <i className="print-pdf-icon fa fa-download mr-2" aria-hidden="true"></i>
                            <span className="report-title">
                                <u>Download Party Transactions Report</u>
                            </span>
                        </div>
                    }
                    filename={`PartyReport_${partyData.firm_name}_${partyData.party_code}`}
                >
                    <ExcelSheet dataSet={atcReportData} name="ATC_Report" />
                </ExcelFile>
            </div>
        </>
    );
};

export default PartyReport;
