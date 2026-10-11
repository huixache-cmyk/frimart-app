import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  ChevronRight, 
  Store, 
  Snowflake, 
  ArrowRight,
  TrendingUp,
  Package,
  DollarSign,
  Compass,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { calculateDistanceMeters } from "../../../data/mockData";
import SectionHeader from "../SectionHeader";

export default function SellerRouteScreen({
  seller,
  stores = [],
  freezers = [],
  activeTargetStoreId,
  onSetActiveTargetStore,
  onSelectStore,
  onOpenPlanogramForFreezer,
  onOpenQuickSale,
  onOpenScanner,
  onOpenMap,
  selectedRouteFilter = "all",
  onSelectRouteFilter
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'in_progress' | 'completed'
  const [routeFilter, setRouteFilter] = useState(selectedRouteFilter || "all");

  useEffect(() => {
    if (selectedRouteFilter) {
      setRouteFilter(selectedRouteFilter);
    }
  }, [selectedRouteFilter]);

  // Current target store synchronized across Map and Route list
  const currentTargetStore = useMemo(() => {
    return stores.find((s) => s.id === activeTargetStoreId) || stores.find((s) => s.status !== "completed") || stores[0];
  }, [stores, activeTargetStoreId]);

  const goal = seller.dailyGoal;
  const percentSales = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const estimatedCommission = Math.round(goal.currentAmount * goal.commissionRate);

  // Filter stores based on search, status, and route
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "pending") return store.status === "pending";
      if (statusFilter === "in_progress") return store.status === "in_progress";
      if (statusFilter === "completed") return store.status === "completed";

      if (routeFilter !== "all") {
        if (store.routeId && store.routeId !== routeFilter) return false;
      }

      return true;
    });
  }, [stores, searchTerm, statusFilter, routeFilter]);

  // Status counts for buttons
  const counts = {
    all: stores.length,
    pending: stores.filter((s) => s.status === "pending").length,
    in_progress: stores.filter((s) => s.status === "in_progress").length,
    completed: stores.filter((s) => s.status === "completed").length
  };

  return (
    <div className="pb-28 animate-fade-in bg-[#f8fafc] min-h-full">
      {/* 1. Large Search Bar */}
      <div className="pt-2 px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿A qué tienda te diriges? (Oxxo, GoMart...)"
            className="w-full pl-11 pr-4 py-3 rounded-[18px] bg-white border border-slate-300 text-sm text-slate-800 placeholder-slate-400 shadow-2xs outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. Daily Goal Card - White with Gray Outline */}
      <div className="px-4 mb-6">
        <div className="p-4 rounded-[22px] bg-white border border-slate-300 shadow-[0_2px_8px_rgba(15,23,42,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#059669] border border-emerald-200/80 flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-card-title text-slate-900">
                Meta Diaria de Venta
              </span>
            </div>
            <span className="text-xs font-extrabold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0] shadow-2xs">
              {percentSales}% alcanzado
            </span>
          </div>

          {/* Amount & Progress Line */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                ${goal.currentAmount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                de ${goal.targetAmount.toLocaleString()} MXN
              </span>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div 
                className="h-full bg-gradient-to-r from-[#059669] to-[#10b981] rounded-full transition-all duration-500"
                style={{ width: `${percentSales}%` }}
              />
            </div>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-400 font-semibold block">Cajas</span>
              <strong className="text-xs font-bold text-slate-800">
                {goal.currentBoxes} / {goal.targetBoxes}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] text-slate-400 font-semibold block">Visitas</span>
              <strong className="text-xs font-bold text-slate-800">
                {goal.completedVisits} / {goal.targetVisits}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center shadow-2xs">
              <span className="text-[10px] text-[#059669] font-semibold block">Comisión</span>
              <strong className="text-xs font-bold text-[#059669]">
                +${estimatedCommission}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Centered Single-Line Filter Buttons with Guaranteed 24px Separation */}
      <div className="px-4 my-6" style={{ marginTop: "24px", marginBottom: "24px" }}>
        <div className="grid grid-cols-4 gap-1 w-full max-w-md mx-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`tap-effect py-2 px-0.5 rounded-xl text-[10px] font-semibold text-center border transition-all cursor-pointer shadow-2xs whitespace-nowrap leading-normal ${
              statusFilter === "all"
                ? "bg-[#059669] text-white border-[#059669] shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Todas ({counts.all})
          </button>

          <button
            onClick={() => setStatusFilter("pending")}
            className={`tap-effect py-2 px-0.5 rounded-xl text-[10px] font-semibold text-center border transition-all cursor-pointer shadow-2xs whitespace-nowrap leading-normal ${
              statusFilter === "pending"
                ? "bg-[#059669] text-white border-[#059669] shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Pendientes ({counts.pending})
          </button>

          <button
            onClick={() => setStatusFilter("in_progress")}
            className={`tap-effect py-2 px-0.5 rounded-xl text-[10px] font-semibold text-center border transition-all cursor-pointer shadow-2xs whitespace-nowrap leading-normal ${
              statusFilter === "in_progress"
                ? "bg-[#059669] text-white border-[#059669] shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            En curso ({counts.in_progress})
          </button>

          <button
            onClick={() => setStatusFilter("completed")}
            className={`tap-effect py-2 px-0.5 rounded-xl text-[10px] font-semibold text-center border transition-all cursor-pointer shadow-2xs whitespace-nowrap leading-normal ${
              statusFilter === "completed"
                ? "bg-[#059669] text-white border-[#059669] shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Completadas ({counts.completed})
          </button>
        </div>
      </div>

      {/* 4. Section Header with Separation & In-App Map Trigger */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <SectionHeader 
          title="Tiendas en tu Ruta"
          subtitle={`${filteredStores.length} paradas asignadas para hoy`}
        />
        <button
          type="button"
          onClick={() => onOpenMap?.(currentTargetStore?.id || null)}
          className="tap-effect h-8 px-2.5 rounded-xl bg-white border border-emerald-300 text-[#059669] text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-emerald-50 transition cursor-pointer shrink-0"
          title="Ver mapa completo con radar y ruta activa"
        >
          <Compass className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Ver Mapa</span>
        </button>
      </div>

      {/* 4.1 Spotlight Banner: Siguiente Punto a Atender en Ruta */}
      {currentTargetStore && (
        <div className="px-4 mb-4">
          <div className="p-3.5 rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-500/40 shadow-md flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-400 uppercase tracking-wider mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Siguiente Parada a Atender</span>
              </div>
              <h4 className="font-extrabold text-sm text-white truncate">
                {currentTargetStore.name}
              </h4>
              <p className="text-[11px] text-slate-300 truncate">
                {currentTargetStore.address}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onSetActiveTargetStore?.(currentTargetStore.id, false);
                  onOpenMap?.(currentTargetStore.id);
                }}
                className="tap-effect h-8 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm transition cursor-pointer"
                title="Trazar ruta por calles en el mapa"
              >
                <Compass className="w-3.5 h-3.5 stroke-[2.4]" />
                <span>Ruta en Mapa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.5. Selector de Rutas de Campo Aguascalientes */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: "Todas las Rutas Ags", count: stores.length },
            { id: "RUTA-01", label: "Ruta 01 • Juan Pablo Morales", count: stores.filter(s => s.routeId === "RUTA-01").length },
            { id: "RUTA-02", label: "Ruta 02 • Carlos Estrada", count: stores.filter(s => s.routeId === "RUTA-02").length },
            { id: "RUTA-03", label: "Ruta 03 • María Elena", count: stores.filter(s => s.routeId === "RUTA-03").length }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRouteFilter(r.id);
                onSelectRouteFilter?.(r.id);
              }}
              className={`tap-effect px-3 py-1.5 rounded-full font-bold whitespace-nowrap border text-xs transition cursor-pointer shadow-2xs ${
                routeFilter === r.id
                  ? "bg-sky-900 text-white border-sky-900 ring-2 ring-sky-900/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {r.label} ({r.count})
            </button>
          ))}
        </div>
      </div>

      {/* 5. Well-Defined Store Cards with 16px Flexbox Gap */}
      <div className="px-4 flex flex-col gap-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredStores.map((store) => {
          // Calculate live distance from seller
          const sellerLat = seller.currentLocation?.lat || 21.1485;
          const sellerLng = seller.currentLocation?.lng || -86.8402;
          const distanceM = calculateDistanceMeters(sellerLat, sellerLng, store.lat, store.lng);
          const isInsideGeofence = distanceM <= (store.geofenceRadius || 200);

          // Get primary freezer for this store
          const storeFreezer = freezers.find((f) => f.storeId === store.id);
          const isCurrentTarget = store.id === currentTargetStore?.id;

          return (
            <div 
              key={store.id} 
              className={`p-4 rounded-[22px] transition-all duration-200 space-y-3 ${
                isCurrentTarget
                  ? "bg-gradient-to-b from-emerald-50/60 via-white to-white border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-white border border-slate-300 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-slate-400"
              }`}
            >
              {/* Target Banner if active */}
              {isCurrentTarget && (
                <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/80">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>🎯 Siguiente a Atender</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Navigation className="w-2.5 h-2.5 rotate-45 text-emerald-700" />
                    <span>Ruta Sincronizada con Mapa</span>
                  </span>
                </div>
              )}

              {/* Store Title & Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs border ${
                      isCurrentTarget 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : "bg-white text-[#059669] border-slate-200/90"
                    }`}>
                      <Store className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <h3 className="font-card-title text-slate-900 leading-normal text-sm">
                      {store.name}
                    </h3>
                  </div>

                  {/* Route & Vendor badge */}
                  {(store.routeName || store.vendorName) && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                        {store.routeName || "Ruta Ags"} • {store.vendorName || "Vendedor Asignado"}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {store.address}
                  </p>
                </div>

                {/* Status Badge */}
                {store.status === "completed" ? (
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-white text-slate-600 text-[10px] font-bold border border-slate-200/90 flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Visitada
                  </span>
                ) : store.status === "in_progress" ? (
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-white text-amber-700 text-[10px] font-bold border border-amber-300 flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    En curso
                  </span>
                ) : (
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-white text-slate-500 text-[10px] font-bold border border-slate-200/90 shadow-2xs">
                    Pendiente
                  </span>
                )}
              </div>

              {/* GPS Geofence & Freezer Telemetry Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Distance & GPS Geofence */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-2xs ${
                  isInsideGeofence
                    ? "bg-white text-emerald-800 border-emerald-300"
                    : "bg-white text-slate-600 border-slate-200/90"
                }`}>
                  <Navigation className="w-3 h-3 text-slate-400 rotate-45" />
                  <span>
                    {isInsideGeofence 
                      ? "En punto • Dentro de geocerca" 
                      : `A ${Math.round(distanceM)}m (${(distanceM / 1000).toFixed(1)} km)`
                    }
                  </span>
                </div>

                {/* Freezer presence (Solo icono y temperatura) */}
                {storeFreezer ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-blue-700 border border-blue-200 text-[11px] font-medium shadow-2xs">
                    <Snowflake className="w-3 h-3 text-blue-600" />
                    <span>-18.4°C</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-500 border border-slate-200/90 text-[11px] shadow-2xs">
                    <span>Sin congelador</span>
                  </div>
                )}
              </div>

              {/* Action Bar: 1) Iniciar visita -> 2) Atender siguiente -> 3) Planograma -> 4) Botón Mapa */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-300/70">
                {/* 1. Botón Principal de Visita */}
                <button
                  onClick={() => onSelectStore(store)}
                  className={`tap-effect h-7 px-2.5 rounded-lg text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer border shadow-2xs ${
                    store.status === "completed"
                      ? "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      : store.status === "in_progress"
                      ? "bg-white text-amber-700 border-amber-300 hover:bg-amber-50"
                      : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span>
                    {store.status === "completed" 
                      ? "Detalle de visita" 
                      : store.status === "in_progress" 
                      ? "Continuar auditoría" 
                      : "Iniciar visita"
                    }
                  </span>
                  <ChevronRight className="w-3 h-3 stroke-[2]" />
                </button>

                {/* 2. Botón Siguiente a Atender */}
                {isCurrentTarget ? (
                  <div className="h-7 px-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black flex items-center gap-1 shadow-2xs">
                    <span>✓ Siguiente</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetActiveTargetStore?.(store.id)}
                    className="tap-effect h-7 px-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 text-[10.5px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    title="Seleccionar este punto de venta como el siguiente a atender"
                  >
                    <span>🎯 Atender siguiente</span>
                  </button>
                )}

                {/* 3. Botón Planograma si aplica */}
                {storeFreezer && (
                  <button
                    onClick={() => onOpenPlanogramForFreezer(storeFreezer.id)}
                    className="tap-effect h-7 px-2 rounded-lg bg-white border border-emerald-300 text-emerald-700 text-[10.5px] font-medium flex items-center gap-1 hover:bg-emerald-50 transition cursor-pointer shadow-2xs"
                    title="Auditar Planograma"
                  >
                    <Snowflake className="w-3 h-3 stroke-[2]" />
                    <span>Planograma</span>
                  </button>
                )}

                {/* 4. Botón Mapa en app */}
                <button
                  type="button"
                  onClick={() => {
                    onSetActiveTargetStore?.(store.id, false);
                    onOpenMap?.(store.id);
                  }}
                  className="tap-effect h-7 px-2.5 rounded-lg bg-white border border-slate-300 flex items-center gap-1 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition cursor-pointer shadow-2xs text-[10.5px] font-semibold ml-auto"
                  title="Ver en Mapa de la app con radar y ruta calculada"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                  <span>Mapa</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredStores.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No se encontraron tiendas con ese filtro en la ruta.
          </div>
        )}
      </div>
    </div>
  );
}
