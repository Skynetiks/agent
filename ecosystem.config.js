module.exports = {
  apps: [
    {
      name: "Content Generator",
      cwd: "./content-service",
      script: "npm",
      args: "run dev",
      exec_mode: "fork",
      autorestart: true,
    },
    {
      name: "Lead Scrapper",
      cwd: "./email-scrapper",
      script: "npm",
      args: "run dev",
      exec_mode: "fork",
      autorestart: true,
    },
    {
      name: "Mail Worker",
      cwd: "./mail-worker",
      script: "npm",
      args: "run dev",
      exec_mode: "fork",
      autorestart: true,
    },
    {
      name: "Validator Service",
      cwd: "./validator-service",
      script: "npm",
      args: "run dev",
      exec_mode: "fork",
      autorestart: true,
    },
    {
      name: "Agent Scheduler",
      cwd: "./schedulers",
      script: "npm",
      args: "run agent",
      exec_mode: "fork",
      autorestart: true,
    },
    {
      name: "Task Scheduler",
      cwd: "./schedulers",
      script: "npm",
      args: "run task",
      exec_mode: "fork",
      autorestart: true,
    },
    {
      name: "Web Scrapper",
      cwd: "./web-scrapper",
      script: "npm",
      args: "run dev",
      exec_mode: "fork",
      autorestart: true,
    },
  ],
};
