import React from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";

export default function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  onChangeFilter,
  onResetFilters,
  totalResultsCount
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div className="w-full max-w-md mx-auto max-h-[85vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden animate-sheet-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eeeeee]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#059669]" />
            <h3 className="font-section-title text-[#0f172a]">
              Filtros de Catálogo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="tap-effect w-8 h-8 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
            aria-label="Cerrar filtros"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 text-xs">
          {/* 1. Ordenar por */}
          <div>
            <label className="font-bold text-slate-800 text-sm block mb-2.5">
              Ordenar por
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "relevance", label: "Más Relevantes" },
                { id: "bestseller", label: "Más Vendidos" },
                { id: "price_asc", label: "Menor Precio ($)" },
                { id: "price_desc", label: "Mayor Precio ($)" },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChangeFilter("sortBy", opt.id)}
                  className={`tap-effect py-2.5 px-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                    filters.sortBy === opt.id
                      ? "bg-[#ecfdf5] border-[#059669] text-[#059669] font-bold"
                      : "bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{opt.label}</span>
                  {filters.sortBy === opt.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Marca */}
          <div>
            <label className="font-bold text-slate-800 text-sm block mb-2.5">
              Marca Oficial
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Todas las marcas" },
                { id: "La Huerta", label: "La Huerta" },
                { id: "Frimart", label: "Frimart" },
              ].map(brand => (
                <button
                  key={brand.id}
                  onClick={() => onChangeFilter("brand", brand.id)}
                  className={`tap-effect py-2 px-3.5 rounded-full border text-xs cursor-pointer transition ${
                    filters.brand === brand.id
                      ? "bg-[#059669] text-white border-[#059669] font-bold"
                      : "bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Disponibilidad / Tipo */}
          <div>
            <label className="font-bold text-slate-800 text-sm block mb-2.5">
              Tipo de Oferta
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Todos los productos" },
                { id: "promo", label: "En Promoción / Oferta" },
                { id: "bestseller", label: "Bestsellers" },
                { id: "new", label: "Nuevos lanzamientos" },
              ].map(badge => (
                <button
                  key={badge.id}
                  onClick={() => onChangeFilter("specialTag", badge.id)}
                  className={`tap-effect py-2 px-3.5 rounded-full border text-xs cursor-pointer transition ${
                    filters.specialTag === badge.id
                      ? "bg-[#059669] text-white border-[#059669] font-bold"
                      : "bg-[#f8fafc] border-[#e2e8f0] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {badge.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Rango de Precio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-800 text-sm">
                Precio Máximo
              </label>
              <span className="font-extrabold text-sm text-[#059669] font-['Outfit']">
                Hasta ${filters.maxPrice || 250} MXN
              </span>
            </div>
            <input 
              type="range"
              min="30"
              max="250"
              step="5"
              value={filters.maxPrice || 250}
              onChange={(e) => onChangeFilter("maxPrice", Number(e.target.value))}
              className="w-full accent-[#059669] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>$30</span>
              <span>$140</span>
              <span>$250 MXN</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="bg-white border-t border-[#eeeeee] p-4 flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="tap-effect py-3 px-4 rounded-[14px] bg-[#f8fafc] border border-[#e2e8f0] text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="tap-effect flex-1 py-3 px-4 rounded-[14px] bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer text-center"
          >
            Ver {totalResultsCount} Resultados
          </button>
        </div>
      </div>
    </div>
  );
}
