import { useContext } from 'react';
import { AuthContext } from '../App';

function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h1>{user?.name}</h1>
        <p>{user?.email}</p>
        <div className="user-role-badge">
          {user?.role === 'admin' ? 'Administrator' : 'User'}
        </div>
      </div>
      
      <div className="profile-info">
        <div className="info-group">
          <span className="info-label">Account Type:</span>
          <span className="info-value">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</span>
        </div>
        
        <div className="info-group">
          <span className="info-label">Member Since:</span>
          <span className="info-value">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        
        <div className="info-group">
          <span className="info-label">Last Login:</span>
          <span className="info-value">
            {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;