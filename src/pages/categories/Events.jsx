import { useState, useEffect } from "react";
import { getPosts } from "../../firebase/firestore";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";

function Events() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts("event");
        
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
        <h1>Community Events</h1>
        <p className="page-description">
          Find upcoming events in your neighborhood or post your own event.
        </p>
        
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="no-posts">No events posted yet. Be the first to post an event!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;