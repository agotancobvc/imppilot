"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoTConnectionService = void 0;
var socket_io_client_1 = require("socket.io-client");
var websocket_config_1 = require("@/config/websocket.config");
var IoTConnectionService = /** @class */ (function () {
    function IoTConnectionService(token) {
        this.token = token;
        this.socket = null;
        this.reconnectAttempts = 0;
        this.heartbeatInterval = null;
        this.connectionTimeout = null;
    }
    IoTConnectionService.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.socket = (0, socket_io_client_1.io)(websocket_config_1.WEBSOCKET_CONFIG.url, {
                auth: { token: _this.token },
                timeout: websocket_config_1.WEBSOCKET_CONFIG.timeout,
            });
            _this.connectionTimeout = setTimeout(function () {
                reject(new Error(websocket_config_1.WEBSOCKET_ERRORS.TIMEOUT));
            }, websocket_config_1.WEBSOCKET_CONFIG.timeout);
            _this.socket.on(websocket_config_1.WEBSOCKET_CONFIG.events.CONNECT, function () {
                if (_this.connectionTimeout) {
                    clearTimeout(_this.connectionTimeout);
                    _this.connectionTimeout = null;
                }
                _this.reconnectAttempts = 0;
                _this.startHeartbeat();
                resolve();
            });
            _this.socket.on(websocket_config_1.WEBSOCKET_CONFIG.events.DISCONNECT, function () {
                _this.stopHeartbeat();
                _this.handleReconnect();
            });
            _this.socket.on(websocket_config_1.WEBSOCKET_CONFIG.events.ERROR, function (error) {
                reject(new Error(error.message || websocket_config_1.WEBSOCKET_ERRORS.CONNECTION_FAILED));
            });
        });
    };
    IoTConnectionService.prototype.disconnect = function () {
        this.stopHeartbeat();
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    };
    IoTConnectionService.prototype.subscribeToPatient = function (patientId) {
        if (this.socket) {
            this.socket.emit(websocket_config_1.WEBSOCKET_CONFIG.events.SUBSCRIBE, { patientId: patientId });
        }
    };
    IoTConnectionService.prototype.unsubscribeFromPatient = function (patientId) {
        if (this.socket) {
            this.socket.emit(websocket_config_1.WEBSOCKET_CONFIG.events.UNSUBSCRIBE, { patientId: patientId });
        }
    };
    IoTConnectionService.prototype.onGaitMetrics = function (callback) {
        if (this.socket) {
            this.socket.on(websocket_config_1.WEBSOCKET_CONFIG.events.GAIT_METRICS, callback);
        }
    };
    IoTConnectionService.prototype.onTrackingStarted = function (callback) {
        if (this.socket) {
            this.socket.on(websocket_config_1.WEBSOCKET_CONFIG.events.TRACKING_STARTED, callback);
        }
    };
    IoTConnectionService.prototype.onTrackingStopped = function (callback) {
        if (this.socket) {
            this.socket.on(websocket_config_1.WEBSOCKET_CONFIG.events.TRACKING_STOPPED, callback);
        }
    };
    IoTConnectionService.prototype.startTracking = function (patientId) {
        if (this.socket) {
            this.socket.emit('startTracking', { patientId: patientId });
        }
    };
    IoTConnectionService.prototype.stopTracking = function (patientId) {
        if (this.socket) {
            this.socket.emit('stopTracking', { patientId: patientId });
        }
    };
    Object.defineProperty(IoTConnectionService.prototype, "isConnected", {
        get: function () {
            var _a;
            return ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected) || false;
        },
        enumerable: false,
        configurable: true
    });
    IoTConnectionService.prototype.handleReconnect = function () {
        var _this = this;
        if (this.reconnectAttempts < websocket_config_1.WEBSOCKET_CONFIG.reconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(function () {
                _this.connect().catch(console.error);
            }, websocket_config_1.WEBSOCKET_CONFIG.reconnectDelay);
        }
    };
    IoTConnectionService.prototype.startHeartbeat = function () {
        var _this = this;
        this.heartbeatInterval = setInterval(function () {
            if (_this.socket) {
                _this.socket.emit('ping');
            }
        }, websocket_config_1.WEBSOCKET_CONFIG.heartbeatInterval);
    };
    IoTConnectionService.prototype.stopHeartbeat = function () {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    };
    return IoTConnectionService;
}());
exports.IoTConnectionService = IoTConnectionService;
