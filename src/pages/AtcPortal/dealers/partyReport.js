import React from 'react';
import ReactExport from 'react-data-export';
import { convertDate } from '../../../utils/dateConverter';

const PartyReport = ({ allTrans, partyData }) => {
    const { ExcelFile, ExcelSheet } = ReactExport;

    // Common cell style
    const commonStyle = {
        font: { sz: '10', bold: true, color: { rgb: 'FF350C0C' } },
        fill: { patternType: 'solid', fgColor: { rgb: 'FF00FFFF' } },
    };

    // Generate opening balance data
    const generateOpeningBalanceData = (openingBalance) =>
        openingBalance.map((item) => [
            { value: `${item.productcode} Delivered`, style: commonStyle },
            { value: `${item.delivered} mt`, style: commonStyle },
            { value: `${item.productcode} Billed`, style: commonStyle },
            { value: `${item.billed} mt`, style: commonStyle },
        ]);

    // Generate firm details data
    const generateFirmDetails = (partyData) => [
        [{ value: 'Firm Name', style: commonStyle }, { value: partyData.firm_name, style: commonStyle }],
        [{ value: 'Owner', style: commonStyle }, { value: partyData.name, style: commonStyle }],
        [{ value: 'Party Code', style: commonStyle }, { value: partyData.party_code, style: commonStyle }],
    ];

    // Generate summary data (Total Delivered, Billed, Outstanding)
    const generateSummaryData = (totalCount) => [
        [{ value: 'Total Delivered', style: commonStyle }, { value: `${totalCount.totaldelivered.toFixed(2)} mt`, style: commonStyle }],
        [{ value: 'Total Billed', style: commonStyle }, { value: `${totalCount.totalbilled.toFixed(2)} mt`, style: commonStyle }],
        [{ value: 'Total Outstanding', style: commonStyle }, { value: `${totalCount.outstanding.toFixed(2)} mt`, style: commonStyle }],
    ];

    // Generate transaction data
    const generateTransactionData = (allTransactions) => {
        const reportData = [];
        allTransactions.forEach((item) => {
            const totalReturns = item.returns.reduce((acc, data) => {
                acc[data.productcode] = data.quantity || 0;
                return acc;
            }, {});

            item.products.forEach((data) => {
                reportData.push([
                    { value: convertDate(item.transactiondate, 0, true), style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.productcode, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.delivered, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.billed, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: data.mode.value, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: item.vehiclenumber, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: item.consigneefirmname || '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: totalReturns[data.productcode] || 0, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                    { value: item.trans_comment || '', style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                ]);
            });
        });
        return reportData;
    };

    // Generate main report data
    let reportData = [[{ value: '' }]];

    if (partyData.openingbalance) {
        reportData = [
            ...reportData,
            ...generateFirmDetails(partyData),
            [{ value: '' }],
            [{ value: 'Opening Balance', style: commonStyle }],
            ...generateOpeningBalanceData(partyData.openingbalance),
            [{ value: '' }],
        ];
    }

    if (allTrans.totalCount) {
        reportData = [...reportData, ...generateSummaryData(allTrans.totalCount), [{ value: '' }]];
    }

    if (allTrans.allTransactions?.length) {
        reportData = [...reportData, ...generateTransactionData(allTrans.allTransactions)];
    }

    // Define Excel sheet structure
    const atcReportData = [
        {
            columns: [
                { title: 'Date', width: { wpx: 90 }, style: commonStyle },
                { title: 'Product', width: { wpx: 80 }, style: commonStyle },
                { title: 'Delivered', width: { wpx: 80 }, style: commonStyle },
                { title: 'Billed', width: { wpx: 100 }, style: commonStyle },
                { title: 'Mode', width: { wpx: 100 }, style: commonStyle },
                { title: 'Vehicle No', width: { wpx: 100 }, style: commonStyle },
                { title: 'Consignee', width: { wpx: 100 }, style: commonStyle },
                { title: 'Total Return', width: { wpx: 120 }, style: commonStyle },
                { title: 'Comments', width: { wpx: 100 }, style: commonStyle },
            ],
            data: reportData,
        },
    ];

    return (
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
    );
};

export default PartyReport;
