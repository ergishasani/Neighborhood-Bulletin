import React from "react";

export default function ActivityStats({ posts = [] }) {
    // Simple stub: show total post count
    const total = posts.length;

    return (
        <div className="activity-stats">
            <p>Total posts: <strong>{total}</strong></p>
        </div>
    );
}
