module.exports = {
  apps: [
    {
      name: "voyage-hack-searchbot",
      script: "node",
      args: "backend/server.js",
      instances: 1,
      exec_mode: "fork",
      watch: true,
      ignore_watch: ["node_modules", "public"],
      error_file: "../logs/searchbot-error.log",
      out_file: "../logs/searchbot-out.log",
      log_file: '../logs/searchbot-combined.log',
      env: {
        NODE_ENV: "production"
      },
      watch_options: {
        "followSymlinks": false
      }
    }
  ]
};
