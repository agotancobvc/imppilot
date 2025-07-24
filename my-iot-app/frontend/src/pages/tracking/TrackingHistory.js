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
var authStore_1 = require("@/store/authStore");
var tracking_1 = require("@/services/api/tracking");
var formatters_1 = require("@/utils/formatters");
var dateUtils_1 = require("@/utils/dateUtils");
var lucide_react_1 = require("lucide-react");
var TrackingHistory = function () {
    var _a = (0, authStore_1.useAuthStore)(), patient = _a.patient, token = _a.token;
    var _b = (0, react_1.useState)([]), sessions = _b[0], setSessions = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    (0, react_1.useEffect)(function () {
        var fetchHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
            var history_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!patient || !token)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, tracking_1.TrackingService.getHistory(patient.id, token)];
                    case 2:
                        history_1 = _a.sent();
                        setSessions(history_1);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        setError(err_1 instanceof Error ? err_1.message : 'Failed to load history');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchHistory();
    }, [patient, token]);
    if (loading) {
        return (<div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>);
    }
    if (error) {
        return (<div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
        {error}
      </div>);
    }
    return (<div className="card">
      <div className="flex items-center gap-3 mb-6">
        <lucide_react_1.History className="h-6 w-6 text-primary-600"/>
        <h2 className="text-xl font-bold text-gray-900">Tracking History</h2>
      </div>

      {sessions.length === 0 ? (<div className="text-center py-8">
          <lucide_react_1.Clock className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
          <p className="text-gray-500">No tracking sessions found</p>
        </div>) : (<div className="space-y-4">
          {sessions.map(function (session) { return (<div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <lucide_react_1.User className="h-4 w-4 text-gray-500"/>
                  <span className="font-medium">{patient === null || patient === void 0 ? void 0 : patient.firstName} {patient === null || patient === void 0 ? void 0 : patient.lastName}</span>
                </div>
                <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(session.status === 'completed'
                    ? 'bg-success-100 text-success-800'
                    : 'bg-warning-100 text-warning-800')}>
                  {session.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Start Time:</span> {formatters_1.formatters.dateTime(session.startTime)}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {session.endTime
                    ? dateUtils_1.dateUtils.formatDuration(session.startTime, session.endTime)
                    : 'In progress'}
                </div>
                <div>
                  <span className="font-medium">Metrics Collected:</span> {session.metrics.length}
                </div>
                <div>
                  <span className="font-medium">Session ID:</span> {session.id.substring(0, 8)}...
                </div>
              </div>
            </div>); })}
        </div>)}
    </div>);
};
exports.default = TrackingHistory;
