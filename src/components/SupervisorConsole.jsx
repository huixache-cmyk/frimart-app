import React, { useState } from "react";
import {
  ShieldCheck,
  Layers,
  Clock,
  Search,
  Radio,
  Eye,
  CheckCircle
} from "lucide-react";

export default function SupervisorConsole({ 
  seller, 
  stores, 
  freezers, 
  onInspectFreezer 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFreezers = freezers.filter(f => 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Consola de Supervisión & Monitoreo en Tiempo Real
              </h2>
              <span className="bg-sky-50 text-sky-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-sky-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-sky-600" />
                Rastreo GPS Activo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-10 max-w-2xl">
              Auditoría en vivo de visitas en ruta, validación estricta de geocercas y estado operativo de congeladores La Huerta
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2 px-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Vendedor Monitoreado:</span>
              <strong className="text-xs text-slate-800">{seller.name}</strong>
            </div>
            <img 
              src={seller.avatar} 
              alt={seller.name} 
              className="w-9 h-9 rounded-xl object-cover border border-sky-400 shadow-sm"
            />
          </div>
        </div>

        {/* Real-time KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="glass-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] text-slate-500 font-semibold">Efectividad de Visita</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {Math.round((seller.dailyGoal.completedVisits / seller.dailyGoal.targetVisits) * 100)}%
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
              {seller.dailyGoal.completedVisits} de {seller.dailyGoal.targetVisits} tiendas atendidas
            </span>
          </div>

          <div className="glass-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] text-slate-500 font-semibold">Venta en Ruta Acumulada</span>
            <div className="text-2xl font-black text-sky-600 font-mono mt-1">
              ${seller.dailyGoal.currentAmount.toLocaleString("es-MX")}
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              Meta: ${seller.dailyGoal.targetAmount.toLocaleString("es-MX")}
            </span>
          </div>

          <div className="glass-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] text-slate-500 font-semibold">Congeladores Enrolados</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {freezers.length} equipos
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Con GPS y planograma activo</span>
          </div>

          <div className="glass-card p-4 border border-slate-200 bg-white">
            <span className="text-[11px] text-slate-500 font-semibold">Auditorías con Geocerca OK</span>
            <div className="text-2xl font-black text-purple-600 font-mono mt-1">
              100%
            </div>
            <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">0 visitas fuera de rango</span>
          </div>
        </div>
      </div>

      {/* Grid: Live Feed & Enrolled Freezers Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live GPS Feed of Route */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 border border-slate-200 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              Bitácora de Atención GPS en Vivo
            </h3>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className={`p-3.5 rounded-2xl border text-xs transition ${
                    store.status === "completed"
                      ? "bg-emerald-50/60 border-emerald-200"
                      : store.status === "in_progress"
                      ? "bg-sky-50/80 border-sky-300 shadow-sm"
                      : "bg-slate-50 border-slate-200/80 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="text-slate-900 font-bold truncate max-w-[200px]">{store.name}</span>
                    {store.status === "completed" && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        {store.checkOutTime}
                      </span>
                    )}
                    {store.status === "in_progress" && (
                      <span className="text-[10px] text-sky-700 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                        EN VISITA
                      </span>
                    )}
                    {store.status === "pending" && (
                      <span className="text-[10px] text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full font-medium">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 truncate mb-2">
                    {store.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/80 pt-2 font-mono">
                    <span>
                      Venta: <strong className="text-slate-800">${store.salesToday.toLocaleString("es-MX")}</strong> ({store.boxesToday} cajas)
                    </span>
                    <span className={`font-bold ${
                      store.compliancePercent >= 90 ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {store.compliancePercent}% Planograma
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enrolled Freezers Table & Telemetry */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Parque de Congeladores en la Ruta
              </h3>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtrar congelador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 transition font-mono"
                />
              </div>
            </div>

            {/* Freezers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-mono bg-slate-50/80">
                    <th className="py-2.5 pl-3">Folio QR</th>
                    <th className="py-2.5">Tienda Asignada</th>
                    <th className="py-2.5">Temp</th>
                    <th className="py-2.5">Charolas</th>
                    <th className="py-2.5 text-right pr-3">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFreezers.map((freezer) => (
                    <tr key={freezer.id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-3 pl-3 font-mono font-bold text-sky-700">
                        {freezer.qrCode}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-800">{freezer.storeName}</div>
                        <div className="text-[10px] text-slate-400">{freezer.model}</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-700">
                        {freezer.temperature}°C
                      </td>
                      <td className="py-3 font-mono text-slate-600">
                        {freezer.shelvesCount} niveles
                      </td>
                      <td className="py-3 text-right pr-3">
                        <button
                          onClick={() => onInspectFreezer(freezer.id)}
                          className="tactile-btn bg-slate-100 hover:bg-sky-600 text-slate-700 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer border border-slate-200 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspeccionar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
