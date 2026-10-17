// ==============================================================================
// FILE: ecosystem.config.js (ĐỂ --env-file=.env NẠP TRUST_PROXY TỰ NHIÊN)
// ==============================================================================
module.exports = {
  apps: [
    {
      name: 'data-analyst-portfolio',
      script: '.next/standalone/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      node_args: '--env-file=.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
        // Không đặt TRUST_PROXY ở đây để Node đọc trực tiếp TRUST_PROXY từ tệp .env
      },
      max_memory_restart: '512M',
      exp_backoff_restart_delay: 200
    }
  ]
};
