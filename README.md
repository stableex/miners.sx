# SX - Server

## `.env` settings

```bash
# REQUIRED
PRIVATE_KEYS="<PRIVATE KEY>"
ACTOR="<ACCOUNT>"

# OPTIONAL
CPU_ACTOR="<ACCOUNT>"
CONCURRENCY=5
TIMEOUT_MS=10

# Up to 32 API endpoints separated by comma
NODEOS_ENDPOINTS="https://api.eosn.io,https://bp.whaleex.com,https://api.eosflare.io"
```

## Install

```
$ pm2 install typescript
$ npm install
```

## Quickstart

```
# start server
$ pm2 start

# monitor status
$ pm2 log

# stop server
$ pm2 stop all
```
