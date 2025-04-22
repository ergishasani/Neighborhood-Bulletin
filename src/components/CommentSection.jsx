import { FaUser, FaTrash } from "react-icons/fa";
import formatDate from "../utils/formatDate";

function CommentSection({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  loading,
  currentUser,
}) {
  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      {currentUser ? (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
          />
          <button
            onClick={handleAddComment}
            className="btn btn-primary"
            disabled={loading || !newComment.trim()}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <p className="login-prompt">
          <a href="/login">Login</a> to post a comment
        </p>
      )}
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-author">
                  <FaUser className="user-icon" />
                  <span>{comment.authorName}</span>
                </div>
                <span className="comment-date">
                  {formatDate(comment.createdAt?.toDate())}
                </span>
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
              {currentUser && currentUser.uid === comment.authorId && (
                <button className="btn btn-delete-comment">
                  <FaTrash />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;