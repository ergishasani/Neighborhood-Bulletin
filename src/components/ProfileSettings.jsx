import React, { useState } from "react";
import { updateUser } from "../firebase/firestore";
import "../styles/components/_profileSettings.scss";

export default function ProfileSettings({ user }) {
    const [open, setOpen] = useState(false);
    const [bio, setBio] = useState(user.bio || "");
    const [neighborhood, setNeighborhood] = useState(user.neighborhood || "");
    const [website, setWebsite] = useState(user.website || "");
    const [loading, setLoading] = useState(false);
    const toggle = () => setOpen((o) => !o);

    const save = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateUser(user.id, { bio, neighborhood, website });
        setLoading(false);
        setOpen(false);
    };

    return (
        <>
            <button className="btn btn-outline" onClick={toggle}>
                Settings
            </button>
            {open && (
                <div className="settings-modal">
                    <div className="settings-content">
                        <h2>Edit Profile</h2>
                        <form onSubmit={save}>
                            <label>Bio</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                            <label>Neighborhood</label>
                            <input
                                type="text"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                            />
                            <label>Website</label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                            <div className="actions">
                                <button type="button" onClick={toggle} disabled={loading}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
