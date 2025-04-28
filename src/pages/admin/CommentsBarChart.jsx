import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { getPosts, getComments } from "../../firebase/firestore";

// Register only once
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CommentsBarChart() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const pRes = await getPosts({ limitCount: 1000 });
            if (!pRes.success) return;
            const counts = {};
            // tally comments per day across all posts
            await Promise.all(pRes.data.map(async (p) => {
                const cRes = await getComments(p.id);
                if (!cRes.success) return;
                cRes.data.forEach(c => {
                    const d = new Date(c.createdAt.seconds * 1000).toLocaleDateString();
                    counts[d] = (counts[d] || 0) + 1;
                });
            }));
            const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
            setData({
                labels,
                datasets: [{
                    label: "Comments",
                    data: labels.map(l => counts[l]),
                    backgroundColor: "#f8961e"
                }]
            });
        }
        load();
    }, []);

    if (!data) return <p>Loading chart…</p>;
    return (
        <div className="chart-card">
            <h3>Comments／Day</h3>
            <Bar data={data} redraw />
        </div>
    );
}
