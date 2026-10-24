import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getApiUser, saveApiProfile } from '../lib/api';
import './Login.css';

type AuthMode = 'login' | 'register';

const getSafeAuthError = (error: unknown): string => {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already uses this email.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Choose a stronger password.';
    default:
      return 'We could not complete that request. Please try again.';
  }
};

const Login = () => {
  const [activeTab, setActiveTab] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      try {
        const profile = await getApiUser(cred.user);
        if (profile.role === 'admin') {
          navigate('/admin');
          return;
        }
      } catch {
        // Admin access is checked again by the API before any protected data is returned.
      }

      navigate('/products');
    } catch (authError: unknown) {
      setError(getSafeAuthError(authError));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCred.user, { displayName: name });
      }
      try {
        await saveApiProfile(userCred.user, name);
      } catch {
        // The account remains usable; the API creates its profile on the next authenticated request.
      }

      navigate('/products');
    } catch (authError: unknown) {
      setError(getSafeAuthError(authError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-card glass">
          <div className="auth-tabs">
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
            <form className="auth-form animate-fade-in" onSubmit={handleRegister}>
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

        </div>
      </div>
    </Layout>
  );
};

export default Login;
