// src/components/Feed.jsx
import React, { useState, useEffect } from 'react';
import { getPostsListener } from '../services/postService'; // Adjust path if needed
import Post from './Post'; // Adjust path if needed
import '../styles/Feed.scss'; // Adjust path if needed

function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Call the listener function from postService
    // It returns an 'unsubscribe' function
    const unsubscribe = getPostsListener(
      (fetchedPosts) => {
        // This callback function runs whenever the posts data changes in Firestore
        setPosts(fetchedPosts);
        setIsLoading(false);
        setError(null); // Clear error on successful fetch/update
      },
      (err) => {
        // Optional: Add an error handler directly to the listener if your service provides it
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        setIsLoading(false);
      }
    );

    // Cleanup function: This runs when the component unmounts
    // It calls the 'unsubscribe' function to stop listening to Firestore changes
    return () => {
      console.log("Unsubscribing from posts listener.");
      unsubscribe();
    };

  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div className="feed-container">
      <h2>Feed</h2>
      {isLoading && <p className="loading-message">Loading posts...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && posts.length === 0 && (
        <p className="empty-feed-message">No posts yet. Be the first to post!</p>
      )}
      {!isLoading && !error && posts.length > 0 && (
        <div className="posts-list">
          {posts.map((post) => (
            <Post key={post.id} post={post} /> // Pass the whole post object as a prop
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;