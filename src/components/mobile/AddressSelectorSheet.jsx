import React from "react";
import { X, MapPin, Check, Plus } from "lucide-react";

export default function AddressSelectorSheet({
  isOpen,
  onClose,
  addresses = [],
  currentAddress,
  onSelectAddress
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#059669]" />
            <h3 className="font-section-title text-[#0f172a]">
              Dirección de Entrega
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Selecciona dónde deseas recibir tus productos congelados con garantía de temperatura a -18°C.
        </p>

        <div className="space-y-2.5">
          {addresses.map((addr) => {
            const isSelected = currentAddress.includes(addr.alias) || currentAddress.includes(addr.address.slice(0, 15));

            return (
              <button
                key={addr.id}
                onClick={() => {
                  onSelectAddress(addr.address);
                  onClose();
                }}
                className={`tap-effect w-full p-3.5 rounded-2xl border text-left flex items-start justify-between cursor-pointer transition ${
                  isSelected
                    ? "bg-[#ecfdf5] border-[#059669] text-slate-900"
                    : "bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{addr.alias}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-[#059669] bg-white px-2 py-0.2 rounded-full border border-[#a7f3d0]">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{addr.address}</p>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{addr.reference}</span>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            const newAddr = prompt("Ingresa nueva dirección de entrega en Cancún o Riviera Maya:");
            if (newAddr) {
              onSelectAddress(newAddr);
              onClose();
            }
          }}
          className="tap-effect w-full py-3 rounded-xl border border-dashed border-[#059669] text-[#059669] text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agregar Nueva Dirección</span>
        </button>
      </div>
    </div>
  );
}
