// Initialize Socket.IO connection
const socket = io();

socket.on('metric_update', function(data) {
    updateChartData(data);
});

socket.on('connection_ack', function(data) {
    console.log('WebSocket connected:', data.status);
});

// Request real-time updates
function subscribeToMetric(metricId) {
    socket.emit('request_metric_update', {
        metric_id: metricId
    });
}
