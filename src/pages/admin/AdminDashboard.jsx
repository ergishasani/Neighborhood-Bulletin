// src/pages/admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import {
    getPosts,
    getUsers,
    getReports,
    toggleUserRole,
    deletePost,
    fetchAuditLogs,
    fetchSystemHealth,
} from "../../firebase/firestore";

import PostsOverTimeChart    from "./PostsOverTimeChart";
import CategoryDoughnutChart from "./CategoryDoughnutChart";
import CommentsBarChart      from "./CommentsBarChart";
import LeafletMap            from "./LeafletMap";


import "../../styles/pages/_adminDashboard.scss";

export default function AdminDashboard() {
    const [stats, setStats]               = useState({ users: 0, posts: 0, comments: 0, reports: 0 });
    const [recentUsers, setRecentUsers]   = useState([]);
    const [flaggedPosts, setFlaggedPosts] = useState([]);

    const [loading, setLoading]           = useState(true);

    useEffect(() => {
        async function loadAll() {
            setLoading(true);
            try {
                const [pRes, uRes, rRes, logsRes, healthRes] = await Promise.all([
                    getPosts({ limitCount: 0 }),
                    getUsers(),
                    getReports(),
                    fetchAuditLogs(),
                    fetchSystemHealth(),
                ]);

                setStats({
                    users:    uRes.data.length,
                    posts:    pRes.data.length,
                    comments: pRes.data.reduce((sum, p) => sum + (p.commentCount || 0), 0),
                    reports:  rRes.data.length,
                });

                setRecentUsers(
                    uRes.data
                        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                        .slice(0, 10)
                );

                setFlaggedPosts(rRes.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadAll();
    }, []);

    const handleToggleAdmin = async (uid, isAdmin) => {
        await toggleUserRole(uid, !isAdmin);
        setRecentUsers(us => us.map(u => u.uid === uid ? { ...u, admin: !isAdmin } : u));
    };

    const handleDeleteFlagged = async (postId) => {
        await deletePost(postId);
        setFlaggedPosts(fs => fs.filter(r => r.postId !== postId));
    };

    const handleDismissFlagged = (postId) => {
        setFlaggedPosts(fs => fs.filter(r => r.postId !== postId));
    };

    if (loading) return <div className="admin-dashboard--loading">Loading…</div>;

    return (
        <div className="admin-dashboard">

            {/* 1) Top metrics */}
            <section className="metrics-cards">
                {["Users","Posts","Comments","Reports"].map((label, i) => {
                    const key = ["users","posts","comments","reports"][i];
                    return (
                        <div key={key} className={`card ${key}`}>
                            <h4>Total {label}</h4>
                            <p>{stats[key]}</p>
                        </div>
                    );
                })}
            </section>

            {/* 2) Charts */}
            <section className="charts-grid">
                <div className="chart-card"><PostsOverTimeChart /></div>
                <div className="chart-card"><CategoryDoughnutChart /></div>
                <div className="chart-card"><CommentsBarChart /></div>
            </section>

            {/* 3) Geo map */}
            <section className="geo-map">
                <h3>Posts by Location</h3>
                <LeafletMap />
            </section>

        </div>
    );
}
