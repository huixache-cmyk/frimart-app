import { supabase } from "./supabase";

/**
 * CATÁLOGO EN LÍNEA (tiendas y congeladores) + BITÁCORA + AUTORIZACIONES
 *
 * - Supabase es la fuente de verdad: al abrir la app se descargan tiendas y
 *   congeladores; cualquier alta o cambio local se sube automáticamente.
 * - Sin señal, los cambios quedan pendientes (se comparan contra la última
 *   versión subida) y se reintentan al volver la conexión y cada 60 s.
 * - El historial de cada cambio lo guarda Supabase (trigger → frimart_bitacora).
 */

const SYNCED_KEY = "frimart_catalog_synced"; // { "tiendas:ID": hash, "congeladores:ID": hash }

const readSynced = () => { try { return JSON.parse(localStorage.getItem(SYNCED_KEY) || "{}"); } catch { return {}; } };
const writeSynced = (m) => { try { localStorage.setItem(SYNCED_KEY, JSON.stringify(m)); } catch { /* lleno */ } };

const isDataUrl = (v) => typeof v === "string" && v.startsWith("data:");

/** Quita fotos en base64 (pesadas); las fotos viajan por Storage con la visita. */
function sanitize(item) {
  const out = { ...item };
  ["photoUrl", "photo", "photoEvidence", "image"].forEach((k) => { if (isDataUrl(out[k])) out[k] = null; });
  if (Array.isArray(out.visits)) out.visits = out.visits.map((v) => (isDataUrl(v?.photo) ? { ...v, photo: null } : v));
  return out;
}
const hashOf = (item) => JSON.stringify(sanitize(item));

const storeRow = (s, userId, isNew) => ({
  id: s.id,
  nombre: s.name,
  ruta_id: s.routeId || null,
  cedis_id: s.cedisId || null,
  lat: s.coordinates?.lat ?? s.lat ?? null,
  lng: s.coordinates?.lng ?? s.lng ?? null,
  activo: s.active !== false,
  datos: sanitize(s),
  actualizado_en: new Date().toISOString(),
  actualizado_por: userId || null,
  ...(isNew ? { creado_por: userId || null } : {})
});

const freezerRow = (f, userId, isNew) => ({
  id: f.id,
  qr: f.qrCode || f.id,
  tienda_id: f.storeId || null,
  modelo: f.model || null,
  activo: f.active !== false,
  datos: sanitize(f),
  actualizado_en: new Date().toISOString(),
  actualizado_por: userId || null,
  ...(isNew ? { creado_por: userId || null } : {})
});

/** Descarga el catálogo. Devuelve null si no hay conexión o faltan las tablas. */
export async function fetchCatalog() {
  try {
    const [t, c] = await Promise.all([
      supabase.from("frimart_tiendas").select("id,datos").eq("activo", true),
      supabase.from("frimart_congeladores").select("id,datos").eq("activo", true)
    ]);
    if (t.error || c.error) throw t.error || c.error;
    return { stores: (t.data || []).map((r) => r.datos), freezers: (c.data || []).map((r) => r.datos) };
  } catch (err) {
    console.warn("Catálogo sin conexión:", err?.message || err);
    return null;
  }
}

/**
 * Une lo remoto con lo local:
 * - lo que existe en Supabase manda;
 * - lo creado en este teléfono y aún no subido se conserva (y se subirá);
 * - lo que ya se había subido y no está en Supabase (dado de baja) se quita.
 */
export function mergeCatalog(kind, local = [], remote = []) {
  const synced = readSynced();
  const remoteIds = new Set(remote.map((r) => r.id));
  const pendingLocal = local.filter((l) => !remoteIds.has(l.id) && !synced[`${kind}:${l.id}`]);
  remote.forEach((r) => { synced[`${kind}:${r.id}`] = hashOf(r); });
  Object.keys(synced).forEach((k) => {
    const [kk, id] = [k.slice(0, k.indexOf(":")), k.slice(k.indexOf(":") + 1)];
    if (kk === kind && !remoteIds.has(id)) delete synced[k];
  });
  writeSynced(synced);
  return [...pendingLocal, ...remote];
}

let pushing = false;
/** Sube lo que cambió desde la última sincronización. Devuelve # registros subidos. */
export async function pushCatalogChanges({ stores = [], freezers = [] }, user) {
  if (pushing || !navigator.onLine) return 0;
  pushing = true;
  let sent = 0;
  try {
    const synced = readSynced();
    const tasks = [
      ["tiendas", "frimart_tiendas", stores, storeRow],
      ["congeladores", "frimart_congeladores", freezers, freezerRow]
    ];
    for (const [kind, table, items, toRow] of tasks) {
      const changed = items.filter((i) => i?.id && synced[`${kind}:${i.id}`] !== hashOf(i));
      if (!changed.length) continue;
      const rows = changed.map((i) => toRow(i, user?.id, !synced[`${kind}:${i.id}`]));
      const { error } = await supabase.from(table).upsert(rows);
      if (error) { console.warn(`No se pudo subir ${kind}:`, error.message); continue; }
      changed.forEach((i) => { synced[`${kind}:${i.id}`] = hashOf(i); });
      sent += changed.length;
    }
    writeSynced(synced);
  } finally {
    pushing = false;
  }
  return sent;
}

