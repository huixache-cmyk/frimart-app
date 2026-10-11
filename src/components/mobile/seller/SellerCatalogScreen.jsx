import React, { useState, useMemo } from "react";
import { 
  Search, 
  Sparkles, 
  Tag, 
  Package, 
  TrendingUp, 
  Plus, 
  Check, 
  Info,
  DollarSign,
  ChevronRight
} from "lucide-react";
import CategoryChips from "../CategoryChips";
import SectionHeader from "../SectionHeader";

export default function SellerCatalogScreen({
  categories = [],
  products = [],
  onSelectProduct,
  onAddToOrder
}) {
  const [selectedCategory, setSelectedCategory] = useState("vegetales");
  const [searchTerm, setSearchTerm] = useState("");
  const [addedItems, setAddedItems] = useState({});

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "todos" || p.category === selectedCategory;
      const matchSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleAdd = (product) => {
    onAddToOrder(product);
    setAddedItems(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    setTimeout(() => {
      setAddedItems(prev => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* 1. Header & Search */}
      <div className="pt-2 px-4 space-y-3">
        <div>
          <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block">
            Catálogo Comercial Frimart
          </span>
          <h1 className="font-page-title text-[#0f172a]">
            Precios & Productos de Venta
          </h1>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por producto, marca o ingrediente..."
            className="w-full pl-11 pr-4 py-3 rounded-[18px] bg-white border border-[#e2e8f0] text-sm text-slate-800 placeholder-slate-400 shadow-2xs outline-none focus:border-[#059669] transition"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. Horizontal Categories (Airbnb Style) */}
      <div className="px-4">
        <CategoryChips
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
          variant="icons-vertical"
        />
      </div>

      {/* 3. Section Title */}
      <div className="px-4">
        <SectionHeader 
          title="Productos Disponibles en CEDI" 
          subtitle={`${filteredProducts.length} productos con garantía de entrega a -18°C`}
        />
      </div>

      {/* 4. Seller Product Cards Grid (2 Columns, Mobile-First) */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filteredProducts.map((product) => {
          const wholesalePrice = product.price;
          const retailSuggested = (wholesalePrice * 1.25).toFixed(2);
          const margin = (retailSuggested - wholesalePrice).toFixed(2);
          const isJustAdded = !!addedItems[product.id];

          return (
            <div
              key={product.id}
              className="p-3 rounded-[20px] bg-white border border-[#eeeeee] shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              {/* Image & Brand */}
              <div>
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="aspect-square rounded-xl bg-[#f8fafc] p-2 flex items-center justify-center overflow-hidden mb-2 relative cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-full bg-white/90 backdrop-blur-xs text-[9px] font-bold text-slate-600 border border-slate-200">
                    {product.brand}
                  </span>
                </div>

                <span className="text-[10px] text-slate-400 font-medium block">
                  {product.presentation}
                </span>

                <h4 
                  onClick={() => onSelectProduct(product)}
                  className="font-card-title text-xs text-slate-900 line-clamp-2 mt-0.5 cursor-pointer hover:text-[#059669]"
                >
                  {product.name}
                </h4>

                {/* Pricing for Seller vs Tienda */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Costo Tienda:</span>
                    <strong className="text-sm font-bold text-slate-900 font-['Outfit']">
                      ${wholesalePrice.toFixed(2)}
                    </strong>
                  </div>

                  <div className="flex items-baseline justify-between text-[10px] text-emerald-700 mt-0.5">
                    <span>Sugerido (+25%):</span>
                    <span className="font-bold">${retailSuggested}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Add to Store Order */}
              <div className="mt-2.5 pt-1">
                <button
                  onClick={() => handleAdd(product)}
                  className={`tap-effect w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                    isJustAdded
                      ? "bg-[#059669] text-white"
                      : "bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] hover:bg-emerald-100"
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Agregado</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Añadir a Pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
