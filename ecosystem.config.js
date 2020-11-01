module.exports = {
    apps: [
        {
            name: "sx.server::sx",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACTOR: "miner.sx",
                CPU_ACTOR: "cpu.sx",
                TYPE: "sx"
            }
        },
        {
            name: "sx.server::gravy",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACTOR: "gravy.sx",
                CPU_ACTOR: "miner.sx",
                TYPE: "gravy",
                CONCURRENCY: 1
            }
        },
        {
            name: "sx.server::sapex",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACTOR: "miner.sx",
                CPU_ACTOR: "miner.sx",
                TYPE: "sapex",
                CONCURRENCY: 1,
                TIMEOUT_MS: 60000
            }
        },
    ]
};
