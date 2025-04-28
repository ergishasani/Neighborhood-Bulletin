import React, { useState, useEffect } from "react";
import { getComments, addComment } from "../firebase/firestore";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import "../styles/components/_comment-section.scss";

export default function CommentSection() {
    const { id: postId } = useParams();
    const { currentUser } = useAuth();

    const [comments, setComments]     = useState([]);
    const [newText, setNewText]       = useState("");
    const [loading, setLoading]       = useState(true);
    const [posting, setPosting]       = useState(false);
    const [error, setError]           = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getComments(postId);
            if (res.success) setComments(res.data);
            else setError(res.error);
            setLoading(false);
        })();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newText.trim()) return;
        setPosting(true);
        const res = await addComment(postId, {
            text: newText,
            authorId: currentUser.uid,
            authorName: currentUser.displayName,
        });
        if (res.success) {
            // push a synthetic comment with a JS Date so the parser below works
            setComments((c) => [
                {
                    id: res.id,
                    text: newText,
                    authorName: currentUser.displayName,
                    createdAt: new Date(),
                },
                ...c,
            ]);
            setNewText("");
        } else {
            setError(res.error);
        }
        setPosting(false);
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="comment-section">
            <form className="add-comment" onSubmit={handleSubmit}>
        <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
        />
                <button type="submit" disabled={posting}>
                    {posting ? "Posting…" : "Post Comment"}
                </button>
            </form>

            <div className="comments-list">
                {comments.map((comment) => {
                    // —— Robust date parsing ——
                    let dateObj;
                    if (comment.createdAt && typeof comment.createdAt.toDate === "function") {
                        dateObj = comment.createdAt.toDate();
                    } else if (comment.createdAt instanceof Date) {
                        dateObj = comment.createdAt;
                    } else if (comment.createdAt?.seconds) {
                        dateObj = new Date(comment.createdAt.seconds * 1000);
                    } else {
                        dateObj = new Date(comment.createdAt);
                    }
                    const dateStr = isNaN(dateObj) ? "" : dateObj.toLocaleString();

                    return (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <strong>{comment.authorName}</strong>{" "}
                                <span className="comment-date">{dateStr}</span>
                            </div>
                            <p className="comment-body">{comment.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
