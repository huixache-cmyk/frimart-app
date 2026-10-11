import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, X, CheckCircle2, Zap } from "lucide-react";

export default function OtaDeviceUpdateBanner() {
  const [incomingUpdate, setIncomingUpdate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const checkBroadcast = () => {
      const saved = localStorage.getItem("frimart_broadcast_update");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Check if within last 5 minutes
          if (Date.now() - parsed.timestamp < 1000 * 60 * 5) {
            setIncomingUpdate(parsed);
          }
        } catch (e) {}
      }
    };

    checkBroadcast();
    window.addEventListener("storage", checkBroadcast);
    const interval = setInterval(checkBroadcast, 2500);

    return () => {
      window.removeEventListener("storage", checkBroadcast);
      clearInterval(interval);
    };
  }, []);

  if (!incomingUpdate) return null;

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsUpdated(true);
      setTimeout(() => {
        setIncomingUpdate(null);
        setIsUpdated(false);
        // Clear local storage broadcast
        localStorage.removeItem("frimart_broadcast_update");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed top-12 inset-x-0 mx-auto w-full max-w-sm px-3 z-50 animate-bounce-subtle">
      <div className="bg-slate-900/95 text-white border border-emerald-500/60 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
              {isUpdated ? "¡Actualización Aplicada!" : `Nueva Versión ${incomingUpdate.version} Disponible`}
            </span>
            <p className="text-xs font-bold text-white truncate">
              {isUpdated ? "Componentes sincronizados" : incomingUpdate.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isUpdated && (
            <button
              onClick={handleApplyUpdate}
              disabled={isUpdating}
              className="tap-effect px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Instalando...</span>
                </>
              ) : (
                <span>Instalar</span>
              )}
            </button>
          )}

          <button
            onClick={() => setIncomingUpdate(null)}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