/** Suscripción en tiempo real a cambios del catálogo hechos en otros teléfonos. */
export function subscribeCatalog(onChange) {
  const channel = supabase
    .channel(`frimart-catalogo-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "frimart_tiendas" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "frimart_congeladores" }, onChange)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

// ---------------- Bitácora de acciones ----------------

const LOG_QUEUE = "frimart_log_queue";
const device = () => (typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 160) : null);

/** Registra una acción del usuario. Nunca bloquea; sin señal queda en cola. */
export function logAction(user, accion, { tabla = null, registroId = null, detalle = null } = {}) {
  const entry = {
    origen: "app",
    usuario_id: user?.id || null,
    usuario_nombre: user?.name || null,
    rol: user?.role || null,
    accion,
    tabla,
    registro_id: registroId,
    detalle,
    dispositivo: device(),
    creado_en: new Date().toISOString()
  };
  let q = [];
  try { q = JSON.parse(localStorage.getItem(LOG_QUEUE) || "[]"); } catch { q = []; }
  q.push(entry);
  try { localStorage.setItem(LOG_QUEUE, JSON.stringify(q.slice(-500))); } catch { /* lleno */ }
  flushLogQueue();
}

let flushingLog = false;
export async function flushLogQueue() {
  if (flushingLog || !navigator.onLine) return;
  flushingLog = true;
  try {
    let q = [];
    try { q = JSON.parse(localStorage.getItem(LOG_QUEUE) || "[]"); } catch { q = []; }
    if (!q.length) return;
    const { error } = await supabase.from("frimart_bitacora").insert(q);
    if (!error) {
      const now = JSON.parse(localStorage.getItem(LOG_QUEUE) || "[]");
      localStorage.setItem(LOG_QUEUE, JSON.stringify(now.slice(q.length)));
    }
  } catch { /* se reintenta luego */ } finally {
    flushingLog = false;
  }
}

// ---------------- Autorizaciones de un solo uso ----------------

export const AUTH_CODE_MINUTES = 30;

/** El supervisor genera un código de 6 dígitos, válido 30 min y un solo uso. */
export async function createAuthCode(supervisor, vendor, motivo = "") {
  const digits = new Uint32Array(1);
  crypto.getRandomValues(digits);
  const codigo = String(100000 + (digits[0] % 900000));
  const row = {
    id: `AUT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    codigo,
    tipo: "jornada_fuera_cedis",
    supervisor_id: supervisor.id,
    supervisor_nombre: supervisor.name,
    vendedor_id: vendor?.id || null,
    vendedor_nombre: vendor?.name || null,
    motivo: motivo || null,
    expira_en: new Date(Date.now() + AUTH_CODE_MINUTES * 60000).toISOString()
  };
  const { error } = await supabase.from("frimart_autorizaciones").insert(row);
  if (error) throw new Error("No se pudo generar el código (revisa tu conexión).");
  logAction(supervisor, "genera_codigo_jornada", { tabla: "frimart_autorizaciones", registroId: row.id, detalle: { vendedor: vendor?.name, motivo } });
  return row;
}

/** El vendedor canjea el código. Se marca como usado en la misma operación (no se puede reutilizar). */
export async function redeemAuthCode(codigo, vendor, jornadaId) {
  if (!navigator.onLine) throw new Error("Se necesita conexión para validar el código.");
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("frimart_autorizaciones")
    .update({ usado_en: now, usado_por: vendor.id, jornada_id: jornadaId })
    .eq("codigo", codigo)
    .eq("tipo", "jornada_fuera_cedis")
    .is("usado_en", null)
    .is("cancelado_en", null)
    .gt("expira_en", now)
    .or(`vendedor_id.is.null,vendedor_id.eq.${vendor.id}`)
    .select();
  if (error) throw new Error("No se pudo validar el código (revisa tu conexión).");
  if (!data?.length) {
    logAction(vendor, "codigo_jornada_rechazado", { detalle: { codigo } });
    throw new Error("Código inválido, vencido, ya usado o no asignado a ti.");
  }
  return data[0];
}

export async function fetchAuthCodes(supervisorId, limit = 15) {
  const { data, error } = await supabase
    .from("frimart_autorizaciones").select("*")
    .eq("supervisor_id", supervisorId).order("creado_en", { ascending: false }).limit(limit);
  if (error) throw error;
  return data || [];
}

export async function cancelAuthCode(id, supervisor) {
  const { error } = await supabase.from("frimart_autorizaciones").update({ cancelado_en: new Date().toISOString() }).eq("id", id).is("usado_en", null);
  if (error) throw error;
  logAction(supervisor, "cancela_codigo_jornada", { tabla: "frimart_autorizaciones", registroId: id });
}
