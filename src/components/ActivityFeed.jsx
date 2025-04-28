import React from "react";
import PostCard from "./PostCard";
import "../styles/components/_activityFeed.scss";

export default function ActivityFeed({ posts=[], isMe }) {
    return (
        <div className="activity-feed">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
    );
}
