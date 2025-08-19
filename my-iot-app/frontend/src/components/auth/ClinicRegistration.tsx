import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ClinicRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Nebraska Clinic',
    email: 'nebraska@clinic.com',
    address: '123 Main St, Lincoln, NE',
    phone: '555-123-4567',
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

    try {
      const apiUrl = 'http://localhost:3000/api';
      console.log('Submitting to:', `${apiUrl}/clinics/register`);
      console.log('Form data:', formData);
      
      const response = await fetch(`${apiUrl}/clinics/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      setSuccess('Clinic registered successfully! Please check your email for verification.');
      setFormData({ name: '', email: '', address: '', phone: '' });
    } catch (err) {
      console.error('Registration error:', err);
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

        <h1 className="login-title">Register New Clinic</h1>
        <p className="login-subtitle">
          Create your clinic account to start managing patients and clinicians.
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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Clinic Name *"
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
              placeholder="◦ Email Address *"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Clinic Address (Optional)"
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="login-input"
              placeholder="◦ Phone Number (Optional)"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !formData.name.trim() || !formData.email.trim()}
            className="login-button"
          >
            <span>{loading ? 'Registering...' : 'Register Clinic'}</span>
          </button>
        </form>
        
        <div className="secondary-actions">
          <button
            type="button"
            onClick={() => navigate('/clinic/login')}
            className="back-button"
          >
            Back to Clinic Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegistration;
