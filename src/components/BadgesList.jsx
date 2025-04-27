import React from "react";
import "../styles/components/_badgesList.scss";

export default function BadgesList({ badges=[] }) {
    return (
        <div className="badges-list">
            {badges.map(b => (
                <div key={b} className="badge">{b}</div>
            ))}
        </div>
    );
}
