import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Navigation, 
  Layers, 
  QrCode, 
  Grid, 
  User,
  Snowflake,
  ShieldCheck,
  Building2,
  BarChart3,
  Crown,
  Clock,
  TrendingUp,
  LayoutGrid,
  X
} from "lucide-react";
import { canSeeTabForRole, getRoleLevel, HOME_TAB } from "../../../data/permissions";

// Catálogo de pestañas (el acceso lo decide src/data/permissions.js)
const TAB_DEFS = {
  propietario_hub: { label: "Master Hub", icon: Crown, group: "Propietario" },
  direccion: { label: "Multi-CEDIS", icon: BarChart3, group: "Director" },
  cedis: { label: "Mi CEDIS", icon: Building2, group: "Gerente" },
  catalogo: { label: "Catálogo", icon: Grid, group: "Gerente" },
  supervision: { label: "Supervisión", icon: ShieldCheck, group: "Supervisor" },
  ruta: { label: "Ruta", icon: Navigation, group: "Vendedor" },
  pendientes: { label: "Pendientes & Metas", icon: Clock, group: "Vendedor" },
  escanear: { label: "Auditar QR", icon: QrCode, group: "Vendedor" },
  congeladores: { label: "Congeladores", icon: Snowflake, group: "Vendedor" },
  perfil: { label: "Perfil", icon: User, group: "Cuenta" }
};

const RUTA_LABEL = { 1: "Ruta", 2: "Rutas Campo", 3: "Rutas Plaza", 4: "Rutas", 5: "Rutas" };

export default function SellerBottomNavigation({ 
  activeTab: activeTabProp, 
  onChangeTab: onChangeTabProp, 
  role = "vendedor",
  pendingStoresCount = 0,
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const level = getRoleLevel(role);
  const allowed = (id) => canSeeTabForRole(role, id);

  let navItems = [];
  let moreItems = [];

  if (level <= 1) {
    // Vendedor: accesos básicos, todo cabe en la barra
    navItems = [
      { id: "ruta", label: "Ruta", icon: Navigation, badge: pendingStoresCount > 0 ? pendingStoresCount : null },
      { id: "pendientes", label: "Pendientes & Metas", icon: Clock },
      { id: "escanear", label: "Escanear QR", icon: QrCode, isPrimaryAction: true },
      { id: "congeladores", label: "Congeladores", icon: Snowflake },
      { id: "perfil", label: "Perfil", icon: User, isAvatar: true, hasDot: true }
    ];
  } else {
    // Supervisor en adelante: hereda todo lo del nivel inferior
    const home = HOME_TAB[role] || "ruta";
    const barIds = [home, "ruta", "escanear", "congeladores"].filter((id, i, arr) => allowed(id) && arr.indexOf(id) === i);
    navItems = barIds.map((id) => ({
      id,
      ...TAB_DEFS[id],
      label: id === "ruta" ? RUTA_LABEL[level] : TAB_DEFS[id].label,
      isPrimaryAction: id === "escanear"
    }));
    moreItems = Object.keys(TAB_DEFS)
      .filter((id) => allowed(id) && !barIds.includes(id))
      .map((id) => ({ id, ...TAB_DEFS[id] }));
    if (moreItems.length) {
      navItems.push({ id: "__more", label: "Más", icon: LayoutGrid });
    }
  }

  const moreIds = moreItems.map((m) => m.id);
  const activeTab = moreIds.includes(activeTabProp) ? "__more" : activeTabProp;
  const onChangeTab = (id) => {
    if (id === "__more") {
      setMoreOpen(true);
      return;
    }
    setMoreOpen(false);
    onChangeTabProp(id);
  };

  const moreSheet = moreOpen && createPortal(
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in" onClick={() => setMoreOpen(false)}>
      <div className="w-full max-w-md mx-auto bg-white rounded-t-[24px] shadow-2xl animate-sheet-up p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Más secciones</span>
          <button type="button" onClick={() => setMoreOpen(false)} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 cursor-pointer" aria-label="Cerrar">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTabProp === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`tap-effect p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition ${
                  isActive ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.id === "perfil" ? (
                  <img src={userAvatar} alt="Perfil" className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
                <span className="text-[9px] text-slate-400 font-medium">{item.group}</span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>,
    document.body
  );

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 pt-1.5 pb-2"
      role="navigation"
      aria-label="Navegación del rol activo"
      style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom, 8px))" }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimaryAction) {
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className="tap-effect relative -top-3 flex flex-col items-center justify-center cursor-pointer group px-1"
                aria-label={item.label}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 ${
                  isActive 
                    ? "bg-slate-900 text-white ring-4 ring-[#ecfdf5]" 
                    : "bg-[#059669] text-white ring-4 ring-white"
                }`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] mt-1 font-bold text-slate-700 leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className="tap-effect relative flex flex-col items-center justify-center py-1 px-1.5 min-w-[50px] cursor-pointer group"
              aria-selected={isActive}
            >
              <div className="relative">
                {item.isAvatar ? (
                  <div className={`relative w-5 h-5 rounded-full overflow-hidden transition-all duration-200 ${
                    isActive 
                      ? "ring-2 ring-[#059669] ring-offset-1 scale-105" 
                      : "ring-1 ring-slate-300 group-hover:ring-slate-400"
                  }`}>
                    <img 
                      src={userAvatar} 
                      alt="Perfil" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Icon 
                    className={`w-5 h-5 transition-colors duration-200 stroke-[1.8] ${
                      isActive 
                        ? "text-[#059669] stroke-[2.2]" 
                        : "text-slate-500 group-hover:text-slate-900"
                    }`} 
                  />
                )}
                
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#059669] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}

                {item.hasDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white" />
                )}
              </div>

              <span 
                className={`text-[10px] mt-1 transition-colors duration-200 font-semibold leading-none ${
                  isActive 
                    ? "text-[#059669]" 
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {moreSheet}
    </nav>
  );
}
