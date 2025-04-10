// src/components/CreatePost.jsx
import React, { useState } from 'react';
import { createPost } from '../services/postService.jsx'; // Adjust path if needed
import '../styles/CreatePost.scss'; // We'll create this SCSS file next

function CreatePost() {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    if (!postText.trim()) {
      setError('Post cannot be empty.');
      return; // Don't submit empty posts
    }

    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      await createPost(postText); // Call the service function
      setPostText(''); // Clear the textarea after successful post
      console.log('Post submitted successfully!');
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false); // Re-enable the button/form
    }
  };

  return (
    <div className="create-post-container">
      <h3>Create a New Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="create-post-textarea"
          rows="4"
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          disabled={isLoading} // Disable textarea while submitting
        />
        {error && <p className="error-message">{error}</p>}
        <button
           type="submit"
           className="create-post-button"
           disabled={isLoading || !postText.trim()} // Disable button if loading or text is empty/whitespace
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;