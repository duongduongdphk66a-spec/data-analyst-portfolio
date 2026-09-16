module.exports = {
  apps: [
    {
      name: 'data-analyst-portfolio',
      script: '.next/standalone/server.js',
      cwd: './',
      // Tận dụng đa nhân CPU với cluster mode (mặc định 'max').
      // Nếu server chỉ có 1 vCPU hoặc RAM hạn chế (< 1GB), có thể đặt PM2_INSTANCES=1 và PM2_EXEC_MODE=fork
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: process.env.PM2_EXEC_MODE || 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      max_memory_restart: '500M',
    },
  ],
};
