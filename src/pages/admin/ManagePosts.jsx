import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts, deletePost } from "../../firebase/firestore";
import Loader from "../../components/Loader";
import { useAuth } from '../../context/AuthContext';
import formatDate from "../../utils/formatDate";

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts(null, 50);
        
        if (result.success) {
          setPosts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        const result = await deletePost(id);
        
        if (result.success) {
          setPosts(posts.filter(post => post.id !== id));
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

  if (!currentUser || currentUser.role !== "admin") {
    return <div>Unauthorized access</div>;
  }

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="manage-posts">
      <div className="container">
        <div className="page-header">
          <h1>Manage Posts</h1>
          <Link to="/admin" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        {posts.length > 0 ? (
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link to={`/posts/${post.id}`} className="post-link">
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/profile/${post.authorId}`} className="author-link">
                        {post.authorName}
                      </Link>
                    </td>
                    <td className="category-cell">
                      <span className={`category-badge ${post.category}`}>
                        {post.category}
                      </span>
                    </td>
                    <td>{formatDate(post.createdAt?.toDate())}</td>
                    <td>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-posts">No posts found</div>
        )}
      </div>
    </div>
  );
}

export default ManagePosts;