import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import * as XLSX from 'xlsx';

const OrderChart: React.FC = () => {
  const token = localStorage.getItem('token');
  const [state, setState] = useState<{
    series: { name: string; data: number[] }[];
    categories: string[];
  }>({
    series: [],
    categories: [],
  });

  useEffect(() => {
    // Fetch order data from your backend
    axios.get(import.meta.env.VITE_SERVERHOST+'api/v1/auth/orders/monthly-stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      const data = response.data;

      setState({
        series: [
          {
            name: 'Total Orders',
            data: data.totalOrders, // Array of order counts per month/week
          },
          {
            name: 'Total Revenue',
            data: data.totalRevenue, // Array of revenue values per month/week
          },
        ],
        categories: data.categories, // Array of month/week names
      });
    });
  }, []);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: state.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 4000,
    },
  };

  const exportToExcel = () => {
    const wsData = [
      ['Month/Week', 'Total Orders', 'Total Revenue'],
      ...state.categories.map((category, index) => [
        category,
        state.series[0]?.data[index] || 0,
        state.series[1]?.data[index] || 0,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order Data');

    XLSX.writeFile(wb, 'order_data.xlsx');
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Orders</p>
              <p className="text-sm font-medium">Statistics Overview</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Revenue</p>
              <p className="text-sm font-medium">Statistics Overview</p>
            </div>
          </div>
        </div>
        <button
          onClick={exportToExcel}
          className="mt-2 ml-auto bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Export to Excel
        </button>
      </div>

      <div>
        <div id="orderChart" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderChart;
