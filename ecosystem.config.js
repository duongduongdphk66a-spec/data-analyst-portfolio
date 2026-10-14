module.exports = {
  apps: [
    {
      name: 'data-analyst-portfolio',
      script: '.next/standalone/server.js',
      cwd: __dirname,
      instances: 'max',
      exec_mode: 'cluster',
      node_args: '--env-file=.env', // Bắt buộc để Node 20+ nạp toàn bộ biến từ .env vào standalone
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        TRUST_PROXY: 'true'
      },
      max_memory_restart: '512M',
      exp_backoff_restart_delay: 100,
      merge_logs: true
    }
  ]
};

