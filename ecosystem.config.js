module.exports = {
  apps: [
    // Backend Node.js app
    {
      name: "backend",
      cwd: "./backend",
      script: "npm",
      args: "npm run start --dev",       // or "run start:prod", or point directly to dist/index.js
      env: {
        NODE_ENV: "production",
        PORT: 4000             // or whatever port your API listens on
      }
    },

    // Frontend React app (serving static build)
    {
      name: "frontend",
      cwd: "./frontend",
      script: "npm",
      args: "npm run dev",
      env: {
        NODE_ENV: "production",
        PORT: 5173 
      }
    }
  ]
};
