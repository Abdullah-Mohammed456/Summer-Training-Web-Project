import { useEffect, useState } from 'react';
import './AdminPages.css';
import { FaTrash } from 'react-icons/fa';
import { auth } from '../../firebase';
import { getAdminUsers, type ApiUser } from '../../lib/api';

const Users = () => {
  const [usersData, setUsersData] = useState<ApiUser[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError('Sign in with an administrator account to view users.');
      setLoading(false);
      return;
    }

    void getAdminUsers(currentUser)
      .then((users) => {
        if (isMounted) setUsersData(users);
      })
      .catch(() => {
        if (isMounted) setError('Unable to load users.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header">
        <h1>System Users</h1>
        <p>Manage all registered accounts.</p>
      </div>

      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5}>Loading users…</td></tr>}
            {!loading && error && <tr><td colSpan={5}>{error}</td></tr>}
            {!loading && !error && usersData.map((user, index) => (
              <tr key={user.uid}>
                <td>{index + 1}</td>
                <td style={{fontWeight: '600'}}>{user.email ?? '—'}</td>
                <td><span className={`status-badge ${user.role === 'admin' ? 'completed' : 'shipped'}`}>{user.role}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="action-btn delete" disabled style={{opacity: 0.5}}><FaTrash /> Delete</button>
                </td>
              </tr>
            ))}
            {!loading && !error && usersData.length === 0 && <tr><td colSpan={5}>No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
