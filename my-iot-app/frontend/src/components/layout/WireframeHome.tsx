import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WireframeHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-red-500/20 p-12 text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4">
            ImPilot
          </h1>
          <p className="text-gray-300 text-lg">
            Gait Metrics System
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Real-time gait analysis for clinical assessment
          </p>
        </div>
        
        <button
          onClick={() => navigate('/clinic/login')}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25 text-lg"
        >
          Clinic Login
        </button>
      </div>
    </div>
  );
};
