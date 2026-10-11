import React, { useState } from "react";
import { 
  X, 
  DollarSign, 
  Package, 
  Store, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function QuickSaleSheet({
  isOpen,
  onClose,
  stores = [],
  initialStore,
  onSaveSale
}) {
  const [selectedStoreId, setSelectedStoreId] = useState(initialStore?.id || stores[0]?.id || "");
  const [amount, setAmount] = useState(3850);
  const [boxes, setBoxes] = useState(15);
  const [paymentType, setPaymentType] = useState("transfer"); // 'transfer' | 'cash' | 'credit'

  if (!isOpen) return null;

  const currentStore = stores.find(s => s.id === selectedStoreId) || initialStore;
  const estimatedCommission = Math.round(amount * 0.04);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    onSaveSale({
      storeId: selectedStoreId,
      storeName: currentStore?.name || "Tienda",
      amount: Number(amount),
      boxes: Number(boxes),
      paymentType,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-section-title text-[#0f172a]">
                Registrar Venta en Ruta
              </h3>
              <p className="text-[11px] text-slate-500">Suma al progreso de tu meta diaria</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Store Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Tienda / Punto de Venta
            </label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-[#059669]"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.zone || "Cancún"})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Monto Vendido ($ MXN)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-[#059669]"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Cajas Entregadas
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={boxes}
                  onChange={(e) => setBoxes(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-[#059669]"
                  required
                />
                <Package className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Método de Cobro
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType("transfer")}
                className={`tap-effect py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  paymentType === "transfer"
                    ? "bg-[#ecfdf5] border-[#059669] text-[#059669]"
                    : "bg-[#f8fafc] border-slate-200 text-slate-600"
                }`}
              >
                Transferencia
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("cash")}
                className={`tap-effect py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  paymentType === "cash"
                    ? "bg-[#ecfdf5] border-[#059669] text-[#059669]"
                    : "bg-[#f8fafc] border-slate-200 text-slate-600"
                }`}
              >
                Efectivo
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("credit")}
                className={`tap-effect py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  paymentType === "credit"
                    ? "bg-[#ecfdf5] border-[#059669] text-[#059669]"
                    : "bg-[#f8fafc] border-slate-200 text-slate-600"
                }`}
              >
                Crédito 8 días
              </button>
            </div>
          </div>

          {/* Commission Highlight Box */}
          <div className="p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Comisión estimada (4%):</span>
            <strong className="text-sm font-bold text-[#059669]">
              +${estimatedCommission} MXN
            </strong>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="tap-effect w-full py-3.5 rounded-xl bg-[#059669] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:bg-[#047857] transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Confirmar Venta y Sumar a Metas</span>
          </button>
        </form>
      </div>
    </div>
  );
}
