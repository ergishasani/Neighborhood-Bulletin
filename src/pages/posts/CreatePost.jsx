import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPost, uploadImage } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      return setError("Title and content are required");
    }
    
    setLoading(true);
    setError("");
    
    try {
      let imageUrl = "";
      
      if (image) {
        const uploadResult = await uploadImage(
          image,
          `posts/${currentUser.uid}/${Date.now()}_${image.name}`
        );
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }
        
        imageUrl = uploadResult.url;
      }
      
      const postData = {
        title,
        content,
        category,
        location,
        imageUrl,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        likes: [],
        commentCount: 0,
      };
      
      const result = await addPost(postData);
      
      if (result.success) {
        navigate(`/posts/${result.id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-page">
      <div className="container">
        <h1>Create New Post</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="post-form">
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
          
          <div className="form-group">
            <label htmlFor="location">Location (optional)</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Street Park"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="6"
            />
          </div>
          
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