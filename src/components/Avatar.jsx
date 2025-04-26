// src/components/Avatar.jsx
import React from "react";
import "../styles/components/_Avatar.scss";

export default function Avatar({ src, alt, size = 40 }) {
    return (
        <img
            className="avatar"
            src={src}
            alt={alt}
            width={size}
            height={size}
        />
    );
}