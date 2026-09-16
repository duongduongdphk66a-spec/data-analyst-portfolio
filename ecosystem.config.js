module.exports = {
  apps: [
    {
      name: 'data-analyst-portfolio',
      script: '.next/standalone/server.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
