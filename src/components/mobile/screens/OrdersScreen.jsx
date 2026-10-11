import React, { useState } from "react";
import { 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  X,
  Phone,
  MapPin,
  Snowflake
} from "lucide-react";

export default function OrdersScreen({
  orders = [],
  onReorder,
  onOpenShoppingTab
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "in_transit":
        return {
          label: "En camino (-18°C)",
          classes: "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
        };
      case "preparing":
        return {
          label: "Preparando en CEDI",
          classes: "bg-amber-50 text-amber-700 border-amber-200"
        };
      case "delivered":
        return {
          label: "Entregado",
          classes: "bg-slate-100 text-slate-700 border-slate-200"
        };
      default:
        return {
          label: "Cancelado",
          classes: "bg-rose-50 text-rose-700 border-rose-200"
        };
    }
  };

  return (
    <div className="space-y-5 px-4 pt-3 pb-24 animate-fade-in">
      {/* 1. Page Header */}
      <div>
        <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block">
          Historial y Seguimiento
        </span>
        <h1 className="font-page-title text-[#0f172a]">
          Mis Pedidos
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Rastreo en tiempo real con monitoreo de temperatura de entrega
        </p>
      </div>

      {/* 2. Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-card-title text-slate-800">
            Aún no tienes pedidos registrados
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-4">
            Realiza tu primer pedido y recibe productos congelados directo a tu puerta.
          </p>
          <button
            onClick={onOpenShoppingTab}
            className="tap-effect px-5 py-2.5 rounded-full bg-[#059669] text-white text-xs font-bold shadow-sm"
          >
            Comprar ahora
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const isOngoing = order.status === "in_transit" || order.status === "preparing";

            return (
              <article 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`tap-effect-subtle group p-4.5 bg-white border rounded-[22px] shadow-xs cursor-pointer hover:border-slate-300 transition ${
                  isOngoing ? "border-[#059669]/40 ring-1 ring-[#059669]/20" : "border-[#eeeeee]"
                }`}
              >
                {/* Header: Folio, Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block">
                      Pedido #{order.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.date}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${statusInfo.classes}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Real-time Transit Progress Bar for Active Orders */}
                {isOngoing && (
                  <div className="mb-3.5 p-3 rounded-[16px] bg-[#f8fafc] border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[#059669] flex items-center gap-1.5">
                        <Truck className="w-4 h-4 animate-bounce" />
                        Llegada estimada: {order.estimatedDelivery}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        -18.4°C OK
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <div className="h-1.5 flex-1 rounded-full bg-[#059669]" />
                      <div className="h-1.5 flex-1 rounded-full bg-[#059669]" />
                      <div className={`h-1.5 flex-1 rounded-full ${order.status === "in_transit" ? "bg-[#059669] animate-pulse" : "bg-slate-200"}`} />
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                      <span>Confirmado</span>
                      <span>En Cámara</span>
                      <span>En Ruta</span>
                      <span>Entregado</span>
                    </div>
                  </div>
                )}

                {/* Thumbnails Row */}
                <div className="flex items-center gap-2 py-2 border-y border-[#f1f5f9] mb-3 overflow-x-auto no-scrollbar">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-[10px] bg-[#f8fafc] p-0.5 shrink-0 overflow-hidden border border-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-[8px]" 
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-[10px] bg-[#f1f5f9] flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                  <span className="text-xs text-slate-500 ml-2">
                    {order.itemsCount} productos en total
                  </span>
                </div>

                {/* Footer: Price and Reorder Button */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total pagado</span>
                    <span className="font-extrabold text-base text-slate-900 font-['Outfit']">
                      ${order.total.toFixed(2)} MXN
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorder(order.items);
                      }}
                      className="tap-effect flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecfdf5] hover:bg-[#059669] text-[#059669] hover:text-white text-xs font-bold transition cursor-pointer border border-[#d1fae5]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Volver a pedir</span>
                    </button>

                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-700">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal / Sheet */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="w-full max-w-md mx-auto max-h-[88vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden animate-sheet-up">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#eeeeee]">
              <div>
                <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider block">
                  Detalle del Pedido
                </span>
                <h3 className="font-section-title text-[#0f172a]">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="tap-effect w-8 h-8 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
              {/* Delivery and Driver Card */}
              <div className="p-3.5 rounded-[16px] bg-[#f8fafc] border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <MapPin className="w-4 h-4 text-[#059669]" />
                  <span>Entrega en: {selectedOrder.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <span>Unidad: {selectedOrder.driverVehicle}</span>
                </div>
                {selectedOrder.driverName && selectedOrder.status === "in_transit" && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-800">Repartidor: {selectedOrder.driverName}</span>
                    <a 
                      href={`tel:${selectedOrder.driverPhone}`}
                      className="tap-effect px-2.5 py-1 rounded-full bg-[#059669] text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Llamar
                    </a>
                  </div>
                )}
              </div>

              {/* Items in order */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Productos ({selectedOrder.itemsCount})
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{item.name}</span>
                          <span className="text-[11px] text-slate-400">{item.presentation} · x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-slate-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Costo de envío</span>
                  <span className="text-[#059669] font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total</span>
                  <span className="font-['Outfit'] text-lg font-black text-[#059669]">
                    ${selectedOrder.total.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 border-t border-[#eeeeee] bg-white">
              <button
                onClick={() => {
                  onReorder(selectedOrder.items);
                  setSelectedOrder(null);
                }}
                className="tap-effect w-full py-3.5 rounded-[16px] bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Agregar todos los productos al carrito</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
