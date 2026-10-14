import React, { useEffect, useState } from "react";
import {
  XCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { fetchReviewedForVendor, subscribeVisitsAndAlerts } from "../../../lib/visitsSync";

const ACK_KEY = "frimart_ack_reviews";
const readAck = () => { try { return JSON.parse(localStorage.getItem(ACK_KEY) || "[]"); } catch { return []; } };

/**
 * AVISOS AL VENDEDOR: resultado de la revisión de sus visitas.
 * Rechazadas se muestran hasta que el vendedor confirme "Entendido"; aprobadas aparecen como aviso breve.
 */
export default function SellerReviewNotices({ vendorId }) {
  const [items, setItems] = useState([]);
  const [ack, setAck] = useState(readAck);

  useEffect(() => {
    if (!vendorId) return;
    const load = () => fetchReviewedForVendor(vendorId).then(setItems).catch(() => {});
    load();
    const off = subscribeVisitsAndAlerts((p) => { if (p.table === "visitas") load(); });
    return off;
  }, [vendorId]);

  const pending = items.filter((i) => !ack.includes(i.id));
  if (!pending.length) return null;

  const dismiss = (id) => {
    const next = [...ack, id].slice(-200);
    setAck(next);
    localStorage.setItem(ACK_KEY, JSON.stringify(next));
  };

  return (
    <div className="px-4 pt-3 space-y-2">
      {pending.slice(0, 3).map((v) => {
        const rejected = v.estado === "rechazada";
        return (
          <div key={v.id} className={`p-3 rounded-2xl border flex items-start gap-2.5 ${rejected ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"}`}>
            {rejected ? <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            <div className="min-w-0 flex-1">
              <strong className={`block text-[13px] ${rejected ? "text-rose-800" : "text-emerald-800"}`}>
                Visita {rejected ? "rechazada" : "aprobada"} · {v.tienda_nombre}
              </strong>
              {v.comentario && <span className="block text-[12px] text-slate-700 mt-0.5">“{v.comentario}”</span>}
              <span className="block text-[11px] text-slate-500 mt-0.5">
                {v.revisado_nombre ? `Revisó ${v.revisado_nombre}` : ""}{rejected ? " · Corrige en tu próxima visita a esta tienda." : ""}
              </span>
            </div>
            {rejected ? (
              <button type="button" onClick={() => dismiss(v.id)} className="tap-effect shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 text-[11px] font-bold text-rose-700 cursor-pointer">Entendido</button>
            ) : (
              <button type="button" onClick={() => dismiss(v.id)} className="shrink-0 p-1 text-slate-400 cursor-pointer" aria-label="Cerrar"><X className="w-4 h-4" /></button>
            )}
          </div>
        );
      })}
    </div>
  );
}
