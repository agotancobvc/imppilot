"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/App.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ClinicLogin_1 = require("./components/auth/ClinicLogin");
var ClinicianLogin_1 = require("./components/auth/ClinicianLogin");
var PatientLogin_1 = require("./components/auth/PatientLogin");
var Dashboard_1 = require("./components/dashboard/Dashboard");
var PrivateRoute_1 = require("./components/common/PrivateRoute");
var App = function () {
    return (<react_router_dom_1.BrowserRouter>
      <div className="App">
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/auth/clinic" element={<ClinicLogin_1.default />}/>
          <react_router_dom_1.Route path="/auth/clinician" element={<ClinicianLogin_1.default />}/>
          <react_router_dom_1.Route path="/auth/patient" element={<PatientLogin_1.default />}/>
          <react_router_dom_1.Route path="/dashboard" element={<PrivateRoute_1.default>
                <Dashboard_1.default />
              </PrivateRoute_1.default>}/>
          <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/auth/clinic"/>}/>
        </react_router_dom_1.Routes>
      </div>
    </react_router_dom_1.BrowserRouter>);
};
exports.default = App;
