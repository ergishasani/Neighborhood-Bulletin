// src/components/GroupsAndEvents.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserByUid, getPostById } from "../firebase/firestore";
import { db } from "../firebase/config";             // your initialized Firestore
import { doc, getDoc } from "firebase/firestore";
import Loader from "./Loader";
import PostCard from "./PostCard";
import "../styles/components/_groupsAndEvents.scss";

export default function GroupsAndEvents({ userId }) {
    const [groups, setGroups]   = useState([]);
    const [events, setEvents]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            setLoading(true);
            setError("");
            try {
                // 1) fetch the user doc
                const uRes = await getUserByUid(userId);
                if (!uRes.success) throw new Error(uRes.error || "Failed to load user");
                const { groups: groupIds = [], eventsJoined = [] } = uRes.data;

                // 2) fetch groups
                const grpPromises = groupIds.map((gid) =>
                    getDoc(doc(db, "groups", gid)).then((snap) =>
                        snap.exists() ? { id: snap.id, ...snap.data() } : null
                    )
                );
                const grpData = (await Promise.all(grpPromises)).filter(Boolean);

                // 3) fetch each joined event
                const evtPromises = eventsJoined.map((pid) =>
                    getPostById(pid).then((r) => (r.success ? r.data : null))
                );
                const evtData = (await Promise.all(evtPromises)).filter(Boolean);

                if (!cancelled) {
                    setGroups(grpData);
                    setEvents(evtData);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadData();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (loading) return <Loader />;
    if (error)   return <div className="error-message">{error}</div>;

    return (
        <div className="groups-events">
            {/* Groups Section */}
            <section className="groups-section">
                <h3>Joined Groups</h3>
                {groups.length > 0 ? (
                    <ul className="groups-list">
                        {groups.map((g) => (
                            <li key={g.id}>
                                <Link to={`/groups/${g.id}`} className="group-link">
                                    {g.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-groups">You haven't joined any groups.</p>
                )}
            </section>

            {/* Events Section */}
            <section className="events-section">
                <h3>Joined Events</h3>
                {events.length > 0 ? (
                    <div className="events-grid">
                        {events.map((evt) => (
                            <PostCard key={evt.id} post={evt} />
                        ))}
                    </div>
                ) : (
                    <p className="no-events">You haven't joined any events.</p>
                )}
            </section>
        </div>
    );
}
