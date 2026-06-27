import express from 'express';

const app = express();
app.use(express.json());

const scope = {
  project: 'AccuLynx Browser-Session Access Gateway',
  mode: 'read_only_browser_session_gateway',
  paidApiKeyRequired: false,
  paidAppConnectionsRequired: false,
  writesAllowed: false,
  mcpIsCoreIntegration: false,
  approvalRequiredFor: [
    'fresh AccuLynx login/session capture',
    'credential vault/session-state setup',
    'account/security/permission changes',
    'live customer-data extraction',
    'production release',
    'paid AccuLynx App Connections/API enablement',
    'write-back or edits inside AccuLynx'
  ]
};

app.get('/ping', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/status', (_req, res) => {
  res.json({ status: 'configured_for_scope', ...scope });
});

app.get('/jobs', (_req, res) => {
  res.status(412).json({
    status: 'session_required',
    message: 'Browser-session connector is intentionally not configured until Daniel approves login/session setup.',
    readOnly: true,
    nextSafeWork: [
      'build sanitized fixtures',
      'map AccuLynx UI/report/export fields',
      'wire approved browser-session connector',
      'add QA checks for no secrets and no write actions'
    ]
  });
});

// Optional compatibility placeholder only. The AccuLynx source layer is the browser-session gateway.
app.all('/mcp', (_req, res) => {
  res.json({
    status: 'optional_internal_adapter_placeholder',
    note: 'This endpoint is not a paid/backend AccuLynx API integration. It may later wrap the read-only browser-session gateway for Hermes/Multica compatibility.',
    ...scope
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`AccuLynx browser-session gateway listening on http://localhost:${PORT}`);
});
