import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClinicLogin from '@/components/auth/ClinicLogin';
import ClinicianLogin from '@/components/auth/ClinicianLogin';
import PatientLogin from '@/components/auth/PatientLogin';
import Dashboard from '@/components/dashboard/Dashboard';
import PrivateRoute from '@/components/common/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth/clinic" element={<ClinicLogin />} />
          <Route path="/auth/clinician" element={<ClinicianLogin />} />
          <Route path="/auth/patient" element={<PatientLogin />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/auth/clinic" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
