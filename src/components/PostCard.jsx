import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaComment,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import formatDate from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { toggleBookmark, isBookmarked } from "../firebase/firestore";
import "../styles/components/_post-card.scss";

export default function PostCard({ post }) {
  // ─────── HOOKS ───────
  const { currentUser }                      = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (currentUser && post?.id) {
      isBookmarked(currentUser.uid, post.id).then(setBookmarked);
    }
  }, [currentUser, post]);

  // ─────── EARLY RETURN (POST REQUIRED) ───────
  if (!post) return null;

  // ─────── DESTRUCTURE FIELDS ───────
  const {
    id,
    title,
    content,
    imageUrl,
    category,
    location,
    createdAt,
    likes = [],
    commentCount = 0,
  } = post;

  // ─────── DATE PARSING ───────
  let dateObj;
  if (createdAt && typeof createdAt.toDate === "function") {
    dateObj = createdAt.toDate();
  } else if (createdAt instanceof Date) {
    dateObj = createdAt;
  } else if (createdAt?.seconds) {
    dateObj = new Date(createdAt.seconds * 1000);
  } else {
    dateObj = new Date(createdAt);
  }
  const dateStr = isNaN(dateObj) ? "" : formatDate(dateObj);

  // ─────── EXCERPT + CATEGORY LABEL ───────
  const excerpt = content
      ? content.length > 100
          ? content.slice(0, 100) + "…"
          : content
      : "No content available";

  const displayCategory = category
      ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

  // ─────── BOOKMARK TOGGLE ───────
  const onToggleBookmark = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    await toggleBookmark(currentUser.uid, id, bookmarked);
    setBookmarked((b) => !b);
  };

  // ─────── RENDER ───────
  return (
      <div className="post-card">
        <Link to={`/posts/${id}`} className="post-link">
          {imageUrl && (
              <div className="post-image">
                <img src={imageUrl} alt={title || "Post Image"} />
              </div>
          )}

          <div className="post-content">
            <div className="post-header">
              <h3 className="post-title">{title || "Untitled"}</h3>
              {currentUser && (
                  <button
                      className="bookmark-btn"
                      onClick={onToggleBookmark}
                      aria-label="Toggle Bookmark"
                  >
                    {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
              )}
            </div>

            <p className="post-excerpt">{excerpt}</p>

            <div className="post-meta">
              {displayCategory && (
                  <span className="post-category">{displayCategory}</span>
              )}
              {dateStr && (
                  <span className="post-date">
                <FaCalendarAlt /> {dateStr}
              </span>
              )}
              {location && (
                  <span className="post-location">
                <FaMapMarkerAlt /> {location}
              </span>
              )}
            </div>

            <div className="post-stats">
            <span className="post-likes">
              <FaHeart /> {likes.length}
            </span>
              <span className="post-comments">
              <FaComment /> {commentCount}
            </span>
            </div>
          </div>
        </Link>
      </div>
  );
}
