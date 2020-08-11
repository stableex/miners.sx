module.exports = {
    apps: [
        {
            name: "sx.miners",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm"
        }
    ]
};