"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateUtils = void 0;
exports.dateUtils = {
    formatDuration: function (startTime, endTime) {
        var end = endTime || new Date();
        var diff = end.getTime() - startTime.getTime();
        var minutes = Math.floor(diff / 60000);
        var seconds = Math.floor((diff % 60000) / 1000);
        return "".concat(minutes, ":").concat(seconds.toString().padStart(2, '0'));
    },
    isToday: function (date) {
        var today = new Date();
        return date.toDateString() === today.toDateString();
    },
    formatRelativeTime: function (date) {
        var now = new Date();
        var diff = now.getTime() - date.getTime();
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        if (days > 0)
            return "".concat(days, " day").concat(days > 1 ? 's' : '', " ago");
        if (hours > 0)
            return "".concat(hours, " hour").concat(hours > 1 ? 's' : '', " ago");
        if (minutes > 0)
            return "".concat(minutes, " minute").concat(minutes > 1 ? 's' : '', " ago");
        return 'Just now';
    },
};
