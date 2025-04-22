import { Link } from "react-router-dom";
import { FaHeart, FaComment, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import formatDate from "../utils/formatDate";

function PostCard({ post }) {
  return (
    <div className="post-card">
      <Link to={`/posts/${post.id}`} className="post-link">
        {post.imageUrl && (
          <div className="post-image">
            <img src={post.imageUrl} alt={post.title} />
          </div>
        )}
        <div className="post-content">
          <h3 className="post-title">{post.title}</h3>
          <p className="post-excerpt">{post.content.substring(0, 100)}...</p>
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">
              <FaCalendarAlt /> {formatDate(post.createdAt?.toDate())}
            </span>
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