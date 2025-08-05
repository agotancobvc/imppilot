import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { API_ENDPOINTS } from '@/config/endpoints';

const ClinicLogin: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setClinic } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.CLINIC_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const clinic = await response.json();
        setClinic(clinic);
        navigate('/auth/clinician');
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
      </div>
    </div>
  );
};

export default ClinicLogin;
