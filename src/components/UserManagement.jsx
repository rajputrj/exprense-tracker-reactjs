import { useState, useEffect } from 'react';
import { Users, Plus, X, UserPlus, Trash2, AlertTriangle, Edit2, Save } from 'lucide-react';
import { getUsers, createUser, deleteUser, updateUser } from '../services/api';
import { getCurrentUser } from '../services/auth';
import Loader from './Loader';
import Toast from './Toast';

function UserManagement({ onUserCreated }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.name) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Password is only required for new users, optional for editing
    if (!editingUser && !formData.password) {
      showToast('Password is required for new users', 'error');
      return;
    }

    try {
      const currentUser = getCurrentUser();
      
      if (editingUser) {
        // Update existing user
        setUpdatingUserId(editingUser.id);
        const updateData = {
          username: formData.username,
          name: formData.name,
          role: formData.role,
          updatedBy: currentUser.id
        };
        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
        }
        const updatedUser = await updateUser(editingUser.id, updateData);
        
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', role: 'user' });
        showToast('User updated successfully!', 'success');
      } else {
        // Create new user
        const newUser = await createUser({
          ...formData,
          createdBy: currentUser.id
        });
        
        setUsers([...users, newUser]);
        setIsModalOpen(false);
        setFormData({ username: '', password: '', name: '', role: 'user' });
        showToast('User created successfully!', 'success');
      }
      
      if (onUserCreated) onUserCreated();
    } catch (error) {
      console.error('Failed to save user:', error);
      showToast(error.response?.data?.error || 'Failed to save user', 'error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't pre-fill password
      name: user.name,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '', password: '', name: '', role: 'user' });
  };

  const handleDeleteClick = (user) => {
    setDeleteConfirm(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    try {
      setDeletingUserId(deleteConfirm.id);
      const currentUser = getCurrentUser();
      await deleteUser(deleteConfirm.id, currentUser.id);
      
      setUsers(users.filter(u => u.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      showToast('User and their expenses deleted successfully!', 'success');
      if (onUserCreated) onUserCreated();
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast(error.response?.data?.error || 'Failed to delete user', 'error');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="md" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">User Management</h2>
          <p className="text-gray-600">Create and manage users (Super Admin Only)</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No users found</p>
          <p className="text-gray-500 text-sm">Create your first user to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => {
          const currentUser = getCurrentUser();
          const canDelete = user.role !== 'superadmin' && user.id !== currentUser?.id;
          const canEdit = true; // Superadmin can edit all users
          const isDeleting = deletingUserId === user.id;
          const isUpdating = updatingUserId === user.id;
          
          return (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100 transition-all duration-300 animate-fadeIn relative group"
            >
              {/* User Avatar and Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                  user.role === 'superadmin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                  <div className="mt-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'superadmin' ? 'Super Admin' : 'User'}
                    </span>
                    {user.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-gray-500 font-medium">(You)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {canEdit && (
                  <button
                    onClick={() => handleEditClick(user)}
                    disabled={isUpdating || isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    title="Edit user"
                  >
                    {isUpdating ? (
                      <div className="spinner w-4 h-4 border-2 border-blue-600 border-t-transparent"></div>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDeleteClick(user)}
                    disabled={isDeleting || isUpdating}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    title="Delete user"
                  >
                    {isDeleting ? (
                      <div className="spinner w-4 h-4 border-2 border-red-600 border-t-transparent"></div>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-scaleIn">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                {editingUser ? (
                  <Edit2 className="w-6 h-6 text-blue-600" />
                ) : (
                  <UserPlus className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password {editingUser && <span className="text-gray-400 text-sm font-normal">(leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingUser}
                  placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingUserId === editingUser?.id}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  {updatingUserId === editingUser?.id ? (
                    <>
                      <div className="spinner w-4 h-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : editingUser ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update User</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Delete User</h2>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              </p>
              <p className="text-xs text-gray-600">
                This will permanently remove the user account and <strong>all expenses</strong> created by this user. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingUserId === deleteConfirm.id}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                {deletingUserId === deleteConfirm.id ? (
                  <>
                    <div className="spinner w-4 h-4 border-2 border-white border-t-transparent"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default UserManagement;

