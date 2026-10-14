import React, { useEffect, useState } from "react";
import { ShieldCheck, Check, X, Thermometer, Camera, Shuffle, RefreshCw, CloudOff } from "lucide-react";
import { reviewVisit, fetchLatestVisitForFreezer } from "../../lib/visitsSync";

/** Normaliza una fila de Supabase (frimart_visitas) al formato de la tarjeta */
export function normalizeVisitRow(r) {
  if (!r) return null;
  const c = r.checklist || {};
  return {
    id: r.id,
    storeName: r.tienda_nombre,
    vendorName: r.vendedor_nombre,
    endedAt: r.fin,
    photo: r.foto_url,
    checks: c,
    substitutions: c.sustitutos || [],
    stockouts: c.quiebres || [],
    temperature: r.temperatura,
    tempAlert: !!r.alerta_temp,
    compliance: Number(r.cumplimiento || 0),
    score: r.calificacion,
    amount: Number(r.venta || 0),
    bags: r.bolsas_surtidas,
    estado: r.estado || "pendiente",
    comentario: r.comentario,
    reviewer: r.revisado_nombre,
    synced: true
  };
}

const scoreTone = (n) => (n >= 85 ? "text-emerald-700 bg-emerald-50" : n >= 70 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50");

/**
 * REVISIÓN DE LA VISITA DEL VENDEDOR (supervisor en adelante)
 * Lee directo de Supabase. Recibe `visit` (fila ya cargada) o `freezer` (busca su última visita).
 */
export default function VisitReviewCard({ freezer, visit: visitRow, reviewer, onReviewed, compact = false }) {
  const [visit, setVisit] = useState(() => normalizeVisitRow(visitRow));
  const [loading, setLoading] = useState(!visitRow && !!freezer);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!freezer?.id) return;
    setLoading(true);
    try {
      const row = await fetchLatestVisitForFreezer(freezer.id);
      if (row) setVisit(normalizeVisitRow(row));
      else {
        // Aún no llega a Supabase (sin señal): usa la copia local como referencia
        const local = freezer?.visits?.[0];
        setVisit(local ? { ...local, bags: local.bagsRestocked, estado: "pendiente", synced: false } : null);
      }
    } catch {
      setError("No se pudo consultar la visita en línea.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visitRow) { setVisit(normalizeVisitRow(visitRow)); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freezer?.id, visitRow?.id, freezer?.visits?.[0]?.id]);

  const card = "bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3";
  const title = (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>{compact ? visit?.storeName || "Visita" : "Revisión de la visita del vendedor"}</span>
      </h3>
      {freezer && (
        <button type="button" onClick={load} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer" aria-label="Actualizar">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      )}
    </div>
  );

  if (loading && !visit) return <div className={card}>{title}<p className="text-[13px] text-slate-400">Consultando visita…</p></div>;
  if (!visit) return <div className={card}>{title}<p className="text-[13px] text-slate-500">No hay visita guiada que revisar en este congelador.</p></div>;

  const checks = visit.checks || {};
  const checkItems = [["Termómetro", checks.thermometer], ["Luz LED", checks.led], ["Sellos de puerta", checks.seals], ["Limpieza", checks.cleaned]];
  const subs = visit.substitutions || [];
  const stockouts = visit.stockouts || [];
  const reviewed = visit.estado === "aprobada" || visit.estado === "rechazada";

  const submit = async (estado) => {
    if (estado === "rechazada" && !comment.trim()) { setError("Escribe el motivo del rechazo para el vendedor."); return; }
    setBusy(true); setError(null);
    try {
      await reviewVisit(visit.id, { estado, comentario: comment.trim(), reviewer });
      setVisit((v) => ({ ...v, estado, comentario: comment.trim(), reviewer: reviewer?.name }));
      onReviewed?.(visit.id, estado);
    } catch {
      setError("No se pudo guardar la revisión. Revisa tu conexión.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={card}>
      {title}
      <p className="text-[12px] text-slate-500">
        {visit.vendorName || "Vendedor"} · {visit.endedAt ? new Date(visit.endedAt).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
      </p>

      {/* Indicadores principales */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className={`p-2 rounded-2xl ${scoreTone(visit.compliance)}`}>
          <span className="block text-[10px] font-semibold opacity-80">Planograma</span>
          <span className="block font-['Outfit'] text-xl font-black">{visit.compliance}%</span>
        </div>
        <div className={`p-2 rounded-2xl ${scoreTone(Number(visit.score || 0))}`}>
          <span className="block text-[10px] font-semibold opacity-80">Calificación</span>
          <span className="block font-['Outfit'] text-xl font-black">{visit.score ?? "—"}</span>
        </div>
        <div className="p-2 rounded-2xl bg-slate-50 text-slate-800">
          <span className="block text-[10px] font-semibold text-slate-500">Venta</span>
          <span className="block font-['Outfit'] text-xl font-black">${Number(visit.amount || 0).toFixed(0)}</span>
        </div>
      </div>

      {visit.photo ? (
        <img src={visit.photo} alt="Evidencia de la visita" className="w-full h-40 object-cover rounded-2xl border border-slate-200" />
      ) : (
        <div className="h-20 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center gap-2 text-[12px] text-slate-400">
          <Camera className="w-4 h-4" />Sin foto
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {checkItems.map(([label, ok]) => (
          <span key={label} className={`flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-xl ${ok ? "bg-emerald-50 text-emerald-800" : ok === false ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-500"}`}>
            {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}{label}
          </span>
        ))}
        <span className={`col-span-2 flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-xl ${visit.tempAlert ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-800"}`}>
          <Thermometer className="w-3.5 h-3.5" />Temperatura registrada: {visit.temperature ?? "—"}°C
        </span>
      </div>

      {(subs.length > 0 || stockouts.length > 0) && (
        <div className="space-y-1">
          {subs.map((s, i) => (
            <p key={i} className="flex items-start gap-1.5 text-[12px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-xl">
              <Shuffle className="w-3.5 h-3.5 mt-0.5 shrink-0" />{s.originalName} → {s.substituteName}{s.visitsInRow >= 2 ? ` (${s.visitsInRow}ª visita seguida)` : ""}
            </p>
          ))}
          {stockouts.map((s, i) => (
            <p key={`q${i}`} className="text-[12px] text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-xl">Quiebre de inventario: {s.name}</p>
          ))}
        </div>
      )}

      {!visit.synced ? (
        <p className="flex items-center gap-2 text-[12px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
          <CloudOff className="w-4 h-4 shrink-0" />La visita aún no llega al servidor (el vendedor estaba sin señal). Podrás revisarla en cuanto se sincronice.
        </p>
      ) : reviewed ? (
        <div className={`p-3 rounded-2xl text-[13px] text-center ${visit.estado === "aprobada" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          <strong className="block">Visita {visit.estado}{visit.reviewer ? ` por ${visit.reviewer}` : ""}</strong>
          {visit.comentario && <span className="block text-[12px] mt-0.5">“{visit.comentario}”</span>}
        </div>
      ) : (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="Comentario para el vendedor (obligatorio si rechazas)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
          {error && <p className="text-[12px] text-rose-600">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled={busy} onClick={() => submit("rechazada")} className="tap-effect py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-[13px] font-bold cursor-pointer disabled:opacity-50">Rechazar</button>
            <button type="button" disabled={busy} onClick={() => submit("aprobada")} className="tap-effect py-3 rounded-2xl bg-emerald-600 text-white text-[13px] font-bold cursor-pointer disabled:opacity-50">Aprobar</button>
          </div>
        </>
      )}
    </div>
  );
}
