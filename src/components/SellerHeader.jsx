import React from "react";
import { 
  MapPin, 
  QrCode, 
  LayoutDashboard, 
  ShieldCheck, 
  Layers, 
  Printer, 
  Building2,
  Radio,
  Sparkles
} from "lucide-react";

export default function SellerHeader({ 
  seller, 
  currentTab, 
  setCurrentTab, 
  onOpenScanner,
  isGpsActive = true 
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Seller Info */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            {/* Vector Brand Logo with Snowflake Crystal Icon */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sky-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.15" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-900 text-lg font-['Outfit']">
                  FRIMART<span className="text-sky-600">.OS</span>
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                  La Huerta
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-700">{seller.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-mono text-[11px]">{seller.route}</span>
              </p>
            </div>
          </div>

          {/* Mobile QR Scan Button */}
          <button
            onClick={onOpenScanner}
            className="md:hidden flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear</span>
          </button>
        </div>

        {/* GPS Live Status Indicator */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs shadow-inner">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold text-[10px] tracking-wider uppercase">GPS Activo:</span>
          </div>
          <span className="text-slate-700 font-mono text-[11px]">
            {seller.currentLocation.lat.toFixed(4)}° N, {Math.abs(seller.currentLocation.lng).toFixed(4)}° W
          </span>
          <span className="text-slate-400 text-[11px] font-mono">
            (±{seller.currentLocation.accuracy}m)
          </span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold border border-emerald-200">
            ONLINE
          </span>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setCurrentTab("seller")}
              className={`tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                currentTab === "seller"
                  ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Mi Ruta & Metas</span>
            </button>

            <button
              onClick={() => setCurrentTab("planogram")}
              className={`tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                currentTab === "planogram"
                  ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Planogramas</span>
            </button>

            <button
              onClick={() => setCurrentTab("qr-generator")}
              className={`tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                currentTab === "qr-generator"
                  ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Lote QR (2000)</span>
            </button>

            <button
              onClick={() => setCurrentTab("supervisor")}
              className={`tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                currentTab === "supervisor"
                  ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Supervisión</span>
            </button>

            <button
              onClick={() => setCurrentTab("admin")}
              className={`tactile-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                currentTab === "admin"
                  ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Catálogos</span>
            </button>
          </nav>

          {/* Desktop QR Scan Button */}
          <button
            onClick={onOpenScanner}
            className="tactile-btn hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer border border-emerald-400/30"
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear QR Congelador</span>
          </button>
        </div>
      </div>
    </header>
  );
}
