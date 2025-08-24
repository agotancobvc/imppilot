import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const userFlows = [
    {
      title: 'Clinic Administration',
      description: 'Register your clinic and manage clinicians',
      icon: '🏥',
      steps: ['Register Clinic', 'Verify Email', 'Login', 'Manage Clinicians'],
      primaryAction: () => navigate('/clinic/register'),
      secondaryAction: () => navigate('/clinic/login'),
      primaryLabel: 'Register Clinic',
      secondaryLabel: 'Login as Clinic'
    },
    {
      title: 'Healthcare Provider',
      description: 'Join a clinic and manage patient care',
      icon: '👨‍⚕️',
      steps: ['Join Clinic', 'Create Account', 'Login', 'Manage Patients'],
      primaryAction: () => navigate('/clinician/register'),
      secondaryAction: () => navigate('/clinician/login'),
      primaryLabel: 'Join as Clinician',
      secondaryLabel: 'Clinician Login'
    },
    {
      title: 'Patient Care',
      description: 'Access your health dashboard and track progress',
      icon: '🏥',
      steps: ['Get Registered', 'Login with MRN', 'View Dashboard', 'Track Progress'],
      primaryAction: () => navigate('/patient/login'),
      secondaryAction: () => navigate('/patients'),
      primaryLabel: 'Patient Login',
      secondaryLabel: 'Patient Management'
    }
  ];

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="brand-icon">⚕️</span>
            ImPilot Clinic Management
          </h1>
          <p className="hero-subtitle">
            Comprehensive healthcare management system for clinics, clinicians, and patients
          </p>
        </div>
      </div>

      <div className="flows-section">
        <h2 className="section-title">Choose Your Role</h2>
        <div className="flows-grid">
          {userFlows.map((flow, index) => (
            <div key={index} className="flow-card">
              <div className="flow-header">
                <div className="flow-icon">{flow.icon}</div>
                <h3 className="flow-title">{flow.title}</h3>
              </div>
              
              <p className="flow-description">{flow.description}</p>
              
              <div className="flow-steps">
                {flow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flow-step">
                    <span className="step-number">{stepIndex + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
              
              <div className="flow-actions">
                <button 
                  onClick={flow.primaryAction}
                  className="primary-action-btn"
                >
                  {flow.primaryLabel}
                </button>
                <button 
                  onClick={flow.secondaryAction}
                  className="secondary-action-btn"
                >
                  {flow.secondaryLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">System Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h4>Secure Authentication</h4>
            <p>Role-based access with JWT tokens and audit logging</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Patient Dashboard</h4>
            <p>Real-time gait metrics and progress tracking</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h4>Multi-Role Support</h4>
            <p>Seamless switching between clinic, clinician, and patient views</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h4>HIPAA Compliant</h4>
            <p>Secure patient data management with full audit trails</p>
          </div>
        </div>
      </div>

      <div className="quick-access">
        <h3>Quick Access</h3>
        <div className="quick-buttons">
          <button onClick={() => navigate('/patients')} className="quick-btn">
            👥 Patient Management
          </button>
          <button onClick={() => navigate('/clinic/register')} className="quick-btn">
            🏥 Register New Clinic
          </button>
          <button onClick={() => navigate('/patient/login')} className="quick-btn">
            📊 Patient Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
