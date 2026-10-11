import React, { useState } from "react";
import { 
  BarChart3, 
  Building2, 
  TrendingUp, 
  MapPin, 
  Users, 
  Award, 
  Snowflake, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight, 
  Filter, 
  Globe, 
  Sparkles,
  PieChart
} from "lucide-react";
import { MASTER_CEDIS } from "../../data/authRolesData";

export default function CommercialDirectorScreen({
  directorUser,
  onSelectCedis
}) {
  const [selectedCedisFilter, setSelectedCedisFilter] = useState("ALL"); // 'ALL' | 'CEDIS-01' | 'CEDIS-02' | 'CEDIS-03'

  // National Aggregations
  const totalMonthlySales = MASTER_CEDIS.reduce((acc, c) => acc + c.currentMonthSales, 0);
  const totalMonthlyTarget = MASTER_CEDIS.reduce((acc, c) => acc + c.monthlyTarget, 0);
  const totalTodaySales = MASTER_CEDIS.reduce((acc, c) => acc + c.todaySales, 0);
  const totalTodayTarget = MASTER_CEDIS.reduce((acc, c) => acc + c.dailyTarget, 0);
  const totalFreezers = MASTER_CEDIS.reduce((acc, c) => acc + c.freezersInstalled, 0);
  const totalRoutes = MASTER_CEDIS.reduce((acc, c) => acc + c.activeRoutesCount, 0);

  const nationalPercent = Math.round((totalMonthlySales / totalMonthlyTarget) * 100);

  // Top National Sellers ranking
  const topSellers = [
    { rank: 1, name: "María Eugenia Torres", cedis: "CEDIS Cancún (01)", route: "Ruta 02 Riviera Maya", sales: 842000, compliance: 114 },
    { rank: 2, name: "Carlos Alberto Reyes", cedis: "CEDIS Mérida (02)", route: "Ruta 11 Mérida Centro", sales: 789000, compliance: 108 },
    { rank: 3, name: "Juan Pablo Morales", cedis: "CEDIS Cancún (01)", route: "Ruta 04 Oxxo Cancún", sales: 712000, compliance: 102 },
    { rank: 4, name: "Esteban Camal", cedis: "CEDIS Playa del Carmen", route: "Ruta 05 Playa Quinta Av.", sales: 654000, compliance: 98 }
  ];

  const displayedCedisList = selectedCedisFilter === "ALL" 
    ? MASTER_CEDIS 
    : MASTER_CEDIS.filter(c => c.id === selectedCedisFilter);

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen animate-fade-in space-y-4">
      {/* Executive Dark Purple Banner */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white p-5 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-300">
              Dirección Comercial Corporativa
            </span>
          </div>
          <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-bold">
            Red Peninsular Frimart
          </span>
        </div>

        <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight">
          {directorUser?.name || "Lic. Roberto Garza"}
        </h1>
        <p className="text-xs text-purple-200/80 mt-0.5">
          Consolidado Nacional Multi-CEDIS • {MASTER_CEDIS.length} Centros de Distribución en Operación
        </p>

        {/* Global KPI cards */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs text-center">
          <div>
            <span className="text-[10px] text-purple-200 block uppercase font-bold">Venta Nacional</span>
            <span className="text-sm font-black font-mono">
              ${(totalMonthlySales / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[10px] text-purple-200 block uppercase font-bold">% Cuota Global</span>
            <span className="text-sm font-black font-mono text-purple-300">
              {nationalPercent}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-purple-200 block uppercase font-bold">Congeladores</span>
            <span className="text-sm font-black font-mono">
              {totalFreezers}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* CEDIS Selector Filter */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-purple-600" />
            Filtrar por CEDIS:
          </label>
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedCedisFilter("ALL")}
              className={`tap-effect px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedCedisFilter === "ALL" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Todos ({MASTER_CEDIS.length})
            </button>
            {MASTER_CEDIS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCedisFilter(c.id)}
                className={`tap-effect px-2 py-1 rounded-lg transition cursor-pointer ${
                  selectedCedisFilter === c.id ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Comparativa Multi-CEDIS */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Rendimiento por Centro de Distribución
          </span>

          {displayedCedisList.map((cedis) => {
            const percent = Math.round((cedis.currentMonthSales / cedis.monthlyTarget) * 100);
            return (
              <div
                key={cedis.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-purple-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{cedis.name}</span>
                      <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 rounded-full">
                        {cedis.state}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Gerente: {cedis.managerName} • {cedis.activeRoutesCount} rutas
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-purple-700 block">
                      ${(cedis.currentMonthSales / 1000000).toFixed(2)}M MXN
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Meta: ${(cedis.monthlyTarget / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                    <span>Avance Presupuestal Mensual</span>
                    <span className="font-bold text-purple-700 font-mono">{percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <span>🏪 {cedis.totalClientsCount} clientes atendidos</span>
                  <span className="text-right">❄️ {cedis.freezersInstalled} congeladores instalados</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranking Nacional de Vendedores */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top Vendedores Nacionales (Mes)
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Ranking en Vivo</span>
          </div>

          <div className="space-y-2">
            {topSellers.map((seller) => (
              <div
                key={seller.rank}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] font-mono ${
                    seller.rank === 1 ? "bg-amber-400 text-slate-950 font-black shadow-xs" :
                    seller.rank === 2 ? "bg-slate-300 text-slate-900" :
                    "bg-slate-200 text-slate-700"
                  }`}>
                    {seller.rank}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{seller.name}</span>
                    <span className="text-[10px] text-slate-500">{seller.cedis}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black font-mono text-purple-700 block">
                    ${seller.sales.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {seller.compliance}% cuota
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
