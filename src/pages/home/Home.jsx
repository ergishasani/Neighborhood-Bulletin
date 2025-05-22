// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPosts } from "../../firebase/firestore";
import Loader from "../../components/Loader";
import QuickPostForm from "../../components/QuickPostForm";
import PostCard from "../../components/PostCard";
import "../../styles/pages/_home.scss";

const CATEGORIES = [
  { key: "all",            label: "All" },
  { key: "event",          label: "Events" },
  { key: "lost-and-found", label: "Lost & Found" },
  { key: "garage-sale",    label: "Garage Sales" },
];

export default function Home() {
  const { currentUser } = useAuth();
  const [posts, setPosts]          = useState([]);
  const [loading, setLoading]      = useState(true);
  const [error, setError]          = useState(null);
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag]           = useState("");

  // Fetch posts on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPosts({ limitCount: 100 });
        if (!res.success) throw new Error(res.error);
        setPosts(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Prepend new post to feed
  const handleNewPost = post => setPosts(prev => [post, ...prev]);

  // Compute trending tags
  const tagCounts = {};
  posts.forEach(p => (p.tags || []).forEach(t => tagCounts[t] = (tagCounts[t]||0)+1));
  const trending = Object.entries(tagCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 6);

  // Upcoming events
  const upcoming = posts
      .filter(p => p.category === "event")
      .sort((a,b) => a.createdAt.seconds - b.createdAt.seconds)
      .slice(0, 5);

  // Filter logic
  const filtered = posts.filter(p => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    const text = `${p.title} ${p.content}`.toLowerCase();
    if (!text.includes(searchQuery.toLowerCase())) return false;
    if (selectedTag && !(p.tags || []).includes(selectedTag)) return false;
    return true;
  });

  if (loading) return <Loader />;
  if (error)   return <div className="error-message">{error}</div>;

  return (
      <div className="home-container">
        {/* Left Sidebar */}
        <aside className="sidebar left">
          <div className="profile-summary">
            <h2>Welcome,</h2>
            <img
                src={currentUser?.photoURL || "/default-avatar.png"}
                alt="Avatar"
                className="avatar"
            />
            <p className="name">{currentUser?.displayName || "Guest"}</p>

            {/* only show “View Profile” if logged in */}
            {currentUser ? (
                <NavLink
                    to={`/profile/${currentUser.uid}`}
                    className="btn btn-outline"
                >
                  View Profile
                </NavLink>
            ) : (
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
            )}

            <nav className="nav-links">
              <NavLink exact to="/" activeClassName="active">
                Home
              </NavLink>

              {/* only show “My Posts” if logged in */}
              {currentUser && (
                  <NavLink
                      to={`/profile/${currentUser.uid}`}
                      activeClassName="active"
                  >
                    My Posts
                  </NavLink>
              )}

              <NavLink to="/create-post" activeClassName="active">
                New Post
              </NavLink>

              <NavLink to="/events" activeClassName="active">
                Events
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="main-content">
          <QuickPostForm onPostCreated={handleNewPost} />

          <div className="controls-bar">
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
            <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {selectedTag && (
                <button
                    className="clear-tag"
                    onClick={() => setSelectedTag("")}
                >
                  Clear tag “{selectedTag}”
                </button>
            )}
          </div>

          <div className="feed-list">
            {filtered.length > 0 ? (
                filtered.map(post => <PostCard key={post.id} post={post} />)
            ) : (
                <div className="no-posts">No posts match your filters.</div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar right">
          <section className="trending-tags">
            <h3>Trending Tags</h3>
            <ul>
              {trending.map(([tag, count]) => (
                  <li key={tag}>
                    <button
                        className={selectedTag === tag ? "active" : ""}
                        onClick={() => setSelectedTag(tag)}
                    >
                      #{tag} ({count})
                    </button>
                  </li>
              ))}
            </ul>
          </section>

          <section className="upcoming-events">
            <h3>Upcoming Events</h3>
            <ul>
              {upcoming.map(e => (
                  <li key={e.id}>
                    <Link to={`/posts/${e.id}`}>
                      <strong>{e.title}</strong>
                    </Link>
                    <br />
                    <small>
                      {new Date(e.createdAt.seconds * 1000).toLocaleDateString()}
                    </small>
                  </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
  );
}
