import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPosts } from "../../firebase/firestore";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";

function SearchResults() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts();
        
        if (result.success) {
          // Simple client-side filtering for demo purposes
          // In a real app, you'd want to use Firestore's full-text search or Algolia
          const filteredPosts = result.data.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())
          );
          setPosts(filteredPosts);
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
  }, [query]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="search-results">
      <div className="container">
        <h1>Search Results for "{query}"</h1>
        
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No posts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;