// src/pages/posts/PostDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getPostById,
  deletePost,
  getComments,
  addComment,
  toggleLike,
  toggleBookmark,
  isBookmarked
} from "../../firebase/firestore";
import Loader from "../../components/Loader";
import formatDate from "../../utils/formatDate";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaTag,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import "../../styles/pages/_post-detail.scss";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Post
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [errorPost, setErrorPost] = useState("");

  // Likes & Favorites
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState("");
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [errorNewComment, setErrorNewComment] = useState("");

  // parse Firestore Timestamp / raw / Date
  const parseDate = (ts) => {
    let d;
    if (ts?.toDate) d = ts.toDate();
    else if (ts instanceof Date) d = ts;
    else if (ts?.seconds) d = new Date(ts.seconds * 1000);
    else d = new Date(ts);
    return isNaN(d) ? null : d;
  };

  // load post, likes, favorites
  useEffect(() => {
    (async () => {
      setLoadingPost(true);
      try {
        const res = await getPostById(id);
        if (!res.success) throw new Error(res.error || "Fetch failed");
        setPost(res.data);
        // init liked
        setLiked(res.data.likes?.includes(currentUser?.uid));
        // init bookmarked
        if (currentUser) {
          const bm = await isBookmarked(currentUser.uid, id);
          setBookmarked(bm);
        }
      } catch (err) {
        setErrorPost(err.message);
      } finally {
        setLoadingPost(false);
      }
    })();
  }, [id, currentUser]);

  // load comments
  useEffect(() => {
    (async () => {
      setLoadingComments(true);
      try {
        const res = await getComments(id);
        if (!res.success) throw new Error(res.error || "Fetch failed");
        setComments(res.data);
      } catch (err) {
        setErrorComments(err.message);
      } finally {
        setLoadingComments(false);
      }
    })();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    setLoadingPost(true);
    try {
      const res = await deletePost(id);
      if (!res.success) throw new Error(res.error || "Delete failed");
      navigate("/");
    } catch (err) {
      setErrorPost(err.message);
      setLoadingPost(false);
    }
  };

  const handleToggleLike = async () => {
    if (!currentUser) return;
    const res = await toggleLike(id, currentUser.uid, liked);
    if (res.success) setLiked((l) => !l);
  };

  const handleToggleBookmark = async () => {
    if (!currentUser) return;
    const res = await toggleBookmark(currentUser.uid, id, bookmarked);
    if (res.success) setBookmarked((b) => !b);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setErrorNewComment("Comment cannot be empty");
      return;
    }
    setPostingComment(true);
    try {
      const payload = {
        content: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
      };
      const res = await addComment(id, payload);
      if (!res.success) throw new Error(res.error || "Comment failed");
      setComments((prev) => [
        { id: res.id, ...payload, createdAt: new Date() },
        ...prev,
      ]);
      setNewComment("");
      setErrorNewComment("");
    } catch (err) {
      setErrorNewComment(err.message);
    } finally {
      setPostingComment(false);
    }
  };

  if (loadingPost) return <Loader />;
  if (errorPost) return <div className="error-message">{errorPost}</div>;
  if (!post) return <div className="error-message">Post not found</div>;

  // eslint-disable-next-line no-unused-vars
  const {
    title,
    content,
    imageUrl,
    category,
    location,
    authorName,
    authorId,
    tags = [],
    createdAt,
    likes = [],
  } = post;

  const isAuthor = currentUser?.uid === authorId;
  const postDate = parseDate(createdAt);

  return (
      <div className="post-detail-page">
        <div className="container">
          <div className="post-detail">
            {imageUrl && (
                <div className="post-image">
                  <img src={imageUrl} alt={title} />
                </div>
            )}

            <div className="post-header">
              <h1 className="post-title">{title}</h1>
              {tags.length > 0 && (
                  <div className="post-tags">
                    {tags.map((t) => (
                        <span key={t} className="tag-badge">
                    <FaTag /> {t}
                  </span>
                    ))}
                  </div>
              )}

              <div className="post-meta">
              <span className="meta-item">
                <FaCalendarAlt />{" "}
                {postDate ? formatDate(postDate) : "Unknown date"}
              </span>
                {location && (
                    <span className="meta-item">
                  <FaMapMarkerAlt /> {location}
                </span>
                )}
                <span className="meta-item">By {authorName}</span>
              </div>

              <div className="post-actions">
                <button
                    className={`btn like-btn ${liked ? "liked" : ""}`}
                    onClick={handleToggleLike}
                >
                  {liked ? <FaHeart /> : <FaRegHeart />} {likes.length + (liked && !likes.includes(currentUser.uid) ? 1 : 0)}
                </button>
                <button
                    className="btn bookmark-btn"
                    onClick={handleToggleBookmark}
                >
                  {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                {isAuthor && (
                    <>
                      <button
                          className="btn btn-outline"
                          onClick={() => navigate(`/edit-post/${id}`)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                          className="btn btn-danger"
                          onClick={handleDeletePost}
                          disabled={loadingPost}
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                )}
              </div>
            </div>

            <div className="post-content">
              <p>{content}</p>
            </div>
          </div>

          <div className="comments-section">
            <h2>Comments ({comments.length})</h2>

            <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows={3}
                disabled={postingComment}
            />
              {errorNewComment && (
                  <div className="error-message">{errorNewComment}</div>
              )}
              <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={postingComment}
              >
                {postingComment ? "Posting…" : "Post Comment"}
              </button>
            </form>

            {loadingComments ? (
                <Loader small />
            ) : errorComments ? (
                <div className="error-message">{errorComments}</div>
            ) : (
                <div className="comments-list">
                  {comments.map((c) => {
                    const d = parseDate(c.createdAt);
                    return (
                        <div key={c.id} className="comment-item">
                          <div className="comment-meta">
                            <strong>{c.authorName}</strong>{" "}
                            <span className="comment-date">
                        {d ? d.toLocaleString() : ""}
                      </span>
                          </div>
                          <p className="comment-body">{c.content}</p>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
