// src/components/QuickPostForm.jsx

import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../firebase/imgbb";         // imgbb helper
import { addPost } from "../firebase/firestore";         // Firestore addPost
import Loader from "./Loader";
import {
    Calendar,
    MapPin,
    ShoppingCart,
    Tag as TagIcon,
    Crosshair
} from "lucide-react";
import "../styles/components/_quickPostForm.scss";

export default function QuickPostForm({ onPostCreated }) {
    const { currentUser } = useAuth();
    const fileInputRef = useRef();

    const [title, setTitle]       = useState("");
    const [content, setContent]   = useState("");
    const [category, setCategory] = useState("event");
    const [location, setLocation] = useState("");
    const [coords, setCoords]     = useState(null);
    const [tags, setTags]         = useState([]);
    const [imageFile, setImageFile]       = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState("");

    const maxContentLen = 500;

    // Handle image selection + preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Tag input on Enter or comma
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
    const removeTag = (i) => setTags((ts) => ts.filter((_, idx) => idx !== i));

    // Detect user location via Geolocation + reverse‐geocode
    const detectLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            return;
        }
        setError("");
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                try {
                    const resp = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await resp.json();
                    setLocation(data.address.city || data.display_name);
                    setCoords({ lat: latitude, lng: longitude });
                } catch {
                    setError("Reverse geocode failed");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Location permission denied");
                setLoading(false);
            }
        );
    };

    // Submit new post
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("Title & content required");
            return;
        }
        setLoading(true);
        setError("");
        try {
            let imageUrl = "";
            if (imageFile) {
                const uploadRes = await uploadImage(imageFile);
                if (!uploadRes.success) throw new Error(uploadRes.error);
                imageUrl = uploadRes.url;
            }

            const postData = {
                title: title.trim(),
                content: content.trim(),
                category,
                location: location.trim(),
                coords,
                tags,
                imageUrl,
                authorId: currentUser.uid,
                authorName: currentUser.displayName,
                likes: [],
                commentCount: 0,
                createdAt: new Date(),
            };

            const { success, id } = await addPost(postData);
            if (!success) throw new Error("Failed to save post");
            const newPost = { id, ...postData };
            onPostCreated(newPost);
            // reset form
            setTitle("");
            setContent("");
            setCategory("event");
            setLocation("");
            setCoords(null);
            setTags([]);
            setImageFile(null);
            setImagePreview("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quick-post-form">
            <h2>Create a Post</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    maxLength={100}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />

                {/* Content */}
                <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    maxLength={maxContentLen}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                <div className="char-counter">{content.length}/{maxContentLen}</div>

                {/* Category */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                >
                    <option value="event">Event</option>
                    <option value="lost-and-found">Lost & Found</option>
                    <option value="garage-sale">Garage Sale</option>
                </select>

                {/* Location + Detect */}
                <div className="location-group">
                    <input
                        type="text"
                        placeholder="Location (enter or detect)"
                        value={location}
                        onChange={(e) => { setLocation(e.target.value); setCoords(null); }}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={detectLocation}
                        disabled={loading}
                        title="Detect my location"
                    >
                        <Crosshair />
                    </button>
                </div>

                {/* Tags */}
                <div className="tags-input">
                    <TagIcon />
                    <input
                        type="text"
                        placeholder="Add tags (Enter or ,)"
                        onKeyDown={handleTagKeyDown}
                        disabled={loading}
                    />
                </div>
                <div className="tags-list">
                    {tags.map((t, i) => (
                        <span key={i} className="tag-item">
              {t} <button type="button" onClick={() => removeTag(i)}>×</button>
            </span>
                    ))}
                </div>

                {/* Image Upload */}
                <div className="image-upload">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                    >
                        {imagePreview ? "Change Image" : "Upload Image"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        disabled={loading}
                    />
                </div>
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                    </div>
                )}

                {/* Submit */}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <Loader small /> : "Post"}
                </button>
            </form>
        </div>
    );
}
