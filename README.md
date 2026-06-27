# AccuLynx Browser-Session Access Gateway

JLand internal project for read-only AccuLynx access by the AccuLynx Manager Agent and Estimator Agent.

## Scope correction

This project is **not** a paid AccuLynx API-key integration and is **not** built around a fake/public sandbox API.

The approved direction is:

- use legitimate, authorized AccuLynx browser-login/session access;
- prefer included UI paths, saved views, reports, exports, and browser-observed read-only data requests;
- expose only sanitized/read-only internal outputs to JLand agents;
- optionally wrap the internal gateway with MCP-compatible endpoints if Hermes/Multica needs that shape;
- never store credentials, cookies, tokens, live exports, or private customer data in the repo.

## Approval boundaries

Daniel approval is required before any of these:

- fresh AccuLynx login/session capture;
- credential vault or session-state setup;
- account/security/permission changes;
- live customer-data extraction;
- production release;
- paid AccuLynx App Connections/API enablement;
- write-back or edits inside AccuLynx.

Safe work that can continue without Daniel:

- code scaffolding;
- sanitized fixtures;
- schema mapping;
- read-only guards;
- docs;
- tests;
- QA for no secrets/no writes.

## Local run

```bash
npm install
npm start
curl http://localhost:8085/ping
curl http://localhost:8085/status
```

## Current endpoints

- `GET /ping` — server health.
- `GET /status` — safe status and scope boundaries.
- `GET /jobs` — placeholder read-only endpoint. Returns `session_required` until an approved browser-session connector is configured.
- `ALL /mcp` — optional internal compatibility placeholder. Not the core AccuLynx access method.

## Security

The `.gitignore` intentionally excludes session state, cookies, exported files, logs, `.env` files, and live data folders.
