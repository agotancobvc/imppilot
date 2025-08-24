import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FlowchartHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">ImPilot Clinic Management</h1>
        <p className="login-subtitle">
          Choose your entry point to access the system
        </p>
        
        <div className="home-navigation">
          <button 
            onClick={() => navigate('/clinic/register')}
            className="nav-button primary"
          >
            Register New Clinic
          </button>
          
          <button 
            onClick={() => navigate('/clinic/login')}
            className="nav-button primary"
          >
            Clinic Login
          </button>
          
          <button 
            onClick={() => navigate('/clinician/register')}
            className="nav-button secondary"
          >
            Join as Clinician
          </button>
        </div>
      </div>
    </div>
  );
};
