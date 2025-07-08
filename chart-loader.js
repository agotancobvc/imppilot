function renderChart(metricId, data) {
    const ctx = document.getElementById('metricChart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.timestamp * 1000).toLocaleTimeString()),
            datasets: [
                {
                    label: metricId,
                    data: data.map(d => d.value),
                    borderColor: '#4caf50',
                    tension: 0.1
                }
            ]
        }
    });
}

function updateChartData(newData) {
    if (currentChart) {
        currentChart.data.labels.push(new Date(newData.timestamp * 1000).toLocaleTimeString());
        currentChart.data.datasets[0].data.push(newData.value);

        if (currentChart.data.labels.length > 50) {
            currentChart.data.labels.shift();
            currentChart.data.datasets[0].data.shift();
        }

        currentChart.update();
    }
}