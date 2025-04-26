import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getUserByUid, updateUser } from "../../firebase/firestore";  // <- changed
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

function EditProfile() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio]     = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserByUid(currentUser.uid);  // <- changed
        if (res.success) {
          const u = res.data;
          setName(u.displayName || "");
          setEmail(u.email || "");
          setBio(u.bio || "");
        } else {
          setError(res.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return setError("Name is required");
    }

    setLoading(true);
    setError("");

    try {
      // 1) Update Firebase Auth
      await updateProfile(auth.currentUser, { displayName: name.trim() });

      // 2) Update Firestore
      const res = await updateUser(currentUser.uid, {
        displayName: name.trim(),
        bio,
      });
      if (!res.success) {
        throw new Error(res.error);
      }

      navigate(`/profile/${currentUser.uid}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <Loader />;

  return (
      <div className="edit-profile-page">
        <div className="container">
          <h1>Edit Profile</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  placeholder="Tell your neighbors about yourself..."
              />
            </div>

            <div className="form-actions">
              <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
              >
                {loading ? <Loader small /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default EditProfile;
