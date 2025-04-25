import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts, getUsers } from "../../firebase/firestore";
import Loader from "../../components/Loader";
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    recentPosts: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch posts
        const postsResult = await getPosts(null, 5);
        if (!postsResult.success) throw new Error(postsResult.error);
        
        // Fetch users
        const usersResult = await getUsers(5);
        if (!usersResult.success) throw new Error(usersResult.error);
        
        setStats({
          totalPosts: postsResult.total || 0,
          totalUsers: usersResult.total || 0,
          recentPosts: postsResult.data,
          recentUsers: usersResult.data,
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (!currentUser || currentUser.role !== "admin") {
    return <div>Unauthorized access</div>;
  }

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-value">{stats.totalPosts}</p>
            <Link to="/admin/posts" className="stat-link">
              View All Posts
            </Link>
          </div>
          
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <Link to="/admin/users" className="stat-link">
              View All Users
            </Link>
          </div>
        </div>
        
        <div className="recent-section">
          <div className="recent-posts">
            <h2>Recent Posts</h2>
            {stats.recentPosts.length > 0 ? (
              <ul className="recent-list">
                {stats.recentPosts.map((post) => (
                  <li key={post.id} className="recent-item">
                    <Link to={`/posts/${post.id}`} className="recent-title">
                      {post.title}
                    </Link>
                    <span className="recent-meta">
                      {post.authorName} • {new Date(post.createdAt?.toDate()).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items">No recent posts</p>
            )}
          </div>
          
          <div className="recent-users">
            <h2>Recent Users</h2>
            {stats.recentUsers.length > 0 ? (
              <ul className="recent-list">
                {stats.recentUsers.map((user) => (
                  <li key={user.id} className="recent-item">
                    <Link to={`/profile/${user.id}`} className="recent-title">
                      {user.displayName || "Anonymous"}
                    </Link>
                    <span className="recent-meta">
                      {user.email} • {new Date(user.createdAt?.toDate()).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;