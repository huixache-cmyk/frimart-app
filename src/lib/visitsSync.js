import { supabase } from "./supabase";

/**
 * Sincronización en línea de visitas guiadas, fotos y alertas.
 * Si no hay señal, la visita queda en una cola local y se reenvía sola
 * al recuperar conexión (evento "online" y cada 60 s).
 */

const QUEUE_KEY = "frimart_visit_queue";
const BUCKET = "visitas-fotos";
export const TEMP_ALERT_THRESHOLD = -15;

const readQueue = () => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; }
};
const writeQueue = (q) => {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch { /* almacenamiento lleno */ }
  window.dispatchEvent(new CustomEvent("frimart-queue-change", { detail: q.length }));
};
export const pendingVisitsCount = () => readQueue().length;

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

async function uploadPhoto(visitId, dataUrl) {
  if (!dataUrl) return null;
  if (/^https?:\/\//.test(dataUrl)) return dataUrl; // ya subida
  const blob = await dataUrlToBlob(dataUrl);
  const path = `${new Date().toISOString().slice(0, 10)}/${visitId}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function toRow(visit, photoUrl) {
  return {
    id: visit.id,
    congelador_id: visit.freezerId,
    tienda_id: visit.storeId,
    tienda_nombre: visit.storeName,
    vendedor_id: visit.vendorId,
    vendedor_nombre: visit.vendorName,
    cedis_id: visit.cedisId,
    ruta_id: visit.routeId,
    inicio: visit.startedAt,
    fin: visit.endedAt,
    gps_lat: visit.gps?.lat ?? null,
    gps_lng: visit.gps?.lng ?? null,
    distancia_m: visit.distanceM,
    bolsas_surtidas: visit.bagsRestocked,
    venta: visit.amount,
    cumplimiento: visit.compliance,
    frentes_vacios: visit.emptyFacingsFound,
    temperatura: visit.temperature,
    alerta_temp: !!visit.tempAlert,
    checklist: { ...(visit.checks || {}), sustitutos: visit.substitutions || [], quiebres: visit.stockouts || [] },
    lineas: visit.lines || [],
    foto_url: photoUrl,
    calificacion: visit.score
  };
}

function buildAlerts(visit) {
  const base = {
    visita_id: visit.id,
    congelador_id: visit.freezerId,
    tienda_id: visit.storeId,
    tienda_nombre: visit.storeName,
    vendedor_id: visit.vendorId,
    vendedor_nombre: visit.vendorName,
    cedis_id: visit.cedisId,
    ruta_id: visit.routeId
  };
  const alerts = [];
  if (visit.tempAlert) {
    alerts.push({ ...base, id: `ALR-T-${visit.id}`, tipo: "temperatura", severidad: "alta", mensaje: `Temperatura ${visit.temperature}°C en ${visit.storeName} (máx. ${TEMP_ALERT_THRESHOLD}°C)` });
  }
  const c = visit.checks || {};
  const fails = [
    c.thermometer === false && "termómetro",
    c.led === false && "luz LED",
    c.seals === false && "sellos de puerta"
  ].filter(Boolean);
  if (fails.length) {
    alerts.push({ ...base, id: `ALR-E-${visit.id}`, tipo: "equipo", severidad: "media", mensaje: `Falla de ${fails.join(", ")} en ${visit.storeName}` });
  }
  const stockouts = visit.stockouts || [];
  if (stockouts.length) {
    alerts.push({ ...base, id: `ALR-Q-${visit.id}`, tipo: "quiebre", severidad: "media", mensaje: `Quiebre de inventario en ${visit.storeName}: ${stockouts.map((s) => s.name).join(", ")}` });
  }
  const repeated = (visit.substitutions || []).filter((s) => s.visitsInRow >= 2);
  if (repeated.length) {
    alerts.push({ ...base, id: `ALR-S-${visit.id}`, tipo: "sustituto", severidad: "baja", mensaje: `Sustituto ${repeated.length > 1 ? "repetido" : "por " + repeated[0].visitsInRow + "ª visita"} en ${visit.storeName}: ${repeated.map((s) => `${s.originalName} → ${s.substituteName}`).join("; ")}` });
  }
  return alerts;
}

async function pushVisit(visit) {
  const photoUrl = await uploadPhoto(visit.id, visit.photo);
  const { error } = await supabase.from("frimart_visitas").upsert(toRow(visit, photoUrl));
  if (error) throw error;
  const alerts = buildAlerts(visit);
  if (alerts.length) {
    const { error: aErr } = await supabase.from("frimart_alertas").upsert(alerts);
    if (aErr) throw aErr;
  }
  return photoUrl;
}

/** Envía la visita; si falla, la deja en cola. Devuelve { synced, photoUrl }. */
export async function submitVisit(visit) {
  try {
    const photoUrl = await pushVisit(visit);
    return { synced: true, photoUrl };
  } catch (err) {
    console.warn("Visita en cola (sin conexión o error):", err?.message || err);
    writeQueue([...readQueue().filter((v) => v.id !== visit.id), visit]);
    return { synced: false, photoUrl: null };
  }
}

let flushing = false;
export async function flushVisitQueue() {
  if (flushing || !navigator.onLine) return 0;
  flushing = true;
  let sent = 0;
  try {
    for (const v of readQueue()) {
      try {
        await pushVisit(v);
        writeQueue(readQueue().filter((x) => x.id !== v.id));
        sent += 1;
      } catch { break; }
    }
  } finally {
    flushing = false;
  }
  return sent;
}

export function startVisitQueueWorker(onSent) {
  const run = async () => { const n = await flushVisitQueue(); if (n && onSent) onSent(n); };
  window.addEventListener("online", run);
  const t = setInterval(run, 60000);
  run();
  return () => { window.removeEventListener("online", run); clearInterval(t); };
}

// ---------- Lectura y revisión (supervisor en adelante) ----------

const fromRow = (r) => ({ ...r, venta: Number(r.venta || 0), temperatura: r.temperatura === null ? null : Number(r.temperatura) });

export async function fetchVisits({ vendorIds = null, limit = 60 } = {}) {
  let q = supabase.from("frimart_visitas").select("*").order("fin", { ascending: false }).limit(limit);
  if (vendorIds) q = q.in("vendedor_id", vendorIds.length ? vendorIds : ["__none__"]);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function fetchOpenAlerts({ vendorIds = null } = {}) {
  let q = supabase.from("frimart_alertas").select("*").eq("atendida", false).order("creado_en", { ascending: false }).limit(50);
  if (vendorIds) q = q.in("vendedor_id", vendorIds.length ? vendorIds : ["__none__"]);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

/** Última visita registrada en línea para un congelador. */
export async function fetchLatestVisitForFreezer(freezerId) {
  const { data, error } = await supabase
    .from("frimart_visitas").select("*").eq("congelador_id", freezerId)
    .order("fin", { ascending: false }).limit(1);
  if (error) throw error;
  return data?.[0] ? fromRow(data[0]) : null;
}

/** Visitas del vendedor ya revisadas por su supervisor (para avisarle). */
export async function fetchReviewedForVendor(vendorId, sinceDays = 7) {
  const since = new Date(Date.now() - sinceDays * 86400000).toISOString();
  const { data, error } = await supabase
    .from("frimart_visitas").select("id,tienda_nombre,estado,comentario,revisado_nombre,revisado_en,fin,cumplimiento,calificacion")
    .eq("vendedor_id", vendorId).in("estado", ["aprobada", "rechazada"]).gte("fin", since)
    .order("revisado_en", { ascending: false }).limit(30);
  if (error) throw error;
  return data || [];
}

export async function reviewVisit(visitId, { estado, comentario, reviewer }) {
  const { error } = await supabase
    .from("frimart_visitas")
    .update({ estado, comentario: comentario || null, revisado_por: reviewer?.id, revisado_nombre: reviewer?.name, revisado_en: new Date().toISOString() })
    .eq("id", visitId);
  if (error) throw error;
}

export async function resolveAlert(alertId, reviewer) {
  const { error } = await supabase
    .from("frimart_alertas")
    .update({ atendida: true, atendida_por: reviewer?.name || reviewer?.id, atendida_en: new Date().toISOString() })
    .eq("id", alertId);
  if (error) throw error;
}

/** Suscripción en tiempo real a visitas y alertas. Devuelve función para cancelar. */
export function subscribeVisitsAndAlerts(onChange) {
  const channel = supabase
    .channel(`frimart-visitas-alertas-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "frimart_visitas" }, (p) => onChange({ table: "visitas", ...p }))
    .on("postgres_changes", { event: "*", schema: "public", table: "frimart_alertas" }, (p) => onChange({ table: "alertas", ...p }))
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
