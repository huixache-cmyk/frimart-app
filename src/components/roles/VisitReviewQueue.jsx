import React, { useEffect, useMemo, useState } from "react";
import { Layers, AlertTriangle, CheckCircle2 } from "lucide-react";
import { fetchVisits, subscribeVisitsAndAlerts } from "../../lib/visitsSync";
import VisitReviewCard from "./VisitReviewCard";

/** Motivos de prioridad de una visita (alertas de inventario primero) */
function reasonsOf(v) {
  const c = v.checklist || {};
  const r = [];
  if ((c.quiebres || []).length) r.push({ label: "Quiebre de inventario", w: 5 });
  if ((c.sustitutos || []).some((s) => s.visitsInRow >= 2)) r.push({ label: "Sustituto repetido", w: 4 });
  else if ((c.sustitutos || []).length) r.push({ label: "Con sustitutos", w: 3 });
  if (v.alerta_temp) r.push({ label: "Temperatura", w: 4 });
  if (c.thermometer === false || c.led === false || c.seals === false) r.push({ label: "Falla de equipo", w: 3 });
  if (Number(v.cumplimiento || 0) < 80) r.push({ label: "Planograma bajo", w: 2 });
  return r;
}

/**
 * COLA DE REVISIÓN (supervisor en adelante)
 * Tarjetas apiladas de las visitas pendientes de sus vendedores; permanecen hasta aprobar o rechazar.
 */
export default function VisitReviewQueue({ reviewer, vendorIds = null, onToast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchVisits({ vendorIds, limit: 100 });
      setRows(data.filter((v) => (v.estado || "pendiente") === "pendiente"));
    } catch {
      /* tablas no disponibles: el panel de visitas ya muestra el aviso */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const off = subscribeVisitsAndAlerts((p) => { if (p.table === "visitas") load(); });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(vendorIds)]);

  const queue = useMemo(
    () => rows
      .map((v) => ({ v, reasons: reasonsOf(v) }))
      .sort((a, b) => Math.max(0, ...b.reasons.map((x) => x.w)) - Math.max(0, ...a.reasons.map((x) => x.w)) || new Date(a.v.fin) - new Date(b.v.fin)),
    [rows]
  );

  if (loading) return null;

  const top = queue[0];
  const withAlerts = queue.filter((q) => q.reasons.some((r) => r.w >= 3)).length;

  return (
    <section className="px-4 pt-3 space-y-3" aria-label="Cola de revisión de visitas">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-section-title text-[#0f172a] flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />Por revisar
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-800">{queue.length} pendientes</span>
          {withAlerts > 0 && <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700">{withAlerts} con alerta</span>}
        </div>
      </div>

      {!top ? (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-[13px] font-semibold text-emerald-800">
          <CheckCircle2 className="w-5 h-5" />Sin visitas pendientes. Todo revisado.
        </div>
      ) : (
        <div className="relative pb-3">
          {/* Efecto de pila */}
          {queue.length > 2 && <div className="absolute inset-x-6 bottom-0 h-6 rounded-b-3xl bg-slate-200/70 border border-slate-200" />}
          {queue.length > 1 && <div className="absolute inset-x-3 bottom-1.5 h-6 rounded-b-3xl bg-slate-100 border border-slate-200" />}
          <div className="relative">
            {top.reasons.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {top.reasons.map((r) => (
                  <span key={r.label} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${r.w >= 4 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}>
                    <AlertTriangle className="w-3 h-3" />{r.label}
                  </span>
                ))}
              </div>
            )}
            <VisitReviewCard
              key={top.v.id}
              visit={top.v}
              compact
              reviewer={reviewer}
              onReviewed={(id, estado) => {
                onToast?.(estado === "aprobada" ? "Visita aprobada" : "Visita rechazada: se avisó al vendedor");
                setTimeout(() => setRows((prev) => prev.filter((x) => x.id !== id)), 900);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
