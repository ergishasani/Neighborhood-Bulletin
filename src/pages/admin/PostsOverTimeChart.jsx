// src/pages/admin/PostsOverTimeChart.jsx

import React, { useEffect, useState } from "react";
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
import { getPosts } from "../../firebase/firestore";

// register once
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function PostsOverTimeChart() {
    const [chartData, setChartData] = useState(null);
    const [error, setError]         = useState(null);

    // helper to normalize timestamp
    function toDate(ts) {
        if (!ts) return null;
        if (ts.toDate) return ts.toDate();
        if (ts.seconds) return new Date(ts.seconds * 1000);
        if (ts instanceof Date) return ts;
        return new Date(ts);
    }

    useEffect(() => {
        let cancelled = false;
        async function loadData() {
            try {
                const res = await getPosts({ limitCount: 1000 });
                if (!res.success) throw new Error(res.error || "Failed to load posts");
                // count per day
                const counts = {};
                res.data.forEach((p) => {
                    const dObj = toDate(p.createdAt);
                    if (!dObj) return;
                    const day = dObj.toISOString().slice(0, 10); // YYYY-MM-DD
                    counts[day] = (counts[day] || 0) + 1;
                });
                const labels = Object.keys(counts).sort();
                const data = {
                    labels,
                    datasets: [
                        {
                            label: "Posts",
                            data: labels.map((day) => counts[day]),
                            borderColor: "var(--primary-color)",
                            backgroundColor: "var(--primary-light)",
                            tension: 0.3,
                            fill: true,
                        },
                    ],
                };
                if (!cancelled) setChartData(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError(err.message);
            }
        }
        loadData();
        return () => {
            cancelled = true;
        };
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                title: { display: true, text: "Date" },
            },
            y: {
                title: { display: true, text: "Number of Posts" },
                beginAtZero: true,
            },
        },
    };

    if (error) return <p className="chart-error">Error: {error}</p>;
    if (!chartData) return <p className="chart-loading">Loading chart…</p>;

    return (
        <div className="chart-card posts-over-time-chart">
            <h3>Posts Over Time</h3>
            <div className="chart-wrapper">
                <Line data={chartData} options={options} redraw />
            </div>
        </div>
    );
}
