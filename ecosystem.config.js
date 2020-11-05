module.exports = {
    apps: [
        {
            name: "sx.server::push.sx",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
        }
    ]
};
