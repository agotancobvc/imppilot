"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/setupTests.ts
require("@testing-library/jest-dom");
// Mock environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
process.env.REACT_APP_WS_URL = 'ws://localhost:3001';
// Mock localStorage
var localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;
// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(function () { return ({
    close: jest.fn(),
    send: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
}); });
// Mock socket.io-client
jest.mock('socket.io-client', function () { return ({
    io: jest.fn().mockReturnValue({
        on: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
        connected: true,
    }),
}); });
// Mock Recharts for testing - Note: Using jest.mock instead of JSX
jest.mock('recharts', function () { return ({
    LineChart: function () { return 'LineChart'; },
    Line: function () { return 'Line'; },
    XAxis: function () { return 'XAxis'; },
    YAxis: function () { return 'YAxis'; },
    CartesianGrid: function () { return 'CartesianGrid'; },
    Tooltip: function () { return 'Tooltip'; },
    Legend: function () { return 'Legend'; },
    ResponsiveContainer: function (_a) {
        var children = _a.children;
        return children;
    },
}); });
