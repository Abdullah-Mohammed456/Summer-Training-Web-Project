import './AdminPages.css';
import { FaTrash } from 'react-icons/fa';

const Users = () => {
  const usersData = [
    { id: 1, email: 'ethan@example.com', role: 'user', joined: '2024-07-10' },
    { id: 2, email: 'admin@123.com', role: 'admin', joined: '2024-01-01' },
    { id: 3, email: 'noah@example.com', role: 'user', joined: '2024-07-15' },
    { id: 4, email: 'ava@example.com', role: 'user', joined: '2024-07-18' },
  ];

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
            {usersData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td style={{fontWeight: '600'}}>{user.email}</td>
                <td><span className={`status-badge ${user.role === 'admin' ? 'completed' : 'shipped'}`}>{user.role}</span></td>
                <td>{user.joined}</td>
                <td>
                  <button className="action-btn delete" disabled={user.role === 'admin'} style={{opacity: user.role === 'admin' ? 0.5 : 1}}><FaTrash /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
