module.exports = {
    apps: {
        name: "sx.server",
        script: "index.ts",
        interpreter: "ts-node",
        autorestart: true,
        log_date_format : "YYYY-MM-DD HH:mm:ss",
    }
};
