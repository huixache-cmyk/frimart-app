import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp, Store, Star, Wallet, ShoppingBag } from "lucide-react";
import { fetchVisits } from "../../../lib/visitsSync";

const PERIODS = [
  { key: "hoy", label: "Hoy" },
  { key: "ayer", label: "Ayer" },
  { key: "semana", label: "Semana" },
  { key: "mes", label: "Mes" }
];

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

function rangeFor(key) {
  const today = startOfDay(new Date());
  if (key === "ayer") { const a = new Date(today); a.setDate(a.getDate() - 1); return [a, today]; }
  if (key === "semana") { const a = new Date(today); a.setDate(a.getDate() - ((a.getDay() + 6) % 7)); return [a, null]; } // desde el lunes
  if (key === "mes") return [new Date(today.getFullYear(), today.getMonth(), 1), null];
  return [today, null];
}

const money = (n) => `$${Math.round(n).toLocaleString("es-MX")}`;
const tone = (n) => (n >= 90 ? "text-emerald-700 bg-emerald-50" : n >= 70 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50");

/**
 * MI DESEMPEÑO (vendedor): tiendas visitadas, calificación, venta y comisión
 * por tienda y en total, por día, semana o mes. Lee de Supabase.
 * Las visitas rechazadas por el supervisor no suman venta ni comisión.
 */
export default function SellerPerformance({ user }) {
  const [period, setPeriod] = useState("ayer");
  const [visits, setVisits] = useState(null);
  const [error, setError] = useState(null);
  const rate = Number(user?.commissionRate) > 0 ? (user.commissionRate > 1 ? user.commissionRate / 100 : user.commissionRate) : 0.04;

  useEffect(() => {
    let alive = true;
    fetchVisits({ vendorIds: [user.id], limit: 1000 })
      .then((v) => alive && setVisits(v))
      .catch(() => alive && setError("Sin conexión: no se pudo cargar tu historial."));
    return () => { alive = false; };
  }, [user.id]);

  const data = useMemo(() => {
    const [from, to] = rangeFor(period);
    const inRange = (visits || []).filter((v) => {
      const t = new Date(v.fin || v.inicio);
      return t >= from && (!to || t < to);
    });
    const valid = inRange.filter((v) => v.estado !== "rechazada");
    const byStore = new Map();
    valid.forEach((v) => {
      const s = byStore.get(v.tienda_id) || { id: v.tienda_id, name: v.tienda_nombre, visits: 0, sale: 0, scores: [] };
      s.visits += 1; s.sale += Number(v.venta || 0); s.scores.push(Number(v.calificacion || 0));
      byStore.set(v.tienda_id, s);
    });
    const stores = [...byStore.values()].map((s) => ({ ...s, score: Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length), commission: s.sale * rate })).sort((a, b) => b.sale - a.sale);
    const sale = valid.reduce((a, v) => a + Number(v.venta || 0), 0);
    const score = valid.length ? Math.round(valid.reduce((a, v) => a + Number(v.calificacion || 0), 0) / valid.length) : null;
    return { stores, sale, commission: sale * rate, score, rejected: inRange.length - valid.length };
  }, [visits, period, rate]);

  return (
    <section className="px-4 pt-3 space-y-2" aria-label="Mi desempeño">
      <h2 className="font-section-title text-[#0f172a] flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-600" />Mi desempeño</h2>
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100">
        {PERIODS.map((p) => (
          <button key={p.key} type="button" onClick={() => setPeriod(p.key)} className={`py-1.5 rounded-xl text-[12px] font-bold cursor-pointer transition ${period === p.key ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-500"}`}>{p.label}</button>
        ))}
      </div>
      {error && <p className="text-[12px] text-amber-800 bg-amber-50 p-3 rounded-2xl">{error}</p>}
      {!error && visits === null && <p className="text-[12px] text-slate-400">Cargando…</p>}
      {!error && visits !== null && (
        <>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="p-2 rounded-2xl bg-white border border-slate-200"><Store className="w-3.5 h-3.5 mx-auto text-slate-400" /><strong className="block text-[14px] text-slate-900">{data.stores.length}</strong><span className="text-[10px] text-slate-400">Tiendas</span></div>
            <div className="p-2 rounded-2xl bg-white border border-slate-200"><Star className="w-3.5 h-3.5 mx-auto text-slate-400" /><strong className="block text-[14px] text-slate-900">{data.score ?? "—"}</strong><span className="text-[10px] text-slate-400">Calif.</span></div>
            <div className="p-2 rounded-2xl bg-white border border-slate-200"><ShoppingBag className="w-3.5 h-3.5 mx-auto text-slate-400" /><strong className="block text-[14px] text-slate-900">{money(data.sale)}</strong><span className="text-[10px] text-slate-400">Venta</span></div>
            <div className="p-2 rounded-2xl bg-emerald-50 border border-emerald-200"><Wallet className="w-3.5 h-3.5 mx-auto text-emerald-600" /><strong className="block text-[14px] text-emerald-800">{money(data.commission)}</strong><span className="text-[10px] text-emerald-700">Comisión</span></div>
          </div>
          {data.rejected > 0 && <p className="text-[11px] text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl">{data.rejected} visita(s) rechazada(s) no suman venta ni comisión.</p>}
          {data.stores.length === 0 ? (
            <p className="text-[12px] text-slate-500 bg-white border border-slate-200 p-3 rounded-2xl">Sin visitas registradas en este periodo.</p>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
              {data.stores.map((s) => (
                <div key={s.id} className="flex items-center gap-2 p-2.5">
                  <div className="min-w-0 flex-1">
                    <strong className="block text-[13px] text-slate-900 truncate">{s.name}</strong>
                    <span className="text-[11px] text-slate-500">{s.visits} visita(s) · venta {money(s.sale)} · comisión {money(s.commission)}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[12px] font-black ${tone(s.score)}`}>{s.score}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
