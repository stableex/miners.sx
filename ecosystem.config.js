module.exports = {
    apps: [
        {
            name: "sx.server::sx",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACTOR: "miner.sx",
                TYPE: "sx",
                CONCURRENCY: 4,
                TIMEOUT_MS: 20
            }
        },
        {
            name: "sx.server::gravy",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACTOR: "gravy.sx",
                CPU_ACTOR: "cpu.sx",
                TYPE: "gravy",
                CONCURRENCY: 2,
                TIMEOUT_MS: 20
            }
        },
        {
            name: "sx.server::sapex",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACTOR: "cpu.sx",
                TYPE: "sapex",
                CONCURRENCY: 1,
                TIMEOUT_MS: 60000
            }
        },
    ]
};
