import React from "react";
import { Plus, Check } from "lucide-react";

export default function ProductHorizontalCard({
  product,
  onSelectProduct,
  onAddToCart
}) {
  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="tap-effect-subtle flex items-center justify-between gap-3 p-3 bg-white border border-[#eeeeee] rounded-[16px] shadow-xs cursor-pointer hover:border-slate-300 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-[12px] bg-[#f8fafc] p-1 shrink-0 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-[8px]" 
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider block">
            {product.brand}
          </span>
          <h4 className="text-sm font-semibold text-slate-900 truncate max-w-[160px] sm:max-w-[200px]">
            {product.name}
          </h4>
          <span className="text-xs text-slate-500 block">
            {product.presentation}
          </span>
          <span className="text-sm font-extrabold text-[#059669] font-['Outfit'] mt-0.5 block">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="tap-effect w-8 h-8 rounded-full bg-[#ecfdf5] hover:bg-[#059669] text-[#059669] hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
        aria-label="Agregar"
      >
        <Plus className="w-4 h-4 stroke-[2.2]" />
      </button>
    </div>
  );
}
