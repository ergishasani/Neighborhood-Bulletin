import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPosts } from "../../firebase/firestore";
import Loader from "../../components/Loader";
import QuickPostForm from "../../components/QuickPostForm";
import PostCard from "../../components/PostCard";
import "../../styles/pages/_home.scss";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "event", label: "Events" },
  { key: "lost-and-found", label: "Lost & Found" },
  { key: "garage-sale", label: "Garage Sales" },
];

export default function Home() {
  // ─────── State & Hooks ───────
  const { currentUser }            = useAuth();
  const [posts, setPosts]          = useState([]);
  const [loading, setLoading]      = useState(true);
  const [error, setError]          = useState(null);
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag]           = useState("");

  // ─────── Fetch Posts ───────
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

  // ─────── Add New Post Handler ───────
  const handleNewPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  // ─────── Compute Trending Tags & Upcoming Events ───────
  const tagCounts = {};
  posts.forEach((p) => (p.tags || []).forEach((t) => (tagCounts[t] = (tagCounts[t]||0)+1)));
  const trending = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

  const upcoming = posts
      .filter((p) => p.category === "event")
      .sort((a,b) => {
        const da = a.createdAt.seconds*1000;
        const db = b.createdAt.seconds*1000;
        return da - db;
      })
      .slice(0,5);

  // ─────── Filtering Logic ───────
  const filtered = posts.filter((p) => {
    // category
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }
    // search
    const text = `${p.title} ${p.content}`.toLowerCase();
    if (!text.includes(searchQuery.toLowerCase())) {
      return false;
    }
    // tag
    if (selectedTag && !(p.tags || []).includes(selectedTag)) {
      return false;
    }
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
            <p className="name">{currentUser?.displayName}</p>
            <Link to="/profile" className="btn btn-outline">
              View Profile
            </Link>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/my-posts">My Posts</Link>
              <Link to="/create-post">New Post</Link>
              <Link to="/events">Events</Link>
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
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                filtered.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
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
              {upcoming.map((e) => (
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
