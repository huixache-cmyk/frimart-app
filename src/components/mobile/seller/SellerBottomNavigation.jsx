import React from "react";
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
  TrendingUp
} from "lucide-react";

export default function SellerBottomNavigation({ 
  activeTab, 
  onChangeTab, 
  role = "vendedor",
  pendingStoresCount = 0,
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
}) {
  let navItems = [];

  if (role === "vendedor") {
    navItems = [
      {
        id: "ruta",
        label: "Ruta",
        icon: Navigation,
        badge: pendingStoresCount > 0 ? pendingStoresCount : null
      },
      {
        id: "pendientes",
        label: "Pendientes & Metas",
        icon: Clock
      },
      {
        id: "escanear",
        label: "Escanear QR",
        icon: QrCode,
        isPrimaryAction: true
      },
      {
        id: "congeladores",
        label: "Congeladores",
        icon: Snowflake
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
        isAvatar: true,
        hasDot: true
      }
    ];
  } else if (role === "supervisor") {
    navItems = [
      {
        id: "supervision",
        label: "Supervisión",
        icon: ShieldCheck
      },
      {
        id: "ruta",
        label: "Rutas Campo",
        icon: Navigation
      },
      {
        id: "escanear",
        label: "Auditar QR",
        icon: QrCode,
        isPrimaryAction: true
      },
      {
        id: "congeladores",
        label: "Congeladores",
        icon: Snowflake
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
        isAvatar: true
      }
    ];
  } else if (role === "gerente_cedis") {
    navItems = [
      {
        id: "cedis",
        label: "Mi CEDIS",
        icon: Building2
      },
      {
        id: "ruta",
        label: "Rutas Plaza",
        icon: Navigation
      },
      {
        id: "catalogo",
        label: "Catálogo",
        icon: Grid
      },
      {
        id: "congeladores",
        label: "Congeladores",
        icon: Snowflake
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
        isAvatar: true
      }
    ];
  } else if (role === "director_comercial") {
    navItems = [
      {
        id: "direccion",
        label: "Multi-CEDIS",
        icon: BarChart3
      },
      {
        id: "cedis",
        label: "Plazas",
        icon: Building2
      },
      {
        id: "catalogo",
        label: "Catálogo",
        icon: Grid
      },
      {
        id: "congeladores",
        label: "Congeladores",
        icon: Snowflake
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
        isAvatar: true
      }
    ];
  } else {
    // Propietario
    navItems = [
      {
        id: "propietario_hub",
        label: "Master Hub",
        icon: Crown
      },
      {
        id: "direccion",
        label: "Multi-CEDIS",
        icon: BarChart3
      },
      {
        id: "ruta",
        label: "Ruta Vendedor",
        icon: Navigation
      },
      {
        id: "congeladores",
        label: "Congeladores",
        icon: Snowflake
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: User,
        isAvatar: true
      }
    ];
  }

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
    </nav>
  );
}
