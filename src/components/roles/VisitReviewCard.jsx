import React, { useState } from "react";
import { ShieldCheck, Check, X, Thermometer, Camera, Shuffle } from "lucide-react";
import { reviewVisit } from "../../lib/visitsSync";

/**
 * REVISIÓN DE LA VISITA DEL VENDEDOR (supervisor en adelante)
 * Muestra la evidencia de la última visita guiada del congelador y permite aprobarla o rechazarla.
 */
export default function VisitReviewCard({ freezer, reviewer, onReviewed }) {
  const last = freezer?.visits?.[0];
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(last?.reviewState || null);
  const [error, setError] = useState(null);

  const card = "bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3";
  const title = (
    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
      <ShieldCheck className="w-4 h-4 text-emerald-600" />
      <span>Revisión de la visita del vendedor</span>
    </h3>
  );

  if (!last) {
    return (
      <div className={card}>
        {title}
        <p className="text-[13px] text-slate-500">No hay visita guiada que revisar en este congelador.</p>
      </div>
    );
  }

  const checks = last.checks || {};
  const checkItems = [
    ["Termómetro", checks.thermometer],
    ["Luz LED", checks.led],
    ["Sellos de puerta", checks.seals],
    ["Limpieza", checks.cleaned]
  ];
  const subs = last.substitutions || [];
  const stockouts = last.stockouts || [];

  const submit = async (estado) => {
    if (estado === "rechazada" && !comment.trim()) {
      setError("Escribe el motivo del rechazo para el vendedor.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await reviewVisit(last.id, { estado, comentario: comment.trim(), reviewer });
      setResult(estado);
      onReviewed?.(last.id, estado, comment.trim());
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
        {last.vendorName || "Vendedor"} · {last.endedAt ? new Date(last.endedAt).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
      </p>

      {last.photo ? (
        <img src={last.photo} alt="Evidencia de la visita" className="w-full h-40 object-cover rounded-2xl border border-slate-200" />
      ) : freezer?.photoUrl ? (
        <img src={freezer.photoUrl} alt="Evidencia de la visita" className="w-full h-40 object-cover rounded-2xl border border-slate-200" />
      ) : (
        <div className="h-24 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center gap-2 text-[12px] text-slate-400">
          <Camera className="w-4 h-4" />Sin foto disponible en este dispositivo
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {checkItems.map(([label, ok]) => (
          <span key={label} className={`flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-xl ${ok ? "bg-emerald-50 text-emerald-800" : ok === false ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-500"}`}>
            {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}{label}
          </span>
        ))}
        <span className={`col-span-2 flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-xl ${last.tempAlert ? "bg-rose-50 text-rose-700" : "bg-sky-50 text-sky-800"}`}>
          <Thermometer className="w-3.5 h-3.5" />Temperatura registrada: {last.temperature ?? "—"}°C
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
            <p key={`q${i}`} className="text-[12px] text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-xl">Quiebre: {s.name}</p>
          ))}
        </div>
      )}

      {result ? (
        <div className={`p-3 rounded-2xl text-[13px] font-bold text-center ${result === "aprobada" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          Visita {result === "aprobada" ? "aprobada" : "rechazada"}
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
            <button type="button" disabled={busy} onClick={() => submit("rechazada")} className="tap-effect py-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-[13px] font-bold cursor-pointer disabled:opacity-50">
              Rechazar
            </button>
            <button type="button" disabled={busy} onClick={() => submit("aprobada")} className="tap-effect py-3 rounded-2xl bg-emerald-600 text-white text-[13px] font-bold cursor-pointer disabled:opacity-50">
              Aprobar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
