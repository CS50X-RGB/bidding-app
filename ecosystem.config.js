module.exports = {
  apps: [
    {
      name: "bidding-backend",
      script: "node ./dist/index.js",
      cwd: "./bidding-backend",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    },
    {
      name: "bidding-frontend",
      script: "npm",
      args: "start",
      cwd: "./bidding-frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};

