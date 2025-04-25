import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser, updateUser } from "../../firebase/firestore";
import Loader from "../../components/Loader";
import { useAuth } from '../../context/AuthContext';
import formatDate from "../../utils/formatDate";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getUsers();
        
        if (result.success) {
          setUsers(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        const result = await deleteUser(userId);
        
        if (result.success) {
          setUsers(users.filter(user => user.id !== userId));
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleAdmin = async (userId, currentRole) => {
    try {
      setLoading(true);
      const newRole = currentRole === "admin" ? "user" : "admin";
      const result = await updateUser(userId, { role: newRole });
      
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return <div>Unauthorized access</div>;
  }

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-management">
      <div className="container">
        <div className="page-header">
          <h1>User Management</h1>
          <Link to="/admin" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        {users.length > 0 ? (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <Link to={`/profile/${user.id}`} className="user-link">
                        {user.displayName || "Anonymous"}
                      </Link>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt?.toDate())}</td>
                    <td>
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.role)}
                        className="btn btn-outline btn-sm"
                      >
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                      {user.id !== currentUser.uid && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-users">No users found</div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;