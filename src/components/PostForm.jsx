import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your firebase.js file exports the 'db' object

const PostForm = ({ setPosts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if title or description is empty after trimming whitespace
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all fields!');
      return;
    }

    setLoading(true);

    try {
      const newPost = {
        title: title.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(), // Automatically sets timestamp
      };

      // Add the new post to Firestore
      const docRef = await addDoc(collection(db, 'posts'), newPost);

      // Optionally, fetch and update the posts
      const newPostWithId = { id: docRef.id, ...newPost };
      setPosts((prevPosts) => [newPostWithId, ...prevPosts]);

      // Clear the form
      setTitle('');
      setDescription('');
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post description"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md disabled:bg-gray-400"
          >
            {loading ? 'Creating Post...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
