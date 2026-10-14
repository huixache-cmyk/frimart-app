/**
 * JORNADA LABORAL: abrir/cerrar con GPS en el CEDIS, acumulado del día y cierre automático.
 * Estado local en localStorage (funciona sin señal) + respaldo en Supabase (frimart_jornadas).
 */
import { supabase } from "./supabase";
import { calculateDistanceMeters } from "../data/mockData";
import { WORKDAY_CONFIG, getCedisLocation } from "../data/workdayConfig";

const KEY = "frimart_workday";
const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Este dispositivo no tiene GPS disponible."));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }),
      () => reject(new Error("No se pudo obtener tu ubicación. Activa el GPS y da permiso a la app.")),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });
}

/** Verifica que el vendedor esté dentro del radio de un punto. */
export function checkGeofence(pos, target, radiusM) {
  if (!pos || !target?.lat) return { ok: false, distanceM: null };
  const distanceM = Math.round(calculateDistanceMeters(pos.lat, pos.lng, target.lat, target.lng));
  return { ok: distanceM <= radiusM, distanceM };
}

export function loadWorkday(vendorId) {
  try {
    const w = JSON.parse(localStorage.getItem(KEY) || "null");
    return w && w.vendorId === vendorId ? w : null;
  } catch { return null; }
}
const saveLocal = (w) => (w ? localStorage.setItem(KEY, JSON.stringify(w)) : localStorage.removeItem(KEY));

const toRow = (w) => ({
  id: w.id,
  vendedor_id: w.vendorId,
  vendedor_nombre: w.vendorName,
  cedis_id: w.cedisId,
  ruta_id: w.routeId,
  fecha: w.date,
  inicio: w.startedAt,
  fin: w.endedAt || null,
  inicio_lat: w.startGps?.lat ?? null,
  inicio_lng: w.startGps?.lng ?? null,
  inicio_distancia_m: w.startDistanceM ?? null,
  fin_lat: w.endGps?.lat ?? null,
  fin_lng: w.endGps?.lng ?? null,
  cierre_auto: !!w.autoClosed,
  tiendas_programadas: w.scheduled || 0,
  tiendas_visitadas: (w.visitedStoreIds || []).length,
  venta: Math.round((w.sales || 0) * 100) / 100,
  piezas: w.bags || 0,
  calificacion_prom: w.scores?.length ? Math.round((w.scores.reduce((a, b) => a + b, 0) / w.scores.length) * 10) / 10 : null,
  cumplimiento_prom: w.compliances?.length ? Math.round((w.compliances.reduce((a, b) => a + b, 0) / w.compliances.length) * 10) / 10 : null,
  no_visitadas: w.notVisited || [],
  estado: w.endedAt ? "cerrada" : "abierta"
});

async function push(w) {
  try {
    const { error } = await supabase.from("frimart_jornadas").upsert(toRow(w));
    return !error;
  } catch { return false; }
}

/** Abre jornada: exige GPS dentro del radio del CEDIS asignado, salvo autorización de supervisor. */
export async function openWorkday(user, scheduled, authorizedBy = null) {
  const cedis = getCedisLocation(user?.cedisId);
  if (!cedis && !authorizedBy) throw new Error("Tu CEDIS no tiene ubicación registrada. Pide a tu supervisor que la configure.");
  let pos = null;
  let distanceM = null;
  if (authorizedBy) {
    // Se intenta registrar la ubicación, pero no se bloquea
    try { pos = await getPosition(); distanceM = cedis ? checkGeofence(pos, cedis, WORKDAY_CONFIG.cedisRadiusM).distanceM : null; } catch { /* sin GPS */ }
  } else {
    pos = await getPosition();
    if (pos.accuracy > WORKDAY_CONFIG.maxGpsAccuracyM) throw new Error(`Señal GPS imprecisa (±${pos.accuracy} m). Sal a cielo abierto y reintenta.`);
    const g = checkGeofence(pos, cedis, WORKDAY_CONFIG.cedisRadiusM);
    distanceM = g.distanceM;
    if (!g.ok) throw new Error(`Estás a ${distanceM >= 1000 ? (distanceM / 1000).toFixed(1) + " km" : distanceM + " m"} de ${cedis.name}. La jornada se abre en el CEDIS (máx. ${WORKDAY_CONFIG.cedisRadiusM} m).`);
  }
  const now = new Date();
  const w = {
    id: `JOR-${user.id}-${todayStr(now)}`,
    vendorId: user.id,
    vendorName: user.name,
    cedisId: user.cedisId,
    routeId: user.routeId,
    date: todayStr(now),
    startedAt: now.toISOString(),
    startGps: pos,
    startDistanceM: distanceM,
    scheduled,
    authorizedBy: authorizedBy ? { id: authorizedBy.id, name: authorizedBy.name } : null,
    visitedStoreIds: [],
    sales: 0,
    bags: 0,
    scores: [],
    compliances: []
  };
  saveLocal(w);
  push(w);
  return w;
}

/** Suma una visita terminada al acumulado de la jornada. */
export function addVisitToWorkday(vendorId, visit) {
  const w = loadWorkday(vendorId);
  if (!w || w.endedAt) return null;
  const next = {
    ...w,
    visitedStoreIds: Array.from(new Set([...(w.visitedStoreIds || []), visit.storeId])),
    sales: (w.sales || 0) + Number(visit.amount || 0),
    bags: (w.bags || 0) + Number(visit.bagsRestocked || 0),
    scores: [...(w.scores || []), Number(visit.score || 0)],
    compliances: [...(w.compliances || []), Number(visit.compliance || 0)]
  };
  saveLocal(next);
  push(next);
  return next;
}

/** Cierra jornada (manual o automática). notVisited: [{tienda_id, tienda_nombre, motivo}] */
export async function closeWorkday(vendorId, { notVisited = [], auto = false } = {}) {
  const w = loadWorkday(vendorId);
  if (!w) return null;
  let endGps = null;
  if (!auto) { try { endGps = await getPosition(); } catch { /* cierre sin ubicación */ } }
  const limit = new Date(`${w.date}T${String(WORKDAY_CONFIG.autoCloseHour).padStart(2, "0")}:00:00`);
  const endedAt = auto ? new Date(Math.min(Date.now(), limit.getTime())).toISOString() : new Date().toISOString();
  const closed = { ...w, endedAt, endGps, autoClosed: auto, notVisited };
  await push(closed);
  saveLocal(null);
  return closed;
}

/** Si la jornada sigue abierta después de la hora límite (o de otro día), se cierra sola. */
export async function enforceAutoClose(vendorId) {
  const w = loadWorkday(vendorId);
  if (!w || w.endedAt) return null;
  const limit = new Date(`${w.date}T${String(WORKDAY_CONFIG.autoCloseHour).padStart(2, "0")}:00:00`);
  if (Date.now() >= limit.getTime()) return closeWorkday(vendorId, { auto: true });
  return null;
}

/** Histórico de jornadas (supervisor: su equipo; vendedor: las suyas). */
export async function fetchWorkdays({ vendorIds = null, days = 7 } = {}) {
  const since = todayStr(new Date(Date.now() - (days - 1) * 86400000));
  let q = supabase.from("frimart_jornadas").select("*").gte("fecha", since).order("fecha", { ascending: false }).limit(300);
  if (vendorIds) q = q.in("vendedor_id", vendorIds.length ? vendorIds : ["__none__"]);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}
