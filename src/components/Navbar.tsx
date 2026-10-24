import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="logo"><Link to="/" style={{color:'white', textDecoration:'none'}} onClick={() => setIsMobileMenuOpen(false)}>NetClaks</Link></div>
        
        <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Products</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink></li>
          {user ? (
            <li><button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="logout-btn" style={{background:'transparent', border:'none', color:'var(--text-muted)', fontSize:'1rem', cursor:'pointer', fontWeight:'500'}}>Logout</button></li>
          ) : (
            <li><NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink></li>
          )}
        </ul>
        <a href="#explore" className="nav-cta">Explore</a>
      </div>
    </nav>
  );
};

export default Navbar;
