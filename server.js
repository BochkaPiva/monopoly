import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 5173);
const root = process.cwd();
const statePath = join(root, ".proleum-state.json");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function loadEnvFile(fileName) {
  const filePath = join(root, fileName);
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] ||= value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const { default: handleStateRequest } = await import("./api/state.js");

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function getState() {
  if (!existsSync(statePath)) return null;
  return JSON.parse(await readFile(statePath, "utf8"));
}

async function saveState(state) {
  await writeFile(statePath, JSON.stringify(state, null, 2), "utf8");
}

async function serveFile(response, urlPath) {
  const safePath = normalize(urlPath === "/" ? "/index.html" : urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath);
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  try {
    const data = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
  response.setHeader("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (url.pathname === "/api/state" && request.method === "GET") {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      await handleStateRequest(request, response);
      return;
    }
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    response.end(JSON.stringify((await getState()) || { rooms: [] }));
    return;
  }

  if (url.pathname === "/api/state" && request.method === "PUT") {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      await handleStateRequest(request, response);
      return;
    }
    const state = JSON.parse(await readBody(request));
    await saveState(state);
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method !== "GET") {
    response.writeHead(405);
    response.end("Method not allowed");
    return;
  }

  await serveFile(response, decodeURIComponent(url.pathname));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`PROLEUM test server: http://127.0.0.1:${port}/`);
});
