import React, { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
const db = getFirestore();

export default function ActivityFeed() {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        const q = query(collection(db,"activityLogs"), orderBy("timestamp","desc"), limit(20));
        return onSnapshot(q, snap =>
            setEvents(snap.docs.map(d=>d.data()))
        );
    },[]);
    return (
        <ul className="activity-feed-list">
            {events.map((e,i)=>(
                <li key={i}>
                    <code>{new Date(e.timestamp.seconds*1000).toLocaleTimeString()}</code>
                    {" "}{e.action} by <strong>{e.targetUid||e.uid}</strong>
                </li>
            ))}
        </ul>
    );
}
