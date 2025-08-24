import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PatientLogin: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/auth/patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          dateOfBirth,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid patient name or date of birth');
      }

      const { patient, token } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'patient');
      localStorage.setItem('patientData', JSON.stringify(patient));
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/patient/register')} 
          className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors mb-6 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Patient Registration</span>
        </button>

        <h1 className="login-title">Patient Access</h1>
        <p className="login-subtitle">Enter your full name and date of birth to access your dashboard.</p>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="login-input"
              placeholder="◦ Enter Full Name (e.g., John Doe)"
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>
          <div className="input-group">
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="login-input"
              placeholder="◦ Date of Birth"
              required
              disabled={loading}
              autoComplete="bday"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !patientName.trim() || !dateOfBirth.trim()}
            className="login-button"
          >
            <span>{loading ? 'Loading...' : 'Access Dashboard'}</span>
          </button>
        </form>
        
        <div className="secondary-actions">
          <button 
            onClick={() => navigate('/clinician/login')} 
            className="back-button"
          >
            ← Back to Clinician Login
          </button>
          <button 
            onClick={() => navigate('/patients')} 
            className="register-link"
          >
            Patient Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
