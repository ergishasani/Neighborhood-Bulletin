import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../../firebase/firestore";
import { getComments, addComment } from "../../firebase/firestore";
import { useAuth } from '../../context/AuthContext';
import Loader from "../../components/Loader";
import CommentSection from "../../components/CommentSection";
import formatDate from "../../utils/formatDate";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResult = await getPostById(id);
        
        if (postResult.success) {
          setPost(postResult.data);
          
          // Fetch comments
          const commentsResult = await getComments(id);
          if (commentsResult.success) {
            setComments(commentsResult.data);
          } else {
            setError(commentsResult.error);
          }
        } else {
          setError(postResult.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setCommentLoading(true);
    
    try {
      const commentData = {
        content: newComment,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
      };
      
      const result = await addComment(id, commentData);
      
      if (result.success) {
        setNewComment("");
        // Refresh comments
        const commentsResult = await getComments(id);
        if (commentsResult.success) {
          setComments(commentsResult.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      
      try {
        const result = await deletePost(id);
        
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div>Post not found</div>;

  const isAuthor = currentUser && currentUser.uid === post.authorId;

  return (
    <div className="post-detail-page">
      <div className="container">
        <div className="post-detail">
          {post.imageUrl && (
            <div className="post-image">
              <img src={post.imageUrl} alt={post.title} />
            </div>
          )}
          
          <div className="post-header">
            <h1>{post.title}</h1>
            
            <div className="post-meta">
              <span className="post-category">{post.category}</span>
              <span className="post-date">
                Posted on {formatDate(post.createdAt?.toDate())}
              </span>
              {post.location && (
                <span className="post-location">
                  <i className="fas fa-map-marker-alt"></i> {post.location}
                </span>
              )}
              <span className="post-author">
                By {post.authorName}
              </span>
            </div>
          </div>
          
          <div className="post-content">
            <p>{post.content}</p>
          </div>
          
          {isAuthor && (
            <div className="post-actions">
              <button
                onClick={() => navigate(`/edit-post/${id}`)}
                className="btn btn-outline"
              >
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
        
        <CommentSection 
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          loading={commentLoading}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

export default PostDetail;