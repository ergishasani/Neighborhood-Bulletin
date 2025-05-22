// src/components/Bookmarks.jsx
import React, { useState, useEffect } from "react";
import { getUserByUid, getPostById, toggleBookmark } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import PostCard from "./PostCard";
import "../styles/components/_bookmarks.scss";

export default function Bookmarks({ userId }) {
    const { currentUser } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);     // array of post objects
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState("");

    // Fetch bookmark IDs, then the posts themselves
    useEffect(() => {
        let cancelled = false;
        async function loadBookmarks() {
            setLoading(true);
            setError("");
            try {
                const userRes = await getUserByUid(userId);
                if (!userRes.success) throw new Error(userRes.error || "Failed to load user");
                const ids = userRes.data.bookmarks || [];
                const posts = await Promise.all(
                    ids.map((pid) => getPostById(pid))
                );
                const valid = posts
                    .filter(r => r.success)
                    .map(r => r.data);
                if (!cancelled) setBookmarks(valid);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadBookmarks();
        return () => { cancelled = true; };
    }, [userId]);

    // Remove a bookmark in-place
    const handleRemove = async (postId) => {
        if (!currentUser) return;
        const res = await toggleBookmark(currentUser.uid, postId, true);
        if (res.success) {
            setBookmarks((prev) => prev.filter(p => p.id !== postId));
        }
    };

    if (loading) return <Loader />;
    if (error)   return <div className="error-message">{error}</div>;
    if (bookmarks.length === 0) {
        return <div className="no-bookmarks">No bookmarks yet.</div>;
    }

    return (
        <div className="bookmarks">
            {bookmarks.map(post => (
                <div key={post.id} className="bookmark-item">
                    <PostCard post={post} />

                    {/* only allow removal if you're viewing your own bookmarks */}
                    {currentUser?.uid === userId && (
                        <button
                            className="btn btn-link remove-bookmark"
                            onClick={() => handleRemove(post.id)}
                        >
                            Remove Bookmark
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
