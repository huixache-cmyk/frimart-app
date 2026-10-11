import React from "react";
import { 
  MapPin, 
  ChevronDown, 
  Bell, 
  ShoppingCart, 
  Sparkles,
  QrCode,
  Briefcase
} from "lucide-react";

export default function MobileAppHeader({ 
  currentAddress = "Av. Nichupté Sm 15",
  onOpenAddressSelector,
  onOpenNotifications,
  onOpenCart,
  onOpenScanner,
  activeMode = "shop",
  onToggleMode,
  cartCount = 0,
  unreadNotifications = 1
}) {
  return (
    <header className="sticky top-0 inset-x-0 bg-white/95 backdrop-blur-md z-30 border-b border-[#eeeeee] px-4 pt-2 pb-2.5 transition-all">
      <div className="flex items-center justify-between gap-2.5">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-sm text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] tracking-tight text-[#0f172a] font-['Outfit']">
                FRIMART
              </span>
              <span className="text-[10px] font-bold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-1.5 py-0.2 rounded-full">
                La Huerta
              </span>
            </div>
          </div>
        </div>

        {/* Address Selector Pill (only in shop mode) */}
        {activeMode === "shop" ? (
          <button
            onClick={onOpenAddressSelector}
            className="tap-effect flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-slate-700 max-w-[155px] truncate cursor-pointer hover:bg-slate-100 transition"
            title="Cambiar dirección de entrega"
          >
            <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
            <span className="font-medium text-[11px] truncate">
              {currentAddress}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-[11px] font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Modo Vendedor</span>
          </div>
        )}

        {/* Action Icons: Scanner, Notifications & Cart */}
        <div className="flex items-center gap-0.5">
          {/* Quick QR Scanner Button */}
          <button
            onClick={onOpenScanner}
            className="tap-effect touch-target relative p-2 text-slate-700 hover:text-[#059669] cursor-pointer rounded-full hover:bg-slate-100"
            aria-label="Escanear QR Congelador"
            title="Escanear código QR de congelador"
          >
            <QrCode className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="tap-effect touch-target relative p-2 text-slate-700 hover:text-slate-900 cursor-pointer rounded-full hover:bg-slate-100"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white"></span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="tap-effect touch-target relative p-2 text-slate-700 hover:text-slate-900 cursor-pointer rounded-full hover:bg-slate-100"
            aria-label="Carrito de compra"
          >
            <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1 bg-[#059669] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
