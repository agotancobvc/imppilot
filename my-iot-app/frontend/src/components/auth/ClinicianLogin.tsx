import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const ClinicianLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { clinic, setClinician } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = 'http://localhost:3000/api';
      console.log('Clinician login to:', `${apiUrl}/auth/clinician`);
      console.log('Login data:', { clinicId: clinic?.id, username });
      
      const response = await fetch(`${apiUrl}/auth/clinician`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clinicId: clinic?.id,
          username, 
          password 
        }),
      });

      if (response.ok) {
        const clinician = await response.json();
        setClinician(clinician);
        navigate('/patients');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Clinician Portal</h1>
        <p className="login-subtitle">
          Welcome to {clinic?.name}. Enter your credentials to access the system.
        </p>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="◦ Enter Username"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="◦ Enter Password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="login-button"
          >
            <span>{loading ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>
        
        <div className="secondary-actions">
          <button 
            onClick={() => navigate('/clinic/login')} 
            className="back-button"
          >
            ← Back to Clinic Login
          </button>
          <button 
            onClick={() => navigate('/clinician/register')} 
            className="register-link"
          >
            Register as Clinician
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicianLogin;
