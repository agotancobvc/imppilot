import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(`Patient registered successfully! MRN: ${result.mrn}`);
        setTimeout(() => {
          navigate('/patient/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/patients')} 
          className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Patient Management</span>
        </button>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-red-500/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Patient Registration
            </h1>
            <p className="text-gray-300 mt-2">Register a new patient in the system</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Any relevant medical history..."
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Current Medications
              </label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                placeholder="List current medications..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
