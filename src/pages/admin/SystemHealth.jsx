import React from "react";

export default function SystemHealth({ data }) {
    if (!data) return <p>No health data</p>;
    return (
        <div className="health-grid">
            <div><strong>Read Latency:</strong> {data.readLatency} ms</div>
            <div><strong>Write Latency:</strong> {data.writeLatency} ms</div>
            <div><strong>Errors:</strong> {data.errors||0}</div>
        </div>
    );
}
