import React, { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  PlusCircle, 
  ArrowUpRight,
  Target,
  Lightbulb,
  X
} from "lucide-react";
import confetti from "canvas-confetti";

export default function DailyGoalCard({ seller, onUpdateSales }) {
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const [saleAmount, setSaleAmount] = useState(3850);
  const [saleBoxes, setSaleBoxes] = useState(15);

  const goal = seller.dailyGoal;
  const percentSales = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const percentBoxes = Math.min(100, Math.round((goal.currentBoxes / goal.targetBoxes) * 100));
  const percentVisits = Math.min(100, Math.round((goal.completedVisits / goal.targetVisits) * 100));
  const estimatedCommission = Math.round(goal.currentAmount * goal.commissionRate);

  const handleRegisterSale = (e) => {
    e.preventDefault();
    if (onUpdateSales) {
      onUpdateSales(Number(saleAmount), Number(saleBoxes));
    }
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowQuickSaleModal(false);
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden border border-slate-200 shadow-sm">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header of Goal Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Meta de Venta Diaria en Ruta
            </h2>
            <span className="bg-sky-50 text-sky-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-sky-200">
              Hoy 18 Sep
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-10">
            Avance de cuota por resurtido en congeladores de la ruta comercial activa
          </p>
        </div>

        <button
          onClick={() => setShowQuickSaleModal(true)}
          className="tactile-btn flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-sky-600/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Resurtido / Venta</span>
        </button>
      </div>

      {/* Main Bento KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* KPI 1: Venta en Dinero */}
        <div className="glass-card p-4.5 border border-sky-100 bg-gradient-to-br from-sky-50/60 to-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Venta Diaria Acumulada</span>
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              ${goal.currentAmount.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center justify-between mb-1.5 font-mono">
              <span>Meta: ${goal.targetAmount.toLocaleString("es-MX")}</span>
              <span className="font-bold text-sky-600">{percentSales}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentSales}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Cajas Resurtidas */}
        <div className="glass-card p-4.5 border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Volumen Surtido</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {goal.currentBoxes} <span className="text-sm font-normal text-slate-500 font-sans">cajas</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center justify-between mb-1.5 font-mono">
              <span>Cuota: {goal.targetBoxes} cajas</span>
              <span className="font-bold text-emerald-600">{percentBoxes}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentBoxes}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 3: Tiendas Atendidas */}
        <div className="glass-card p-4.5 border border-amber-100 bg-gradient-to-br from-amber-50/60 to-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Cobertura de Ruta</span>
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {goal.completedVisits} <span className="text-sm font-normal text-slate-500 font-sans">/ {goal.targetVisits}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center justify-between mb-1.5 font-mono">
              <span>1 en visita GPS</span>
              <span className="font-bold text-amber-600">{percentVisits}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentVisits}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 4: Comisión Estimada */}
        <div className="glass-card p-4.5 border border-purple-100 bg-gradient-to-br from-purple-50/60 to-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">Comisión del Día</span>
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-900 font-mono tracking-tight">
              ${estimatedCommission.toLocaleString("es-MX")}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span className="flex items-center gap-1 text-purple-700 font-semibold">
                <Sparkles className="w-3 h-3 text-purple-500" />
                Tasa 4.0%
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +$380 al cerrar
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentSales}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 text-xs gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-700">
            Faltan <strong className="text-sky-700 font-mono">${(goal.targetAmount - goal.currentAmount).toLocaleString("es-MX")} MXN</strong> para completar el 100% de la cuota diaria y liberar bono extra.
          </span>
        </div>
        <span className="font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-[11px]">
          Avance de ruta en tiempo récord
        </span>
      </div>

      {/* Modal de Registro de Venta Rápida */}
      {showQuickSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-slate-900">
            <button 
              onClick={() => setShowQuickSaleModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Registrar Resurtido de Congelador
                </h3>
                <p className="text-xs text-slate-500">
                  Actualiza tu avance de cuota en la tienda actual
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterSale} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monto de Venta ($ MXN)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-slate-900 font-mono font-bold text-base focus:bg-white focus:outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cajas / Paquetes Resurtidos
                </label>
                <input
                  type="number"
                  value={saleBoxes}
                  onChange={(e) => setSaleBoxes(e.target.value)}
                  required
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono font-bold text-base focus:bg-white focus:outline-none focus:border-sky-500 transition"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Este registro se sumará automáticamente a tu cuota diaria y se asociará con el congelador de la visita actual.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickSaleModal(false)}
                  className="tactile-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tactile-btn px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/30 cursor-pointer"
                >
                  Confirmar Resurtido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
