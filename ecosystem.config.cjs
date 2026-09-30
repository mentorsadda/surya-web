module.exports = {
  apps: [
    {
      name: "suryadietfit",
      script: "server/index.mjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
        HOST: "0.0.0.0",
        PUBLIC_URL: "https://suryadietfit.com"
      }
    }
  ]
};
