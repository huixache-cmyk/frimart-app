import React, { useState } from "react";
import { 
  TrendingUp, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Receipt, 
  Navigation, 
  Plus, 
  ArrowRight, 
  Snowflake, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Filter
} from "lucide-react";

export default function SellerPendingSalesScreen({
  seller,
  stores = [],
  freezers = [],
  pendientes = [],
  salesLog = [],
  onTogglePendiente,
  onOpenStoreDetail,
  onOpenQuickSale,
  onOpenMap,
  onOpenPlanogram
}) {
  const [activeSubTab, setActiveSubTab] = useState("pendientes"); // 'pendientes' | 'metas' | 'ventas' | 'rutas'

  const goal = seller?.dailyGoal || {
    targetAmount: 35000,
    currentAmount: 24850,
    targetBoxes: 140,
    currentBoxes: 98,
    targetVisits: 8,
    completedVisits: 3,
    commissionRate: 0.04
  };

  const percentSales = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const percentBoxes = Math.min(100, Math.round((goal.currentBoxes / goal.targetBoxes) * 100));
  const earnedCommission = Math.round(goal.currentAmount * goal.commissionRate);

  const pendingTasks = pendientes.filter((p) => !p.completed);
  const completedTasks = pendientes.filter((p) => p.completed);

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-b-3xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
              Operación de Ruta
            </span>
          </div>
          <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-mono font-bold">
            {seller.route?.split(" - ")[0] || "Ruta 04"}
          </span>
        </div>

        <h1 className="text-2xl font-bold font-['Outfit'] tracking-tight">
          {seller.name}
        </h1>
        <p className="text-xs text-emerald-100/80 mt-0.5">
          {seller.cedis || "CEDIS Aguascalientes (1205)"} • Resumen Operativo Diario
        </p>

        {/* Daily Summary Quick Pill Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs">
          <div className="text-center">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold">Venta Hoy</span>
            <span className="text-sm font-black font-mono">
              ${goal.currentAmount.toLocaleString()}
            </span>
          </div>
          <div className="text-center border-x border-white/10">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold">Cajas</span>
            <span className="text-sm font-black font-mono">
              {goal.currentBoxes}/{goal.targetBoxes}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold">Comisión</span>
            <span className="text-sm font-black font-mono text-emerald-300">
              +${earnedCommission.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation (Metas | Pendientes | Ventas | Ruta) */}
      <div className="px-4 -mt-3">
        <div className="bg-white p-1 rounded-2xl shadow-md border border-slate-200/80 flex items-center justify-between gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveSubTab("pendientes")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer relative ${
              activeSubTab === "pendientes"
                ? "bg-emerald-600 text-white shadow-sm"
                : "hover:bg-slate-50"
            }`}
          >
            Pendientes ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveSubTab("metas")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeSubTab === "metas"
                ? "bg-emerald-600 text-white shadow-sm"
                : "hover:bg-slate-50"
            }`}
          >
            Metas
          </button>
          <button
            onClick={() => setActiveSubTab("ventas")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeSubTab === "ventas"
                ? "bg-emerald-600 text-white shadow-sm"
                : "hover:bg-slate-50"
            }`}
          >
            Ventas ({salesLog.length})
          </button>
          <button
            onClick={() => setActiveSubTab("rutas")}
            className={`tap-effect flex-1 py-2 rounded-xl transition text-center cursor-pointer ${
              activeSubTab === "rutas"
                ? "bg-emerald-600 text-white shadow-sm"
                : "hover:bg-slate-50"
            }`}
          >
            Mi Ruta
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* TAB 1: PENDIENTES */}
        {activeSubTab === "pendientes" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Pendientes de Ruta ({pendingTasks.length} activos)
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">Prioridad de visita</span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">¡Excelente trabajo!</h3>
                <p className="text-xs text-slate-500">Completaste todos los pendientes y visitas programadas para hoy.</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white p-4 rounded-2xl border transition shadow-2xs space-y-2 ${
                    task.priority === "alta"
                      ? "border-rose-300 hover:border-rose-400"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => onTogglePendiente(task.id)}
                        className="mt-0.5 w-5 h-5 rounded-md border-2 border-slate-300 hover:border-emerald-500 flex items-center justify-center transition cursor-pointer"
                        title="Marcar como realizado"
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === "alta"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {task.badge}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.dueTime}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      📍 {task.storeName}
                    </span>
                    <button
                      onClick={() => {
                        const targetStore = stores.find(s => s.id === task.storeId || s.name.includes(task.storeName.split(" ")[0]));
                        if (targetStore) onOpenStoreDetail(targetStore);
                      }}
                      className="tap-effect text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
                    >
                      Ir a tienda <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Completed Tasks section */}
            {completedTasks.length > 0 && (
              <div className="pt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Tareas Completadas ({completedTasks.length})
                </span>
                <div className="space-y-2 opacity-75">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="line-through text-slate-500 font-medium">{task.title}</span>
                      </div>
                      <button
                        onClick={() => onTogglePendiente(task.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Deshacer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: METAS */}
        {activeSubTab === "metas" && (
          <div className="space-y-4">
            {/* Venta Meta Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Meta Diaria de Venta</h3>
                    <p className="text-[11px] text-slate-500">Periodo actual (Hoy)</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {percentSales}%
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-slate-900 mb-1.5">
                  <span className="text-2xl font-black font-mono">
                    ${goal.currentAmount.toLocaleString()} MXN
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Meta: ${goal.targetAmount.toLocaleString()} MXN
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentSales}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Faltan ${(goal.targetAmount - goal.currentAmount).toLocaleString()} para bono</span>
                  <span className="font-bold text-emerald-600">Comisión estimada: +${earnedCommission}</span>
                </div>
              </div>
            </div>

            {/* Cajas Meta Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Volumen de Cajas</h3>
                    <p className="text-[11px] text-slate-500">La Huerta & Frimart</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {percentBoxes}%
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-slate-900 mb-1.5">
                  <span className="text-2xl font-black font-mono">
                    {goal.currentBoxes} <span className="text-xs font-normal text-slate-500">cajas entregadas</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Meta: {goal.targetBoxes} cajas
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentBoxes}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Progreso de camión refrigerado</span>
                  <span className="font-bold text-sky-600">Restan {goal.targetBoxes - goal.currentBoxes} cajas</span>
                </div>
              </div>
            </div>

            {/* Efectividad de Visita */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Efectividad de Visita en Ruta</span>
                <span className="text-[11px] text-slate-500">
                  {goal.completedVisits} de {goal.targetVisits} tiendas con check-in y venta
                </span>
              </div>
              <span className="text-lg font-black font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {Math.round((goal.completedVisits / goal.targetVisits) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: VENTAS */}
        {activeSubTab === "ventas" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Historial de Ventas de Hoy</h3>
                <p className="text-[11px] text-slate-500">Total acumulado: ${goal.currentAmount.toLocaleString()} MXN</p>
              </div>
              <button
                onClick={onOpenQuickSale}
                className="tap-effect flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva Venta
              </button>
            </div>

            {salesLog.map((sale) => (
              <div key={sale.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{sale.storeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ticket {sale.ticketNumber} • {sale.time}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-emerald-700 block">
                      +${sale.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                      {sale.boxes} cajas
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>💳 {sale.paymentType}</span>
                  <span className="font-bold text-slate-700">Comisión: +${sale.commission}</span>
                </div>
                <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg font-mono">
                  📦 {sale.itemsSummary}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: MIS RUTAS */}
        {activeSubTab === "rutas" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tiendas Asignadas ({stores.length})
                </h3>
                <p className="text-[11px] text-slate-500">Secuencia de visita del día</p>
              </div>
              <button
                onClick={() => onOpenMap && onOpenMap()}
                className="tap-effect flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                Ver Mapa GPS
              </button>
            </div>

            <div className="space-y-2.5">
              {stores.map((store, idx) => (
                <div
                  key={store.id}
                  onClick={() => onOpenStoreDetail(store)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition cursor-pointer shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{store.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          store.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : store.status === "in_progress"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {store.status === "completed" ? "Atendida" : store.status === "in_progress" ? "En Tienda" : "Pendiente"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {store.address}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
