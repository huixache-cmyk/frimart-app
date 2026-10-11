import React from "react";
import { 
  Home, 
  Grid, 
  Search, 
  ShoppingBag, 
  User 
} from "lucide-react";

export default function BottomNavigation({ 
  activeTab, 
  onChangeTab, 
  cartCount = 0,
  activeOrdersCount = 0,
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
}) {
  const navItems = [
    {
      id: "inicio",
      label: "Inicio",
      icon: Home
    },
    {
      id: "categorias",
      label: "Categorías",
      icon: Grid
    },
    {
      id: "buscar",
      label: "Buscar",
      icon: Search
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null
    },
    {
      id: "perfil",
      label: "Perfil",
      icon: User,
      isAvatar: true,
      hasDot: true // Red notification badge like in Airbnb reference image 3 & 5
    }
  ];

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 pt-2 pb-1.5"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className="tap-effect relative flex flex-col items-center justify-center py-0.5 px-2 min-w-[52px] cursor-pointer group"
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
                        : "text-slate-600 group-hover:text-slate-900"
                    }`} 
                  />
                )}
                
                {/* Active orders counter badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#059669] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}

                {/* Airbnb-style Red Notification Dot on Avatar */}
                {item.hasDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white" />
                )}
              </div>

              <span 
                className={`text-[10px] mt-1 transition-colors duration-200 font-semibold leading-normal ${
                  isActive 
                    ? "text-[#059669]" 
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Native Home Indicator Bar cleanly below all labels */}
      <div className="home-indicator" style={{ margin: "6px auto 2px auto" }} />
    </nav>
  );
}
