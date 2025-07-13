import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginProps {
  onLogin: (token: string, clinicianName: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [clinicianId, setClinicianId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicianId: clinicianId.toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('clinicianName', data.name);
        onLogin(data.token, data.name);
        navigate('/patient-select');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Gait Analysis System</h2>
          <p className="login-subtitle">Clinician Portal</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clinicianId">Clinician ID</label>
            <input
              type="text"
              id="clinicianId"
              className="form-control"
              value={clinicianId}
              onChange={(e) => setClinicianId(e.target.value)}
              placeholder="Enter your clinician ID"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !clinicianId || !password}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          <p>Demo Accounts:</p>
          <p>dr.smith / password123</p>
          <p>admin / admin</p>
        </div>
      </div>
    </div>
  );
};
