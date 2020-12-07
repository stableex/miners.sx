require("dotenv").config();
const NODEOS_ENDPOINTS = (process.env.NODEOS_ENDPOINT || process.env.NODEOS_ENDPOINTS || "http://localhost:8888").split(",")

module.exports = {
    apps: NODEOS_ENDPOINTS.map( NODEOS_ENDPOINT => {
       return {
            name: "sx.server-" + require("url").parse(NODEOS_ENDPOINT).host,
            script: "index.ts",
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm:ss",
            env: {
                NODEOS_ENDPOINT
            }
        }
    })
};
