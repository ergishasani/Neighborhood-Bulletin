import { Link } from "react-router-dom";
import { FaHeart, FaComment, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import formatDate from "../utils/formatDate";

function PostCard({ post }) {
  if (!post) return null; // extra safety

  return (
      <div className="post-card">
        <Link to={`/posts/${post.id}`} className="post-link">
          {post.imageUrl && (
              <div className="post-image">
                <img src={post.imageUrl} alt={post.title || "Post Image"} />
              </div>
          )}
          <div className="post-content">
            <h3 className="post-title">{post.title || "Untitled"}</h3>
            <p className="post-excerpt">
              {post.content?.substring(0, 100) || "No content available"}...
            </p>
            <div className="post-meta">
              {post.category && (
                  <span className="post-category">{post.category}</span>
              )}
              {post.createdAt && (
                  <span className="post-date">
                <FaCalendarAlt /> {formatDate(post.createdAt?.toDate())}
              </span>
              )}
              {post.location && (
                  <span className="post-location">
                <FaMapMarkerAlt /> {post.location}
              </span>
              )}
            </div>
            <div className="post-stats">
            <span className="post-likes">
              <FaHeart /> {post.likes?.length || 0}
            </span>
              <span className="post-comments">
              <FaComment /> {post.commentCount || 0}
            </span>
            </div>
          </div>
        </Link>
      </div>
  );
}

export default PostCard;
