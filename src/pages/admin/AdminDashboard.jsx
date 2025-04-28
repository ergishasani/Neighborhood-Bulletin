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

import PostsOverTimeChart    from "../../pages/admin/PostsOverTimeChart";
import CategoryDoughnutChart from "../../pages/admin/CategoryDoughnutChart";
import CommentsBarChart      from "../../pages/admin/CommentsBarChart";
import LeafletMap            from "../../pages/admin/LeafletMap";
import ActivityFeed          from "../../pages/admin/ActivityFeed";
import SystemHealth          from "../../pages/admin/SystemHealth";
import AuditLogTable         from "../../pages/admin/AuditLogTable";

import "../../styles/pages/_adminDashboard.scss";

export default function AdminDashboard() {
  const [stats, setStats]             = useState({ users:0, posts:0, comments:0, reports:0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [auditLogs, setAuditLogs]     = useState([]);
  const [health, setHealth]           = useState(null);
  const [loading, setLoading]         = useState(true);

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
          users:   uRes.data.length,
          posts:   pRes.data.length,
          comments: pRes.data.reduce((sum,p)=>sum+(p.commentCount||0),0),
          reports: rRes.data.length,
        });

        setRecentUsers(
            uRes.data
                .sort((a,b)=>b.createdAt?.seconds - a.createdAt?.seconds)
                .slice(0,10)
        );

        setFlaggedPosts(rRes.data);
        setAuditLogs(logsRes.data);
        setHealth(healthRes.data);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const handleToggleAdmin = async (uid, isAdmin) => {
    await toggleUserRole(uid, !isAdmin);
    setRecentUsers(us => us.map(u=>u.uid===uid?{...u,admin:!isAdmin}:u));
  };

  const handleDeleteFlagged = async (postId) => {
    await deletePost(postId);
    setFlaggedPosts(fs => fs.filter(r=>r.postId!==postId));
  };

  if (loading) return <div className="admin-dashboard--loading">Loading…</div>;

  return (
      <div className="admin-dashboard">
        {/* 1) Top metrics */}
        <section className="metrics-cards">
          {["Users","Posts","Comments","Reports"].map((label,i)=>{
            const keys = ["users","posts","comments","reports"];
            return (
                <div key={label} className={`card ${keys[i]}`}>
                  <h4>Total {label}</h4>
                  <p>{stats[keys[i]]}</p>
                </div>
            );
          })}
        </section>

        {/* 2,3,4) Charts */}
        <section className="charts-grid">
          <PostsOverTimeChart />
          <CategoryDoughnutChart />
          <CommentsBarChart />
        </section>

        {/* 5) Geo map */}
        <section className="geo-map">
          <h3>Posts by Location</h3>
          <LeafletMap />
        </section>

        {/* 6) Flagged content */}
        <section className="flagged-list">
          <h3>Flagged Content</h3>
          <ul>
            {flaggedPosts.map(r => (
                <li key={r.id}>
                  <strong>{r.postTitle}</strong> ({r.reason})
                  <button onClick={()=>handleDeleteFlagged(r.postId)}>Delete</button>
                  <button>Dismiss</button>
                </li>
            ))}
          </ul>
        </section>

        {/* 7,8) Recent users & role management */}
        <section className="recent-users">
          <h3>Recent Sign-Ups</h3>
          <table>
            <thead>
            <tr>
              <th>Avatar</th><th>Name</th><th>Email</th><th>Joined</th><th>Role</th>
            </tr>
            </thead>
            <tbody>
            {recentUsers.map(u=>(
                <tr key={u.uid}>
                  <td><img src={u.photoURL||"/default-avatar.png"} alt="" /></td>
                  <td>{u.displayName}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt.seconds*1000).toLocaleDateString()}</td>
                  <td>
                    <button
                        className={u.admin?"btn-admin":"btn-user"}
                        onClick={()=>handleToggleAdmin(u.uid, u.admin)}
                    >
                      {u.admin?"Admin":"User"}
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>

        {/* 9) Activity feed */}
        <section className="activity-feed">
          <h3>Live Activity</h3>
          <ActivityFeed />
        </section>

        {/* 10) System health */}
        <section className="system-health">
          <h3>System Health</h3>
          <SystemHealth data={health} />
        </section>

        {/* 11) Notifications */}
        <section className="notifications">
          <h3>Notifications</h3>
          <p>(unread alerts…)</p>
        </section>

        {/* 12) Audit logs */}
        <section className="audit-logs">
          <h3>Audit Logs</h3>
          <AuditLogTable logs={auditLogs} />
        </section>

        {/* 13) Bulk actions & export */}
        <section className="bulk-export">
          <button className="btn-export">Export CSV</button>
          <button className="btn-bulk-delete">Bulk Delete</button>
        </section>

        {/* 14) Dark/Light mode toggle */}
        <section className="theme-toggle">
          <button>Toggle Dark Mode</button>
        </section>

        {/* 15) Settings quick links */}
        <section className="settings-links">
          <h3>Settings</h3>
          <ul>
            <li><a href="/admin/site-settings">Site Settings</a></li>
            <li><a href="/admin/location-settings">Location Settings</a></li>
            <li><a href="/admin/push-notifications">Push Notifications</a></li>
          </ul>
        </section>
      </div>
  );
}
