import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WireframeHome } from './components/layout/WireframeHome';
import ClinicLogin from './components/auth/ClinicLogin';
import ClinicRegistration from './components/auth/ClinicRegistration';
import ClinicianRegistration from './components/auth/ClinicianRegistration';
import ClinicianLogin from './components/auth/ClinicianLogin';
import PatientLogin from './components/auth/PatientLogin';
import { PatientRegistration } from './components/auth/PatientRegistration';
import PatientManagement from './components/patient/PatientManagement';
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Home Page - Starting Point */}
          <Route path="/" element={<WireframeHome />} />
          
          {/* Clinic Flow */}
          <Route path="/clinic/login" element={<ClinicLogin />} />
          <Route path="/clinic/register" element={<ClinicRegistration />} />
          
          {/* Clinician Flow */}
          <Route path="/clinic/register" element={<ClinicRegistration />} />
          <Route path="/clinician/register" element={<ClinicianRegistration />} />
          <Route path="/clinician/login" element={<ClinicianLogin />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegistration />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
