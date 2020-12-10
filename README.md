# SX - Server

## `.env` settings

```bash
# REQUIRED
PRIVATE_KEYS="<PRIVATE KEY>"
ACTOR="<ACCOUNT>"

# OPTIONAL
CPU_ACTOR="<ACCOUNT>"
NODEOS_ENDPOINT="http://localhost:8888"
CONCURRENCY=8
TIMEOUT_MS=1
```

## Install

```
$ pm2 install typescript
$ npm install
```

## Quickstart

```
$ pm2 start
```
