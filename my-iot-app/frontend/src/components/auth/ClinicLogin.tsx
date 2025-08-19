import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const ClinicLogin: React.FC = () => {
  const [code, setCode] = useState('G16B0T');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setClinic } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = 'http://localhost:3000/api';
      console.log('Clinic login to:', `${apiUrl}/auth/clinic`);
      console.log('Clinic code:', code);
      
      const response = await fetch(`${apiUrl}/auth/clinic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const clinic = await response.json();
        setClinic(clinic);
        navigate('/clinician/register');
      } else {
        setError('Invalid clinic code');
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
        <h1 className="login-title">Gait Metrics System</h1>
        <p className="login-subtitle">Enter your clinic code to continue</p>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="login-input"
              placeholder="◦ Enter Clinic Code"
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="login-button"
          >
            <span>{loading ? 'Verifying...' : 'Continue'}</span>
          </button>
        </form>
        
        <div className="secondary-actions">
          <button
            type="button"
            onClick={() => navigate('/clinic/register')}
            className="logout-link"
          >
            Register New Clinic
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicLogin;
