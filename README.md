# SX - Server

## `.env` settings

```bash
# REQUIRED
PRIVATE_KEYS="<PRIVATE KEY>"
ACTOR="<ACCOUNT>"

# OPTIONAL
NODEOS_ENDPOINT="http://localhost:8888"
PERMISSION="active"
CONCURRENCY=5
TIMEOUT_MS=20
ACCOUNT="basic.sx"
ACTION="mine"
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
