import { useEffect, useState } from "react";
import { getPosts } from "../../firebase/firestore";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await getPosts();
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
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">Community Bulletin Board</h1>
        <p className="page-subtitle">Latest posts from your neighborhood</p>

        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="no-posts">No posts found. Be the first to post!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;