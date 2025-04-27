import React from "react";
import "../styles/components/_activityMap.scss";

export default function ActivityMap({ posts=[] }) {
    // Placeholder: integrate Leaflet or Google Maps here
    return (
        <div className="activity-map">
            {/* TODO: render a map with markers for posts that have coords */}
            <p>Map of post locations will go here.</p>
        </div>
    );
}
