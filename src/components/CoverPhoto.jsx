import React, { useRef } from "react";
import "../styles/components/_coverPhoto.scss";

export default function CoverPhoto({ src, editable, onUpload }) {
    const fileRef = useRef();
    const pick = () => fileRef.current.click();
    const handle = (e) => {
        const f = e.target.files[0];
        if (f && onUpload) onUpload(f);
    };

    return (
        <div
            className="cover-photo"
            style={{ backgroundImage: `url(${src || "/default-cover.jpg"})` }}
        >
            {editable && (
                <>
                    <button className="cover-upload-btn" onClick={pick}>
                        Change Cover
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={handle}
                        style={{ display: "none" }}
                    />
                </>
            )}
        </div>
    );
}
