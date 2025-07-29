import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Building2, ArrowRight } from 'lucide-react';

const ClinicLogin: React.FC = () => {
  const [clinicCode, setClinicCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setClinic } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // API call to validate clinic code
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/clinic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clinicCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid clinic code');
      }

      const clinic = await response.json();
      setClinic(clinic);
      navigate('/auth/clinician');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Gait Metrics System</h2>
          <p className="text-gray-600 mt-2">Enter your clinic code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="clinicCode" className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Code
            </label>
            <input
              id="clinicCode"
              type="text"
              value={clinicCode}
              onChange={(e) => setClinicCode(e.target.value)}
              className="input-field"
              placeholder="Enter clinic code"
              required
            />
          </div>

          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !clinicCode}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying...' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClinicLogin;
