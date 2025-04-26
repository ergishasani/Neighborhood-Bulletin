import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById, getPosts } from "../../firebase/firestore";
import { useAuth } from '../../context/AuthContext';
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResult = await getUserById(id);
        if (!userResult.success) {
          throw new Error(userResult.error);
        }
        setUser(userResult.data);

        // Fetch user's posts
        const postsResult = await getPosts(null, 10, null, id);
        if (!postsResult.success) {
          throw new Error(postsResult.error);
        }
        setPosts(postsResult.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>User not found</div>;

  const isCurrentUser = currentUser && currentUser.uid === id;

  return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            <div className="profile-info">
              <h1>{user.displayName || "Anonymous"}</h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-joined">
                Member since {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
              </p>

              {isCurrentUser && (
                  <Link to="/edit-profile" className="btn btn-outline">
                    Edit Profile
                  </Link>
              )}
            </div>
          </div>

          <div className="profile-content">
            <h2>Recent Posts</h2>

            {posts.length > 0 ? (
                <div className="posts-grid">
                  {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                  ))}
                </div>
            ) : (
                <div className="no-posts">
                  {isCurrentUser ? (
                      <p>You haven't posted anything yet. <Link to="/create-post">Create your first post</Link></p>
                  ) : (
                      <p>This user hasn't posted anything yet.</p>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Profile;
