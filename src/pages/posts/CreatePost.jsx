import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../firebase/imgbb"; // Updated import
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import { addPost } from "../../firebase/firestore"; // Make sure to import the addPost function

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("event");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview image after selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return setError("Title and content are required");
    }

    setLoading(true);
    setError(""); // Clear any previous error

    try {
      let imageUrl = ""; // Default to empty string if no image is uploaded

      if (image) {
        const uploadResult = await uploadImage(image); // Upload image to imgbb

        if (!uploadResult.success) {
          throw new Error(uploadResult.error); // If upload fails, throw an error
        }

        imageUrl = uploadResult.url; // Get image URL from imgbb
      }


      const postData = {
        title,
        content,
        category,
        location,
        imageUrl,
        authorId: currentUser.uid, // Current user info from context
        authorName: currentUser.displayName,
        likes: [],
        commentCount: 0,
        createdAt: new Date(), // Add timestamp for post creation
      };

      // Add the post data to Firestore (assuming addPost is defined in firestore.js)
      const result = await addPost(postData);

      if (result.success) {
        navigate(`/posts/${result.id}`); // Redirect to the new post page
      } else {
        throw new Error(result.error); // Handle any errors from Firestore
      }
    } catch (err) {
      setError(err.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
      <div className="post-form-page">
        <div className="container">
          <h1>Create New Post</h1>

          {error && <div className="error-message">{error}</div>} {/* Show error message */}

          <form onSubmit={handleSubmit} className="post-form">
            {/* Title input */}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* Category select */}
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
              >
                <option value="event">Event</option>
                <option value="lost-and-found">Lost & Found</option>
                <option value="garage-sale">Garage Sale</option>
              </select>
            </div>

            {/* Content input */}
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
              ></textarea>
            </div>

            {/* Location input */}
            <div className="form-group">
              <label htmlFor="location">Location (optional)</label>
              <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Image upload */}
            <div className="form-group">
              <label htmlFor="image">Image (optional)</label>
              <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
              />
              {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
              )}
            </div>

            {/* Form actions */}
            <div className="form-actions">
              <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
              >
                {loading ? <Loader small /> : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default CreatePost;
