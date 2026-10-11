import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Snowflake,
  MessageCircle,
  Phone,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Play,
  Square,
  Award,
  Truck,
  ShieldCheck
} from "lucide-react";

export default function SellerProfileScreen({
  seller,
  storesCount = 7,
  freezersCount = 3,
  onUpdateSeller,
  onLockSession
}) {
  const [modalType, setModalType] = useState(null); // 'supervisor_contact' | 'cold_protocol' | 'account_settings' | 'shift_confirm'
  
  // Shift state persisted in localStorage
  const [isShiftActive, setIsShiftActive] = useState(() => {
    return localStorage.getItem("frimart_shift_active") !== "false";
  });
  const [shiftStartTime, setShiftStartTime] = useState(() => {
    return localStorage.getItem("frimart_shift_start") || "07:30 AM";
  });

  const fileInputRef = useRef(null);

  // Toggle Shift Handler
  const handleToggleShift = () => {
    if (isShiftActive) {
      if (confirm("¿Deseas finalizar tu turno de ruta de hoy? Se registrará el cierre de jornada y el resumen de visitas en el CEDIS.")) {
        setIsShiftActive(false);
        localStorage.setItem("frimart_shift_active", "false");
        alert("Turno finalizado con éxito. Jornada cerrada.");
      }
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsShiftActive(true);
      setShiftStartTime(timeStr);
      localStorage.setItem("frimart_shift_active", "true");
      localStorage.setItem("frimart_shift_start", timeStr);
      alert(`¡Turno iniciado a las ${timeStr}! Buen viaje en tu ruta.`);
    }
  };

  // Profile Picture Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatarUrl = event.target?.result;
        if (newAvatarUrl && onUpdateSeller) {
          const updated = { ...seller, avatar: newAvatarUrl };
          onUpdateSeller(updated);
          try {
            localStorage.setItem("frimart_seller", JSON.stringify(updated));
          } catch (err) {}
          alert("¡Foto de perfil actualizada con éxito!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Default avatars to choose from
  const AVATAR_OPTIONS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  ];

  const handleSelectPredefinedAvatar = (url) => {
    if (onUpdateSeller) {
      const updated = { ...seller, avatar: url };
      onUpdateSeller(updated);
      try {
        localStorage.setItem("frimart_seller", JSON.stringify(updated));
      } catch (err) {}
      alert("Foto de perfil actualizada.");
    }
  };

  return (
    <div className="pb-32 bg-white min-h-screen font-sans">
      {/* 1. Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Perfil de Vendedor
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Panel Operativo de Ruta Frimart
          </p>
        </div>

        {/* Shift Badge Indicator */}
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
          isShiftActive 
            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
            : "bg-slate-100 text-slate-600 border-slate-300"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isShiftActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
          <span>{isShiftActive ? "En Turno" : "Fuera de Turno"}</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 2. User Identity Card with Camera Trigger */}
        <div className="relative flex items-center gap-3.5 p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shrink-0 group">
            <img 
              src={seller.avatar} 
              alt={seller.name} 
              className="w-full h-full object-cover" 
            />
            <button
              onClick={() => setModalType("account_settings")}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              title="Cambiar foto de perfil"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-slate-900 text-base truncate">
                {seller.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate">{seller.route}</p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                {seller.cedis}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                • {storesCount} Tiendas Asignadas
              </span>
            </div>
          </div>
        </div>

        {/* 3. Monthly Sales & Commission Performance */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-950/40 text-emerald-200 text-[10px] font-black tracking-wider uppercase border border-white/20">
              MES EN CURSO
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-100 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Rendimiento Oro</span>
            </div>
          </div>

          <div>
            <div className="text-2xl font-black font-mono">
              $18,450.00 MXN
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Comisión acumulada del mes por colocación y resurtido en ruta.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
            <span className="text-emerald-200">
              Cumplimiento: <strong>94% de cuota</strong>
            </span>
            <span className="text-white font-bold">
              342 cajas entregadas
            </span>
          </div>
        </div>

        {/* 4. Shift Management Card (OPCIÓN 1: INICIAR / FINALIZAR TURNO) */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isShiftActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {isShiftActive ? "Turno de Ruta Activo" : "Turno Fuera de Servicio"}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isShiftActive ? `Iniciado a las ${shiftStartTime}` : "Jornada laboral no iniciada"}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
              isShiftActive 
                ? "bg-emerald-50 text-emerald-700 border-emerald-300" 
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}>
              {isShiftActive ? "En Servicio" : "Inactivo"}
            </span>
          </div>

          <button
            onClick={handleToggleShift}
            className={`tap-effect w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
              isShiftActive
                ? "bg-slate-900 hover:bg-slate-800 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isShiftActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Finalizar Turno de Ruta</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Turno de Ruta</span>
              </>
            )}
          </button>
        </div>

        {/* 5. MENÚ OFICIAL EXCLUSIVO DEL VENDEDOR (4 OPCIONES RESTANTES) */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          
          {/* OPCIÓN 2: CONTACTO CON SUPERVISOR DE RUTA */}
          <button
            onClick={() => setModalType("supervisor_contact")}
            className="tap-effect w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <MessageCircle className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 block leading-tight">
                  Contacto con Supervisor de Ruta
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  WhatsApp y llamada directa con Ing. Roberto Almanza
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
          </button>

          {/* OPCIÓN 3: GARANTÍA DE CADENA DE FRÍO */}
          <button
            onClick={() => setModalType("cold_protocol")}
            className="tap-effect w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                <Snowflake className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 block leading-tight">
                  Garantía de Cadena de Frío (-18°C)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Protocolo La Huerta y reporte de contingencia
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
          </button>

          {/* OPCIÓN 4: CONFIGURAR CUENTA (FOTO DE PERFIL) */}
          <button
            onClick={() => setModalType("account_settings")}
            className="tap-effect w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                <Settings className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 block leading-tight">
                  Configurar Cuenta (Foto de Perfil)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Actualizar fotografía, datos de vendedor y unidad
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
          </button>

          {/* OPCIÓN 5: CERRAR SESIÓN / CAMBIAR PIN */}
          <button
            onClick={() => {
              if (confirm("¿Deseas cerrar sesión en este dispositivo?")) {
                onLockSession?.();
              }
            }}
            className="tap-effect w-full p-4 flex items-center justify-between text-left hover:bg-rose-50/50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <LogOut className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-sm font-bold text-rose-600 group-hover:text-rose-700 block leading-tight">
                  Cerrar Sesión
                </span>
                <span className="text-[11px] text-rose-400 block mt-0.5">
                  Salir a la pantalla de PIN de seguridad
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-300 group-hover:text-rose-500 transition" />
          </button>
        </div>
      </div>

      {/* Hidden File Input for Avatar Upload */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* MODAL 1: CONTACTO CON SUPERVISOR DE RUTA */}
      {modalType === "supervisor_contact" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in p-2 sm:p-4">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Supervisor de Ruta</h3>
                  <p className="text-[11px] text-slate-500">Ruta 01 • CEDIS Aguascalientes</p>
                </div>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Supervisor Profile Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                RA
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-900 truncate">Ing. Roberto Almanza</h4>
                <p className="text-xs text-slate-500 font-medium">Supervisor Operativo y Logística Ags</p>
                <span className="inline-block px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-1">
                  En Turno • Disponible
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Comunícate para reporte de congeladores sin frío, pedidos urgentes de tienda o ajustes de inventario.
            </p>

            <div className="space-y-2 pt-1">
              <a
                href="https://wa.me/524491234567?text=Hola%20Roberto,%20soy%20Juan%20Pablo%20Morales%20de%20la%20Ruta%2001%20Aguascalientes.%20Requiero%20apoyo%20con%20mi%20ruta."
                target="_blank"
                rel="noreferrer"
                className="tap-effect w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Enviar WhatsApp (+52 449 123 4567)</span>
              </a>

              <a
                href="tel:+524491234567"
                className="tap-effect w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition cursor-pointer border border-slate-200"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Llamar al Supervisor Directo</span>
              </a>

              <a
                href="tel:+524499101205"
                className="tap-effect w-full py-2.5 px-4 rounded-xl bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Despacho CEDIS Aguascalientes (1205)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GARANTÍA DE CADENA DE FRÍO */}
      {modalType === "cold_protocol" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in p-2 sm:p-4">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Garantía de Cadena de Frío</h3>
                  <p className="text-[11px] text-slate-500">Estándar de Calidad La Huerta IQF</p>
                </div>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-200 text-sky-950 text-xs flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-sky-600 shrink-0" />
              <p>
                <strong>Temperatura Oficial Frimart:</strong> -18°C a -25°C constante en congeladores de clientes.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800">Protocolo Operativo de Visita:</p>
              <ul className="space-y-2 text-slate-700 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">1.</span>
                  <span><strong>Auditar Termómetro:</strong> Registrar la temperatura digital o de carátula en cada tienda.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">2.</span>
                  <span><strong>Regla de 90 Segundos:</strong> No mantener las puertas abiertas por más de 90 segundos durante el resurtido.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">3.</span>
                  <span><strong>Alerta Crítica:</strong> Si un congelador supera los -14°C, notificar al supervisor de inmediato.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setModalType(null)}
              className="tap-effect w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              Comprendido y Aceptado
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIGURAR CUENTA (FOTO DE PERFIL) */}
      {modalType === "account_settings" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in p-2 sm:p-4">
          <div className="w-full max-w-md mx-auto p-5 bg-white rounded-[28px] shadow-2xl space-y-4 animate-sheet-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Configuración de Cuenta</h3>
                  <p className="text-[11px] text-slate-500">Fotografía y ficha técnica de vendedor</p>
                </div>
              </div>
              <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar Change Section */}
            <div className="flex flex-col items-center py-2 space-y-3">
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-emerald-500/30 shadow-md">
                <img 
                  src={seller.avatar} 
                  alt={seller.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="tap-effect px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Subir Nueva Foto</span>
                </button>
              </div>

              {/* Predefined Avatars */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 font-medium block text-center mb-1.5">O elige un avatar Frimart:</span>
                <div className="flex items-center gap-2.5 justify-center">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPredefinedAvatar(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        seller.avatar === url ? "border-emerald-500 ring-2 ring-emerald-400/40" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Read-Only Details */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500">No. Empleado:</span>
                <span className="font-bold text-slate-900 font-mono">VND-1041</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500">Unidad de Reparto:</span>
                <span className="font-bold text-slate-900">Camioneta Isuzu ELF 200 (AG-8921-C)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500">Teléfono Registrado:</span>
                <span className="font-bold text-slate-900 font-mono">+52 449 987 6543</span>
              </div>
            </div>

            <button
              onClick={() => setModalType(null)}
              className="tap-effect w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
