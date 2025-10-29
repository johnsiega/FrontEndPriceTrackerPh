import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState(''); // Add this state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetLink('');

    try {
      const response = await forgotPassword(email);
      
      // Check if we got a reset link back (for development)
      if (response.data.resetLink) {
        setResetLink(response.data.resetLink);
        setMessage('Reset link generated for testing:');
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      
      {resetLink && (
        <div className="reset-link-container">
          <p><strong>Development Reset Link:</strong></p>
          <a href={resetLink} className="reset-link">
            {resetLink}
          </a>
          <p className="reset-help">
            Click this link to reset your password (for testing only)
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email address"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn" 
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>
      
      <div className="auth-link">
        <Link to="/login">← Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;