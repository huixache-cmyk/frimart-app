import React from "react";
import { 
  Search, 
  Sparkles, 
  Flame, 
  Clock, 
  Tag, 
  Snowflake, 
  ChevronRight,
  ShieldCheck,
  Heart
} from "lucide-react";
import CategoryChips from "../CategoryChips";
import SectionHeader from "../SectionHeader";
import ProductCard from "../ProductCard";
import ProductHorizontalCard from "../ProductHorizontalCard";

export default function HomeScreen({
  categories,
  selectedCategoryId,
  onSelectCategory,
  products,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onOpenSearch,
  onViewCategoryAll
}) {
  const bestsellers = products.filter(p => p.isBestseller);
  const promos = products.filter(p => p.isPromo);
  const newProducts = products.filter(p => p.isNew);
  const recommended = products.slice(0, 6);
  const recentPurchases = products.slice(2, 5);

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Large Search Bar */}
      <div className="pt-2 px-4">
        <button
          onClick={onOpenSearch}
          className="tap-effect w-full flex items-center justify-between p-3.5 rounded-[18px] bg-white border border-[#e2e8f0] shadow-xs text-left cursor-pointer hover:border-slate-300 transition"
          aria-label="Abrir buscador"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-500">
              <Search className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 block">
                ¿Qué producto estás buscando?
              </span>
              <span className="text-[11px] text-slate-400 block">
                Vegetales, frutas, carnes, mariscos...
              </span>
            </div>
          </div>
          <div className="px-2 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-[10px] font-bold border border-[#d1fae5]">
            Buscar
          </div>
        </button>
      </div>

      {/* 2. Quick Horizontal Categories */}
      <div className="px-4">
        <CategoryChips 
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => {
            onSelectCategory(id);
            if (id !== "todos") {
              onViewCategoryAll(id);
            }
          }}
        />
      </div>

      {/* 3. Hero Feature Promo Banner */}
      <div className="px-4">
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-[#064e3b] via-[#059669] to-[#047857] text-white p-5 shadow-sm">
          {/* Subtle Decorative Background Graphic */}
          <div className="absolute -right-6 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute right-4 top-4 text-emerald-300/30">
            <Snowflake className="w-20 h-20" />
          </div>

          <div className="relative z-10 max-w-[230px]">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 border border-white/20">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              Garantía Cadena de Frío
            </span>
            <h3 className="font-['Outfit'] font-black text-xl leading-tight mb-1">
              Ultracongelación IQF a -18°C
            </h3>
            <p className="text-xs text-emerald-100 mb-3">
              Cosechado y empacado para conservar el 100% de nutrientes y sabor fresco.
            </p>
            <button
              onClick={() => onViewCategoryAll("vegetales")}
              className="tap-effect inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#064e3b] font-bold text-xs shadow-xs hover:bg-emerald-50 transition cursor-pointer"
            >
              <span>Ver Catálogo La Huerta</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Section: Más Vendidos (Horizontal Cards) */}
      <section className="px-4">
        <SectionHeader 
          title="Más Vendidos" 
          subtitle="Los favoritos indispensables de las familias"
          onViewAll={() => onViewCategoryAll("todos")}
        />
        
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-3.5 pb-2">
          {bestsellers.map((product) => (
            <div key={product.id} className="w-[175px] shrink-0">
              <ProductCard 
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section: Ofertas de la Semana */}
      <section className="px-4">
        <SectionHeader 
          title="Ofertas de la Semana" 
          subtitle="Precios especiales por tiempo limitado"
          onViewAll={() => onViewCategoryAll("todos")}
        />

        <div className="grid grid-cols-2 gap-3.5">
          {promos.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 6. Section: Compra Nuevamente (Recurrent purchases) */}
      <section className="px-4">
        <SectionHeader 
          title="Compra Nuevamente" 
          subtitle="Tus básicos de la alacena fría"
        />

        <div className="space-y-2.5">
          {recentPurchases.map((product) => (
            <ProductHorizontalCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* 7. Section: Nuevos Productos */}
      {newProducts.length > 0 && (
        <section className="px-4">
          <SectionHeader 
            title="Nuevos Lanzamientos" 
            subtitle="Innovaciones gastronómicas en tu congelador"
            onViewAll={() => onViewCategoryAll("todos")}
          />

          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-3.5 pb-2">
            {newProducts.map((product) => (
              <div key={product.id} className="w-[175px] shrink-0">
                <ProductCard 
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Trust & Delivery Quality Card */}
      <div className="px-4 pt-2">
        <div className="p-4 rounded-[20px] bg-white border border-[#eeeeee] flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Compromiso Frimart Express
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Entregas en camionetas con termógrafo activo a -18°C. Si el producto no llega firme y congelado, te lo cambiamos sin costo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
