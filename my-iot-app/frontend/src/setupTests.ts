// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock environment variables for Vite
if (typeof import.meta !== 'undefined') {
  Object.defineProperty(import.meta, 'env', {
    value: {
      VITE_API_URL: 'http://localhost:3001/api',
      VITE_WS_URL: 'ws://localhost:3001'
    },
    writable: true
  });
}

// Mock localStorage
const localStorageMock = {
  getItem: vi?.fn?.() || jest?.fn?.() || (() => null),
  setItem: vi?.fn?.() || jest?.fn?.() || (() => {}),
  removeItem: vi?.fn?.() || jest?.fn?.() || (() => {}),
  clear: vi?.fn?.() || jest?.fn?.() || (() => {}),
  length: 0,
  key: vi?.fn?.() || jest?.fn?.() || (() => null),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi?.fn?.() || jest?.fn?.() || (() => null),
  setItem: vi?.fn?.() || jest?.fn?.() || (() => {}),
  removeItem: vi?.fn?.() || jest?.fn?.() || (() => {}),
  clear: vi?.fn?.() || jest?.fn?.() || (() => {}),
  length: 0,
  key: vi?.fn?.() || jest?.fn?.() || (() => null),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.OPEN;
  url: string;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  close = vi?.fn?.() || jest?.fn?.() || (() => {});
  send = vi?.fn?.() || jest?.fn?.() || (() => {});
  addEventListener = vi?.fn?.() || jest?.fn?.() || (() => {});
  removeEventListener = vi?.fn?.() || jest?.fn?.() || (() => {});
  dispatchEvent = vi?.fn?.() || jest?.fn?.() || (() => false);
}

global.WebSocket = MockWebSocket as any;

// Mock fetch
global.fetch = vi?.fn?.() || jest?.fn?.() || (() => Promise.resolve(new Response()));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (vi?.fn?.() || jest?.fn?.() || (() => {})).mockImplementation?.((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi?.fn?.() || jest?.fn?.() || (() => {}),
    removeListener: vi?.fn?.() || jest?.fn?.() || (() => {}),
    addEventListener: vi?.fn?.() || jest?.fn?.() || (() => {}),
    removeEventListener: vi?.fn?.() || jest?.fn?.() || (() => {}),
    dispatchEvent: vi?.fn?.() || jest?.fn?.() || (() => false),
  })) || ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })),
});

// Mock ResizeObserver
global.ResizeObserver = (vi?.fn?.() || jest?.fn?.() || function() {}).mockImplementation?.(() => ({
  observe: vi?.fn?.() || jest?.fn?.() || (() => {}),
  unobserve: vi?.fn?.() || jest?.fn?.() || (() => {}),
  disconnect: vi?.fn?.() || jest?.fn?.() || (() => {}),
})) || function() {
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  };
};

// Mock IntersectionObserver
global.IntersectionObserver = (vi?.fn?.() || jest?.fn?.() || function() {}).mockImplementation?.(() => ({
  observe: vi?.fn?.() || jest?.fn?.() || (() => {}),
  unobserve: vi?.fn?.() || jest?.fn?.() || (() => {}),
  disconnect: vi?.fn?.() || jest?.fn?.() || (() => {}),
})) || function() {
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  };
};

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
