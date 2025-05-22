// src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserByUid, getPosts, updateUser, uploadImage } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import AvatarUploader from "../../components/AvatarUploader";
import FollowButton from "../../components/FollowButton";
import Tabs from "../../components/Tabs";
import ActivityStats from "../../components/ActivityStats";
import ActivityFeed from "../../components/ActivityFeed";
import GroupsAndEvents from "../../components/GroupsAndEvents";
import Bookmarks from "../../components/Bookmarks";
import "../../styles/pages/_profile.scss";

export default function Profile() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const isMe = currentUser?.uid === id;

  const [user, setUser]       = useState(null);
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Load user + posts
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const r1 = await getUserByUid(id);
        if (!r1.success) throw new Error(r1.error);
        setUser(r1.data);

        const r2 = await getPosts({ authorId: id, limitCount: 100 });
        if (!r2.success) throw new Error(r2.error);
        setPosts(r2.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Unified image upload handler
  const handleImageUpload = async (file, field) => {
    const res = await uploadImage(file);
    if (res.success) {
      await updateUser(id, { [field]: res.url });
      setUser((u) => ({ ...u, [field]: res.url }));
    }
  };

  if (loading) return <Loader />;
  if (error)   return <div className="error-message">{error}</div>;
  if (!user)   return <div className="error-message">User not found</div>;

  // Category counts
  const counts = {
    all: posts.length,
    events: posts.filter(p => p.category === "event").length,
    lost: posts.filter(p => p.category === "lost-and-found").length,
    garage: posts.filter(p => p.category === "garage-sale").length,
  };

  const tabs = [
    {
      label: `Feed (${counts.all})`,
      Component: <ActivityFeed posts={posts} />,
    },
    {
      label: `Events (${counts.events})`,
      Component: <ActivityFeed posts={posts.filter(p => p.category==="event")} />,
    },
    {
      label: `Lost & Found (${counts.lost})`,
      Component: <ActivityFeed posts={posts.filter(p => p.category==="lost-and-found")} />,
    },
    {
      label: `Garage Sales (${counts.garage})`,
      Component: <ActivityFeed posts={posts.filter(p => p.category==="garage-sale")} />,
    },
    {
      label: "Groups",
      Component: <GroupsAndEvents userId={id} />,
    },
    {
      label: "Bookmarks",
      Component: <Bookmarks userId={id} />,
    },
    {
      label: "Stats",
      Component: <ActivityStats posts={posts} />,
    },
  ];

  const joinedDate = user.createdAt
      ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
      : "N/A";

  return (
      <div className="profile-page">


        <div className="profile-header container">
          {/* Avatar */}
          <AvatarUploader
              src={user.photoURL}
              size={120}
              editable={isMe}
              onUpload={file => handleImageUpload(file, "photoURL")}
          />

          <div className="header-info">
            <h1>{user.displayName || "Anonymous"}</h1>
            {user.bio && <p className="bio">{user.bio}</p>}

            <div className="meta">
              {user.neighborhood && <span>🏘 {user.neighborhood}</span>}
              <span>📅 Joined {joinedDate}</span>
              {user.email && (
                  <span>
                ✉ <Link to={`mailto:${user.email}`}>{user.email}</Link>
              </span>
              )}
            </div>

            <div className="header-actions">
              {isMe
                  ? <Link to="/edit-profile" className="btn btn-outline">Settings</Link>
                  : <FollowButton userId={id} />
              }

            </div>
          </div>
        </div>



        {/* Tabbed content */}
        <div className="profile-tabs container">
          <Tabs tabs={tabs} />
        </div>
      </div>
  );
}
