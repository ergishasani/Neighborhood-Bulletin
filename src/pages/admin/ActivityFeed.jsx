// src/pages/admin/ActivityFeed.jsx
import React, { useEffect, useState } from "react";
import {
    onSnapshot,
    collection,
    query,
    orderBy,
    limit,
    getFirestore,
} from "firebase/firestore";

const db = getFirestore();



export default function ActivityFeed() {
    const [events, setEvents]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        const q = query(
            collection(db, "activityLogs"),
            orderBy("timestamp", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const list = snap.docs.map((d) => d.data());
                setEvents(list);
                setLoading(false);
            },
            (err) => {
                console.error("ActivityFeed snapshot error:", err);
                setError("Failed to load activity.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const parseTime = (ts) => {
        if (!ts) return "";
        const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
        return isNaN(d) ? "" : d.toLocaleTimeString();
    };

    if (loading) {
        return <div className="activity-feed-loading">Loading activity…</div>;
    }
    if (error) {
        return <div className="activity-feed-error">{error}</div>;
    }
    if (events.length === 0) {
        return <div className="activity-feed-empty">No recent activity.</div>;
    }

    return (
        <ul className="activity-feed-list">
            {events.map((e, i) => (
                <li key={i}>
                    <code>{parseTime(e.timestamp)}</code>{" "}
                    {e.action} by <strong>{e.targetUid || e.uid || "Unknown"}</strong>
                </li>
            ))}
        </ul>
    );
}
