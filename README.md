# Syscoin Info API

## Description

This is a simple Node.js Express server to fetch information on Syscoin.

## Configuration

All runtime settings live under `config/`:

| File | Purpose |
|------|---------|
| `config/.env.example` | Template — copy to `config/env` and edit |
| `config/env` | Your local secrets and overrides (not committed) |
| `config.js` | Defaults (e.g. SyscoinVaultManager address) |

**Setup:**

```bash
cp config/.env.example config/env
# Edit config/env with your RPC credentials
```

- **Local:** `node index.js` loads `config/env` via dotenv.
- **Docker:** `docker compose` injects the same file (`env_file: config/env` in `docker-compose.yml`).

This service expects a **Syscoin Core node already running** on the host (or elsewhere) and reachable via RPC. UTXO supply uses `gettxoutsetinfo`; NEVM components come from the public explorer API.

### Environment variables

**Required** (in `config/env`):

- `SYSCOIN_CORE_RPC_HOST` — e.g. `localhost` (local) or `host.docker.internal` (Docker on Linux)
- `SYSCOIN_CORE_RPC_PORT` — e.g. `8370`
- `SYSCOIN_CORE_RPC_USERNAME` — RPC username
- `SYSCOIN_CORE_RPC_PASSWORD` — RPC password

**Optional:**

- `SYSCOIN_VAULT_MANAGER` — override the SyscoinVaultManager contract address (default in `config.js`)
- `PORT` — HTTP listen port (default `3000`)
- `POLLING_INTERVAL_SECONDS` — how often supply is recalculated (default `30`)

Generate RPC credentials for `syscoin.conf`:

```bash
curl -sSL https://raw.githubusercontent.com/syscoin/syscoin/master/share/rpcauth/rpcauth.py | python - <username>
```

See also: https://github.com/syscoin/docker-syscoin-core#usage

## Syscoin Vault Manager

The official contract address is defined in `config.js` and can be overridden via `SYSCOIN_VAULT_MANAGER` in `config/env`.

```
total supply = UTXO supply + NEVM supply − vault contract balance
```

## Endpoints

Host: https://info.syscoin.org/

### `GET /totalsupply`

Returns total supply (UTXO + NEVM - minus vault balance) as plain text.

### `GET /circulatingsupply`

Returns circulating supply as plain text.

### `GET /triggerRecordSupply`

Manually triggers an immediate supply recalculation. On startup and by default every 30 seconds, supply is refreshed automatically via polling (`POLLING_INTERVAL_SECONDS` in `config/env`).

### `GET /health`

Simple liveness check (`OK`).

### `GET /status`

Detailed status including last recorded values and any fetch errors.

## Docker

```bash
cp config/.env.example config/env
# Edit config/env (use host.docker.internal for SYSCOIN_CORE_RPC_HOST on Linux)

docker compose up -d --build
```

The API is published on host port `3050` (maps to container port `3000`).
