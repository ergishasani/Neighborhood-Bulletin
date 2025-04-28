import React, { useRef } from "react";
import Avatar from "./Avatar";
import "../styles/components/_avatarUploader.scss";

export default function AvatarUploader({ src, size = 80, editable, onUpload }) {
    const fileRef = useRef();
    const pick = () => fileRef.current.click();
    const handle = (e) => {
        const f = e.target.files[0];
        if (f && onUpload) onUpload(f);
    };

    return (
        <div className="avatar-uploader" style={{ width: size, height: size }}>
            <Avatar src={src} size={size} />
            {editable && (
                <>
                    <div className="avatar-overlay" onClick={pick}>✎</div>
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
