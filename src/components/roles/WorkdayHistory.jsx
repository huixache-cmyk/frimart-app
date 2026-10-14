import React, { useEffect, useMemo, useState } from "react";
import { History, Bot, XCircle } from "lucide-react";
import { fetchWorkdays } from "../../lib/workday";
import { fetchVisits } from "../../lib/visitsSync";

const hhmm = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—");
const dur = (a, b) => {
  if (!a || !b) return "—";
  const m = Math.max(0, Math.round((new Date(b) - new Date(a)) / 60000));
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};
const tone = (n) => (n >= 90 ? "text-emerald-700 bg-emerald-50" : n >= 70 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50");

/**
 * HISTÓRICO DE JORNADAS Y CUMPLIMIENTO DIARIO
 * Cumplimiento = tiendas con visita válida (no rechazada) ÷ tiendas programadas.
 */
export default function WorkdayHistory({ vendorIds = null, days = 7, title = "Jornadas y cumplimiento diario", showVendor = true }) {
  const [rows, setRows] = useState(null);
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchWorkdays({ vendorIds, days }), fetchVisits({ vendorIds, limit: 500 }).catch(() => [])])
      .then(([j, v]) => { if (alive) { setRows(j); setVisits(v); } })
      .catch(() => alive && setError("Falta crear la tabla de jornadas en Supabase (supabase_jornadas_setup.sql)."));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(vendorIds), days]);

  const computed = useMemo(() => (rows || []).map((j) => {
    const end = j.fin || new Date().toISOString();
    const dayVisits = visits.filter((v) => v.vendedor_id === j.vendedor_id && v.fin >= j.inicio && v.fin <= end);
    const valid = dayVisits.filter((v) => v.estado !== "rechazada");
    const rejected = dayVisits.length - valid.length;
    const stores = new Set(valid.map((v) => v.tienda_id)).size || (dayVisits.length ? 0 : j.tiendas_visitadas || 0);
    const programmed = j.tiendas_programadas || 0;
    const compliance = programmed ? Math.round((stores / programmed) * 100) : 0;
    const scoreAvg = valid.length ? Math.round(valid.reduce((a, v) => a + Number(v.calificacion || 0), 0) / valid.length) : j.calificacion_prom;
    return { j, stores, programmed, compliance, scoreAvg, rejected };
  }), [rows, visits]);

  return (
    <section className="px-4 pt-3 space-y-2" aria-label={title}>
      <h2 className="font-section-title text-[#0f172a] flex items-center gap-2"><History className="w-4 h-4 text-emerald-600" />{title}</h2>
      {error && <p className="text-[12px] text-amber-800 bg-amber-50 p-3 rounded-2xl">{error}</p>}
      {!error && rows === null && <p className="text-[12px] text-slate-400">Cargando…</p>}
      {!error && rows?.length === 0 && <p className="text-[12px] text-slate-500 bg-white border border-slate-200 p-3 rounded-2xl">Sin jornadas registradas en los últimos {days} días.</p>}
      {computed.map(({ j, stores, programmed, compliance, scoreAvg, rejected }) => (
        <div key={j.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              {showVendor && <strong className="block text-[13px] text-slate-900 truncate">{j.vendedor_nombre || j.vendedor_id}</strong>}
              <span className="block text-[11px] text-slate-500">
                {new Date(`${j.fecha}T12:00:00`).toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short" })} · {hhmm(j.inicio)} – {j.fin ? hhmm(j.fin) : "en curso"} · {dur(j.inicio, j.fin)}
              </span>
            </div>
            <span className={`shrink-0 px-2.5 py-1 rounded-xl text-[13px] font-black ${tone(compliance)}`}>{compliance}%</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1.5 rounded-xl bg-slate-50"><span className="block text-[10px] text-slate-400">Tiendas</span><strong className="text-[12px] text-slate-800">{stores}/{programmed}</strong></div>
            <div className="p-1.5 rounded-xl bg-slate-50"><span className="block text-[10px] text-slate-400">Calificación</span><strong className="text-[12px] text-slate-800">{scoreAvg ?? "—"}</strong></div>
            <div className="p-1.5 rounded-xl bg-slate-50"><span className="block text-[10px] text-slate-400">Venta</span><strong className="text-[12px] text-slate-800">${Number(j.venta || 0).toFixed(0)}</strong></div>
          </div>
          {(j.cierre_auto || rejected > 0 || (j.no_visitadas || []).length > 0) && (
            <div className="flex flex-wrap gap-1">
              {j.cierre_auto && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800"><Bot className="w-3 h-3" />Cierre automático</span>}
              {rejected > 0 && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700"><XCircle className="w-3 h-3" />{rejected} rechazada(s)</span>}
              {(j.no_visitadas || []).map((n) => (
                <span key={n.tienda_id} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{n.tienda_nombre}: {n.motivo}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
