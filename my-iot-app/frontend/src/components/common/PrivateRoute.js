"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("@/store/authStore");
var PrivateRoute = function (_a) {
    var children = _a.children;
    var isAuthenticated = (0, authStore_1.useAuthStore)().isAuthenticated;
    return isAuthenticated ? <>{children}</> : <react_router_dom_1.Navigate to="/auth/clinic"/>;
};
exports.default = PrivateRoute;
