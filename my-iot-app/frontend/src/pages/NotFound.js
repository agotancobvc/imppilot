"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var NotFound = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 bg-error-100 rounded-full flex items-center justify-center mb-6">
          <lucide_react_1.AlertCircle className="h-12 w-12 text-error-600"/>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <button onClick={function () { return navigate('/'); }} className="btn-primary flex items-center gap-2 mx-auto">
          <lucide_react_1.Home className="h-4 w-4"/>
          Go Home
        </button>
      </div>
    </div>);
};
exports.default = NotFound;
