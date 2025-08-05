import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const PatientLogin: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { clinic, clinician, setPatient, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId: clinic?.id,
          clinicianId: clinician?.id,
          patientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid patient ID');
      }

      const { patient, token } = await response.json();
      setPatient(patient);
      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/auth/clinician');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Patient Access</h1>
        <p className="login-subtitle">
          Welcome, {clinician?.firstName} {clinician?.lastName}. Select a patient to monitor.
        </p>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="login-input"
              placeholder="◦ Enter Patient ID"
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !patientId.trim()}
            className="login-button"
          >
            <span>{loading ? 'Loading...' : 'Access Patient Data'}</span>
          </button>
        </form>
        
        <div className="secondary-actions">
          <button onClick={handleBack} className="logout-link">
            Switch Clinician
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
