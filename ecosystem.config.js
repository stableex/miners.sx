module.exports = {
    apps: [
        {
            name: "sx.server::push.sx",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACCOUNT: "push.sx",
                ACTOR: "miner.sx",
                CPU_ACTOR: "miner.sx",
                TYPE: "sx",
                CONCURRENCY: 2
            }
        },
        {
            name: "sx.server::basic.sx",
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm",
            env: {
                ACCOUNT: "basic.sx",
                ACTOR: "cpu.sx",
                CPU_ACTOR: "cpu.sx",
                TYPE: "sx",
                CONCURRENCY: 2
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
        }
    ]
};
