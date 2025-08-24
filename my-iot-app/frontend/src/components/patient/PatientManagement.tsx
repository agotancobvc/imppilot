import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  mrn: string;
  dateOfBirth: string;
  createdAt: string;
}

const PatientManagement: React.FC = () => {
  const { clinic } = useAuthStore();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  });

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/patients/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicId: clinic?.id,
          firstName: newPatient.firstName,
          lastName: newPatient.lastName,
          dateOfBirth: newPatient.dateOfBirth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add patient');
      }

      setSuccess(`Patient added successfully! MRN: ${data.patient.mrn}`);
      setNewPatient({ firstName: '', lastName: '', dateOfBirth: '' });
      setShowAddForm(false);
      
      // Refresh patient list
      loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    if (!clinic?.id) return;
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${apiUrl}/patients/clinic/${clinic.id}?limit=50`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPatients(data.patients || []);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    if (!clinic?.id || !searchQuery.trim()) {
      loadPatients();
      return;
    }
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/patients?clinicId=${clinic?.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPatients(data || []);
      }
    } catch (err) {
      console.error('Failed to search patients:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPatients();
  }, [clinic?.id]);

  React.useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchPatients();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="patient-management">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/clinician/register')} 
        className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Clinician Registration</span>
      </button>

      <div className="management-header">
        <h2>Patient Management</h2>
        <div className="header-actions">
          <button 
            onClick={() => navigate('/patient/register')} 
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Register New Patient</span>
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (!clinic?.id) {
              setError('Please select a clinic first');
              return;
            }
            setError('');
            setShowAddForm(!showAddForm);
          }}
          className="patient-add-button"
          disabled={!clinic?.id}
        >
          {showAddForm ? 'Cancel' : 'Add New Patient'}
        </button>
        
        <button 
          onClick={() => navigate('/patient/login')}
          className="nav-button secondary"
          disabled={!clinic?.id}
        >
          Patient Login
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showAddForm && (
        <div className="add-form-container">
          <h3>Add New Patient</h3>
          <form onSubmit={handleAddPatient} className="add-form">
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                value={newPatient.firstName}
                onChange={handleInputChange}
                placeholder="First Name *"
                required
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                value={newPatient.lastName}
                onChange={handleInputChange}
                placeholder="Last Name *"
                required
                disabled={loading}
              />
            </div>
            <div className="form-row">
              <input
                type="date"
                name="dateOfBirth"
                value={newPatient.dateOfBirth}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !newPatient.firstName.trim() || !newPatient.lastName.trim() || !newPatient.dateOfBirth}
              className="submit-button"
            >
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </form>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients by name or MRN..."
          className="search-input"
        />
      </div>

      <div className="patients-list">
        {loading && <div className="loading">Loading patients...</div>}
        
        {!loading && patients.length === 0 && (
          <div className="no-patients">No patients found</div>
        )}
        
        {!loading && patients.length > 0 && (
          <div className="patients-grid">
            {patients.map((patient) => (
              <div key={patient.id} className="patient-card">
                <div className="patient-info">
                  <h4>{patient.firstName} {patient.lastName}</h4>
                  <p><strong>MRN:</strong> {patient.mrn}</p>
                  <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>Added:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="patient-actions">
                  <button className="edit-button">Edit</button>
                  <button className="view-button">View Sessions</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
