const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
  response.setHeader("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
}

async function readBody(request) {
  if (request.body && typeof request.body === "object" && !request.body[Symbol.asyncIterator]) {
    return request.body;
  }
  if (typeof request.body === "string") {
    return request.body ? JSON.parse(request.body) : null;
  }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return null;
  return JSON.parse(raw);
}

function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase env is missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required.");
  }
}

async function supabaseFetch(path, options = {}) {
  assertSupabaseEnv();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function getState() {
  const rows = await supabaseFetch("game_rooms?select=state&order=updated_at.desc");
  return { rooms: rows.map((row) => row.state).filter(Boolean) };
}

async function saveState(state) {
  const rooms = Array.isArray(state?.rooms) ? state.rooms : [];
  const deletedRoomIds = Array.isArray(state?.deletedRoomIds) ? state.deletedRoomIds.filter(Boolean) : [];
  if (deletedRoomIds.length) {
    const encoded = deletedRoomIds.map((id) => `"${String(id).replaceAll('"', "")}"`).join(",");
    await supabaseFetch(`game_rooms?id=in.(${encodeURIComponent(encoded)})`, { method: "DELETE" });
  }

  const existingRows = rooms.length
    ? await supabaseFetch(`game_rooms?select=id,state&id=in.(${encodeURIComponent(rooms.map((room) => `"${String(room.id).replaceAll('"', "")}"`).join(","))})`)
    : [];
  const existingById = new Map((existingRows || []).map((row) => [row.id, row.state]));
  const payload = rooms.map((room) => ({
    id: room.id,
    name: room.name || room.id,
    state: room,
  })).filter((entry) => {
    const existing = existingById.get(entry.id);
    if (!existing) return true;
    const incomingRevision = Number(entry.state?.revision || 0);
    const existingRevision = Number(existing?.revision || 0);
    if (incomingRevision !== existingRevision) return incomingRevision > existingRevision;
    const incomingTime = Date.parse(entry.state?.updatedAt || 0) || 0;
    const existingTime = Date.parse(existing?.updatedAt || 0) || 0;
    return incomingTime > existingTime;
  });

  if (!payload.length) return;

  for (const room of payload) {
    await supabaseFetch("game_rooms?on_conflict=id", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify([room]),
    });
  }
}

export default async function handler(request, response) {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  try {
    if (request.method === "GET") {
      sendJson(response, 200, await getState());
      return;
    }

    if (request.method === "PUT") {
      const state = await readBody(request);
      if (!state) {
        sendJson(response, 400, { error: "Request body is required" });
        return;
      }
      await saveState(state);
      sendJson(response, 200, { ok: true });
      return;
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}
