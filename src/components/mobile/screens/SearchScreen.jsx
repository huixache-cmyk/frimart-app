import React, { useState, useMemo } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";

export default function SearchScreen({
  products,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Brócoli La Huerta",
    "Arrachera marinada",
    "Fresas congeladas",
    "Papas a la francesa"
  ]);

  const trendingQueries = [
    "Mezcla California",
    "Hamburguesas de res",
    "Frutos rojos",
    "Tilapia premium",
    "Waffles belgas",
    "Espinacas"
  ];

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
    );
  }, [searchTerm, products]);

  const handleSearchSubmit = (term) => {
    setSearchTerm(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 5)]);
    }
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  return (
    <div className="space-y-5 px-4 pt-3 pb-24 animate-fade-in">
      {/* 1. Search Input Field */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input 
          type="text"
          placeholder="Busca por producto, marca o ingrediente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-[#e2e8f0] rounded-[18px] pl-10 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#059669] shadow-xs transition"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="tap-effect absolute right-3 top-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Empty query: Show Trending and Recent Searches */}
      {!searchTerm.trim() ? (
        <div className="space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Búsquedas Recientes
                </span>
                <button
                  onClick={handleClearHistory}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Borrar historial
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearchSubmit(term)}
                    className="tap-effect flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white border border-[#e2e8f0] text-xs font-medium text-slate-700 hover:border-slate-300 cursor-pointer"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
              Tendencias Populares
            </span>

            <div className="flex flex-wrap gap-2">
              {trendingQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleSearchSubmit(query)}
                  className="tap-effect flex items-center gap-1 py-1.5 px-3.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-[#ecfdf5] hover:border-[#059669] hover:text-[#059669] transition cursor-pointer"
                >
                  <span>🔥 {query}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Category Suggestions */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Explorar por Categoría
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: "Vegetales IQF", count: "8 productos", query: "vegetales" },
                { title: "Frutas & Smoothies", count: "4 productos", query: "frutas" },
                { title: "Carnes para Asar", count: "4 productos", query: "carnes" },
                { title: "Mariscos del Día", count: "4 productos", query: "pescados" },
              ].map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleSearchSubmit(c.query)}
                  className="tap-effect p-3 bg-white border border-[#eeeeee] rounded-[16px] cursor-pointer hover:border-slate-300"
                >
                  <strong className="text-xs font-bold text-slate-900 block">{c.title}</strong>
                  <span className="text-[11px] text-slate-400">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 3. Search Results Grid */
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span>Resultados para: <strong className="text-slate-900 font-bold">"{searchTerm}"</strong></span>
            <span className="font-mono">{filteredResults.length} encontrados</span>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-card-title text-slate-800">
                No encontramos productos coincidentes
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-4">
                Verifica la ortografía o intenta buscar por ingredientes generales como "res", "fresa" o "papa".
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="tap-effect px-4 py-2 rounded-full bg-slate-800 text-white text-xs font-semibold"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {filteredResults.map(product => (
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
          )}
        </div>
      )}
    </div>
  );
}
