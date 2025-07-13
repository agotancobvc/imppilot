import React from 'react';

interface SessionControlsProps {
  sessionActive: boolean;
  sessionPaused: boolean;
  onStart: () => void;
  onEnd: () => void;
  canStart: boolean;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  sessionActive,
  sessionPaused,
  onStart,
  onEnd,
  canStart
}) => {
  return (
    <div className="session-controls">
      <button
        onClick={onStart}
        disabled={sessionActive || !canStart}
        className="btn btn-primary"
      >
        {sessionActive ? 'Session Active' : 'Start Session'}
      </button>
      
      <button
        onClick={onEnd}
        disabled={!sessionActive}
        className="btn btn-danger"
      >
        End Session
      </button>
      
      <div className="session-status">
        Status: {sessionActive ? (sessionPaused ? 'Paused' : 'Active') : 'Inactive'}
      </div>
    </div>
  );
};
