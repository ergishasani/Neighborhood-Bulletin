// src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPosts } from "../../firebase/firestore";
import Loader from "../../components/Loader";
import PostCard from "../../components/PostCard";
import "../../styles/pages/_events.scss";

export default function Events() {
  const { currentUser } = useAuth();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        // pull only "event" category, up to 100 items
        const res = await getPosts({ category: "event", limitCount: 100 });
        if (!res.success) throw new Error(res.error || "Failed to load events");
        setEvents(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // filter by title or content
  const filtered = events.filter(evt => {
    const text = `${evt.title} ${evt.content}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  if (loading) return <Loader />;
  if (error)   return <div className="error-message">{error}</div>;

  return (
      <div className="events-page">
        <div className="container">
          <header className="events-header">
            <h1>Community Events</h1>
            <p>Discover and share neighborhood gatherings, workshops, meet-ups, and more.</p>
            {currentUser && (
                <Link to="/create-post?category=event" className="btn btn-primary">
                  Post an Event
                </Link>
            )}
          </header>

          <div className="events-controls">
            <input
                type="text"
                placeholder="Search events…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
            />
          </div>

          <div className="events-grid">
            {filtered.length > 0 ? (
                filtered.map(evt => (
                    <PostCard key={evt.id} post={evt} />
                ))
            ) : (
                <div className="no-events">
                  {events.length === 0
                      ? "No events have been posted yet. Be the first to create one!"
                      : "No events match your search."}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
