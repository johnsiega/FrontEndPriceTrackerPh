import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { loginUser } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    console.log('🔍 Sending login request with:', formData);
    const response = await loginUser(formData);
    console.log('🔍 Login API response:', response);
    console.log('🔍 Response data:', response.data);
    
    // FIX: Extract from response.data.data instead of response.data
    const { user, token } = response.data.data; // ← ADD .data here!
    console.log('🔍 Extracted user:', user, 'token:', token);
    
    if (!user || !token) {
      throw new Error('Invalid response from server: missing user or token');
    }
    
    console.log('🔍 Calling login function with user:', user);
    login(user, token);
    console.log('🔍 Login function completed, navigating...');
    navigate('/');
  } catch (err) {
    console.error('🔍 Login error:', err);
    console.error('🔍 Error response:', err.response);
    setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <h1>Welcome Back</h1>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn" 
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="auth-link">
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
      
      <div className="auth-link">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </div>
    </div>
  );
}

export default Login;