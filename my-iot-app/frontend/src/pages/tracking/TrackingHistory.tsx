import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { TrackingService } from '@/services/api/tracking';
import { TrackingSession } from '@/types/tracking.types';
import { formatters } from '@/utils/formatters';
import { dateUtils } from '@/utils/dateUtils';
import { History, Clock, User } from 'lucide-react';

const TrackingHistory: React.FC = () => {
  const { patient, token } = useAuthStore();
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patient || !token) return;
      
      try {
        const history = await TrackingService.getHistory(patient.id, token);
        setSessions(history);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patient, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <History className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Tracking History</h2>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No tracking sessions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{patient?.firstName} {patient?.lastName}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === 'completed' 
                    ? 'bg-success-100 text-success-800'
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Start Time:</span> {formatters.dateTime(session.startTime)}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {
                    session.endTime 
                      ? dateUtils.formatDuration(session.startTime, session.endTime)
                      : 'In progress'
                  }
                </div>
                <div>
                  <span className="font-medium">Metrics Collected:</span> {session.metrics.length}
                </div>
                <div>
                  <span className="font-medium">Session ID:</span> {session.id.substring(0, 8)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackingHistory;
