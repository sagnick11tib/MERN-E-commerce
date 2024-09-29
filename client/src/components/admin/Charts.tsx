import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const months = ["January", "February", "March", "April", "May", "June", "July"];

interface BarChartProps {
  horizontal?: boolean;
  data_1: number[];
  data_2: number[];
  title_1: string;
  title_2: string;
  bgColor_1: string;
  bgColor_2: string;
  labels?: string[];
}

export const BarChart = ({
  data_1 = [],
  data_2 = [],
  title_1,
  title_2,
  bgColor_1,
  bgColor_2,
  horizontal = false,
  labels = months,
}: BarChartProps) => {
  const options: ChartOptions<"bar"> = {
    responsive: true, //means that the chart should resize when the browser does (good for mobile)
    indexAxis: horizontal ? "y" : "x", //if horizontal is true, the chart will be horizontal
    plugins: { //this is where we can customize the chart
      legend: { //this is the legend that shows the labels of the data on the chart ex: Revenue, Transaction
        display: false,
      },
      title: { //this is the title of the chart
        display: false,
      },
    },

    scales: { //this is where we can customize the scales of the chart
      y: { //this is the y-axis
        beginAtZero: true, //this means that the y-axis will start at 0
        grid: { //this is the grid that shows the lines on the chart
          display: false,
        },
      },
      x: { //this is the x-axis
        grid: { //this is the grid that shows the lines on the chart
          display: false,
        },
      },
    },
  };

  const data: ChartData<"bar", number[], string> = {
    labels, //this is the labels of the data on the chart ex: January, February, March ...
    datasets: [ //this is the data that will be displayed on the chart
      {
        label: title_1,//this is the label of the data ex: Revenue or Transaction
        data: data_1,//this is the data that will be displayed on the chart
        backgroundColor: bgColor_1,
        barThickness: "flex", //this is the thickness of the bar on the chart (flex means that it will be flexible)
        barPercentage: 1,
        categoryPercentage: 0.4, //this is the percentage of the category
      },
      {
        label: title_2, //this is the label of the data ex: Revenue or Transaction
        data: data_2, //this is the data that will be displayed on the chart
        backgroundColor: bgColor_2,
        barThickness: "flex",
        barPercentage: 1,
        categoryPercentage: 0.4,
      },
    ],
  };

  return <Bar width={horizontal ? "200%" : ""} options={options} data={data} />;
};

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  cutout?: number | string;
  legends?: boolean;
  offset?: number[];
}

export const DoughnutChart = ({
  labels, //this is the labels of the data on the 
  data, //this is the data that will be displayed on the chart
  backgroundColor,
  cutout,// this is the cutout of the chart (the space in the middle of the chart)
  legends = true, //this is the legends of the chart (the labels of the data on the chart)
  offset, //this is the offset of the chart (the space between the chart and the legends)
}: DoughnutChartProps) => {
  const doughnutData: ChartData<"doughnut", number[], string> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 0,
        offset,
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: legends,
        position: "bottom",
        labels: {
          padding: 40,
        },
      },
    },
    cutout,
  };

  return <Doughnut data={doughnutData} options={doughnutOptions} />;
};

interface PieChartProps {
  labels: string[];
  data: number[];
  backgroundColor: string[];
  offset?: number[];
}
export const PieChart = ({
  labels,
  data,
  backgroundColor,
  offset,
}: PieChartProps) => {
  const pieChartData: ChartData<"pie", number[], string> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 1,
        offset,
      },
    ],
  };

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: { //
        display: false,
      },
    },
  };

  return <Pie data={pieChartData} options={pieChartOptions} />;
};

interface LineChartProps {
  data: number[];
  label: string;
  backgroundColor: string;
  borderColor: string;
  labels?: string[];
}

export const LineChart = ({
  data,
  label,
  backgroundColor,
  borderColor,
  labels = months,
}: LineChartProps) => {
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const lineChartData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        fill: true,
        label,
        data,
        backgroundColor,
        borderColor,
      },
    ],
  };

  return <Line options={options} data={lineChartData} />;
};
