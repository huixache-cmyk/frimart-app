import React, { useState } from "react";
import { 
  User, 
  MapPin, 
  CreditCard, 
  Receipt, 
  Heart, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Snowflake,
  ShieldCheck,
  Award,
  Sparkles,
  MessageCircle,
  X,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  Phone
} from "lucide-react";

export default function ProfileScreen({
  user,
  favoritesCount = 0,
  onOpenFavoritesTab,
  onOpenAddressSelector,
  onOpenOrdersTab,
  onOpenOperations,
  onOpenScanner
}) {
  const [modalType, setModalType] = useState(null); // 'help' | 'addresses' | 'payments' | 'billing' | 'cold_chain'

  // Clean list rows matching Airbnb reference image 4
  const menuGroup1 = [
    {
      id: "account",
      label: "Configuración de la cuenta",
      icon: Settings,
      action: () => alert(`Cuenta: ${user.name}\nCorreo: ${user.email}\nTel: ${user.phone}`)
    },
    {
      id: "operations",
      label: "Modo Vendedor (Rutas y Congeladores)",
      icon: ShieldCheck,
      badge: "Activo",
      badgeColor: "text-[#059669] bg-[#ecfdf5]",
      action: onOpenOperations
    },
    {
      id: "scan_freezer",
      label: "Escanear QR de Congelador",
      icon: Snowflake,
      action: onOpenScanner
    },
    {
      id: "help",
      label: "Recibe ayuda",
      icon: HelpCircle,
      action: () => setModalType("help")
    },
    {
      id: "profile_info",
      label: "Consulta el perfil",
      icon: User,
      action: () => alert(`Perfil Frimart: ${user.name}\nNivel: ${user.tier}`)
    },
    {
      id: "privacy",
      label: "Privacidad y seguridad",
      icon: ShieldCheck,
      action: () => alert("Tus datos están protegidos bajo cifrado SSL de 256 bits y estrictas políticas de confidencialidad.")
    }
  ];

  const menuGroup2 = [
    {
      id: "addresses",
      label: "Direcciones de entrega",
      icon: MapPin,
      badge: `${user.savedAddresses?.length || 2} guardadas`,
      action: onOpenAddressSelector
    },
    {
      id: "payments",
      label: "Métodos de pago",
      icon: CreditCard,
      badge: "Mastercard ••4821",
      action: () => setModalType("payments")
    },
    {
      id: "billing",
      label: "Facturación electrónica (CFDI 4.0)",
      icon: Receipt,
      action: () => setModalType("billing")
    },
    {
      id: "legal",
      label: "Legal y términos de servicio",
      icon: BookOpen,
      action: () => alert("Términos y condiciones del servicio Frimart Distribuciones S.A. de C.V. - Cancún, Q.R.")
    }
  ];

  return (
    <div className="pb-28 bg-white min-h-screen">
      {/* 1. Profile Screen Header (Airbnb Reference Image 5) */}
      <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-[#eeeeee]">
        <h1 className="text-[28px] font-bold text-[#0f172a] font-['Outfit'] tracking-tight">
          Perfil
        </h1>

        {/* Circular Bell Button with Red Notification Dot */}
        <button
          onClick={() => alert("Notificaciones: Tienes 1 aviso sobre tu pedido en camino a -18.4°C.")}
          className="tap-effect relative w-10 h-10 rounded-full bg-[#f1f5f9] hover:bg-slate-200 flex items-center justify-center text-slate-800 transition cursor-pointer"
          aria-label="Avisos y notificaciones"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* User Identity Pill Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-[22px] bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#059669]/30 shrink-0">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-card-title text-slate-900 truncate">
                {user.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-[10px] font-bold">
                {user.tier}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                • {user.loyaltyPoints} pts
              </span>
            </div>
          </div>
        </div>

        {/* 2. Top Featured Card with [ NUEVO ] badge (Airbnb Image 5) */}
        <div className="p-4 rounded-[24px] bg-gradient-to-br from-[#059669] to-[#047857] text-white shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/40 text-emerald-200 text-[10px] font-black tracking-wider uppercase border border-white/20">
              NUEVO
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-100 font-medium">
              <Snowflake className="w-3.5 h-3.5" />
              <span>Garantía -18°C</span>
            </div>
          </div>

          <div>
            <h3 className="font-['Outfit'] font-bold text-lg leading-tight">
              Monitoreo de Cadena de Frío en Vivo
            </h3>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              Tus congelados viajan con sensores térmicos activos hasta la puerta de tu congelador.
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-200">
              Certificado La Huerta IQF
            </span>
            <button
              onClick={() => setModalType("cold_chain")}
              className="tap-effect px-3 py-1.5 rounded-full bg-white text-[#047857] text-xs font-bold shadow-xs hover:bg-emerald-50 transition cursor-pointer"
            >
              Verificar
            </button>
          </div>
        </div>

        {/* 3. 2-Column Action Cards with [ NUEVO ] badges (Airbnb Image 5) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Recetario y Congelados */}
          <button
            onClick={() => setModalType("recipes")}
            className="tap-effect p-3.5 rounded-[20px] bg-white border border-[#eeeeee] shadow-2xs text-left cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[9px] font-black uppercase tracking-wider">
                NUEVO
              </span>
              <BookOpen className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <span className="font-['Outfit'] font-bold text-[14px] text-slate-900 block leading-tight">
                Recetario de Cuaresma
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Platillos con pescados y vegetales
              </span>
            </div>
          </button>

          {/* Card 2: Pedidos Anteriores */}
          <button
            onClick={onOpenOrdersTab}
            className="tap-effect p-3.5 rounded-[20px] bg-white border border-[#eeeeee] shadow-2xs text-left cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[9px] font-black uppercase tracking-wider">
                NUEVO
              </span>
              <ShoppingBag className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <span className="font-['Outfit'] font-bold text-[14px] text-slate-900 block leading-tight">
                Pedidos Anteriores
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Reordena tus favoritos en 1 toque
              </span>
            </div>
          </button>
        </div>

        {/* 4. Frimart Club Rewards Banner */}
        <div className="p-4 rounded-[22px] bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Outfit'] font-bold text-sm text-slate-900">
                Puntos Frimart Club
              </h4>
              <p className="text-xs text-slate-500">
                Tienes <strong className="text-[#059669]">{user.loyaltyPoints} pts</strong> acumulados ($125 MXN)
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert("Cupón de $125.00 MXN generado para tu próxima orden con código ORO125")}
            className="tap-effect text-xs font-bold text-[#059669] bg-white px-3 py-1.5 rounded-full border border-[#a7f3d0] hover:bg-emerald-50 transition cursor-pointer"
          >
            Canjear
          </button>
        </div>

        {/* 5. Clean Menu Rows (Airbnb Reference Image 4) */}
        <div className="pt-2">
          {/* Group 1 */}
          <div className="divide-y divide-[#f1f5f9]">
            {menuGroup1.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="tap-effect w-full py-3.5 flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 text-slate-700 stroke-[1.8] group-hover:text-slate-900 transition-colors" />
                    <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 stroke-[2] transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Group Divider Line */}
          <div className="my-2 border-b border-[#eeeeee]" />

          {/* Group 2 */}
          <div className="divide-y divide-[#f1f5f9]">
            {menuGroup2.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="tap-effect w-full py-3.5 flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 text-slate-700 stroke-[1.8] group-hover:text-slate-900 transition-colors" />
                    <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 stroke-[2] transition-colors" />
                  </div>
                </button>
              );
            })}

            {/* Logout Row without chevron (Airbnb Image 4) */}
            <button
              onClick={() => {
                if (confirm("¿Deseas cerrar tu sesión en Frimart Mobile?")) {
                  alert("Sesión finalizada de manera segura.");
                }
              }}
              className="tap-effect w-full py-3.5 flex items-center gap-3.5 text-left cursor-pointer text-slate-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 stroke-[1.8]" />
              <span className="text-sm font-medium">
                Cerrar sesión
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Up Sheets / Modals for Profile Actions */}
      {modalType === "help" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h3 className="font-section-title text-[#0f172a]">Atención al Cliente Frimart</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ¿Tienes alguna duda sobre tu entrega o la calidad de tus congelados? Nuestro equipo de soporte en Cancún y Riviera Maya está disponible 24/7.
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/529982348901"
                target="_blank"
                rel="noreferrer"
                className="tap-effect w-full py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Iniciar Chat de WhatsApp (+52 998 234 8901)</span>
              </a>
              <button
                onClick={() => alert("Llamando a conmutador Frimart CEDI Cancún...")}
                className="tap-effect w-full py-3 px-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Llamada Directa (800 374 6278)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "recipes" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#059669]" />
                <h3 className="font-section-title text-[#0f172a]">Recetario Cuaresma Frimart</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Aprende a cocinar fácil y delicioso con productos congelados Capitán, La Huerta y Picamar:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-slate-900 block">1. Filete Tilapia en Salsa Cilantro</strong>
                <span className="text-slate-500 text-[11px]">Listo en 12 minutos al sartén con mantequilla.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-slate-900 block">2. Medallones de Portobello y Rajas</strong>
                <span className="text-slate-500 text-[11px]">En freidora de aire a 180°C durante 10 minutos.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-slate-900 block">3. Smoothie Bowl con Blendie Frimart</strong>
                <span className="text-slate-500 text-[11px]">Licuado directo con agua de coco y frutos rojos.</span>
              </div>
            </div>
            <button
              onClick={() => {
                alert("Descargando PDF del Recetario Cuaresma Frimart...");
                setModalType(null);
              }}
              className="tap-effect w-full py-3 rounded-xl bg-[#059669] text-white text-xs font-bold hover:bg-[#047857] transition cursor-pointer"
            >
              Descargar Recetario Completo en PDF
            </button>
          </div>
        </div>
      )}

      {modalType === "cold_chain" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-[#059669]" />
                <h3 className="font-section-title text-[#0f172a]">Protocolo de Cadena de Frío</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600">
              <p>
                Frimart garantiza que ningún producto pierde la cadena térmica desde el CEDI de congelación hasta tu congelador:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                <li>Ultracongelación rápida individual (IQF) a <strong>-35°C</strong>.</li>
                <li>Almacenaje en cámaras de alta eficiencia a <strong>-22°C</strong>.</li>
                <li>Camionetas refrigeradas equipadas con sensor telemático continuo a <strong>-18°C</strong>.</li>
                <li>Cajas térmicas isotérmicas con gel refrigerante para entrega residencial.</li>
              </ul>
            </div>
            <button
              onClick={() => setModalType(null)}
              className="tap-effect w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
