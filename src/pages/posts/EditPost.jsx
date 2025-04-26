import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostById,
  updatePost,
  uploadImage,
  deleteImageByUrl,        // <- renamed
} from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("event");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(true);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await getPostById(id);
        if (result.success) {
          const post = result.data;
          if (post.authorId !== currentUser.uid) {
            navigate("/");
            return;
          }
          setTitle(post.title);
          setContent(post.content);
          setCategory(post.category);
          setLocation(post.location || "");
          setCurrentImage(post.imageUrl || "");
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPost();
  }, [id, currentUser, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    setCurrentImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return setError("Title and content are required");
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = currentImage;

      // If a new image is chosen
      if (image) {
        // Delete old image if it exists
        if (currentImage) {
          await deleteImageByUrl(currentImage);
        }

        const uploadResult = await uploadImage(
            image,
            `posts/${currentUser.uid}/`
        );
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }
        imageUrl = uploadResult.url;
      } else if (!currentImage) {
        // If removed entirely
        imageUrl = "";
      }

      const postData = { title, content, category, location, imageUrl };
      const result = await updatePost(id, postData);
      if (result.success) {
        navigate(`/posts/${id}`);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (postLoading) return <Loader />;

  return (
      <div className="post-form-page">
        <div className="container">
          <h1>Edit Post</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="post-form">
            {/* Title */}
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

            {/* Category */}
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

            {/* Location */}
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

            {/* Content */}
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

            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="image">Image (optional)</label>
              <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
              />
              {(imagePreview || currentImage) && (
                  <div className="image-preview">
                    <img
                        src={imagePreview || currentImage}
                        alt="Preview"
                    />
                    <button
                        type="button"
                        className="btn btn-remove-image"
                        onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                  </div>
              )}
            </div>

            {/* Actions */}
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
                {loading ? <Loader small /> : "Update Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default EditPost;
