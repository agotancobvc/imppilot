export const formatters = {
    gaitSpeed: (speed: number): string => `${(speed / 10).toFixed(1)} mph`,
    
    stepLength: (length: number): string => `${length.toFixed(1)} cm`,
    
    stepTime: (time: number): string => `${time.toFixed(0)} ms`,
    
    stepCadence: (cadence: number): string => `${cadence.toFixed(0)} steps/min`,
    
    stanceTime: (time: number): string => `${time.toFixed(0)} ms`,
    
    strideTime: (time: number): string => `${time.toFixed(0)} ms`,
    
    strideLength: (length: number): string => `${length.toFixed(1)} cm`,
    
    timestamp: (timestamp: number): string => {
      return new Date(timestamp).toLocaleTimeString();
    },
    
    date: (date: Date): string => {
      return date.toLocaleDateString();
    },
    
    dateTime: (date: Date): string => {
      return date.toLocaleString();
    },
  };
  