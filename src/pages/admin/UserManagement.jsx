import React, { useState, useEffect } from "react";
import {
  getUsers,
  updateUser,
  deleteUser
} from "../../firebase/firestore";
import Loader from "../../components/Loader";
import {
  FaTrash,
  FaSave,
  FaTimes,
  FaEdit
} from "react-icons/fa";
import "../../styles/pages/_userManagement.scss";

export default function UserManagement() {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [users, setUsers]           = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [editData, setEditData]     = useState({});

  // Fetch users on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getUsers();
        if (!res.success) throw new Error(res.error);
        setUsers(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startEditing = (user) => {
    setEditingId(user.id);
    setEditData({
      displayName: user.displayName || "",
      email:       user.email || "",
      role:        user.role || "user"
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveChanges = async (uid) => {
    setLoading(true);
    try {
      const res = await updateUser(uid, editData);
      if (!res.success) throw new Error(res.error);
      // apply locally
      setUsers((prev) =>
          prev.map((u) =>
              u.id === uid ? { ...u, ...editData } : u
          )
      );
      cancelEditing();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm("Delete this user?")) return;
    setLoading(true);
    try {
      const res = await deleteUser(uid);
      if (!res.success) throw new Error(res.error);
      setUsers((prev) => prev.filter((u) => u.id !== uid));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <div className="error-message">{error}</div>;

  return (
      <div className="user-management-page">
        <div className="container">
          <h1>User Management</h1>
          <table className="user-table">
            <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="actions-col">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((u) => {
              const isEditing = editingId === u.id;
              return (
                  <tr key={u.id}>
                    <td>
                      {isEditing ? (
                          <input
                              type="text"
                              value={editData.displayName}
                              onChange={(e) =>
                                  setEditData((d) => ({
                                    ...d,
                                    displayName: e.target.value
                                  }))
                              }
                          />
                      ) : (
                          u.displayName || "—"
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                          <input
                              type="email"
                              value={editData.email}
                              onChange={(e) =>
                                  setEditData((d) => ({
                                    ...d,
                                    email: e.target.value
                                  }))
                              }
                          />
                      ) : (
                          u.email || "—"
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                          <select
                              value={editData.role}
                              onChange={(e) =>
                                  setEditData((d) => ({
                                    ...d,
                                    role: e.target.value
                                  }))
                              }
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                      ) : (
                          u.role || "user"
                      )}
                    </td>
                    <td className="actions-col">
                      {isEditing ? (
                          <>
                            <button
                                className="btn-save"
                                onClick={() => saveChanges(u.id)}
                                title="Save"
                            >
                              <FaSave />
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={cancelEditing}
                                title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                      ) : (
                          <>
                            <button
                                className="btn-edit"
                                onClick={() => startEditing(u)}
                                title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => handleDelete(u.id)}
                                title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </>
                      )}
                    </td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
  );
}
