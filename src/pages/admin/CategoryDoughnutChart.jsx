import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { getPosts } from "../../firebase/firestore";

// Register only once
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryDoughnutChart() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const res = await getPosts({ limitCount: 1000 });
            if (!res.success) return;
            const counts = {};
            res.data.forEach(p => {
                counts[p.category] = (counts[p.category] || 0) + 1;
            });
            const labels = Object.keys(counts);
            setData({
                labels,
                datasets: [{
                    data: labels.map(l => counts[l]),
                    backgroundColor: ["#4361ee", "#4895ef", "#4cc9f0", "#e74c3c"]
                }]
            });
        }
        load();
    }, []);

    if (!data) return <p>Loading chart…</p>;
    return (
        <div className="chart-card">
            <h3>By Category</h3>
            <Doughnut data={data} redraw />
        </div>
    );
}
