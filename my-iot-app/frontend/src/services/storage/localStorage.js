"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_KEYS = exports.LocalStorageService = void 0;
var LocalStorageService = /** @class */ (function () {
    function LocalStorageService() {
    }
    LocalStorageService.setItem = function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };
    LocalStorageService.getItem = function (key) {
        try {
            var item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error('Failed to get from localStorage:', error);
            return null;
        }
    };
    LocalStorageService.removeItem = function (key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    };
    LocalStorageService.clear = function () {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    };
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;
exports.STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    LAST_PATIENT: 'last_patient',
};
