import React, { useState } from "react";

export default function FollowButton({ userId }) {
    const [following, setFollowing] = useState(false);

    // TODO: wire up real follow/unfollow logic via Firestore
    const toggle = () => setFollowing(f => !f);

    return (
        <button
            onClick={toggle}
            className={`btn ${following ? "btn-secondary" : "btn-primary"}`}
        >
            {following ? "Unfollow" : "Follow"}
        </button>
    );
}
