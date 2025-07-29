module.exports = {
  apps: [{
    name: 'gait-metrics-backend',
    script: 'dist/src/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: 'logs/combined.log',
    out_file: 'logs/out.log',
    error_file: 'logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 8000,
    reload_delay: 1000,
    autorestart: true,
    cron_restart: '0 2 * * *', // Restart daily at 2 AM
    health_check_url: 'http://localhost:3000/health',
    health_check_grace_period: 3000
  }]
};
