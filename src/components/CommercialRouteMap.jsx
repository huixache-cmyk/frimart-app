import React, { useState } from "react";
import { 
  Navigation, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Compass, 
  ChevronRight, 
  Store, 
  Sparkles,
  QrCode,
  Layers,
  LocateFixed,
  Building2,
  UserCheck
} from "lucide-react";
import { calculateDistanceMeters } from "../data/mockData";

export default function CommercialRouteMap({ 
  stores, 
  sellerLocation, 
  onSimulateMove, 
  onSelectStore, 
  onOpenPlanogram,
  onStartOnboardingForStore
}) {
  const [selectedStoreId, setSelectedStoreId] = useState(stores[1]?.id || stores[0]?.id);
  const [activeFilter, setActiveFilter] = useState("all");

  const selectedStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  // Distancia actual del vendedor a la tienda seleccionada
  const currentDistance = calculateDistanceMeters(
    sellerLocation.lat,
    sellerLocation.lng,
    selectedStore.lat,
    selectedStore.lng
  );

  const isWithinGeofence = currentDistance <= selectedStore.geofenceRadius;

  const filteredStores = stores.filter(s => {
    if (activeFilter === "completed") return s.status === "completed";
    if (activeFilter === "pending") return s.status === "pending";
    if (activeFilter === "in_progress") return s.status === "in_progress";
    return true;
  });

  return (
    <div className="glass-panel p-6 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Ruta Comercial & Geolocalización en Tiempo Real
            </h2>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              GPS Activo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-10">
            Geocercas comerciales activas: La auditoría y venta en congeladores se valida únicamente dentro del radio de 60m
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`tactile-btn px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === "all" ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Todas ({stores.length})
          </button>
          <button
            onClick={() => setActiveFilter("in_progress")}
            className={`tactile-btn px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === "in_progress" ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            En Visita (1)
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`tactile-btn px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === "completed" ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Atendidas
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`tactile-btn px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeFilter === "pending" ? "bg-white text-sky-700 font-bold shadow-sm border border-slate-200/80" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pendientes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stores List */}
        <div className="lg:col-span-5 space-y-3 max-h-[540px] overflow-y-auto pr-1">
          {filteredStores.map((store, idx) => {
            const distanceToSeller = calculateDistanceMeters(
              sellerLocation.lat,
              sellerLocation.lng,
              store.lat,
              store.lng
            );
            const isInside = distanceToSeller <= store.geofenceRadius;
            const isSelected = store.id === selectedStoreId;

            return (
              <div
                key={store.id}
                onClick={() => {
                  setSelectedStoreId(store.id);
                  if (onSelectStore) onSelectStore(store);
                }}
                className={`tactile-btn p-4 rounded-2xl cursor-pointer transition border ${
                  isSelected
                    ? "bg-sky-50/70 border-sky-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono ${
                      store.status === "completed" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : store.status === "in_progress"
                        ? "bg-sky-100 text-sky-800 border border-sky-300 animate-pulse"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        {store.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-[260px] mt-0.5">
                        {store.address}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {store.status === "completed" && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3 h-3" /> Hecha
                    </span>
                  )}
                  {store.status === "in_progress" && (
                    <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                      <Clock className="w-3 h-3" /> En Visita
                    </span>
                  )}
                  {store.status === "pending" && (
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                      Pendiente
                    </span>
                  )}
                </div>

                {/* Subinfo: Distance & Congeladores */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`flex items-center gap-1.5 font-semibold font-mono ${
                    isInside ? "text-emerald-700" : "text-slate-500"
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                    {isInside ? (
                      <span>Dentro de tienda ({distanceToSeller}m)</span>
                    ) : (
                      <span>A {distanceToSeller > 1000 ? `${(distanceToSeller / 1000).toFixed(1)} km` : `${distanceToSeller} m`}</span>
                    )}
                  </span>

                  <div className="flex items-center gap-2 text-slate-500">
                    {store.freezersCount > 0 ? (
                      <span className="text-sky-700 font-semibold flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {store.freezersCount} congelador
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Sin congelador</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Store Detail & Geofence Simulator */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden">
          {/* Simulated Radar Visualizer (Light theme) */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 mb-5 p-4 flex flex-col justify-between shadow-inner">
            {/* Grid Pattern */}
            <div className="absolute inset-0 radar-grid opacity-50 pointer-events-none"></div>

            {/* Top Coordinate Tags */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 shadow-sm flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                GPS: {selectedStore.lat.toFixed(4)}° N, {Math.abs(selectedStore.lng).toFixed(4)}° W
              </span>
              <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 font-mono text-[11px] text-sky-800 shadow-sm">
                Radio Geocerca: <strong>{selectedStore.geofenceRadius}m</strong>
              </span>
            </div>

            {/* Radar Center Graphic */}
            <div className="relative flex items-center justify-center my-auto">
              {/* Geofence Circle with dynamic aura */}
              <div className={`w-44 h-44 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-700 ${
                isWithinGeofence 
                  ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.15)]" 
                  : "border-sky-400 bg-sky-500/5 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
              }`}>
                {/* Store Pin Marker */}
                <div className="relative flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 border border-white">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg mt-1.5 border border-slate-200 whitespace-nowrap shadow-sm">
                    {selectedStore.name.split("-")[0]}
                  </span>
                </div>
              </div>

              {/* Seller Location Marker (Offset based on distance) */}
              <div 
                className="absolute transition-all duration-700 flex flex-col items-center z-20"
                style={{
                  transform: isWithinGeofence 
                    ? "translate(22px, 22px)" 
                    : "translate(110px, -50px)"
                }}
              >
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30 animate-pulse border-2 border-white">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-extrabold text-sky-800 bg-white px-1.5 py-0.5 rounded-md border border-sky-300 whitespace-nowrap mt-1 shadow-sm">
                  Vendedor (Tú)
                </span>
              </div>
            </div>

            {/* Geofence Status Ribbon & Simulator */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold border ${
                isWithinGeofence
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}>
                {isWithinGeofence ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>DENTRO DE GEOCERCA ({currentDistance} metros)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>FUERA DE RANGO ({currentDistance} metros de distancia)</span>
                  </>
                )}
              </div>

              {/* Simulation button */}
              <button
                onClick={() => onSimulateMove(selectedStore.lat, selectedStore.lng)}
                className="tactile-btn bg-white hover:bg-slate-50 text-sky-700 border border-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold transition cursor-pointer shadow-sm"
                title="Sincronizar GPS a esta tienda para pruebas rápidas"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>Simular que estoy aquí</span>
              </button>
            </div>
          </div>

          {/* Details & Actions for Selected Store */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">
                  {selectedStore.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStore.address}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Encargado de Tienda: <strong className="text-slate-800">{selectedStore.managerName}</strong>
                </p>
              </div>

              {selectedStore.freezersCount > 0 ? (
                <div className="sm:text-right">
                  <span className="text-xs text-slate-500">Congelador Asignado:</span>
                  <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1 flex items-center gap-1.5 shadow-sm">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedStore.freezerIds[0]}</span>
                  </div>
                </div>
              ) : (
                <div className="sm:text-right">
                  <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Sin Congelador Asignado
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {selectedStore.freezersCount > 0 ? (
                <>
                  <button
                    onClick={() => onOpenPlanogram(selectedStore.freezerIds[0])}
                    className="tactile-btn flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-600/30 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Ver y Auditar Planograma</span>
                  </button>

                  <button
                    onClick={() => onOpenPlanogram(selectedStore.freezerIds[0])}
                    className="tactile-btn bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-3 px-4 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Escanear Sticker</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onStartOnboardingForStore(selectedStore)}
                  className="tactile-btn w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Enrolar Congelador con Sticker QR Virgen Aquí</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
