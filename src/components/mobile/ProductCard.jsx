import React, { useState } from "react";
import { Heart, Plus, Check } from "lucide-react";

export default function ProductCard({ 
  product, 
  onSelectProduct, 
  onAddToCart,
  isFavorite = false,
  onToggleFavorite 
}) {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="tap-effect-subtle group relative flex flex-col justify-between bg-white border border-[#eeeeee] rounded-[18px] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all cursor-pointer overflow-hidden"
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-square bg-[#f8fafc] rounded-[14px] overflow-hidden flex items-center justify-center p-2 mb-2.5">
        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover rounded-[10px] group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Brand/Promo Badge */}
        {product.badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
            product.badge === "Bestseller"
              ? "bg-[#059669] text-white"
              : product.badge === "Oferta"
              ? "bg-rose-500 text-white"
              : product.badge === "Nuevo"
              ? "bg-sky-600 text-white"
              : "bg-slate-800 text-white"
          }`}>
            {product.badge}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          className="tap-effect absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm transition cursor-pointer"
          aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorite 
                ? "text-rose-500 fill-rose-500" 
                : "text-slate-500 hover:text-rose-500"
            }`} 
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
            {product.brand}
          </span>
          <h3 className="font-card-title text-[#0f172a] line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>
          <p className="font-secondary text-slate-500 mb-2">
            {product.presentation}
          </p>
        </div>

        {/* Price and Quick Add */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-extrabold text-[#059669] font-['Outfit']">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[10px] font-medium text-slate-400">MXN</span>
            </div>

            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through block">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Compact Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`tap-effect w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              justAdded
                ? "bg-[#059669] text-white scale-105"
                : "bg-[#f1f5f9] hover:bg-[#059669] text-slate-700 hover:text-white"
            }`}
            aria-label={`Agregar ${product.name} al carrito`}
            title="Agregar rápido"
          >
            {justAdded ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
