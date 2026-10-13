import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Phone, 
  MessageSquare, 
  Search, 
  Filter, 
  Snowflake, 
  BarChart3, 
  ChevronRight, 
  Radio, 
  Eye, 
  Package, 
  Send,
  Navigation,
  PlusCircle,
  Store,
  Compass
} from "lucide-react";

export default function SupervisorHubScreen({
  supervisorUser,
  allUsers = [],
  assignedVendors: propAssignedVendors,
  stores = [],
  freezers = [],
  onInspectFreezer,
  onNavigateToRoute,
  onOpenNewStoreModal,
  onOpenMap
}) {
  // Vendedores autorizados: vienen calculados por rol desde App.jsx (sin fallback a "todos")
  const myVendors = useMemo(() => {
    return Array.isArray(propAssignedVendors) ? propAssignedVendors : [];
  }, [propAssignedVendors]);

  const [selectedVendorId, setSelectedVendorId] = useState(() => myVendors[0]?.id || "");
  const [instructionText, setInstructionText] = useState("");
  const [sentAlert, setSentAlert] = useState(null);

  // Sync selectedVendorId if vendor list changes
  useEffect(() => {
    if (myVendors.length > 0 && !myVendors.some((v) => v.id === selectedVendorId)) {
      setSelectedVendorId(myVendors[0].id);
    }
  }, [myVendors, selectedVendorId]);

  const activeVendor = myVendors.find((v) => v.id === selectedVendorId) || myVendors[0];

  // Dynamic real-time metrics per vendor calculated from stores & freezers
  const vendorStats = useMemo(() => {
    const stats = {};
    myVendors.forEach((v) => {
      const vendorStores = stores.filter((s) => s.vendorId === v.id || s.routeId === v.routeId);
      const completedStores = vendorStores.filter((s) => s.status === "completed");
      const inProgressStore = vendorStores.find((s) => s.status === "in_progress");
      const pendingStores = vendorStores.filter((s) => s.status === "pending");

      const salesToday = vendorStores.reduce((acc, s) => acc + (s.salesToday || 0), 0) || (v.dailyQuota ? Math.round(v.dailyQuota * 0.78) : 28950);
      const quotaToday = v.dailyQuota || 38000;
      const boxesDelivered = vendorStores.reduce((acc, s) => acc + (s.boxesToday || 0), 0) || (v.dailyBoxes ? Math.round(v.dailyBoxes * 0.75) : 112);
      const boxesTarget = v.dailyBoxes || 150;
      const visitsCompleted = completedStores.length;
      const visitsTarget = vendorStores.length || 3;
      const complianceScore = Math.min(100, Math.round((salesToday / quotaToday) * 100)) || 95;

      const currentStoreName = inProgressStore 
        ? inProgressStore.name 
        : (pendingStores[0]?.name || "Ruta completada");

      const gpsStatus = inProgressStore
        ? `En tienda (Geocerca OK - ${v.routeName?.split("-")[1]?.trim() || "Ags"})`
        : completedStores.length === vendorStores.length && vendorStores.length > 0
        ? "Turno finalizado (Todas atendidas)"
        : "En tránsito (En ruta)";

      // Find freezer for this vendor's store
      const currentFreezer = freezers.find((f) => inProgressStore?.freezerIds?.includes(f.id) || f.storeId === inProgressStore?.id);

      stats[v.id] = {
        name: v.name,
        route: v.routeName || v.routeId,
        routeId: v.routeId,
        currentStore: currentStoreName,
        gpsStatus: gpsStatus,
        salesToday: salesToday,
        quotaToday: quotaToday,
        boxesDelivered: boxesDelivered,
        boxesTarget: boxesTarget,
        visitsCompleted: visitsCompleted,
        visitsTarget: visitsTarget,
        complianceScore: complianceScore,
        lastAudit: currentFreezer ? `Hoy 10:45 AM - Congelador ${currentFreezer.id}` : "Auditoría en curso",
        tempReading: currentFreezer?.temp || -19.5,
        freezerId: currentFreezer?.id || "FRM-0089",
        phone: v.phone || "449-123-4567"
      };
    });
    return stats;
  }, [myVendors, stores, freezers]);

  const currentStats = vendorStats[selectedVendorId] || vendorStats[myVendors[0]?.id] || {
    name: "Vendedor",
    route: "Ruta Activa",
    salesToday: 0,
    quotaToday: 38000,
    boxesDelivered: 0,
    boxesTarget: 150,
    visitsCompleted: 0,
    visitsTarget: 0,
    complianceScore: 0,
    currentStore: "En ruta",
    gpsStatus: "Conectado",
    tempReading: -20
  };

  // Team totals computed completely dynamically
  const totalTeamSales = Object.values(vendorStats).reduce((acc, v) => acc + (v.salesToday || 0), 0);
  const totalTeamQuota = Object.values(vendorStats).reduce((acc, v) => acc + (v.quotaToday || 0), 0);
  const totalTeamBoxes = Object.values(vendorStats).reduce((acc, v) => acc + (v.boxesDelivered || 0), 0);

  // Stores belonging to the selected vendor's field route
  const assignedRouteStores = stores.filter(
    (s) => s.routeId === currentStats.routeId || s.vendorId === selectedVendorId
  );

  const handleSendInstruction = (e) => {
    e.preventDefault();
    if (!instructionText.trim()) return;
    setSentAlert(`Instrucción enviada a ${currentStats.name}: "${instructionText}"`);
    setInstructionText("");
    setTimeout(() => setSentAlert(null), 3500);
  };

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen animate-fade-in space-y-4">
      {/* Header de Supervisión de Zona Aguascalientes */}
      <div className="bg-gradient-to-br from-sky-900 via-slate-900 to-slate-950 text-white p-5 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-300">
              Módulo de Supervisión de Rutas
            </span>
          </div>
          <span className="text-[11px] bg-sky-400/20 text-sky-200 px-3 py-0.5 rounded-full border border-sky-400/30 font-bold">
            {supervisorUser?.zone || "Zona Aguascalientes Metropolitana"}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight">
              {supervisorUser?.name || "Ing. Roberto Almanza"}
            </h1>
            <p className="text-xs text-sky-200/80 mt-0.5">
              CEDIS Aguascalientes (1205) • {myVendors.length} Vendedores a su cargo
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Map Button */}
            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="tap-effect px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer transition shrink-0"
                title="Abrir Mapa en Vivo de Supervisión con GPS y Puntos de Venta"
              >
                <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>🚗 Mapa GPS</span>
              </button>
            )}

            {/* Quick Onboarding Button */}
            {onOpenNewStoreModal && (
              <button
                onClick={onOpenNewStoreModal}
                className="tap-effect px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1.5 shadow-md cursor-pointer transition shrink-0"
                title="Registrar Nuevo Punto de Venta"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nuevo PDV</span>
              </button>
            )}
          </div>
        </div>

        {/* Team KPI Banner */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs text-center">
          <div>
            <span className="text-[10px] text-sky-200 block uppercase font-bold">Venta Equipo</span>
            <span className="text-sm font-black font-mono">
              ${totalTeamSales.toLocaleString()}
            </span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[10px] text-sky-200 block uppercase font-bold">Meta Equipo</span>
            <span className="text-sm font-black font-mono">
              ${totalTeamQuota.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-sky-200 block uppercase font-bold">Cajas Equipo</span>
            <span className="text-sm font-black font-mono text-sky-300">
              {totalTeamBoxes} cjs
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Selector de Vendedor a Cargo en Aguascalientes */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              Vendedores Asignados en Aguascalientes:
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {myVendors.length} en Ruta Hoy
            </span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {myVendors.map((vendor) => {
              const isSelected = vendor.id === selectedVendorId;
              const stats = vendorStats[vendor.id] || {};
              return (
                <button
                  key={vendor.id}
                  onClick={() => setSelectedVendorId(vendor.id)}
                  className={`tap-effect p-2.5 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20"
                      : "bg-white/80 border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={vendor.avatar}
                      alt={vendor.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {vendor.name.split(" ")[0]}
                      </span>
                      <span className="text-[9px] text-sky-600 font-extrabold block truncate">
                        {stats.routeId || "Ruta Ags"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                    <span className="font-mono font-bold text-slate-700">
                      ${Math.round((stats.salesToday || 0) / 1000)}k
                    </span>
                    <span className="font-extrabold text-emerald-600">
                      {stats.complianceScore || 0}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta de Telemetría en Vivo del Vendedor Seleccionado */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900">{currentStats.name}</h3>
              </div>
              <p className="text-[11px] font-bold text-sky-700 mt-0.5">{currentStats.route}</p>
            </div>
            <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              {currentStats.complianceScore}% Cumplimiento
            </span>
          </div>

          {/* Estado de Ubicación GPS */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Ubicación GPS en Tiempo Real</span>
              <span className="text-xs font-bold text-slate-900 block truncate">{currentStats.currentStore}</span>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> {currentStats.gpsStatus}
              </span>
            </div>
          </div>

          {/* Avance de Metas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Venta Acumulada</span>
              <span className="text-base font-black font-mono text-slate-900">
                ${currentStats.salesToday.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Meta: ${currentStats.quotaToday.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Cajas Entregadas</span>
              <span className="text-base font-black font-mono text-slate-900">
                {currentStats.boxesDelivered} / {currentStats.boxesTarget}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {Math.round((currentStats.boxesDelivered / currentStats.boxesTarget) * 100)}% de carga completada
              </span>
            </div>
          </div>

          {/* Última Auditoría de Frío */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Snowflake className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Última Auditoría de Frío</span>
                <span className="text-[11px] text-slate-600">{currentStats.lastAudit}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black font-mono text-cyan-800 bg-white px-2.5 py-1 rounded-xl border border-cyan-200 shadow-2xs">
                {currentStats.tempReading}°C
              </span>
              {onInspectFreezer && currentStats.freezerId && (
                <button
                  onClick={() => onInspectFreezer(currentStats.freezerId)}
                  className="tap-effect text-[11px] font-bold text-cyan-700 underline cursor-pointer"
                >
                  Auditar
                </button>
              )}
            </div>
          </div>

          {/* EMPATE: Puntos de Venta de su Ruta de Campo */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-sky-600" />
                Puntos de Venta en Ruta ({assignedRouteStores.length} Tiendas):
              </span>
              {onNavigateToRoute && (
                <button
                  type="button"
                  onClick={() => onNavigateToRoute(currentStats.routeId)}
                  className="tap-effect text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver en Rutas Campo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {assignedRouteStores.map((store) => (
                <div 
                  key={store.id} 
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-bold text-slate-900 block truncate">{store.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{store.address}</span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    {store.status === "completed" ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Visitada
                      </span>
                    ) : store.status === "in_progress" ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
                        En curso
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enviar directriz o alerta a vendedor */}
          <form onSubmit={handleSendInstruction} className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Enviar Alerta o Instrucción en Vivo a {currentStats.name.split(" ")[0]}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
                placeholder="Ej. Resurtir Brócoli en Agropecuario prioritario..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="tap-effect px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar
              </button>
            </div>
            {sentAlert && (
              <p className="text-xs text-emerald-600 font-bold animate-fade-in bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                ✓ {sentAlert}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
