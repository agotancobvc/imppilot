"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("@/store/authStore");
var lucide_react_1 = require("lucide-react");
var PatientLogin = function () {
    var _a = (0, react_1.useState)(''), patientId = _a[0], setPatientId = _a[1];
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(''), error = _c[0], setError = _c[1];
    var _d = (0, authStore_1.useAuthStore)(), clinic = _d.clinic, clinician = _d.clinician, setPatient = _d.setPatient, setToken = _d.setToken;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var response, _a, patient, token, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    setError('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("".concat(process.env.REACT_APP_API_URL, "/auth/patient"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                clinicId: clinic === null || clinic === void 0 ? void 0 : clinic.id,
                                clinicianId: clinician === null || clinician === void 0 ? void 0 : clinician.id,
                                patientId: patientId,
                            }),
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        throw new Error('Invalid patient ID');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    _a = _b.sent(), patient = _a.patient, token = _a.token;
                    setPatient(patient);
                    setToken(token);
                    navigate('/dashboard');
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _b.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'An error occurred');
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleBack = function () {
        navigate('/auth/clinician');
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <lucide_react_1.Users className="h-6 w-6 text-white"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Selection</h2>
          <p className="text-gray-600 mt-2">
            Clinician: <span className="font-medium">{clinician === null || clinician === void 0 ? void 0 : clinician.firstName} {clinician === null || clinician === void 0 ? void 0 : clinician.lastName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID or Medical Record Number
            </label>
            <input id="patientId" type="text" value={patientId} onChange={function (e) { return setPatientId(e.target.value); }} className="input-field" placeholder="Enter patient ID" required/>
          </div>

          {error && (<div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {error}
            </div>)}

          <div className="flex gap-3">
            <button type="button" onClick={handleBack} className="btn-secondary flex items-center gap-2">
              <lucide_react_1.ArrowLeft className="h-4 w-4"/>
              Back
            </button>
            <button type="submit" disabled={isLoading || !patientId} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {isLoading ? 'Validating...' : 'Start Session'}
              <lucide_react_1.ArrowRight className="h-4 w-4"/>
            </button>
          </div>
        </form>
      </div>
    </div>);
};
exports.default = PatientLogin;
