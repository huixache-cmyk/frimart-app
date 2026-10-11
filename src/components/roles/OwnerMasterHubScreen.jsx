import React from "react";
import { 
  Crown, 
  KeyRound, 
  Zap, 
  Users, 
  Building2, 
  BarChart3, 
  Truck, 
  ShieldCheck, 
  Smartphone, 
  Sliders, 
  Send, 
  ChevronRight, 
  CheckCircle2, 
  Radio, 
  Activity,
  Layers,
  Sparkles
} from "lucide-react";
import { ROLES, MASTER_CEDIS } from "../../data/authRolesData";

export default function OwnerMasterHubScreen({
  ownerUser,
  users = [],
  otaConfig = {},
  onOpenAdminKeys,
  onOpenOtaUpdates,
  onSwitchSimulatedRole
}) {
  const totalFleet = otaConfig.activeFleetDevices || 52;
  const synchronized = otaConfig.synchronizedDevices || 49;

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen animate-fade-in space-y-4">
      {/* Golden/Rose Master Banner */}
      <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-rose-950 text-white p-5 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-rose-300">
              Modo Propietario • Master Key
            </span>
          </div>
          <span className="text-[11px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/40 font-bold">
            Acceso Total Absoluto
          </span>
        </div>

        <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight">
          {ownerUser?.name || "Director General & Propietario"}
        </h1>
        <p className="text-xs text-rose-200/80 mt-0.5">
          Gobernanza de Roles, Claves de Acceso y Actualizaciones de la Red Frimart
        </p>

        {/* Global Overview KPI */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs text-center">
          <div>
            <span className="text-[10px] text-rose-200 block uppercase font-bold">Usuarios & Claves</span>
            <span className="text-sm font-black font-mono">
              {users.length} activos
            </span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[10px] text-rose-200 block uppercase font-bold">Flota Dispositivos</span>
            <span className="text-sm font-black font-mono">
              {totalFleet} móviles
            </span>
          </div>
          <div>
            <span className="text-[10px] text-rose-200 block uppercase font-bold">Versión Flota</span>
            <span className="text-sm font-black font-mono text-emerald-400">
              {otaConfig.currentVersion || "v2.4.2"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* LOS DOS MÓDULOS PRINCIPALES REQUERIDOS */}
        <div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            Módulos de Gestión Exclusivos del Propietario
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* MÓDULO 1: GESTOR DE CLAVES Y AJUSTES */}
            <button
              onClick={onOpenAdminKeys}
              className="tap-effect p-4 rounded-3xl bg-white border border-rose-200 shadow-sm hover:border-rose-400 hover:shadow-md transition text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center group-hover:scale-105 transition">
                  <KeyRound className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {users.length} Claves
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition">
                  1. Administrar Claves & Ajustes
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Crear, editar o revocar PINs de acceso para los 5 roles. Configurar comisiones y geocercas.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
                <span>Abrir Administrador</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* MÓDULO 2: ACTUALIZACIONES Y DESPLIEGUE OTA */}
            <button
              onClick={onOpenOtaUpdates}
              className="tap-effect p-4 rounded-3xl bg-white border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition text-left space-y-2 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition">
                  <Zap className="w-5 h-5 fill-emerald-600" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  OTA Listo
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  2. Desplegar Actualizaciones a Dispositivos
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Configurar versión candidata, probar en sandbox y enviar actualización remota a todos los móviles.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Centro de Despliegue</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* AUDITORÍA Y SIMULACIÓN DE ROLES */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              Auditar / Ver la Aplicación Como:
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">1-Clic Preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onSwitchSimulatedRole("vendedor")}
              className="tap-effect p-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-left transition cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-xs font-bold text-slate-900 block">Vendedor</span>
              <span className="text-[10px] text-slate-500 block">Ruta 04 Cancún</span>
            </button>

            <button
              onClick={() => onSwitchSimulatedRole("supervisor")}
              className="tap-effect p-2.5 rounded-2xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 text-left transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600 mb-1" />
              <span className="text-xs font-bold text-slate-900 block">Supervisor</span>
              <span className="text-[10px] text-slate-500 block">Zona Cancún</span>
            </button>

            <button
              onClick={() => onSwitchSimulatedRole("gerente_cedis")}
              className="tap-effect p-2.5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-xs font-bold text-slate-900 block">Gerente CEDIS</span>
              <span className="text-[10px] text-slate-500 block">Cancún CUN</span>
            </button>

            <button
              onClick={() => onSwitchSimulatedRole("director_comercial")}
              className="tap-effect p-2.5 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-left transition cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-purple-600 mb-1" />
              <span className="text-xs font-bold text-slate-900 block">Director Com.</span>
              <span className="text-[10px] text-slate-500 block">Multi-CEDIS</span>
            </button>
          </div>
        </div>

        {/* ESTADO DE CONECTIVIDAD DE LA FLOTA */}
        <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Monitoreo de la Flota en Tiempo Real
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Sincronizado
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Dispositivos con versión {otaConfig.currentVersion || "v2.4.2"}:</span>
              <span className="font-bold text-white font-mono">{synchronized} de {totalFleet}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.round((synchronized / totalFleet) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">
              3 dispositivos en ruta sin cobertura móvil pendiente de auto-sincronizar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
