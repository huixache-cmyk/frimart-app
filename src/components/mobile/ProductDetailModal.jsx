import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  Snowflake
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
  relatedProducts = []
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("desc"); // 'desc' | 'prep' | 'nutrition' | 'ingredients'
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(prev => prev === section ? null : section);
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      {/* Full Sheet Container */}
      <div className="w-full max-w-md mx-auto h-[92vh] bg-white rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden animate-sheet-up">
        {/* Navigation Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 flex items-center justify-between px-4 py-3 border-b border-[#eeeeee]">
          <button
            onClick={onClose}
            className="tap-effect w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label="Cerrar detalle"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {product.brand}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className="tap-effect w-10 h-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-slate-500 hover:text-rose-500 cursor-pointer"
              aria-label="Favorito"
            >
              <Heart 
                className={`w-5 h-5 ${
                  isFavorite ? "text-rose-500 fill-rose-500" : "text-slate-600"
                }`} 
              />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Main Product Image */}
          <div className="relative w-full aspect-square bg-[#f8fafc] rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-[#f1f5f9]">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Badges on image */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.badge && (
                <span className="bg-[#059669] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}
              <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-200">
                <Snowflake className="w-3 h-3 text-sky-500" />
                Cadena de Frío -18°C
              </span>
            </div>
          </div>

          {/* Title, Presentation, and Price */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#059669] bg-[#ecfdf5] border border-[#d1fae5] px-2.5 py-0.5 rounded-full">
                {product.brand} Oficial
              </span>
              <span className="text-xs font-medium text-slate-500">
                ⭐ {product.rating} ({product.reviewCount} reseñas)
              </span>
            </div>

            <h1 className="font-page-title text-[#0f172a] mt-1">
              {product.name}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Presentación: <strong className="text-slate-800">{product.presentation}</strong>
            </p>

            {/* Price Box */}
            <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-[#f1f5f9]">
              <span className="text-2xl font-black text-[#059669] font-['Outfit']">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">MXN / pieza</span>

              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag, i) => (
                <span key={i} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  ✓ {tag}
                </span>
              ))}
            </div>
          )}

          {/* Accordion / Disclosures for secondary information */}
          <div className="border-t border-[#eeeeee] divide-y divide-[#eeeeee] text-xs">
            {/* 1. Descripción */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion("desc")}
                className="w-full flex items-center justify-between text-left font-bold text-slate-900 cursor-pointer"
              >
                <span className="text-sm">Descripción del Producto</span>
                {activeAccordion === "desc" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {activeAccordion === "desc" && (
                <p className="mt-2.5 text-slate-600 leading-relaxed text-xs">
                  {product.description}
                </p>
              )}
            </div>

            {/* 2. Preparación */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion("prep")}
                className="w-full flex items-center justify-between text-left font-bold text-slate-900 cursor-pointer"
              >
                <span className="text-sm">Modo de Preparación y Descongelación</span>
                {activeAccordion === "prep" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {activeAccordion === "prep" && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-700 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669] mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recomendación del Chef Frimart:</span>
                  </div>
                  <p>{product.prepInstructions}</p>
                </div>
              )}
            </div>

            {/* 3. Información Nutricional */}
            {product.nutrition && (
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion("nutrition")}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-900 cursor-pointer"
                >
                  <span className="text-sm">Información Nutrimental (por 100g)</span>
                  {activeAccordion === "nutrition" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {activeAccordion === "nutrition" && (
                  <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Calorías</span>
                      <strong className="text-xs text-slate-800">{product.nutrition.calories}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Proteína</span>
                      <strong className="text-xs text-slate-800">{product.nutrition.protein}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Carbohidratos</span>
                      <strong className="text-xs text-slate-800">{product.nutrition.carbs}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Grasas</span>
                      <strong className="text-xs text-slate-800">{product.nutrition.fat}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Fibra</span>
                      <strong className="text-xs text-slate-800">{product.nutrition.fiber || "N/A"}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Sodio</span>
                      <strong className="text-xs text-slate-800">{product.nutrition.sodium}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Ingredientes */}
            {product.ingredients && (
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion("ingredients")}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-900 cursor-pointer"
                >
                  <span className="text-sm">Ingredientes</span>
                  {activeAccordion === "ingredients" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {activeAccordion === "ingredients" && (
                  <p className="mt-2.5 text-slate-600 text-xs">
                    {product.ingredients.join(", ")}.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="pt-2">
              <h3 className="font-card-title text-slate-900 mb-2.5">
                Te Podría Interesar
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {relatedProducts.slice(0, 2).map(p => (
                  <ProductCard 
                    key={p.id}
                    product={p}
                    onSelectProduct={() => {}}
                    onAddToCart={onAddToCart}
                    isFavorite={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom CTA Bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#eeeeee] p-4 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-full p-1 shrink-0">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="tap-effect w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Disminuir"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <span className="font-bold text-sm font-['Outfit'] min-w-[20px] text-center text-slate-900">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(q => q + 1)}
              className="tap-effect w-8 h-8 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
              aria-label="Aumentar"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleAddToCart}
            className={`tap-effect flex-1 py-3.5 px-4 rounded-[16px] text-white font-bold text-sm flex items-center justify-between transition-all cursor-pointer shadow-md ${
              addedAnimation
                ? "bg-[#047857]"
                : "bg-[#059669] hover:bg-[#047857] shadow-emerald-600/20"
            }`}
          >
            <span>{addedAnimation ? "¡Agregado con éxito!" : "Agregar al carrito"}</span>
            <span className="font-extrabold font-['Outfit']">
              ${totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
