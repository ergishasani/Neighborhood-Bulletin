import { useState, useEffect } from "react";
import { getPosts } from "../../firebase/firestore";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";

function LostAndFound() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts("lost-and-found");
        
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

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="category-page">
      <div className="container">
        <h1>Lost & Found</h1>
        <p className="page-description">
          Report lost items or found belongings in your neighborhood.
        </p>
        
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="no-posts">No lost & found posts yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LostAndFound;