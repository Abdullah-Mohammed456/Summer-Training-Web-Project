import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'register', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const normalizedEmail = (email || '').toLowerCase();
      
      if (normalizedEmail === 'admin@123.com') {
        navigate('/admin');
        return;
      }

      let role = 'user';
      try {
        const snap = await get(ref(db, `roles/${uid}`));
        if (snap.exists()) {
          role = snap.val()?.role || 'user';
        }
      } catch (roleErr) {
        console.warn("Could not fetch user role", roleErr);
      }

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e, isAdmin = false) => {
    e.preventDefault();
    setError('');
    
    if (isAdmin && secretKey !== '1111') {
      setError('Invalid admin secret key.');
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }
      
      try {
        await set(ref(db, `roles/${userCred.user.uid}`), { role: isAdmin ? "admin" : "user" });
      } catch (dbErr) {
        console.warn("Could not save role to database", dbErr);
      }
      
      navigate(isAdmin ? '/admin' : '/products');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card glass">
          <div className="auth-tabs" style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              Register
            </button>
            <button 
              className={`auth-tab ${activeTab === 'admin' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('admin'); setError(''); }}
            >
              Admin
            </button>
          </div>

          {activeTab === 'login' && (
            <form className="auth-form animate-fade-in" onSubmit={handleLogin}>
              <h2>Welcome Back</h2>
              <p>Enter your details to access your account.</p>
              
              {error && <div className="auth-error" style={{color: '#ff4d4f', marginBottom: '15px'}}>{error}</div>}

              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}
          
          {activeTab === 'register' && (
            <form className="auth-form animate-fade-in" onSubmit={(e) => handleRegister(e, false)}>
              <h2>Create Account</h2>
              <p>Join NetClaks today to start your journey.</p>

              {error && <div className="auth-error" style={{color: '#ff4d4f', marginBottom: '15px'}}>{error}</div>}
              
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <input type="text" id="reg-name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input type="email" id="reg-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input type="password" id="reg-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          )}

          {activeTab === 'admin' && (
            <form className="auth-form animate-fade-in" onSubmit={(e) => handleRegister(e, true)}>
              <h2>Admin Access</h2>
              <p>Register a new administrator account.</p>

              {error && <div className="auth-error" style={{color: '#ff4d4f', marginBottom: '15px'}}>{error}</div>}
              
              <div className="form-group">
                <label htmlFor="admin-key">Secret Key</label>
                <input type="password" id="admin-key" value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="Enter Admin Pin" required />
              </div>

              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <input type="email" id="admin-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-password">Admin Password</label>
                <input type="password" id="admin-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              
              <button type="submit" className="auth-btn" disabled={loading} style={{background: 'var(--primary)'}}>
                {loading ? 'Authorizing...' : 'Create Admin Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
