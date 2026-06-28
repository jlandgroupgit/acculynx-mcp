import { spawn } from 'node:child_process';
import { describe, it, after, before } from 'node:test';
import assert from 'node:assert/strict';

const PORT = 19876;
let child;

describe('AccuLynx browser-session gateway REST API', () => {
  before(async () => {
    child = spawn(process.execPath, ['src/index.js'], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server did not start within 5s')), 5000);
      child.stdout.on('data', (d) => {
        if (d.toString().includes('listening')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      child.on('error', (err) => { clearTimeout(timeout); reject(err); });
    });
  });

  after(() => {
    child?.kill();
  });

  it('GET /ping returns { status: "ok" }', async () => {
    const res = await fetch(`http://localhost:${PORT}/ping`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, { status: 'ok' });
  });

  it('GET /status returns scope with paidApiKeyRequired: false and writesAllowed: false', async () => {
    const res = await fetch(`http://localhost:${PORT}/status`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.paidApiKeyRequired, false);
    assert.equal(body.writesAllowed, false);
  });

  it('GET /jobs returns 412 with session_required', async () => {
    const res = await fetch(`http://localhost:${PORT}/jobs`);
    assert.equal(res.status, 412);
    const body = await res.json();
    assert.equal(body.status, 'session_required');
  });

  it('POST /jobs returns 404 (no write routes exist)', async () => {
    const res = await fetch(`http://localhost:${PORT}/jobs`, { method: 'POST' });
    assert.equal(res.status, 404);
  });
});
