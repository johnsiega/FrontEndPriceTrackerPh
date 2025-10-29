import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(token, formData.password);
      setMessage('Password reset successfully! You can now login with your new password.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Set New Password</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
      
      <div className="auth-link">
        <Link to="/login">← Back to Login</Link>
      </div>
    </div>
  );
}

export default ResetPassword;