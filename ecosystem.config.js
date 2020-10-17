module.exports = {
    apps: [
        {
            name: "sx.server",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm"
        }
    ]
};
