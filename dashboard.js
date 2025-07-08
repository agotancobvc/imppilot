document.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pageContents = document.querySelectorAll('.page-content');
    const addChartBtn = document.getElementById('addChartBtn');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const endBtn = document.getElementById('endBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    let chartCount = 1;
    let charts = {};
    let isTracking = false;
    let isPaused = false;
    let updateIntervals = {};
    let sessionData = {}; // Store all session data for PDF generation
    let sessionStartTime = null;
    let walkCounter = 0;

    // Load walk counter from localStorage instead of sessionStorage for persistence
    const savedWalkCount = JSON.parse(localStorage.getItem('walkCounter') || '0');
    walkCounter = savedWalkCount;

    // Navigation buttons
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            showPage(page);
            
            // Update active nav button
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Load history when history page is shown
            if (page === 'history') {
                console.log('Loading history page...'); // Debug log
                loadWalkHistory();
            }
        });
    });

    // Control buttons
    if (startBtn) {
        startBtn.addEventListener('click', startTracking);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseTracking);
    }
    
    if (endBtn) {
        endBtn.addEventListener('click', endSession);
    }
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', resumeTracking);
    }

    // Add chart functionality
    if (addChartBtn) {
        addChartBtn.addEventListener('click', addNewChart);
    }

    // Initialize default chart
    initializeChart('chart-1');

    // Handle time frame changes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('time-btn')) {
            const chartSection = e.target.closest('.chart-section');
            const chartId = chartSection.dataset.chartId;
            const timeframe = e.target.dataset.timeframe;
            
            // Update active time button
            chartSection.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update chart data
            updateChartData(chartId, timeframe);
        }
    });

    // Handle metric dropdown changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('metric-dropdown')) {
            const chartId = e.target.dataset.chartId;
            const metric = e.target.value;
            updateChartMetric(chartId, metric);
        }
    });

    function startTracking() {
        isTracking = true;
        isPaused = false;
        sessionStartTime = new Date();
        sessionData = {}; // Reset session data
        
        // Initialize session data for all charts
        Object.keys(charts).forEach(chartId => {
            const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
            const metric = dropdown.value;
            sessionData[chartId] = {
                metric: metric,
                metricName: dropdown.options[dropdown.selectedIndex].text,
                data: [],
                timestamps: []
            };
        });
        
        // Show pause and end buttons, hide start button
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
        endBtn.style.display = 'flex';
        resumeBtn.style.display = 'none';
        
        // Start real-time updates for all charts
        Object.keys(charts).forEach(chartId => {
            startRealTimeUpdates(chartId);
        });
    }
    
    function pauseTracking() {
        isPaused = true;
        
        // Show play and end buttons, hide pause button
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'flex';
        endBtn.style.display = 'flex';
        
        // Stop all real-time updates but keep tracking state
        Object.keys(updateIntervals).forEach(chartId => {
            clearInterval(updateIntervals[chartId]);
            delete updateIntervals[chartId];
        });
    }
    
    function resumeTracking() {
        isPaused = false;
        
        // Show pause and end buttons, hide play button
        resumeBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
        endBtn.style.display = 'flex';
        
        // Resume real-time updates for all charts
        Object.keys(charts).forEach(chartId => {
            startRealTimeUpdates(chartId);
        });
    }
    
    function endSession() {
        isTracking = false;
        isPaused = false;
        
        console.log('Ending session...');
        console.log('Session start time:', sessionStartTime);
        console.log('Session data:', sessionData);
        
        // Show only start button
        startBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
        endBtn.style.display = 'none';
        resumeBtn.style.display = 'none';
        
        // Stop all real-time updates
        Object.keys(updateIntervals).forEach(chartId => {
            clearInterval(updateIntervals[chartId]);
            delete updateIntervals[chartId];
        });
        
        // Save walk data if session was started (even if no data collected)
        if (sessionStartTime) {
            console.log('Saving walk data...');
            saveWalkData();
        } else {
            console.log('No session to save - session was not started');
        }
        
        // Reset all charts to initial state
        Object.keys(charts).forEach(chartId => {
            resetChart(chartId);
        });
        
        // Reset session data
        sessionData = {};
        sessionStartTime = null;
    }

    function saveWalkData() {
        console.log('saveWalkData called'); // Debug log
        
        // Increment walk counter and save to localStorage for persistence
        walkCounter++;
        localStorage.setItem('walkCounter', JSON.stringify(walkCounter));
        
        const sessionEndTime = new Date();
        const duration = Math.round((sessionEndTime - sessionStartTime) / 1000);
        
        // Create walk data object - save even if no data was collected
        const walkData = {
            id: walkCounter,
            date: sessionStartTime.toLocaleDateString(),
            startTime: sessionStartTime.toLocaleTimeString(),
            endTime: sessionEndTime.toLocaleTimeString(),
            duration: formatDuration(duration),
            charts: {}
        };
        
        console.log('Walk data created:', walkData);
        
        // Copy session data to walk data (if any exists)
        if (Object.keys(sessionData).length > 0) {
            Object.keys(sessionData).forEach(chartId => {
                walkData.charts[chartId] = {
                    metric: sessionData[chartId].metric,
                    metricName: sessionData[chartId].metricName,
                    data: [...sessionData[chartId].data],
                    timestamps: [...sessionData[chartId].timestamps],
                    statistics: calculateStatistics(sessionData[chartId].data)
                };
            });
        } else {
            // If no data was collected, save info about the charts that were configured
            Object.keys(charts).forEach(chartId => {
                const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
                if (dropdown) {
                    walkData.charts[chartId] = {
                        metric: dropdown.value,
                        metricName: dropdown.options[dropdown.selectedIndex].text,
                        data: [],
                        timestamps: [],
                        statistics: { average: 0, min: 0, max: 0, stdDev: 0 }
                    };
                }
            });
        }
        
        console.log('Final walk data:', walkData);
        
        // Save walk data to localStorage for persistence
        const existingWalks = JSON.parse(localStorage.getItem('walkHistory') || '[]');
        existingWalks.push(walkData);
        localStorage.setItem('walkHistory', JSON.stringify(existingWalks));
        
        console.log('Walk saved to storage. Total walks:', existingWalks.length);
        
        // Notify user that walk was saved
        alert(`Walk ${walkCounter} has been saved! Navigate to the History page to view it.`);
    }

    async function createPDFReport(walkData) {
        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank');
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Walk ${walkData.id} Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        background: white;
                        color: black;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #dc2626;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        color: #dc2626;
                        margin: 0;
                    }
                    .session-info {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin-bottom: 30px;
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    .info-item {
                        display: flex;
                        justify-content: space-between;
                        border-bottom: 1px solid #e9ecef;
                        padding-bottom: 5px;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .chart-section {
                        margin-bottom: 40px;
                        page-break-inside: avoid;
                    }
                    .chart-title {
                        color: #dc2626;
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        border-bottom: 1px solid #dc2626;
                        padding-bottom: 5px;
                    }
                    .statistics {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .stat-box {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        text-align: center;
                        border: 1px solid #e9ecef;
                    }
                    .stat-value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #dc2626;
                    }
                    .stat-label {
                        font-size: 12px;
                        color: #6c757d;
                        margin-top: 5px;
                    }
                    .data-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                    }
                    .data-table th,
                    .data-table td {
                        border: 1px solid #dee2e6;
                        padding: 8px;
                        text-align: left;
                    }
                    .data-table th {
                        background-color: #dc2626;
                        color: white;
                        font-weight: bold;
                    }
                    .data-table tr:nth-child(even) {
                        background-color: #f8f9fa;
                    }
                    @media print {
                        body { margin: 0; }
                        .chart-section { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Walk ${walkData.id} Report</h1>
                    <p>Gait Analysis Session Summary</p>
                </div>
                
                <div class="session-info">
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span>${walkData.date}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Start Time:</span>
                        <span>${walkData.startTime}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">End Time:</span>
                        <span>${walkData.endTime}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Duration:</span>
                        <span>${walkData.duration}</span>
                    </div>
                </div>
                
                ${Object.keys(walkData.charts).map(chartId => {
                    const chart = walkData.charts[chartId];
                    return `
                        <div class="chart-section">
                            <div class="chart-title">${chart.metricName}</div>
                            
                            <div class="statistics">
                                <div class="stat-box">
                                    <div class="stat-value">${chart.statistics.average.toFixed(2)}</div>
                                    <div class="stat-label">Average</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-value">${chart.statistics.min.toFixed(2)}</div>
                                    <div class="stat-label">Minimum</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-value">${chart.statistics.max.toFixed(2)}</div>
                                    <div class="stat-label">Maximum</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-value">${chart.statistics.stdDev.toFixed(2)}</div>
                                    <div class="stat-label">Std Deviation</div>
                                </div>
                            </div>
                            
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${chart.data.map((value, index) => `
                                        <tr>
                                            <td>${chart.timestamps[index] || 'N/A'}</td>
                                            <td>${value.toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                }).join('')}
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Auto-print the PDF
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    function calculateStatistics(data) {
        if (data.length === 0) return { average: 0, min: 0, max: 0, stdDev: 0 };
        
        const sum = data.reduce((a, b) => a + b, 0);
        const average = sum / data.length;
        const min = Math.min(...data);
        const max = Math.max(...data);
        
        const variance = data.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / data.length;
        const stdDev = Math.sqrt(variance);
        
        return { average, min, max, stdDev };
    }

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function loadWalkHistory() {
        console.log('loadWalkHistory called');
        
        const historyContainer = document.getElementById('walkHistoryList');
        if (!historyContainer) {
            console.log('History container not found!');
            return;
        }
        
        const walkHistory = JSON.parse(localStorage.getItem('walkHistory') || '[]');
        console.log('Loaded walk history:', walkHistory);
        
        if (walkHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-walks">
                    <p>No walks recorded yet. Start your first session to see data here.</p>
                </div>
            `;
            return;
        }
        
        const historyHtml = walkHistory.slice().reverse().map(walk => `
            <div class="walk-item" data-walk-id="${walk.id}">
                <div class="walk-header">
                    <h3>Walk ${walk.id}</h3>
                    <span class="walk-date">${walk.date}</span>
                </div>
                <div class="walk-details">
                    <div class="walk-info">
                        <span><strong>Duration:</strong> ${walk.duration}</span>
                        <span><strong>Start:</strong> ${walk.startTime}</span>
                        <span><strong>End:</strong> ${walk.endTime}</span>
                    </div>
                    <div class="walk-metrics">
                        <span><strong>Metrics tracked:</strong> ${Object.keys(walk.charts).length}</span>
                    </div>
                </div>
                <div class="walk-actions">
                    <button class="download-report-btn" onclick="downloadReport(${walk.id})">Download Report</button>
                </div>
            </div>
        `).join('');
        
        historyContainer.innerHTML = historyHtml;
        console.log('History HTML updated');
    }

    function calculateStatistics(data) {
        if (data.length === 0) return { average: 0, min: 0, max: 0, stdDev: 0 };
        
        const sum = data.reduce((a, b) => a + b, 0);
        const average = sum / data.length;
        const min = Math.min(...data);
        const max = Math.max(...data);
        
        const variance = data.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / data.length;
        const stdDev = Math.sqrt(variance);
        
        return { average, min, max, stdDev };
    }

    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function loadWalkHistory() {
        const historyContainer = document.getElementById('walkHistoryList');
        if (!historyContainer) return;
        
        const walkHistory = JSON.parse(sessionStorage.getItem('walkHistory') || '[]');
        
        if (walkHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-walks">
                    <p>No walks recorded yet. Start your first session to see data here.</p>
                </div>
            `;
            return;
        }
        
        const historyHtml = walkHistory.slice().reverse().map(walk => `
            <div class="walk-item" data-walk-id="${walk.id}">
                <div class="walk-header">
                    <h3>Walk ${walk.id}</h3>
                    <span class="walk-date">${walk.date}</span>
                </div>
                <div class="walk-details">
                    <div class="walk-info">
                        <span><strong>Duration:</strong> ${walk.duration}</span>
                        <span><strong>Start:</strong> ${walk.startTime}</span>
                        <span><strong>End:</strong> ${walk.endTime}</span>
                    </div>
                    <div class="walk-metrics">
                        <span><strong>Metrics tracked:</strong> ${Object.keys(walk.charts).length}</span>
                    </div>
                </div>
                <div class="walk-actions">
                    <button class="download-report-btn" onclick="downloadReport(${walk.id})">Download Report</button>
                </div>
            </div>
        `).join('');
        
        historyContainer.innerHTML = historyHtml;
    }

    // Global functions for walk history
    window.downloadReport = function(walkId) {
        const walkHistory = JSON.parse(localStorage.getItem('walkHistory') || '[]');
        const walk = walkHistory.find(w => w.id === walkId);
        if (walk) {
            createPDFReport(walk);
        }
    };

    window.downloadReport = function(walkId) {
        const walkHistory = JSON.parse(localStorage.getItem('walkHistory') || '[]');
        const walk = walkHistory.find(w => w.id === walkId);
        if (walk) {
            createPDFReport(walk);
        }
    };

    function showPage(pageId) {
        // Hide all pages
        pageContents.forEach(page => page.classList.remove('active'));
        
        // Show selected page
        document.getElementById(`${pageId}-page`).classList.add('active');
    }

    function addNewChart() {
        chartCount++;
        const chartsContainer = document.getElementById('chartsContainer');
        
        const newChartHtml = `
            <div class="chart-section" data-chart-id="chart-${chartCount}">
                <div class="chart-header">
                    <div class="metric-selector">
                        <label for="metric-${chartCount}">Metric:</label>
                        <select class="metric-dropdown" id="metric-${chartCount}" data-chart-id="chart-${chartCount}">
                            <option value="step_length">Step Length</option>
                            <option value="step_length_variability">Step Length Variability</option>
                            <option value="stride_length">Stride Length</option>
                            <option value="stride_length_variability">Stride Length Variability</option>
                            <option value="stride_time_variability">Stride Time Variability</option>
                            <option value="cadence">Cadence</option>
                            <option value="gait_speed">Gait Speed</option>
                            <option value="gait_cycle_variability">Gait Cycle Variability</option>
                            <option value="stance_time">Stance Time</option>
                            <option value="swing_time">Swing Time</option>
                            <option value="swing_time_variability">Swing Time Variability</option>
                            <option value="double_support_time">Double Support Time</option>
                        </select>
                    </div>
                    <div class="time-frame-controls">
                        <button class="time-btn active" data-timeframe="1m">1m</button>
                        <button class="time-btn" data-timeframe="5m">5m</button>
                        <button class="time-btn" data-timeframe="10m">10m</button>
                        <button class="time-btn" data-timeframe="30m">30m</button>
                        <button class="time-btn" data-timeframe="all">All</button>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="chart-${chartCount}-canvas" width="400" height="200"></canvas>
                </div>
            </div>
        `;
        
        chartsContainer.insertAdjacentHTML('beforeend', newChartHtml);
        initializeChart(`chart-${chartCount}`);
        
        // Initialize session data for new chart if tracking
        if (isTracking) {
            const dropdown = document.getElementById(`metric-${chartCount}`);
            const metric = dropdown.value;
            sessionData[`chart-${chartCount}`] = {
                metric: metric,
                metricName: dropdown.options[dropdown.selectedIndex].text,
                data: [],
                timestamps: []
            };
        }
        
        // Start tracking for new chart if currently tracking and not paused
        if (isTracking && !isPaused) {
            startRealTimeUpdates(`chart-${chartCount}`);
        }
    }

    function initializeChart(chartId) {
        const canvas = document.getElementById(`${chartId}-canvas`);
        const ctx = canvas.getContext('2d');
        const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
        const metricName = dropdown.options[dropdown.selectedIndex].text;
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: generateTimeLabels('1m'),
                datasets: [{
                    label: metricName,
                    data: generateSampleData(20, dropdown.value),
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#dc2626',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        charts[chartId] = chart;
    }

    function updateChartData(chartId, timeframe) {
        const chart = charts[chartId];
        if (!chart) return;
        
        const newLabels = generateTimeLabels(timeframe);
        const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
        const newData = generateSampleData(newLabels.length, dropdown.value);
        
        chart.data.labels = newLabels;
        chart.data.datasets[0].data = newData;
        chart.update();
    }

    function updateChartMetric(chartId, metric) {
        const chart = charts[chartId];
        if (!chart) return;
        
        const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
        const metricName = dropdown.options[dropdown.selectedIndex].text;
        
        chart.data.datasets[0].label = metricName;
        chart.data.datasets[0].data = generateSampleData(chart.data.labels.length, metric);
        chart.update();
        
        // Update session data metric if tracking
        if (isTracking && sessionData[chartId]) {
            sessionData[chartId].metric = metric;
            sessionData[chartId].metricName = metricName;
        }
    }
    
    function resetChart(chartId) {
        const chart = charts[chartId];
        if (!chart) return;
        
        const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
        const newLabels = generateTimeLabels('1m');
        const newData = generateSampleData(newLabels.length, dropdown.value);
        
        chart.data.labels = newLabels;
        chart.data.datasets[0].data = newData;
        chart.update();
    }

    function generateTimeLabels(timeframe) {
        const labels = [];
        const now = new Date();
        let interval, count;
        
        switch(timeframe) {
            case '1m':
                interval = 3000;
                count = 20;
                break;
            case '5m':
                interval = 15000;
                count = 20;
                break;
            case '10m':
                interval = 30000;
                count = 20;
                break;
            case '30m':
                interval = 90000;
                count = 20;
                break;
            case 'all':
                interval = 300000;
                count = 50;
                break;
            default:
                interval = 3000;
                count = 20;
        }
        
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * interval));
            labels.push(time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}));
        }
        
        return labels;
    }

    function generateSampleData(count, metric) {
        const data = [];
        let baseValue, range;
        
        switch(metric) {
            case 'step_length':
                baseValue = 65; range = 10; break;
            case 'step_length_variability':
                baseValue = 5; range = 3; break;
            case 'stride_length':
                baseValue = 130; range = 20; break;
            case 'stride_length_variability':
                baseValue = 8; range = 5; break;
            case 'stride_time_variability':
                baseValue = 3; range = 2; break;
            case 'cadence':
                baseValue = 110; range = 15; break;
            case 'gait_speed':
                baseValue = 1.2; range = 0.3; break;
            case 'gait_cycle_variability':
                baseValue = 4; range = 2; break;
            case 'stance_time':
                baseValue = 62; range = 8; break;
            case 'swing_time':
                baseValue = 38; range = 6; break;
            case 'swing_time_variability':
                baseValue = 2.5; range = 1.5; break;
            case 'double_support_time':
                baseValue = 12; range = 4; break;
            default:
                baseValue = 50; range = 20;
        }
        
        for (let i = 0; i < count; i++) {
            baseValue += (Math.random() - 0.5) * (range * 0.3);
            baseValue = Math.max(0, baseValue);
            data.push(Math.round(baseValue * 100) / 100);
        }
        
        return data;
    }

    function startRealTimeUpdates(chartId) {
        if (updateIntervals[chartId]) {
            clearInterval(updateIntervals[chartId]);
        }
        
        updateIntervals[chartId] = setInterval(() => {
            const chart = charts[chartId];
            if (!chart || !isTracking || isPaused) return;
            
            const dropdown = document.getElementById(`metric-${chartId.split('-')[1]}`);
            const metric = dropdown.value;
            
            const newTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            const lastValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
            const newValue = generateRealisticNextValue(lastValue, metric);
            
            chart.data.labels.push(newTime);
            chart.data.datasets[0].data.push(newValue);
            
            // Store data for session logging
            if (sessionData[chartId]) {
                sessionData[chartId].data.push(newValue);
                sessionData[chartId].timestamps.push(newTime);
            }
            
            if (chart.data.labels.length > 20) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }
            
            chart.update('none');
        }, 3000);
    }

    function generateRealisticNextValue(currentValue, metric) {
        let volatility;
        
        switch(metric) {
            case 'step_length': volatility = 2; break;
            case 'step_length_variability': volatility = 0.5; break;
            case 'stride_length': volatility = 3; break;
            case 'stride_length_variability': volatility = 1; break;
            case 'stride_time_variability': volatility = 0.3; break;
            case 'cadence': volatility = 3; break;
            case 'gait_speed': volatility = 0.1; break;
            case 'gait_cycle_variability': volatility = 0.5; break;
            case 'stance_time': volatility = 2; break;
            case 'swing_time': volatility = 2; break;
            case 'swing_time_variability': volatility = 0.3; break;
            case 'double_support_time': volatility = 1; break;
            default: volatility = 2;
        }
        
        const change = (Math.random() - 0.5) * volatility;
        return Math.max(0, Math.round((currentValue + change) * 100) / 100);
    }
});