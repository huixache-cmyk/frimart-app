import React, { useState } from "react";
import { 
  X, 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  CheckCircle2, 
  ShieldCheck,
  Tag
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CartSheet({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckoutSuccess,
  currentAddress = "Av. Nichupté Sm 15 Mz 3, Cancún"
}) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 250;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 45.00;
  const discountAmount = appliedPromo ? subtotal * 0.10 : 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FRIMART10" || promoCode.trim().toUpperCase() === "LAHUERTA") {
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: 0.10 });
    } else {
      alert("Código no válido. Prueba usando 'FRIMART10' para un 10% de descuento.");
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const newOrder = {
        id: `FRM-${Math.floor(10000 + Math.random() * 90000)}`,
        date: "Hoy, recién solicitado",
        status: "preparing",
        statusLabel: "Preparando",
        statusBadgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        estimatedDelivery: "35-45 min",
        deliveryAddress: currentAddress,
        driverName: "Por asignar",
        driverPhone: "Asignando repartidor...",
        driverVehicle: "Unidad refrigerada con control de temperatura",
        total: total,
        subtotal: subtotal,
        shippingFee: shippingFee,
        itemsCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
        items: [...cartItems]
      };
      setIsCheckingOut(false);
      onCheckoutSuccess(newOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div className="w-full max-w-md mx-auto h-[90vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden animate-sheet-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eeeeee]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#059669]" />
            <h2 className="font-section-title text-[#0f172a]">
              Mi Carrito ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="tap-effect w-8 h-8 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#f8fafc] border-b border-[#eeeeee] px-5 py-2.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#059669]" />
              {isFreeShipping ? (
                <span className="text-[#059669] font-bold">¡Envío gratis aplicado!</span>
              ) : (
                <span>Agrega <strong className="text-[#059669]">${(freeShippingThreshold - subtotal).toFixed(2)}</strong> para envío gratis</span>
              )}
            </span>
            <span className="font-bold text-slate-500">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#059669] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#f1f5f9] text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-card-title text-slate-800">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-5">
                Explora el catálogo de vegetales, frutas, carnes y productos congelados de Frimart.
              </p>
              <button
                onClick={onClose}
                className="tap-effect px-5 py-2.5 rounded-full bg-[#059669] text-white text-xs font-bold shadow-sm"
              >
                Comenzar a comprar
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 bg-white border border-[#eeeeee] rounded-[16px] shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-16 rounded-[12px] bg-[#f8fafc] p-1 shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-[8px]"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs text-slate-500 block">
                      {item.presentation}
                    </span>
                    <span className="text-sm font-bold text-[#059669] font-['Outfit'] mt-0.5 block">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-full p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="tap-effect w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
                      aria-label="Restar"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="text-xs font-bold min-w-[16px] text-center text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="tap-effect w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
                      aria-label="Sumar"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="tap-effect p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      placeholder="Cupón de descuento (Ej: FRIMART10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] pl-8 pr-3 py-2 text-xs text-slate-800 uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="tap-effect px-3.5 py-2 rounded-[12px] bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedPromo && (
                  <span className="text-[11px] font-semibold text-[#059669] mt-1.5 block">
                    ✓ Cupón {appliedPromo.code} aplicado (10% de descuento)
                  </span>
                )}
              </form>

              {/* Delivery Address Reminder */}
              <div className="p-3 rounded-[14px] bg-[#f8fafc] border border-slate-200 text-xs">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                  Dirección de Entrega:
                </span>
                <span className="font-semibold text-slate-800">
                  {currentAddress}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t border-[#eeeeee] p-5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Costo de envío</span>
                {isFreeShipping ? (
                  <span className="font-bold text-[#059669]">GRATIS</span>
                ) : (
                  <span className="font-semibold text-slate-800">${shippingFee.toFixed(2)}</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#059669] font-semibold">
                  <span>Descuento cupón</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 text-base">
                <span className="font-bold text-slate-900">Total a pagar</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#059669] font-['Outfit']">
                    ${total.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">MXN</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="tap-effect w-full py-3.5 px-4 rounded-[16px] bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm flex items-center justify-between shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
            >
              <span>{isCheckingOut ? "Procesando pedido..." : "Confirmar y Pagar"}</span>
              <span className="flex items-center gap-1 font-extrabold font-['Outfit']">
                ${total.toFixed(2)} <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
