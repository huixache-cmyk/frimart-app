import React, { useEffect, useState } from "react";
import {
  Play,
  Square,
  Clock,
  MapPin,
  Store,
  X,
  History
} from "lucide-react";
import { WORKDAY_CONFIG, getCedisLocation } from "../../../data/workdayConfig";
import WorkdayHistory from "../../roles/WorkdayHistory";
import SellerPerformance from "./SellerPerformance";

const REASONS = ["Tienda cerrada", "Sin acceso", "Sin tiempo", "Sin producto", "Otro"];

function useClock(startedAt) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!startedAt) return;
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, [startedAt]);
  if (!startedAt) return "0h 00m";
  const m = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 60000));
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

/**
 * JORNADA LABORAL DEL VENDEDOR
 * Abrir (GPS en el CEDIS) → avance del día → cerrar con motivo de tiendas no visitadas.
 */
export default function WorkdayCard({ user, workday, stores = [], onOpen, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [closing, setClosing] = useState(false);
  const [reasons, setReasons] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const elapsed = useClock(workday?.startedAt);
  const cedis = getCedisLocation(user?.cedisId);

  const [authCode, setAuthCode] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const handleOpen = async (opts) => {
    setBusy(true); setError(null);
    try { await onOpen(opts); setShowAuth(false); setAuthCode(""); } catch (e) { setError(e.message || "No se pudo abrir la jornada."); } finally { setBusy(false); }
  };

  const visited = new Set(workday?.visitedStoreIds || []);
  const pendingStores = stores.filter((s) => !visited.has(s.id));
  const allReasoned = pendingStores.every((s) => reasons[s.id]);

  const handleClose = async () => {
    setBusy(true);
    try {
      await onClose(pendingStores.map((s) => ({ tienda_id: s.id, tienda_nombre: s.name, motivo: reasons[s.id] })));
      setClosing(false); setReasons({});
    } finally { setBusy(false); }
  };

  const historyBlock = (
    <>
      <button type="button" onClick={() => setShowHistory((v) => !v)} className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold text-emerald-700 py-1.5 cursor-pointer">
        <History className="w-3.5 h-3.5" />{showHistory ? "Ocultar mi historial" : "Ver mi historial"}
      </button>
      {showHistory && <div className="-mx-4 space-y-1"><SellerPerformance user={user} /><WorkdayHistory vendorIds={[user.id]} title="Mis jornadas" showVendor={false} /></div>}
    </>
  );

  if (!workday) {
    return (
      <div className="px-4 pt-3">
        <div className="p-4 rounded-[22px] bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
            <div className="min-w-0">
              <h2 className="font-['Outfit'] text-base font-black text-slate-900 leading-tight">Jornada cerrada</h2>
              <p className="text-[12px] text-slate-500">Ábrela en {cedis?.name || "tu CEDIS"} (radio {WORKDAY_CONFIG.cedisRadiusM} m) para poder visitar tiendas.</p>
            </div>
          </div>
          {error && <p className="flex items-start gap-1.5 text-[12px] text-rose-700 bg-rose-50 p-2.5 rounded-xl"><MapPin className="w-4 h-4 shrink-0 mt-0.5" />{error}</p>}
          <button type="button" disabled={busy} onClick={() => handleOpen()} className="tap-effect w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md shadow-emerald-600/25">
            <Play className="w-4 h-4" />{busy ? "Verificando ubicación…" : "Abrir jornada"}
          </button>
          {error && !showAuth && (
            <button type="button" onClick={() => setShowAuth(true)} className="w-full text-[12px] font-bold text-slate-500 underline cursor-pointer">Abrir con código de mi supervisor</button>
          )}
          {showAuth && (
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" maxLength={6} value={authCode} onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ""))} placeholder="Código de 6 dígitos" className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-slate-200 text-[14px] font-bold tracking-widest focus:outline-none focus:border-emerald-500" />
              <button type="button" disabled={busy || authCode.length !== 6} onClick={() => handleOpen({ authCode })} className="tap-effect px-4 rounded-xl bg-emerald-600 text-white text-[13px] font-bold cursor-pointer disabled:opacity-50">Abrir</button>
            </div>
          )}
          {historyBlock}
        </div>
      </div>
    );
  }

  const progress = stores.length ? Math.round((visited.size / stores.length) * 100) : 0;

  return (
    <div className="px-4 pt-3">
      <div className="p-4 rounded-[22px] bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Jornada en curso · desde {new Date(workday.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="block font-['Outfit'] text-2xl font-black leading-tight">{elapsed}</span>
          </div>
          <button type="button" onClick={() => setClosing(true)} className="tap-effect px-3.5 py-2 rounded-xl bg-white text-emerald-800 text-[12px] font-bold flex items-center gap-1.5 cursor-pointer">
            <Square className="w-3.5 h-3.5" />Cerrar jornada
          </button>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-emerald-50 mb-1"><span>{visited.size} de {stores.length} tiendas</span><span>${Number(workday.sales || 0).toFixed(0)} · {workday.bags || 0} pzs</span></div>
          <div className="h-2 rounded-full bg-white/25 overflow-hidden"><div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
        <p className="text-[10px] text-emerald-100">Cierre automático a las {WORKDAY_CONFIG.autoCloseHour}:00 h</p>
      </div>
      <div className="mt-1">{historyBlock}</div>

      {closing && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 flex items-end justify-center animate-fade-in" onClick={() => !busy && setClosing(false)}>
          <div className="w-full max-w-md bg-white rounded-t-[26px] p-4 pb-8 space-y-3 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit'] text-base font-black text-slate-900">Cerrar jornada</h3>
              <button type="button" onClick={() => setClosing(false)} className="p-1.5 text-slate-400 cursor-pointer" aria-label="Cancelar"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50"><span className="block text-[10px] text-slate-400">Tiempo</span><strong className="text-[13px]">{elapsed}</strong></div>
              <div className="p-2 rounded-xl bg-slate-50"><span className="block text-[10px] text-slate-400">Tiendas</span><strong className="text-[13px]">{visited.size}/{stores.length}</strong></div>
              <div className="p-2 rounded-xl bg-slate-50"><span className="block text-[10px] text-slate-400">Venta</span><strong className="text-[13px]">${Number(workday.sales || 0).toFixed(0)}</strong></div>
            </div>
            {pendingStores.length > 0 && (
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-slate-700">¿Por qué no se visitaron estas tiendas?</p>
                {pendingStores.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900"><Store className="w-3.5 h-3.5 text-slate-400" />{s.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {REASONS.map((r) => (
                        <button key={r} type="button" onClick={() => setReasons((p) => ({ ...p, [s.id]: r }))} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${reasons[s.id] === r ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" disabled={busy || !allReasoned} onClick={handleClose} className="tap-effect w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[14px] cursor-pointer disabled:opacity-50">
              {busy ? "Cerrando…" : "Confirmar cierre"}
            </button>
            {!allReasoned && <p className="text-[11px] text-center text-slate-400">Indica el motivo de cada tienda pendiente</p>}
          </div>
        </div>
      )}
    </div>
  );
}
