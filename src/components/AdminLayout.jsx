import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { FaHome, FaCar, FaShoppingCart, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          NetClaks Admin
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <FaHome /> Dashboard
          </NavLink>
          <NavLink to="/admin/cars" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <FaCar /> Manage Cars
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <FaShoppingCart /> Orders
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "admin-nav-item active" : "admin-nav-item"}>
            <FaUsers /> Users
          </NavLink>
        </nav>
        
        <div className="admin-logout">
          <button onClick={handleLogout} className="admin-logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h2>Admin Portal</h2>
          <div className="admin-profile">
            <span>Admin User</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
