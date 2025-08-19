import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationHeaderProps {
  userRole?: 'clinic' | 'clinician' | 'patient' | null;
  userName?: string;
  clinicName?: string;
  onLogout?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  userRole,
  userName,
  clinicName,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    // Always available
    { path: '/', label: 'Home', icon: '🏠' },
    
    // Clinic Management
    { path: '/clinic/register', label: 'Register Clinic', icon: '🏥', roles: [null] },
    { path: '/clinic/login', label: 'Clinic Login', icon: '🔑', roles: [null, 'clinic'] },
    
    // Clinician Management  
    { path: '/clinician/register', label: 'Join as Clinician', icon: '👨‍⚕️', roles: [null, 'clinic'] },
    { path: '/clinician/login', label: 'Clinician Login', icon: '🩺', roles: [null, 'clinician'] },
    
    // Patient Management
    { path: '/patients', label: 'Patient Management', icon: '👥', roles: ['clinic', 'clinician'] },
    { path: '/patient/login', label: 'Patient Login', icon: '🏥', roles: [null, 'patient'] },
    { path: '/patient/dashboard', label: 'My Dashboard', icon: '📊', roles: ['patient'] },
  ];

  const visibleItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole || null)
  );

  const handleRoleSwitch = (newRole: 'clinic' | 'clinician' | 'patient' | null) => {
    // Clear current session
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('clinicName');
    
    // Navigate to appropriate login
    switch (newRole) {
      case 'clinic':
        navigate('/clinic/login');
        break;
      case 'clinician':
        navigate('/clinician/login');
        break;
      case 'patient':
        navigate('/patient/login');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <header className="navigation-header">
      <div className="nav-container">
        {/* Logo & Brand */}
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="brand-icon">⚕️</span>
          <span className="brand-text">ImPilot Clinic</span>
        </div>

        {/* Main Navigation */}
        <nav className="nav-menu">
          {visibleItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="nav-actions">
          {userRole && (
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">{userName}</span>
                {clinicName && <span className="clinic-name">{clinicName}</span>}
                <span className="user-role">{userRole}</span>
              </div>
            </div>
          )}

          {/* Role Switcher */}
          <div className="role-switcher">
            <button className="role-switch-btn">
              <span>Switch Role</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className="role-dropdown">
              <button onClick={() => handleRoleSwitch('clinic')}>
                🏥 Clinic Admin
              </button>
              <button onClick={() => handleRoleSwitch('clinician')}>
                👨‍⚕️ Clinician
              </button>
              <button onClick={() => handleRoleSwitch('patient')}>
                🏥 Patient
              </button>
              <button onClick={() => handleRoleSwitch(null)}>
                🚪 Guest
              </button>
            </div>
          </div>

          {/* Logout */}
          {userRole && (
            <button onClick={onLogout} className="logout-btn">
              <span>Logout</span>
              <span className="logout-icon">🚪</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
