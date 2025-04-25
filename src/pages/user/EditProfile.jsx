import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getUserById, updateUser } from "../../firebase/firestore";
import { useAuth } from '../../context/AuthContext';
import Loader from "../../components/Loader";

function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserById(currentUser.uid);
        
        if (result.success) {
          const userData = result.data;
          setName(userData.displayName || "");
          setEmail(userData.email || "");
          setBio(userData.bio || "");
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      return setError("Name is required");
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      
      // Update Firestore user document
      const result = await updateUser(currentUser.uid, {
        displayName: name,
        bio,
      });
      
      if (result.success) {
        navigate(`/profile/${currentUser.uid}`);
      } else {
        throw new Error(result.error);
      }
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
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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