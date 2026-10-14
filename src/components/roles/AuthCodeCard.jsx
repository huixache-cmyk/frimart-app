import React, { useEffect, useState } from "react";
import {
  KeyRound,
  Copy,
  Check,
  XCircle,
  Clock
} from "lucide-react";
import { createAuthCode, fetchAuthCodes, cancelAuthCode, AUTH_CODE_MINUTES } from "../../lib/catalogSync";

const REASONS = ["Ruta directa a tienda", "Falla de vehículo", "Cita en tienda temprano", "Otro"];
const hhmm = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function statusOf(a) {
  if (a.usado_en) return { label: `Usado ${hhmm(a.usado_en)}`, cls: "bg-emerald-50 text-emerald-700" };
  if (a.cancelado_en) return { label: "Cancelado", cls: "bg-slate-100 text-slate-500" };
  if (new Date(a.expira_en) < new Date()) return { label: "Vencido", cls: "bg-slate-100 text-slate-500" };
  return { label: `Vigente hasta ${hhmm(a.expira_en)}`, cls: "bg-amber-50 text-amber-800" };
}

/**
 * AUTORIZAR JORNADA FUERA DEL CEDIS (supervisor en adelante)
 * Genera un código de 6 dígitos, de un solo uso, ligado a un vendedor y con vigencia corta.
 * Todo queda registrado en Supabase (frimart_autorizaciones + bitácora).
 */
export default function AuthCodeCard({ supervisor, vendors = [] }) {
  const [vendorId, setVendorId] = useState(vendors[0]?.id || "");
  const [reason, setReason] = useState(REASONS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [last, setLast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const load = () => fetchAuthCodes(supervisor.id).then(setHistory).catch(() => {});
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [supervisor.id]);

  const generate = async () => {
    setBusy(true); setError(null); setCopied(false);
    try {
      const v = vendors.find((x) => x.id === vendorId);
      setLast(await createAuthCode(supervisor, v, reason));
      load();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(last.codigo); setCopied(true); } catch { /* sin portapapeles */ }
  };

  return (
    <section className="px-4 pt-3" aria-label="Autorizar jornada fuera del CEDIS">
      <div className="p-4 rounded-[22px] bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><KeyRound className="w-5 h-5" /></div>
          <div className="min-w-0">
            <h2 className="font-['Outfit'] text-base font-black text-slate-900 leading-tight">Autorizar jornada fuera del CEDIS</h2>
            <p className="text-[12px] text-slate-500">Código de un solo uso · vigencia {AUTH_CODE_MINUTES} min</p>
          </div>
        </div>

        {vendors.length === 0 ? (
          <p className="text-[12px] text-slate-500">No tienes vendedores asignados.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5">
              {vendors.map((v) => (
                <button key={v.id} type="button" onClick={() => setVendorId(v.id)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold border cursor-pointer ${vendorId === v.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"}`}>{v.name}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REASONS.map((r) => (
                <button key={r} type="button" onClick={() => setReason(r)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${reason === r ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-white text-slate-500 border-slate-200"}`}>{r}</button>
              ))}
            </div>
            <button type="button" disabled={busy || !vendorId} onClick={generate} className="tap-effect w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-[14px] cursor-pointer disabled:opacity-60">
              {busy ? "Generando…" : "Generar código"}
            </button>
          </>
        )}
        {error && <p className="text-[12px] text-rose-700 bg-rose-50 p-2.5 rounded-xl">{error}</p>}

        {last && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <span className="text-[11px] text-emerald-800">Comparte este código con {last.vendedor_nombre}</span>
            <div className="flex items-center justify-center gap-2">
              <strong className="font-['Outfit'] text-3xl font-black tracking-[0.25em] text-emerald-900">{last.codigo}</strong>
              <button type="button" onClick={copy} className="p-2 rounded-xl bg-white text-emerald-700 cursor-pointer" aria-label="Copiar código">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
            </div>
            <span className="flex items-center justify-center gap-1 text-[11px] text-emerald-700"><Clock className="w-3 h-3" />Vence a las {hhmm(last.expira_en)}</span>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Historial de códigos</p>
            {history.map((a) => {
              const st = statusOf(a);
              const active = !a.usado_en && !a.cancelado_en && new Date(a.expira_en) > new Date();
              return (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <strong className="block text-[12px] text-slate-800 truncate">{a.vendedor_nombre || "Cualquier vendedor"} · {a.codigo}</strong>
                    <span className="text-[10px] text-slate-500">{new Date(a.creado_en).toLocaleDateString([], { day: "2-digit", month: "short" })} {hhmm(a.creado_en)} · {a.motivo || "—"}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${st.cls}`}>{st.label}</span>
                  {active && (
                    <button type="button" onClick={() => cancelAuthCode(a.id, supervisor).then(load)} className="p-1 text-slate-400 cursor-pointer" aria-label="Cancelar código"><XCircle className="w-4 h-4" /></button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
