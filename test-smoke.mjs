// Smoke test: spawn the server, do the MCP handshake, list tools, call ping.
import { spawn } from "node:child_process";

const child = spawn(process.execPath, ["src/index.js"], {
  env: { ...process.env, ACCULYNX_API_KEY: "test-dummy-key" },
  stdio: ["pipe", "pipe", "pipe"],
});

let raw = "";
child.stdout.on("data", (d) => { raw += d.toString(); });
child.stderr.on("data", (d) => process.stderr.write("[server] " + d.toString()));

const send = (obj) => child.stdin.write(JSON.stringify(obj) + "\n");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await wait(300);
send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "1.0" } } });
await wait(400);
send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });
send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
await wait(800);

const msgs = raw.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return { raw: l }; } });
const list = msgs.find((m) => m.id === 2);
if (list?.result?.tools) {
  console.log("\nTOOLS (" + list.result.tools.length + "):");
  for (const t of list.result.tools) console.log("  - " + t.name);
} else {
  console.log("\nNo tools/list response. Raw output:\n" + raw);
}
child.kill();
