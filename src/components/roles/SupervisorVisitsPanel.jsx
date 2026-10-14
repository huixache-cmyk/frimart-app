import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Camera, CheckCircle2, XCircle, AlertTriangle, Thermometer, Award, Clock,
  PackageCheck, RefreshCw, X, MapPin, Wifi, Lightbulb, DoorClosed, Sparkles, Snowflake
} from "lucide-react";
import {
  fetchVisits, fetchOpenAlerts, reviewVisit, resolveAlert, subscribeVisitsAndAlerts
} from "../../lib/visitsSync";

const money = (n) => `$${Number(n || 0).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
const timeAgo = (iso) => {
  if (!iso) return "";
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "hace un momento";
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
};
const scoreColor = (s) => (s >= 85 ? "bg-emerald-600" : s >= 70 ? "bg-amber-500" : "bg-rose-600");
const STATUS = {
  pendiente: { label: "Por revisar", cls: "bg-amber-50 text-amber-800 border-amber-200" },
  aprobada: { label: "Aprobada", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  rechazada: { label: "Rechazada", cls: "bg-rose-50 text-rose-800 border-rose-200" }
};

/**
 * Panel de visitas en línea (supervisor en adelante).
 * vendorIds: null = todos (director/propietario), arreglo = solo esos vendedores.
 */
export default function SupervisorVisitsPanel({ reviewer, vendorIds = null, onToast }) {
  const [visits, setVisits] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("pendiente");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [live, setLive] = useState(false);
  const scopeKey = vendorIds ? vendorIds.join(",") : "ALL";

  const load = useCallback(async () => {
    try {
      setError("");
      const [v, a] = await Promise.all([fetchVisits({ vendorIds }), fetchOpenAlerts({ vendorIds })]);
      setVisits(v);
      setAlerts(a);
    } catch (e) {
      setError(/frimart_visitas|frimart_alertas|PGRST205/.test(e?.message || "") ? "setup" : (e?.message || "Sin conexión"));
    } finally {
      setLoading(false);
    }
  }, [scopeKey]);

  useEffect(() => {
    load();
    const inScope = (row) => !vendorIds || vendorIds.includes(row?.vendedor_id);
    const unsub = subscribeVisitsAndAlerts(({ table, eventType, new: row }) => {
      setLive(true);
      if (!inScope(row)) return;
      if (table === "visitas" && eventType === "INSERT") {
        onToast?.(`Nueva visita: ${row.tienda_nombre} · ${row.vendedor_nombre || ""}`);
      }
      if (table === "alertas" && eventType === "INSERT") {
        onToast?.(`⚠️ ${row.mensaje}`);
      }
      load();
    });
    const t = setTimeout(() => setLive(true), 2500);
    return () => { unsub(); clearTimeout(t); };
  }, [load]);

  const counts = useMemo(() => ({
    pendiente: visits.filter((v) => v.estado === "pendiente").length,
    aprobada: visits.filter((v) => v.estado === "aprobada").length,
    rechazada: visits.filter((v) => v.estado === "rechazada").length,
    todas: visits.length
  }), [visits]);

  const today = new Date().toDateString();
  const todayVisits = visits.filter((v) => new Date(v.fin).toDateString() === today);
  const todaySales = todayVisits.reduce((a, v) => a + v.venta, 0);
  const avgScore = todayVisits.length ? Math.round(todayVisits.reduce((a, v) => a + (v.calificacion || 0), 0) / todayVisits.length) : 0;

  const shown = filter === "todas" ? visits : visits.filter((v) => v.estado === filter);

  const handleReview = async (visit, estado, comentario) => {
    try {
      await reviewVisit(visit.id, { estado, comentario, reviewer });
      onToast?.(estado === "aprobada" ? "Visita aprobada" : "Visita rechazada");
      setSelected(null);
      load();
    } catch (e) {
      onToast?.(`No se pudo guardar: ${e?.message || "sin conexión"}`);
    }
  };

  const handleResolve = async (alert) => {
    try {
      await resolveAlert(alert.id, reviewer);
      setAlerts((p) => p.filter((a) => a.id !== alert.id));
    } catch (e) {
      onToast?.(`No se pudo atender: ${e?.message || "sin conexión"}`);
    }
  };

  if (error === "setup") {
    return (
      <div className="p-4 rounded-[22px] bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
        <strong className="block">Falta activar las visitas en línea</strong>
        <span>Ejecuta el archivo <code>supabase_visitas_setup.sql</code> en Supabase → SQL Editor.</span>
      </div>
    );
  }

  return (
    <section className="space-y-3" aria-label="Visitas en línea">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-section-title text-[#0f172a]">Visitas del equipo</h2>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className={`w-2 h-2 rounded-full ${live && !error ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            {error ? "Sin conexión" : live ? "En vivo" : "Conectando…"}
          </span>
        </div>
        <button type="button" onClick={load} className="tap-effect w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer" aria-label="Actualizar">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* KPIs del día */}
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Visitas hoy" value={todayVisits.length} />
        <Kpi label="Venta hoy" value={money(todaySales)} accent />
        <Kpi label="Calif. prom." value={avgScore ? `${avgScore}` : "–"} />
      </div>

      {/* Alertas abiertas */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className={`p-3 rounded-2xl border flex items-start gap-2.5 ${a.tipo === "temperatura" ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"}`}>
              {a.tipo === "temperatura" ? <Thermometer className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-snug">{a.mensaje}</p>
                <span className="text-[10px] text-slate-500">{a.vendedor_nombre} · {timeAgo(a.creado_en)}</span>
              </div>
              <button type="button" onClick={() => handleResolve(a)} className="tap-effect px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer shrink-0">
                Atendida
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {[["pendiente", "Por revisar"], ["aprobada", "Aprobadas"], ["rechazada", "Rechazadas"], ["todas", "Todas"]].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setFilter(id)} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer ${filter === id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"}`}>
            {label} <span className="opacity-70">{counts[id]}</span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="p-6 text-center text-xs text-slate-400">Cargando visitas…</div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2"><Wifi className="w-4 h-4" />No se pudo conectar. Reintenta en un momento.</div>
      ) : shown.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
          {filter === "pendiente" ? "No hay visitas por revisar." : "Sin visitas en esta categoría."}
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map((v) => (
            <button key={v.id} type="button" onClick={() => setSelected(v)} className="tap-effect w-full p-2.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-left cursor-pointer hover:border-slate-300">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {v.foto_url ? <img src={v.foto_url} alt={`Evidencia ${v.tienda_nombre}`} className="w-full h-full object-cover" loading="lazy" /> : <Camera className="w-5 h-5 text-slate-300 absolute inset-0 m-auto" />}
                <span className={`absolute bottom-0.5 right-0.5 px-1 rounded text-[10px] font-black text-white ${scoreColor(v.calificacion)}`}>{v.calificacion}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[13px] font-bold text-slate-900 truncate">{v.tienda_nombre}</h3>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded-md border text-[9px] font-bold ${STATUS[v.estado]?.cls}`}>{STATUS[v.estado]?.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{v.vendedor_nombre} · {timeAgo(v.fin)}</p>
                <div className="flex items-center gap-2.5 mt-1 text-[11px] font-semibold text-slate-700">
                  <span className="text-emerald-700">{money(v.venta)}</span>
                  <span>{v.bolsas_surtidas} bolsas</span>
                  <span className={v.alerta_temp ? "text-rose-600" : ""}>{v.temperatura}°C</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <VisitDetail visit={selected} onClose={() => setSelected(null)} onReview={handleReview} />}
    </section>
  );
}

function Kpi({ label, value, accent }) {
  return (
    <div className={`p-2.5 rounded-2xl border text-center ${accent ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
      <span className="block text-[10px] text-slate-500 font-semibold">{label}</span>
      <span className={`block font-['Outfit'] text-lg font-black ${accent ? "text-emerald-800" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}

function CheckItem({ icon: Icon, label, ok }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-semibold ${ok === false ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-emerald-50/50 border-emerald-200 text-emerald-900"}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="flex-1">{label}</span>
      {ok === false ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
    </div>
  );
}

function VisitDetail({ visit, onClose, onReview }) {
  const [comment, setComment] = useState(visit.comentario || "");
  const c = visit.checklist || {};
  const minutes = visit.inicio && visit.fin ? Math.max(1, Math.round((new Date(visit.fin) - new Date(visit.inicio)) / 60000)) : null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md mx-auto bg-white rounded-t-[26px] shadow-2xl animate-sheet-up max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-section-title text-[#0f172a] truncate">{visit.tienda_nombre}</h3>
            <p className="text-[11px] text-slate-500">{visit.vendedor_nombre} · {new Date(visit.fin).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer" aria-label="Cerrar"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-3">
          {visit.foto_url ? (
            <a href={visit.foto_url} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden border border-slate-200">
              <img src={visit.foto_url} alt="Foto de evidencia" className="w-full max-h-80 object-cover" />
            </a>
          ) : (
            <div className="h-32 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">Sin foto</div>
          )}

          <div className="grid grid-cols-4 gap-2 text-center">
            <Mini icon={Award} label="Calif." value={visit.calificacion} strong />
            <Mini icon={PackageCheck} label="Bolsas" value={visit.bolsas_surtidas} />
            <Mini icon={CheckCircle2} label="Planog." value={`${visit.cumplimiento}%`} />
            <Mini icon={Clock} label="Minutos" value={minutes ?? "–"} />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-600 text-white flex items-center justify-between">
            <span className="text-xs font-semibold">Venta cobrada (resurtido)</span>
            <span className="font-['Outfit'] text-xl font-black">{money(visit.venta)}</span>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center justify-between ${visit.alerta_temp ? "bg-rose-50 border-rose-200" : "bg-sky-50 border-sky-200"}`}>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"><Thermometer className="w-4 h-4" />Temperatura</span>
            <span className={`font-['Outfit'] text-lg font-black ${visit.alerta_temp ? "text-rose-700" : "text-sky-800"}`}>{visit.temperatura}°C</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <CheckItem icon={Thermometer} label="Termómetro" ok={c.thermometer} />
            <CheckItem icon={Lightbulb} label="Luz LED" ok={c.led} />
            <CheckItem icon={DoorClosed} label="Sellos" ok={c.seals} />
            <CheckItem icon={Sparkles} label="Limpieza" ok={c.cleaned} />
            <div className="col-span-2 flex items-center gap-2 p-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
              <Snowflake className="w-3.5 h-3.5" />Escarcha: <span className="capitalize">{c.frost || "–"}</span>
            </div>
          </div>

          {Array.isArray(visit.lineas) && visit.lineas.length > 0 && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-600">Productos surtidos</div>
              {visit.lineas.map((l, i) => (
                <div key={i} className="px-3 py-2 flex items-center justify-between text-[12px] border-t border-slate-100">
                  <span className="truncate pr-2">{l.name}</span>
                  <span className="shrink-0 text-slate-600">{l.found}→{l.left} · <strong className="text-emerald-700">+{l.restocked}</strong></span>
                </div>
              ))}
            </div>
          )}

          {visit.distancia_m !== null && visit.distancia_m !== undefined && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Registrada a {visit.distancia_m} m de la tienda</p>
          )}

          {visit.estado !== "pendiente" && (
            <div className={`p-3 rounded-2xl border text-xs ${STATUS[visit.estado]?.cls}`}>
              <strong>{STATUS[visit.estado]?.label}</strong> por {visit.revisado_nombre || "—"}
              {visit.comentario && <p className="mt-1">“{visit.comentario}”</p>}
            </div>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentario para el vendedor (opcional)"
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
          />
          <div className="flex gap-2 pb-2">
            <button type="button" onClick={() => onReview(visit, "rechazada", comment)} className="tap-effect flex-1 py-3 rounded-2xl bg-white border-2 border-rose-200 text-rose-700 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer">
              <XCircle className="w-4 h-4" />Rechazar
            </button>
            <button type="button" onClick={() => onReview(visit, "aprobada", comment)} className="tap-effect flex-1 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="w-4 h-4" />Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value, strong }) {
  return (
    <div className={`p-2 rounded-xl border ${strong ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
      <Icon className={`w-3.5 h-3.5 mx-auto ${strong ? "text-amber-400" : "text-slate-400"}`} />
      <span className="block font-['Outfit'] text-base font-black leading-tight mt-0.5">{value}</span>
      <span className={`block text-[9px] font-semibold ${strong ? "text-white/70" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}
