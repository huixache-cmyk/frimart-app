import React, { useState, useEffect } from "react";
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2 } from "lucide-react";

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed & running in standalone mode
    const standaloneMode = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true;
    
    setIsStandalone(standaloneMode);
    if (standaloneMode) return;

    // 2. Check if dismissed recently (in last 12 hours)
    const dismissedTime = localStorage.getItem("frimart_pwa_dismissed");
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 12 * 3600 * 1000) {
      setIsDismissed(true);
    }

    // 3. Android / Chromium install prompt event listener
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 4. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    
    if (isIosDevice && isSafari && !standaloneMode) {
      setIsIos(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsStandalone(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("frimart_pwa_dismissed", Date.now().toString());
  };

  if (isStandalone || isDismissed) return null;
  if (!deferredPrompt && !isIos) return null;

  return (
    <>
      {/* Floating Bottom Install Banner */}
      <div className="fixed bottom-20 inset-x-3 z-40 max-w-md mx-auto animate-bounce-subtle">
        <div className="p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 text-white shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5 leading-tight">
                <span>Instalar Frimart en tu Celular</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </h4>
              <p className="text-[10.5px] text-slate-300 truncate">
                {isIos ? "Disponible para iPhone (Safari)" : "App nativa con GPS y escáner"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="tap-effect h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Instalar</span>
              </button>
            )}

            {isIos && !deferredPrompt && (
              <button
                type="button"
                onClick={() => setShowIosGuide(true)}
                className="tap-effect h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>¿Cómo instalar?</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Cerrar sugerencia"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Step-by-Step Installation Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-4 animate-fade-in">
          <div className="w-full max-w-md mx-auto p-5 rounded-[26px] bg-white text-slate-900 shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Instalar en tu iPhone</h3>
                  <p className="text-[11px] text-slate-500">Agrega Frimart a tu pantalla de inicio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="leading-relaxed">
                  Toca el botón <strong className="text-slate-900">Compartir</strong> de Safari (el icono de un cuadro con una flecha hacia arriba <Share2 className="w-3.5 h-3.5 inline text-blue-600 stroke-[2.2]" /> en la barra inferior del navegador).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="leading-relaxed">
                  Desliza hacia abajo en el menú y selecciona <strong className="text-slate-900">"Agregar a pantalla de inicio"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11.5px]">
                  <strong>¡Listo!</strong> La app se abrirá en pantalla completa con icono de Frimart, acceso a cámara para códigos QR y GPS en vivo sin barra de navegador.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-slate-800 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
