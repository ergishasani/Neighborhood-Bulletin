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
    Legend
} from "chart.js";
import { getPosts } from "../../firebase/firestore";

// Register only once
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PostsOverTimeChart() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const res = await getPosts({ limitCount: 1000 });
            if (!res.success) return;
            const counts = {};
            res.data.forEach(p => {
                const d = new Date(p.createdAt.seconds * 1000).toLocaleDateString();
                counts[d] = (counts[d] || 0) + 1;
            });
            const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
            setData({
                labels,
                datasets: [{
                    label: "Posts",
                    data: labels.map(d => counts[d]),
                    borderColor: "#4361ee",
                    backgroundColor: "rgba(67,97,238,0.3)",
                }]
            });
        }
        load();
    }, []);

    if (!data) return <p>Loading chart…</p>;
    return (
        <div className="chart-card">
            <h3>Posts Over Time</h3>
            <Line data={data} redraw />
        </div>
    );
}
