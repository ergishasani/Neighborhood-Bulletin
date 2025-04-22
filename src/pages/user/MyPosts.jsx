import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../firebase/firestore";
import { useAuth } from '../../context/AuthContext';
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts(null, 50, null, currentUser.uid);
        
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
  }, [currentUser]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-posts-page">
      <div className="container">
        <div className="page-header">
          <h1>My Posts</h1>
          <Link to="/create-post" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
        
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <p>You haven't posted anything yet.</p>
            <Link to="/create-post" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;