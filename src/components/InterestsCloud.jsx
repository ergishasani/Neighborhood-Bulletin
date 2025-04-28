import React from "react";
import "../styles/components/_interestsCloud.scss";

export default function InterestsCloud({ interests=[] }) {
    return (
        <div className="interests-cloud">
            {interests.map(i => (
                <span key={i} className="interest">{i}</span>
            ))}
        </div>
    );
}
