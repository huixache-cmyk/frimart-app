import React, { useState } from "react";
import {
  TrendingUp,
  Truck,
  ChevronRight
} from "lucide-react";
import { MASTER_CEDIS } from "../../data/authRolesData";

export default function CedisManagerScreen({
  managerUser,
  stores = [],
  freezers = []
}) {
  const [activeTab, setActiveTab] = useState("rutas"); // 'rutas' | 'metas' | 'clientes' | 'ventas'
  const [clientSearch, setClientSearch] = useState("");

  // Determine current CEDIS (Default: CEDIS Aguascalientes)
  const cedisData = MASTER_CEDIS.find((c) => c.id === managerUser?.cedisId) || MASTER_CEDIS[0];

  // Rutas de este CEDIS
  const cedisRoutes = cedisData.code === "AGS" || !cedisData.code ? [
    {
      id: "RUTA-01",
      name: "Ruta 01 - Comercial & Detalle Aguascalientes Norte (Las Fuentes, Agropecuario)",
      vendor: "Juan Pablo Morales",
      truck: "Hino 300 Thermo (Placas AG-4912-B)",
      status: "en_ruta",
      stops: 7,
      completedStops: 2,
      todaySales: 26850,
      targetSales: 38000,
      boxesLoaded: 150,
      boxesDelivered: 104
    },
    {
      id: "RUTA-02",
      name: "Ruta 02 - Zona Centro & Oriente (Súper Avenida, Tepeyac, Casa Blanca)",
      vendor: "Alejandra Guillén",
      truck: "Isuzu Elf 400 (Placas AG-1029-A)",
      status: "en_ruta",
      stops: 10,
      completedStops: 6,
      todaySales: 38400,
      targetSales: 45000,
      boxesLoaded: 180,
      boxesDelivered: 140
    },
    {
      id: "RUTA-03",
      name: "Ruta 03 - Canal Mayorista OXXO Bara Sur & San Lorenzo",
      vendor: "Christian Hernández",
      truck: "Ford Transit Frío (Placas AG-8821-C)",
      status: "en_ruta",
      stops: 8,
      completedStops: 5,
      todaySales: 34200,
      targetSales: 40000,
      boxesLoaded: 165,
      boxesDelivered: 130
    },
    {
      id: "RUTA-04",
      name: "Ruta 04 - Institucional & Hotelería Aguascalientes",
      vendor: "Arturo Belmonte",
      truck: "Nissan NP300 Thermo (Placas AG-3390-D)",
      status: "completada",
      stops: 12,
      completedStops: 12,
      todaySales: 28950,
      targetSales: 30000,
      boxesLoaded: 110,
      boxesDelivered: 110
    }
  ] : [
    {
      id: "RUTA-04",
      name: "Ruta 04 - Ags Oriente & Morelos",
      vendor: "Juan Pablo Morales",
      truck: "Hino 300 (Placas SZ-4912-B)",
      status: "en_ruta",
      stops: 8,
      completedStops: 3,
      todaySales: 24850,
      targetSales: 35000,
      boxesLoaded: 140,
      boxesDelivered: 98
    },
    {
      id: "RUTA-02",
      name: "Ruta 02 - Riviera Maya Hoteles & Clubes",
      vendor: "María Eugenia Torres",
      truck: "Isuzu Elf 400 (Placas SZ-1029-A)",
      status: "en_ruta",
      stops: 12,
      completedStops: 5,
      todaySales: 36200,
      targetSales: 48000,
      boxesLoaded: 190,
      boxesDelivered: 145
    }
  ];

  const totalTodaySales = cedisRoutes.reduce((acc, r) => acc + r.todaySales, 0);
  const totalTargetSales = cedisRoutes.reduce((acc, r) => acc + r.targetSales, 0);
  const totalBoxes = cedisRoutes.reduce((acc, r) => acc + r.boxesDelivered, 0);

  const percentMonthly = Math.round((cedisData.currentMonthSales / cedisData.monthlyTarget) * 100);

  // Filter clients
  const filteredStores = stores.filter((s) => 
    s.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    s.chain.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen animate-fade-in space-y-4">
      {/* Header CEDIS */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 text-white p-5 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
              Gerencia de Centro de Distribución
            </span>
          </div>
          <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-bold font-mono">
            {cedisData.code}
          </span>
        </div>

        <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight">
          {cedisData.name}
        </h1>
        <p className="text-xs text-amber-200/80 mt-0.5">
          Gerente: {managerUser?.name || cedisData.managerName} • {cedisData.address}
        </p>

        {/* Big CEDIS Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs text-center">
          <div>
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Venta Hoy CEDIS</span>
            <span className="text-sm font-black font-mono">
              ${totalTodaySales.toLocaleString()}
            </span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Meta Mensual</span>
            <span className="text-sm font-black font-mono">
              {percentMonthly}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Rutas Activas</span>
            <span className="text-sm font-black font-mono text-amber-300">
              {cedisRoutes.length} unidades
            </span>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas requeridas */}
      <div className="px-4 -mt-2">
        <div className="bg-white p-1 rounded-2xl shadow-md border border-slate-200 flex items-center justify-between gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("rutas")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeTab === "rutas" ? "bg-amber-600 text-white shadow-sm" : "hover:bg-slate-50"
            }`}
          >
            Rutas ({cedisRoutes.length})
          </button>
          <button
            onClick={() => setActiveTab("metas")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeTab === "metas" ? "bg-amber-600 text-white shadow-sm" : "hover:bg-slate-50"
            }`}
          >
            Metas
          </button>
          <button
            onClick={() => setActiveTab("clientes")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeTab === "clientes" ? "bg-amber-600 text-white shadow-sm" : "hover:bg-slate-50"
            }`}
          >
            Clientes ({stores.length})
          </button>
          <button
            onClick={() => setActiveTab("ventas")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeTab === "ventas" ? "bg-amber-600 text-white shadow-sm" : "hover:bg-slate-50"
            }`}
          >
            Ventas
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* PESTAÑA 1: TODAS LAS RUTAS DEL CEDIS */}
        {activeTab === "rutas" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                Rutas de Distribución en Campo
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Salida Bodega: 06:30 AM</span>
            </div>

            {cedisRoutes.map((route) => (
              <div key={route.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{route.name}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        route.status === "en_ruta" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                      }`}>
                        {route.status === "en_ruta" ? "En Ruta" : "Completada"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Operador: <strong className="text-slate-800">{route.vendor}</strong> • {route.truck}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-slate-900 block">
                      ${route.todaySales.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Meta: ${route.targetSales.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar of route stops */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                    <span>Paradas atendidas: {route.completedStops} de {route.stops}</span>
                    <span className="font-bold text-amber-700 font-mono">{route.boxesDelivered} cajas</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.round((route.completedStops / route.stops) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA 2: METAS DEL CEDIS */}
        {activeTab === "metas" && (
          <div className="space-y-4">
            {/* Meta Mensual CEDIS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Meta Mensual de Plaza</h3>
                    <p className="text-[11px] text-slate-500">Septiembre 2026</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {percentMonthly}%
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-slate-900 mb-1.5">
                  <span className="text-2xl font-black font-mono">
                    ${cedisData.currentMonthSales.toLocaleString()} MXN
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Presupuesto: ${cedisData.monthlyTarget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentMonthly}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Proyección de cierre: 104% cumplimiento</span>
                  <span className="font-bold text-amber-600">Restan ${(cedisData.monthlyTarget - cedisData.currentMonthSales).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Meta Diaria Consolidada */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Meta Diaria Consolidada</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black font-mono text-slate-900">
                  ${totalTodaySales.toLocaleString()} MXN
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Objetivo: ${totalTargetSales.toLocaleString()} MXN
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.round((totalTodaySales / totalTargetSales) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: CLIENTES DEL CEDIS */}
        {activeTab === "clientes" && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Buscar cliente, OXXO, Soriana, Abarrotes..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              {filteredStores.map((store) => (
                <div key={store.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{store.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                        {store.chain}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px] mt-0.5">
                      {store.address}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      ❄️ {store.freezersCount} congelador instalado • Compliance: {store.compliancePercent || 92}%
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: VENTAS DEL CEDIS */}
        {activeTab === "ventas" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Desglose de Facturación por Categoría (Hoy)
              </span>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    🥦 Verduras IQF La Huerta
                  </span>
                  <span className="font-bold font-mono text-slate-900">$58,400 (52%)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    🍟 Papas a la Francesa La Huerta
                  </span>
                  <span className="font-bold font-mono text-slate-900">$24,150 (21%)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    🍓 Frutas & Smoothies Blendie
                  </span>
                  <span className="font-bold font-mono text-slate-900">$16,900 (15%)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-800" />
                    🥩 Cárnicos & Hamburguesas Frimart
                  </span>
                  <span className="font-bold font-mono text-slate-900">$13,000 (12%)</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Cámara Fría Central</span>
                <span className="text-[11px] text-amber-700">Temperatura promedio: -22.4°C • Stock suficiente</span>
              </div>
              <span className="text-xs font-bold bg-amber-600 text-white px-3 py-1 rounded-xl">
                Al 94% capacidad
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
