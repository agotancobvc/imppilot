import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Activity, Wifi, TrendingUp, Clock, Target, Footprints, ArrowLeft, Calendar, BarChart3 } from 'lucide-react';

interface PatientData {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  clinicName: string;
}

interface GaitSession {
  id: string;
  date: string;
  duration: number;
  status: 'completed' | 'in_progress' | 'scheduled';
  metrics?: {
    stepCount: number;
    cadence: number;
    strideLength: number;
    balance: number;
  };
}

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [sessions, setSessions] = useState<GaitSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress'>('overview');

  useEffect(() => {
    loadPatientData();
    loadSessions();
  }, []);

  const loadPatientData = async () => {
    // Mock patient data - replace with actual API call
    setPatient({
      id: '123',
      mrn: '65DCNS001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-06-15',
      clinicName: 'Alejandro Gotanco Clinic'
    });
  };

  const loadSessions = async () => {
    // Mock session data - replace with actual API call
    setSessions([
      {
        id: '1',
        date: '2025-08-14',
        duration: 45,
        status: 'completed',
        metrics: {
          stepCount: 1250,
          cadence: 110,
          strideLength: 0.65,
          balance: 85
        }
      },
      {
        id: '2',
        date: '2025-08-12',
        duration: 30,
        status: 'completed',
        metrics: {
          stepCount: 890,
          cadence: 105,
          strideLength: 0.62,
          balance: 82
        }
      },
      {
        id: '3',
        date: '2025-08-16',
        duration: 0,
        status: 'scheduled'
      }
    ]);
    setLoading(false);
  };

  const startNewSession = () => {
    // Navigate to gait tracking session
    navigate('/patient/session/new');
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-red-500/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/patient/login')} 
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Welcome back, {patient?.firstName}!
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                MRN: <span className="text-red-400">{patient?.mrn}</span> • {patient?.clinicName}
              </p>
            </div>
          </div>
          <button 
            onClick={startNewSession} 
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Start New Session</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-red-500/20 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{sessions.filter(s => s.status === 'completed').length}</div>
              <div className="text-gray-300 text-sm">Completed Sessions</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-red-500/20 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {sessions.reduce((total, s) => total + (s.duration || 0), 0)}min
              </div>
              <div className="text-gray-300 text-sm">Total Training Time</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-red-500/20 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Target className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {sessions[0]?.metrics?.balance || 0}%
              </div>
              <div className="text-gray-300 text-sm">Latest Balance Score</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-red-500/20 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Footprints className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {sessions[0]?.metrics?.stepCount || 0}
              </div>
              <div className="text-gray-300 text-sm">Steps Last Session</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-red-500/20 p-2 mb-6 shadow-xl">
        <div className="flex space-x-2">
          <button 
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button 
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeTab === 'sessions' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('sessions')}
          >
            <Calendar className="w-4 h-4" />
            <span>Sessions</span>
          </button>
          <button 
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeTab === 'progress' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Progress</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-red-500/20 p-6 shadow-xl">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-700/30 rounded-lg p-6 border border-red-500/10">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                Recent Sessions
              </h3>
              <div className="space-y-3">
                {sessions.slice(0, 3).map(session => (
                  <div key={session.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex justify-between items-center">
                      <div className="text-white font-medium">{session.date}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          session.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {session.status.replace('_', ' ')}
                        </span>
                        {session.duration > 0 && (
                          <span className="text-gray-300 text-sm">{session.duration}min</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-6 border border-red-500/10">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                Upcoming
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-white font-medium">Aug 16, 2025</div>
                    <div className="text-gray-300 text-sm">Gait Training Session</div>
                    <div className="text-red-400 text-sm">2:00 PM - 2:45 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              Session History
            </h3>
            {sessions.map(session => (
              <div key={session.id} className="bg-gray-700/30 rounded-lg p-6 border border-red-500/10">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-white font-medium text-lg">{session.date}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    session.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    session.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {session.status.replace('_', ' ')}
                  </span>
                </div>
                {session.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-red-400 text-sm font-medium">Steps</div>
                      <div className="text-white text-xl font-bold">{session.metrics.stepCount}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-red-400 text-sm font-medium">Cadence</div>
                      <div className="text-white text-xl font-bold">{session.metrics.cadence} <span className="text-sm text-gray-400">spm</span></div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-red-400 text-sm font-medium">Stride</div>
                      <div className="text-white text-xl font-bold">{session.metrics.strideLength}<span className="text-sm text-gray-400">m</span></div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-red-400 text-sm font-medium">Balance</div>
                      <div className="text-white text-xl font-bold">{session.metrics.balance}<span className="text-sm text-gray-400">%</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              Progress Analytics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-6 border border-red-500/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-red-400 mr-2" />
                  Balance Progress
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-600/30">
                  <div className="text-6xl mb-4">📈</div>
                  <div className="text-gray-300">Interactive chart visualization</div>
                  <div className="text-red-400 text-sm mt-2">Real-time gait analysis coming soon</div>
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-6 border border-red-500/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 text-red-400 mr-2" />
                  Step Count Trends
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-600/30">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-gray-300">Performance metrics dashboard</div>
                  <div className="text-red-400 text-sm mt-2">Connected to IoT sensors</div>
                </div>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="bg-gray-700/30 rounded-lg p-6 border border-red-500/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Wifi className="w-5 h-5 text-red-400 mr-2" />
                System Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="text-white font-medium">Backend Connected</div>
                  <div className="text-gray-400 text-sm">localhost:3000</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="text-white font-medium">IoT Sensors Active</div>
                  <div className="text-gray-400 text-sm">Real-time data</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="text-white font-medium">WebSocket Live</div>
                  <div className="text-gray-400 text-sm">Streaming metrics</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
