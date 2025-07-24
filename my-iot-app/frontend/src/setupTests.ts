// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
process.env.REACT_APP_WS_URL = 'ws://localhost:3001';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn().mockReturnValue({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
  }),
}));

// Mock Recharts for testing - Note: Using jest.mock instead of JSX
jest.mock('recharts', () => ({
  LineChart: () => 'LineChart',
  Line: () => 'Line',
  XAxis: () => 'XAxis',
  YAxis: () => 'YAxis',
  CartesianGrid: () => 'CartesianGrid',
  Tooltip: () => 'Tooltip',
  Legend: () => 'Legend',
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
}));
