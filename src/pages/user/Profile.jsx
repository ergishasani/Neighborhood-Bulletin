// src/pages/user/Profile.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserByUid, getPosts } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/Avatar";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";
import "../../styles/pages/_profile.scss";

export default function Profile() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const isMe = currentUser?.uid === id;

  const [user, setUser]       = useState(null);
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) Try Firestore first
        const resUser = await getUserByUid(id);
        if (resUser.success) {
          setUser(resUser.data);
        } else if (isMe) {
          // 2) Fallback to AuthContext for your own Google account
          setUser({
            displayName: currentUser.displayName || "Anonymous",
            email:       currentUser.email,
            photoURL:    currentUser.photoURL,
            createdAt: {
              seconds: Math.floor(
                  new Date(currentUser.metadata.creationTime).getTime() / 1000
              )
            }
          });
        } else {
          throw new Error("User not found");
        }

        // 3) Fetch their posts
        const resPosts = await getPosts({ authorId: id, limitCount: 10 });
        if (!resPosts.success) throw new Error(resPosts.error);
        setPosts(resPosts.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser, isMe]);

  if (loading) return <Loader />;
  if (error)   return <div className="error-message">{error}</div>;

  // Format join date
  const joinedDate = user.createdAt
      ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
      : "N/A";

  return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <Avatar
                src={user.photoURL || "/default-avatar.png"}
                alt={user.displayName}
                size={120}
            />
            <div className="profile-details">
              <h1 className="profile-name">{user.displayName}</h1>
              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="profile-stats">
                <div>
                  <strong>{posts.length}</strong>
                  <span>Posts</span>
                </div>
              </div>

              <p className="profile-joined">Joined {joinedDate}</p>

              {isMe && (
                  <Link to="/edit-profile" className="btn btn-outline">
                    Edit Profile
                  </Link>
              )}
            </div>
          </div>

          <div className="profile-about">
            <h2>About</h2>
            <ul>
              {user.email && (
                  <li>
                    <strong>Email:</strong> {user.email}
                  </li>
              )}
              {user.location && (
                  <li>
                    <strong>Location:</strong> {user.location}
                  </li>
              )}
              {user.website && (
                  <li>
                    <strong>Website:</strong>{" "}
                    <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  </li>
              )}
            </ul>
          </div>

          <div className="profile-posts">
            <h2>Recent Posts</h2>
            {posts.length > 0 ? (
                <div className="posts-grid">
                  {posts.map(post => (
                      <PostCard key={post.id} post={post} />
                  ))}
                </div>
            ) : (
                <p className="no-posts">
                  {isMe
                      ? (
                          <>
                            You haven’t posted anything yet.{" "}
                            <Link to="/create-post">Create your first post</Link>.
                          </>
                      )
                      : "No posts to show."
                  }
                </p>
            )}
          </div>
        </div>
      </div>
  );
}
