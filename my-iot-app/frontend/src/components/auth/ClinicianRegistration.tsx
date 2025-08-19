import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ClinicianRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    clinicId: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clinicians/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId: formData.clinicId,
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Clinician account created successfully! You can now log in.');
      
      // Clear form
      setFormData({
        clinicId: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        // Show success message and provide login option
        setSuccess('Clinician registered successfully! You can now log in.');
        // Optionally navigate to login after a delay
        setTimeout(() => navigate('/clinician/login'), 2000);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div className="login-container">
      <div className="login-card">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/clinic/login')} 
          className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors mb-6 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Clinic Login</span>
        </button>

        <h1 className="login-title">Create Clinician Account</h1>
        <p className="login-subtitle">
          Register as a new clinician for your clinic.
        </p>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        {success && (
          <div className="success-message">{success}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              name="clinicId"
              value={formData.clinicId}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Clinic ID *"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ First Name *"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Last Name *"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Username *"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Email Address (Optional)"
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Password *"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Confirm Password *"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !formData.clinicId.trim() || !formData.username.trim() || 
                     !formData.password.trim() || !formData.firstName.trim() || !formData.lastName.trim()}
            className="login-button"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>
        
        <div className="secondary-actions">
          <button onClick={() => navigate('/clinician/login')} className="logout-link">
            Clinician Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicianRegistration;
