import React, { useState } from "react";
import { 
  User, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Snowflake,
  Layers,
  BarChart3,
  Store,
  Phone,
  MessageCircle,
  X,
  Clock,
  CheckCircle2,
  Database,
  Smartphone,
  Download
} from "lucide-react";

export default function SellerProfileScreen({
  seller,
  storesCount = 8,
  freezersCount = 3,
  onOpenSupervision,
  onOpenBatchGenerator,
  onOpenAdminCatalog,
  onOpenScanner,
  onLockSession
}) {
  const [modalType, setModalType] = useState(null); // 'supervisor_contact' | 'cedis_info' | 'cold_protocol'

  const menuGroup1 = [
    {
      id: "supervision",
      label: "Consola de Supervisión Cancún",
      icon: BarChart3,
      badge: "En vivo",
      action: onOpenSupervision
    },
    {
      id: "qr_batch",
      label: "Lote de 2,000 Stickers QR",
      icon: Layers,
      badge: "2,000 etiquetas",
      action: onOpenBatchGenerator
    },
    {
      id: "admin_catalog",
      label: "Administración de Catálogo Maestro",
      icon: Database,
      action: onOpenAdminCatalog
    },
    {
      id: "cedis",
      label: "Información de CEDIS Cancún (01)",
      icon: Store,
      action: () => setModalType("cedis_info")
    }
  ];

  const menuGroup2 = [
    {
      id: "supervisor_chat",
      label: "Contacto con Supervisor de Ruta",
      icon: MessageCircle,
      action: () => setModalType("supervisor_contact")
    },
    {
      id: "cold_protocol",
      label: "Garantía de Cadena de Frío (-18°C)",
      icon: Snowflake,
      action: () => setModalType("cold_protocol")
    },
    {
      id: "pwa_install",
      label: "Instalar Frimart en este Celular",
      icon: Smartphone,
      badge: "App Móvil",
      action: () => {
        localStorage.removeItem("frimart_pwa_dismissed");
        window.location.reload();
      }
    },
    {
      id: "settings",
      label: "Configuración de la cuenta",
      icon: Settings,
      action: () => alert(`Vendedor: ${seller.name}\nRuta: ${seller.route}\nCEDIS: ${seller.cedis}`)
    },
    {
      id: "logout",
      label: "Cerrar Sesión / Cambiar PIN",
      icon: LogOut,
      badge: "PIN",
      color: "text-rose-600",
      action: () => onLockSession?.()
    }
  ];

  return (
    <div className="pb-32 bg-white min-h-screen">
      {/* 1. Header (Airbnb Image 5) */}
      <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-[#eeeeee]">
        <h1 className="text-[28px] font-bold text-[#0f172a] font-['Outfit'] tracking-tight">
          Perfil de Vendedor
        </h1>

        {/* Circular Bell Button with Red Notification Dot */}
        <button
          onClick={() => alert("Alertas: Tienes 1 tienda con stock bajo de Brócoli La Huerta en Oxxo Nichupté.")}
          className="tap-effect relative w-10 h-10 rounded-full bg-[#f1f5f9] hover:bg-slate-200 flex items-center justify-center text-slate-800 transition cursor-pointer"
          aria-label="Avisos operativos"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e11d48] ring-2 ring-white" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* User Identity Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-[22px] bg-[#f8fafc] border border-[#e2e8f0]">
          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#059669]/30 shrink-0">
            <img 
              src={seller.avatar} 
              alt={seller.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-card-title text-slate-900 truncate">
              {seller.name}
            </h2>
            <p className="text-xs text-slate-500 truncate">{seller.route}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-[10px] font-bold">
                {seller.cedis}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                • {storesCount} Tiendas
              </span>
            </div>
          </div>
        </div>

        {/* 2. Top Featured Card with [ NUEVO ] Badge (Airbnb Image 5) */}
        <div className="p-4 rounded-[24px] bg-gradient-to-br from-[#059669] to-[#047857] text-white shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/40 text-emerald-200 text-[10px] font-black tracking-wider uppercase border border-white/20">
              MES EN CURSO
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-100 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Rendimiento Oro</span>
            </div>
          </div>

          <div>
            <div className="text-2xl font-black font-['Outfit']">
              $18,450.00 MXN
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Comisión acumulada del mes por colocación y resurtido en ruta.
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-white/20 text-xs">
            <span className="text-emerald-200">
              Cumplimiento: <strong>94% de cuota</strong>
            </span>
            <span className="text-white font-bold">
              342 cajas entregadas
            </span>
          </div>
        </div>

        {/* 3. 2-Column Action Cards with [ NUEVO ] Badges (Airbnb Image 5) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenSupervision}
            className="tap-effect p-3.5 rounded-[20px] bg-white border border-[#eeeeee] shadow-2xs text-left cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[9px] font-black uppercase tracking-wider">
                PANEL
              </span>
              <BarChart3 className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <span className="font-['Outfit'] font-bold text-[14px] text-slate-900 block leading-tight">
                Consola Supervisión
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Ruta Cancún en vivo
              </span>
            </div>
          </button>

          <button
            onClick={onOpenBatchGenerator}
            className="tap-effect p-3.5 rounded-[20px] bg-white border border-[#eeeeee] shadow-2xs text-left cursor-pointer hover:border-slate-300 transition flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[9px] font-black uppercase tracking-wider">
                STICKERS
              </span>
              <Layers className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <span className="font-['Outfit'] font-bold text-[14px] text-slate-900 block leading-tight">
                Lote 2,000 QR
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Alta y formato A4
              </span>
            </div>
          </button>
        </div>

        {/* 4. Clean Menu Rows (Airbnb Reference Image 4) */}
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
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 stroke-[2] transition-colors" />
                  </div>
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
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 stroke-[2] transition-colors" />
                </button>
              );
            })}

            {/* Logout Row without chevron (Airbnb Image 4) */}
            <button
              onClick={() => {
                if (confirm("¿Deseas finalizar tu turno y cerrar sesión en la app de vendedor?")) {
                  alert("Turno finalizado. Reporte enviado a supervisor.");
                }
              }}
              className="tap-effect w-full py-3.5 flex items-center gap-3.5 text-left cursor-pointer text-slate-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 stroke-[1.8]" />
              <span className="text-sm font-medium">
                Finalizar Turno / Cerrar Sesión
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Up Modals */}
      {modalType === "supervisor_contact" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h3 className="font-section-title text-[#0f172a]">Supervisor de Operaciones</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Comunícate con tu supervisor de ruta para incidencias de congeladores, ajustes de inventario o validación de créditos.
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/529982348901"
                target="_blank"
                rel="noreferrer"
                className="tap-effect w-full py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Supervisor (+52 998 234 8901)</span>
              </a>
              <button
                onClick={() => alert("Llamando a mesa de ayuda operativa Frimart Cancún...")}
                className="tap-effect w-full py-3 px-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a Despacho CEDI Cancún</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "cedis_info" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#059669]" />
                <h3 className="font-section-title text-[#0f172a]">CEDIS Aguascalientes (1205)</h3>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>Ubicación:</strong> Km 13.5 Carretera Panamericana Sur, Peñuelas / Cd. Industrial, Aguascalientes, Ags.</p>
              <p><strong>Horario de carga matutina:</strong> 06:30 AM - 08:00 AM</p>
              <p><strong>Cámaras de frío:</strong> Cámara 1 (-22°C) • Cámara 2 (-25°C IQF La Huerta)</p>
            </div>
            <button
              onClick={() => setModalType(null)}
              className="tap-effect w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {modalType === "cold_protocol" && (
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
            <div className="space-y-2 text-xs text-slate-600">
              <p>Protocolo obligatorio para todos los vendedores de ruta:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                <li>Verificar termómetro de congelador en cada visita (-18°C o más frío).</li>
                <li>No dejar puertas de congelador abiertas por más de 90 segundos al resurtir.</li>
                <li>Reportar inmediatamente cualquier congelador que supere los -14°C.</li>
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
