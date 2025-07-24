"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
var zustand_1 = require("zustand");
exports.useAuthStore = (0, zustand_1.create)(function (set) { return ({
    clinic: null,
    clinician: null,
    patient: null,
    token: null,
    isAuthenticated: false,
    setClinic: function (clinic) { return set({ clinic: clinic }); },
    setClinician: function (clinician) { return set({ clinician: clinician }); },
    setPatient: function (patient) { return set({ patient: patient, isAuthenticated: true }); },
    setToken: function (token) { return set({ token: token }); },
    logout: function () { return set({
        clinic: null,
        clinician: null,
        patient: null,
        token: null,
        isAuthenticated: false
    }); },
    reset: function () { return set({
        clinic: null,
        clinician: null,
        patient: null,
        token: null,
        isAuthenticated: false
    }); },
}); });
