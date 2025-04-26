import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserByUid, getPosts } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/Avatar";
import PostCard from "../../components/PostCard";
import Loader from "../../components/Loader";
import "../../styles/pages/_profile.scss";

export default function Profile() {
  const { id } = useParams();           // user’s UID from URL
  const { currentUser } = useAuth();
  const isMe = currentUser?.uid === id;

  const [user, setUser]       = useState(null);
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        // 1) Load user data
        const resUser = await getUserByUid(id);
        if (!resUser.success) throw new Error(resUser.error);
        setUser(resUser.data);

        // 2) Load first page of posts
        const resPosts = await getPosts({ authorId: id, limitCount: 6 });
        if (!resPosts.success) throw new Error(resPosts.error);
        setPosts(resPosts.data);
        setLastVisible(resPosts.lastVisible);
        setHasMore(Boolean(resPosts.lastVisible));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const loadMore = async () => {
    if (!lastVisible) return;
    setLoading(true);
    try {
      const res = await getPosts({
        authorId: id,
        limitCount: 6,
        lastVisible
      });
      if (!res.success) throw new Error(res.error);
      setPosts(prev => [...prev, ...res.data]);
      setLastVisible(res.lastVisible);
      setHasMore(Boolean(res.lastVisible));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="profile-name">
                {user.displayName || "Anonymous"}
              </h1>
              {user.bio && <p className="profile-bio">{user.bio}</p>}

              <div className="profile-stats">
                <div>
                  <strong>{posts.length}</strong>
                  <span>Posts</span>
                </div>
                <div>
                  <strong>123</strong> {/* stub */}
                  <span>Followers</span>
                </div>
                <div>
                  <strong>45</strong> {/* stub */}
                  <span>Following</span>
                </div>
              </div>

              <p className="profile-joined">Joined {joinedDate}</p>

              {isMe ? (
                  <Link to="/edit-profile" className="btn btn-outline">
                    Edit Profile
                  </Link>
              ) : (
                  <button className="btn btn-primary">
                    {/* TODO: wire up follow/unfollow */}
                    Follow
                  </button>
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
                    <a href={user.website} target="_blank" rel="noopener noreferrer">
                      {user.website}
                    </a>
                  </li>
              )}
            </ul>
          </div>

          <div className="profile-posts">
            <h2>Recent Posts</h2>
            {posts.length > 0 ? (
                <>
                  <div className="posts-grid">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                  {hasMore && (
                      <button onClick={loadMore} className="btn btn-secondary">
                        {loading ? "Loading…" : "Load More"}
                      </button>
                  )}
                </>
            ) : (
                <p className="no-posts">
                  {isMe
                      ? (
                          <>
                            You haven’t posted yet.{" "}
                            <Link to="/create-post">Create your first post</Link>.
                          </>
                      )
                      : "No posts to show."}
                </p>
            )}
          </div>
        </div>
      </div>
  );
}
