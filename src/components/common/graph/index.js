import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import API_URL from "../../../config";

const GraphDisplay = ({ partyCode }) => {

    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        axios
            .post(`${API_URL}/monthlygraphdata`, { partyCode: partyCode })
            .then((response) => {
                setGraphData(response.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [partyCode]);
    
    let finalGraphData = [["Month", "PPC", "PSC", "LPPC", "OPC"], ...graphData];
    return (
        <>
            <div className="d-flex justify-content-center align-items-center">
                <Chart
                    width={'95%'}
                    height={'300px'}
                    chartType="Bar"
                    loader={<div>Loading Chart...</div>}
                    data={finalGraphData}
                    options={{
                        // Material design options
                        chart: {
                            title: 'Monthly Order Data',
                            subtitle: 'Orders Placed: JAN - DEC for year 2021',
                        },
                    }}
                />
            </div>
        </>
    )
}

export default GraphDisplay;