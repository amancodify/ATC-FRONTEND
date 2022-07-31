import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactExport from 'react-data-export';
import API_URL from '../../../config';
import { convertDate } from '../../../utils/dateConverter';

const RefillTransReport = ({ godownCode }) => {
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const [godownData, setGodownData] = useState({});
    const [allTrans, setAllTrans] = useState({});

    useEffect(() => {
        axios
            .get(`${API_URL}//godowns/refilltransactions/${godownCode}`)
            .then((response) => {
                setAllTrans(response.data.data);
                setGodownData(response.data.data[0].godowndetails);
                console.log(response.data.data[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [godownCode]);

    let reportData = [];

    if (godownData) {
        reportData.push(
            [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
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

    if (allTrans && allTrans.length > 0) {
        allTrans.map((item) => {
            let dataToPush = [
                { value: convertDate(item.refilldate, 0, true), style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.productdetails.productname, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.fresh, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.damage, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
                { value: item.refillmode, style: { font: { sz: '12' }, alignment: { horizontal: 'center' } } },
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
                    title: 'Fresh',
                    width: { wpx: 80 },
                    style: {
                        alignment: { horizontal: 'center' },
                        font: { sz: '14', bold: true, color: { rgb: 'FFFFFFFF' } },
                        fill: { patternType: 'solid', fgColor: { rgb: 'FF303030' } },
                    },
                },
                {
                    title: 'Damage',
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
                        <u>Download Refill Transactions Report</u>
                    </span>
                </div>
            }
            filename={`Refill Transactions - ${godownData.godownname}`}
        >
            <ExcelSheet dataSet={atcReportData} name="ATC_Refill_Godown_Report" />
        </ExcelFile>
    );
};

export default RefillTransReport;
