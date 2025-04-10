// src/components/Post.jsx
import React from 'react';
import '../styles/Post.scss'; // Adjust path if needed

// Helper function to format Firestore Timestamp (or Date object)
const formatDate = (timestamp) => {
  if (!timestamp) {
    return 'Just now'; // Or some default
  }
  // Convert Firestore Timestamp to JavaScript Date object if necessary
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  // Format it - adjust options as needed
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

function Post({ post }) {
  // Destructure the post object passed as a prop
  const { text, userId, createdAt, userName } = post; // Add userName if you store it

  return (
    <div className="post-item">
      <div className="post-header">
        <span className="post-author">
          {/* Ideally, fetch username based on userId. For now, show userId */}
          Posted by: {userName || userId}
        </span>
        <span className="post-timestamp">
          {formatDate(createdAt)}
        </span>
      </div>
      <div className="post-content">
        <p>{text}</p>
      </div>
      {/* Add LATER: Placeholder for likes/comments */}
      {/* <div className="post-actions">
        <button>Like</button>
        <button>Comment</button>
      </div> */}
    </div>
  );
}

export default Post;