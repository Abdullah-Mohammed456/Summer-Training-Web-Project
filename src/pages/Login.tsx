import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PasswordInput from '../components/PasswordInput';
import { ApiError } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import './Login.css';

type AuthMode = 'login' | 'register';

const getSafeAuthError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Email or password is incorrect.';
      case 409:
        return 'An account already uses this email.';
      case 429:
        return 'Too many attempts. Please try again later.';
      case 400:
        return 'Check the entered details and use a password with at least 12 characters.';
    }
  }
  return 'We could not complete that request. Please try again.';
};

const Login = () => {
  const [activeTab, setActiveTab] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/products');
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
      await register(email, password, name);
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
              type="button"
              aria-pressed={activeTab === 'login'}
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Login
            </button>
            <button 
              type="button"
              aria-pressed={activeTab === 'register'}
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' && (
            <form className="auth-form animate-fade-in" onSubmit={handleLogin} aria-busy={loading}>
              <h2>Welcome Back</h2>
              <p>Enter your details to access your account.</p>
              
              {error && <div className="auth-error" role="alert">{error}</div>}

              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" name="email" autoComplete="username" spellCheck={false} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <PasswordInput id="login-password" name="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" maxLength={128} required />
              </div>
              
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}
          
          {activeTab === 'register' && (
            <form className="auth-form animate-fade-in" onSubmit={handleRegister} aria-busy={loading}>
              <h2>Create Account</h2>
              <p>Join NetClaks today to start your journey.</p>

              {error && <div className="auth-error" role="alert">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <input type="text" id="reg-name" name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" maxLength={120} required />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input type="email" id="reg-email" name="email" autoComplete="email" spellCheck={false} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <PasswordInput id="reg-password" name="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={12} maxLength={128} required />
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
