import React from "react";
import { 
  MapPin, 
  ChevronDown, 
  Bell, 
  QrCode, 
  Radio, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  LogOut,
  KeyRound,
  Zap,
  Crown,
  Building2,
  BarChart3,
  Truck
} from "lucide-react";
import { ROLES } from "../../../data/authRolesData";

export default function SellerMobileHeader({ 
  currentUser,
  onOpenScanner,
  onOpenNotifications,
  onOpenAdminKeys,
  onOpenOtaUpdates,
  onLockSession,
  unreadAlertsCount = 1
}) {
  const currentRole = ROLES[currentUser?.role] || ROLES.vendedor;

  return (
    <header className="sticky top-0 inset-x-0 bg-white/95 backdrop-blur-md z-30 border-b border-[#eeeeee] px-3.5 pt-2.5 pb-2.5 transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & User/Role Identity */}
        <div className="flex items-center gap-2 min-w-0">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs text-white shrink-0 font-extrabold text-xs"
            style={{ backgroundColor: currentRole.color }}
          >
            {currentUser?.role === "propietario" ? "👑" :
             currentUser?.role === "director_comercial" ? "📊" :
             currentUser?.role === "gerente_cedis" ? "🏢" :
             currentUser?.role === "supervisor" ? "🛡️" : "FR"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-[15px] tracking-tight text-[#0f172a] font-['Outfit']">
                FRIMART
              </span>
              <span 
                className="text-[9px] font-bold px-1.5 py-0.2 rounded-full border truncate"
                style={{
                  backgroundColor: currentRole.bgColor,
                  color: currentRole.color,
                  borderColor: currentRole.borderColor
                }}
              >
                {currentRole.shortName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate max-w-[140px] font-medium text-slate-700">
                {currentUser?.name || "Juan Pablo Morales"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions depending on role */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Owner specific shortcuts */}
          {currentUser?.role === "propietario" && (
            <>
              <button
                onClick={onOpenAdminKeys}
                className="tap-effect flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold hover:bg-rose-100 transition cursor-pointer"
                title="Administrador de Claves & Ajustes"
              >
                <KeyRound className="w-3 h-3" />
                <span className="hidden sm:inline">Claves</span>
              </button>

              <button
                onClick={onOpenOtaUpdates}
                className="tap-effect flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 transition cursor-pointer"
                title="Mandar Actualizaciones OTA"
              >
                <Zap className="w-3 h-3 fill-emerald-600" />
                <span className="hidden sm:inline">OTA</span>
              </button>
            </>
          )}

          {/* Quick QR Scanner Button */}
          {currentUser?.role === "vendedor" && (
            <button
              onClick={onOpenScanner}
              className="tap-effect flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-xs font-bold hover:bg-[#d1fae5] transition cursor-pointer"
              title="Escanear congelador"
            >
              <QrCode className="w-3.5 h-3.5 stroke-[2.2]" />
              <span className="text-[11px]">Escanear</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="tap-effect relative p-1.5 text-slate-700 hover:text-slate-900 cursor-pointer rounded-full hover:bg-slate-100 transition"
            aria-label="Alertas operativas"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white" />
            )}
          </button>

          {/* Lock / Switch User Button */}
          <button
            onClick={onLockSession}
            className="tap-effect p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer rounded-full hover:bg-slate-100 transition"
            title="Bloquear sesión / Cambiar de rol"
            aria-label="Cambiar de perfil"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
