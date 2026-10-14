import React, { useState, useEffect } from "react";
import {
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  QrCode,
  X,
  Check,
  Copy
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function MobileDeviceFrame({ 
  children,
  activeMode = "shop",
  onToggleMode
}) {
  const [deviceType, setDeviceType] = useState("iphone-pro"); // 'iphone' | 'iphone-pro' | 'galaxy' | 'fullscreen'
  const [currentTime, setCurrentTime] = useState("09:41");
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const localIpUrl = typeof window !== "undefined" ? window.location.origin + "/" : "";

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth <= 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getDeviceWidth = () => {
    switch (deviceType) {
      case "iphone":
        return "max-w-[390px]";
      case "iphone-pro":
        return "max-w-[420px]";
      case "galaxy":
        return "max-w-[412px]";
      case "fullscreen":
        return "max-w-5xl";
      default:
        return "max-w-md";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localIpUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (isMobileViewport) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col relative text-slate-800">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start sm:py-6 sm:px-4">
      {/* Desktop Top Simulator Control Toolbar */}
      <aside 
        aria-label="Controles del simulador móvil"
        className="hidden sm:flex items-center justify-between w-full max-w-xl bg-slate-800/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl mb-4 text-xs shadow-xl text-white gap-2"
      >
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold font-['Outfit'] tracking-wide">
            FRIMART Mobile
          </span>
        </div>

        {/* QR Open in Phone Button */}
        <button
          onClick={() => setIsQrModalOpen(true)}
          className="tap-effect flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-[11px] shadow-md shadow-emerald-500/20 cursor-pointer transition animate-bounce-subtle shrink-0"
          title="Abrir en celular Android conectando a la misma red Wi-Fi"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>📱 Abrir en mi Android</span>
        </button>

        {/* Device Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setDeviceType("iphone")}
            className={`tap-effect px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              deviceType === "iphone" ? "bg-[#059669] text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
            title="iPhone 15 / 16 (390px)"
          >
            iPhone
          </button>
          <button
            onClick={() => setDeviceType("iphone-pro")}
            className={`tap-effect px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              deviceType === "iphone-pro" ? "bg-[#059669] text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
            title="iPhone Pro Max (420px)"
          >
            iPhone Max
          </button>
          <button
            onClick={() => setDeviceType("galaxy")}
            className={`tap-effect px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              deviceType === "galaxy" ? "bg-[#059669] text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
            title="Samsung Galaxy Ultra (412px)"
          >
            Galaxy S25
          </button>
          <button
            onClick={() => setDeviceType("fullscreen")}
            className={`tap-effect px-2 py-1 rounded-lg text-[11px] transition cursor-pointer ${
              deviceType === "fullscreen" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
            title="Vista Móvil Fluida"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Shell Wrapper */}
      <main 
        id="main-content"
        tabIndex="-1"
        className={`w-full ${getDeviceWidth()} sm:min-h-[844px] sm:max-h-[920px] sm:h-[94vh] bg-white sm:rounded-[44px] shadow-2xl relative flex flex-col overflow-hidden sm:ring-1 sm:ring-slate-700 sm:border-[10px] sm:border-slate-950 sm:[transform:translateZ(0)] outline-none`}
      >
        {/* Dynamic Island / Hardware Notch for iPhone */}
        {deviceType !== "galaxy" && (
          <div className="hidden sm:block dynamic-island shadow-md">
            <div className="absolute right-3.5 top-2.5 w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-950/80" />
            </div>
          </div>
        )}

        {/* Galaxy Camera Hole */}
        {deviceType === "galaxy" && (
          <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black z-50 pointer-events-none ring-1 ring-slate-800" />
        )}

        {/* Native Status Bar */}
        <div className="sticky top-0 inset-x-0 bg-white/95 backdrop-blur-md z-40 px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 select-none">
          <span className="font-['Outfit'] font-bold text-[13px] tracking-tight">
            {currentTime}
          </span>

          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-[10px] font-extrabold font-mono tracking-tighter">5G</span>
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">98%</span>
              <Battery className="w-4 h-4 stroke-[2.2] fill-slate-800" />
            </div>
          </div>
        </div>

        {/* Mobile Viewport Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f8fafc] flex flex-col relative">
          {children}
        </div>
      </main>

      {/* QR Code Modal to open in Android Phone */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[32px] p-6 text-white shadow-2xl relative animate-scale-in space-y-4">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <Smartphone className="w-3.5 h-3.5" />
                Instalación Directa en Android
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white">
                Escanea con tu Celular
              </h3>
              <p className="text-xs text-slate-400">
                Abre la cámara o Google Lens para abrir Frimart OS al instante
              </p>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-3xl mx-auto w-fit shadow-xl flex items-center justify-center">
              <QRCodeSVG
                value={localIpUrl}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* URL Link and Copy Button */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-emerald-400 truncate pl-1">
                {localIpUrl}
              </span>
              <button
                onClick={handleCopy}
                className="tap-effect px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
              >
                {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? "Copiado" : "Copiar"}</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Conecta tu celular al <strong>mismo Wi-Fi</strong> de esta computadora.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Escanea el QR o abre <strong>Chrome</strong> y entra a esa dirección.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>En Chrome: toca los tres puntos <strong>(⋮)</strong> arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</span>
              </div>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
