"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function SalesChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales (INR)",
        data: [12000, 15000, 11000, 18000, 20000, 17000, 22000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        tension: 0.4,
      },
    ],
  };
  return <Line data={data} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />;
}

export function OrdersChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [22, 18, 25, 30, 28, 24, 32],
        borderColor: "#059669",
        backgroundColor: "rgba(5,150,105,0.1)",
        tension: 0.4,
      },
    ],
  };
  return <Line data={data} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />;
}

export function TrafficChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Visitors",
        data: [320, 410, 390, 500, 480, 450, 600],
        borderColor: "#d97706",
        backgroundColor: "rgba(217,119,6,0.1)",
        tension: 0.4,
      },
      {
        label: "Conversions",
        data: [32, 41, 39, 50, 48, 45, 60],
        borderColor: "#be185d",
        backgroundColor: "rgba(190,24,93,0.1)",
        tension: 0.4,
      },
    ],
  };
  return <Line data={data} options={{ plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true } } }} />;
}
