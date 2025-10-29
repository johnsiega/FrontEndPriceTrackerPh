import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Home from './pages/Home';
import Commodities from './pages/Commodities';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import { verifyToken } from './services/api';
import './App.css';

// Create Auth Context
export const AuthContext = createContext();

// Navigation Component that uses the context
function Navigation() {
  const { user, logout } = useContext(AuthContext);

  console.log('🔍 Navigation rendering - user:', user); // DEBUG

  const handleLogout = () => {
    console.log('🚪 Logout clicked'); // DEBUG
    logout();
  };

  return (
    <nav>
      <div className="nav-brand">
        <Link to="/">🌾 Presyo sa Merkados</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/commodities">Monitor Market</Link>
        <Link to="/search">Search</Link>
        {user ? (
          <div className="user-menu">
            <span className="welcome-text">Welcome, {user.name}</span>
            <Link to="/profile" className="profile-link">
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-link">🔐 Login</Link>
            <Link to="/register" className="register-link">📝 Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔍 App rendering - user state:', user, 'loading:', loading); // DEBUG

  useEffect(() => {
    console.log('🔍 App mounted, starting auth check...'); // DEBUG
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('🔍 checkAuth started...'); // DEBUG
    
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔍 LocalStorage - token:', token ? 'exists' : 'null', 'user:', storedUser); // DEBUG
    
    if (token && storedUser) {
      try {
        console.log('🔍 Attempting token verification...'); // DEBUG
        const response = await verifyToken();
        console.log('🔍 Token verification SUCCESS:', response.data); // DEBUG
        setUser(response.data.user);
      } catch (error) {
        console.error('🔍 Token verification FAILED:', error); // DEBUG
        console.error('🔍 Error details:', error.response?.data || error.message); // DEBUG
        
        // Fallback: use stored user data
        console.log('🔍 Using stored user as fallback'); // DEBUG
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('🔍 Failed to parse stored user:', parseError); // DEBUG
          setUser(null);
        }
      }
    } else {
      console.log('🔍 No token or user in localStorage'); // DEBUG
      setUser(null);
    }
    
    console.log('🔍 Auth check complete, setting loading to false'); // DEBUG
    setLoading(false);
  };

const login = (userData, token) => {
  console.log('🔍 Login function called with:', userData, 'token:', token); // DEBUG
  
  // Add validation and fallbacks
  if (!userData) {
    console.error('🔍 WARNING: userData is undefined/null');
    // Create a fallback user object
    userData = { 
      name: 'User', 
      email: formData?.email || 'user@example.com',
      id: Date.now() // temporary ID
    };
  }
  
  if (!token) {
    console.error('🔍 WARNING: token is undefined/null');
    token = 'temp-token-' + Date.now();
  }
  
  setUser(userData);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  console.log('🔍 Login completed - user set to:', userData); // DEBUG
};

  const logout = () => {
    console.log('🔍 Logout called'); // DEBUG
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    console.log('🔍 App showing loading screen'); // DEBUG
    return (
      <div className="loading-fullscreen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  console.log('🔍 App rendering main content'); // DEBUG
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <div className="App">
          <Navigation />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/commodities" element={<Commodities />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/profile" element={
                user ? <Profile /> : <Navigate to="/login" />
              } />
            </Routes>
          </main>

          <footer>
            <p>Presyo sa Merkados © 2025 | Data from Department of Agriculture</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;