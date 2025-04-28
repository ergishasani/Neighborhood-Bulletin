// src/pages/posts/CreatePost.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../firebase/imgbb";    // imgbb helper only
import { addPost } from "../../firebase/firestore";    // Firestore only for saving metadata
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import PostCard from "../../components/PostCard";
import {
  Calendar,
  MapPin,
  ShoppingCart,
  Tag as TagIcon,
} from "lucide-react";
import "../../styles/pages/_createPost.scss";

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [title, setTitle]       = useState("");
  const [content, setContent]   = useState("");
  const [category, setCategory] = useState("event");
  const [location, setLocation] = useState("");
  const [tags, setTags]         = useState([]);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const maxContentLength = 1000;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTagKeyDown = (e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const raw = e.target.value.trim().replace(",", "");
      if (raw && !tags.includes(raw)) {
        setTags((ts) => [...ts, raw]);
      }
      e.target.value = "";
    }
  };

  const removeTag = (idx) =>
      setTags((ts) => ts.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    if (content.length > maxContentLength) {
      setError(`Content cannot exceed ${maxContentLength} characters`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      if (imageFile) {
        // UPLOAD VIA IMGBB ONLY
        const res = await uploadImage(imageFile);
        if (!res.success) throw new Error(res.error);
        imageUrl = res.url;
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
        location: location.trim(),
        tags,
        imageUrl,
        authorId: currentUser.uid,
        authorName: currentUser.displayName,
        likes: [],
        commentCount: 0,
        createdAt: new Date(),
      };

      const result = await addPost(postData);
      if (!result.success) throw new Error(result.error);
      navigate(`/posts/${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preview object
  const previewPost = {
    id: "preview",
    title,
    content,
    category,
    location,
    tags,
    imageUrl: imagePreview,
    authorName: currentUser.displayName,
    createdAt: new Date(),
    likes: [],
    commentCount: 0,
  };

  return (
      <div className="post-form-page">
        <div className="container">
          <h1>Create New Post</h1>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="post-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                  id="title"
                  type="text"
                  value={title}
                  maxLength={100}
                  placeholder="Concise title"
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* Category */}
            <div className="form-group category-select">
              <span>Category *</span>
              {[
                { val: "event", Icon: Calendar, label: "Event" },
                { val: "lost-and-found", Icon: MapPin, label: "Lost & Found" },
                { val: "garage-sale", Icon: ShoppingCart, label: "Garage Sale" },
              ].map(({ val, Icon, label }) => (
                  <label key={val} className={category === val ? "active" : ""}>
                    <input
                        type="radio"
                        name="category"
                        value={val}
                        checked={category === val}
                        onChange={() => setCategory(val)}
                    />
                    <Icon /> {label}
                  </label>
              ))}
            </div>

            {/* Content */}
            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                  id="content"
                  value={content}
                  maxLength={maxContentLength}
                  rows={5}
                  onChange={(e) => setContent(e.target.value)}
                  required
              />
              <div className="char-counter">
                {content.length}/{maxContentLength}
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                  list="location-suggestions"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where is this?"
              />
              <datalist id="location-suggestions">
                <option value="Downtown" />
                <option value="City Park" />
                <option value="Community Center" />
              </datalist>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input">
                <TagIcon />
                <input
                    type="text"
                    placeholder="Enter tags"
                    onKeyDown={handleTagKeyDown}
                />
              </div>
              <div className="tags-list">
                {tags.map((t, i) => (
                    <span key={i} className="tag-item">
                  {t} <button onClick={() => removeTag(i)}>×</button>
                </span>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Image</label>
              <div className="image-upload">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                />
              </div>
              {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
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
                {loading ? <Loader small /> : "Create Post"}
              </button>
            </div>
          </form>

          {/* Live Preview */}
          {(title || content || imagePreview) && (
              <div className="preview-section">
                <h2>Live Preview</h2>
                <PostCard post={previewPost} />
              </div>
          )}
        </div>
      </div>
  );
}
