import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";

const MyCharts = (allData) => {
  const [averageTemp, setAverageTemp] = useState([]);
  const [date, setDate] = useState([]);
  
  useEffect(() => {
    let data = allData.data;
    if (data.length > 0) {
      setAverageTemp(data?.map((item) => item.points));
      setDate(data?.map((item) => item.objectID));
    }
  },[allData]);

 const series = [ //data on the y-axis
    {
      name: "Votes",
      data: averageTemp
    }
  ];
  const options = { //data on the x-axis
  chart: { id: 'bar-chart',zoom: {
    enabled: false
  }},
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  xaxis: {
    categories: date
  }
}
return (
    <div>
  
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        className="mt-5 pt-5"
        height="300px"
      />
    </div>
  )
}
export default MyCharts;