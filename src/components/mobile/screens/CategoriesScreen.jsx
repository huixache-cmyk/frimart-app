import React, { useState, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowLeft, 
  Sparkles,
  Check
} from "lucide-react";
import ProductCard from "../ProductCard";
import FilterBottomSheet from "../FilterBottomSheet";

export default function CategoriesScreen({
  categories,
  selectedCategoryId,
  onSelectCategory,
  products,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onOpenSearch
}) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [filters, setFilters] = useState({
    sortBy: "relevance", // 'relevance' | 'bestseller' | 'price_asc' | 'price_desc'
    brand: "all",        // 'all' | 'La Huerta' | 'Frimart'
    specialTag: "all",   // 'all' | 'promo' | 'bestseller' | 'new'
    maxPrice: 250
  });

  const currentCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  // Derive subcategory tags based on category
  const subCategoryChips = useMemo(() => {
    if (selectedCategoryId === "vegetales") {
      return [
        { id: "all", label: "Todos" },
        { id: "brocoli", label: "Brócoli" },
        { id: "mezclas", label: "Mezclas" },
        { id: "granos", label: "Elote & Chícharo" },
        { id: "hojas", label: "Espinacas" },
      ];
    } else if (selectedCategoryId === "frutas") {
      return [
        { id: "all", label: "Todas" },
        { id: "fresas", label: "Fresas" },
        { id: "berries", label: "Frutos Rojos" },
        { id: "tropical", label: "Mango" },
      ];
    } else if (selectedCategoryId === "carnes") {
      return [
        { id: "all", label: "Todas" },
        { id: "res", label: "Res & Arrachera" },
        { id: "pollo", label: "Pollo & Milanesas" },
      ];
    } else if (selectedCategoryId === "pescados") {
      return [
        { id: "all", label: "Todos" },
        { id: "filetes", label: "Filetes" },
        { id: "mariscos", label: "Camarón" },
        { id: "gourmet", label: "Salmón & Atún" },
      ];
    }
    return [
      { id: "all", label: "Todos" },
      { id: "promo", label: "Ofertas" },
      { id: "bestseller", label: "Más Vendidos" },
      { id: "new", label: "Nuevos" }
    ];
  }, [selectedCategoryId]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (selectedCategoryId !== "todos" && p.category !== selectedCategoryId) {
        return false;
      }

      // Brand match
      if (filters.brand !== "all" && p.brand !== filters.brand) {
        return false;
      }

      // Special tag match
      if (filters.specialTag === "promo" && !p.isPromo) return false;
      if (filters.specialTag === "bestseller" && !p.isBestseller) return false;
      if (filters.specialTag === "new" && !p.isNew) return false;

      // Price filter
      if (filters.maxPrice && p.price > filters.maxPrice) {
        return false;
      }

      // Subcategory keyword search
      if (subCategoryFilter !== "all") {
        const text = (p.name + " " + p.description).toLowerCase();
        if (subCategoryFilter === "brocoli" && !text.includes("brócoli")) return false;
        if (subCategoryFilter === "mezclas" && !text.includes("mezcla") && !text.includes("ensalada")) return false;
        if (subCategoryFilter === "granos" && !text.includes("chícharo") && !text.includes("elote")) return false;
        if (subCategoryFilter === "hojas" && !text.includes("espinaca")) return false;
        if (subCategoryFilter === "fresas" && !text.includes("fresa")) return false;
        if (subCategoryFilter === "berries" && !text.includes("frutos rojos") && !text.includes("zarzamora")) return false;
        if (subCategoryFilter === "tropical" && !text.includes("mango")) return false;
        if (subCategoryFilter === "res" && !text.includes("res") && !text.includes("arrachera")) return false;
        if (subCategoryFilter === "pollo" && !text.includes("pollo") && !text.includes("pechuga")) return false;
        if (subCategoryFilter === "filetes" && !text.includes("filete") && !text.includes("tilapia")) return false;
        if (subCategoryFilter === "mariscos" && !text.includes("camarón")) return false;
        if (subCategoryFilter === "gourmet" && !text.includes("salmón") && !text.includes("atún")) return false;
        if (subCategoryFilter === "promo" && !p.isPromo) return false;
        if (subCategoryFilter === "bestseller" && !p.isBestseller) return false;
        if (subCategoryFilter === "new" && !p.isNew) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.price - b.price;
      if (filters.sortBy === "price_desc") return b.price - a.price;
      if (filters.sortBy === "bestseller") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return b.rating - a.rating;
    });
  }, [products, selectedCategoryId, filters, subCategoryFilter]);

  const handleFilterChange = (field, val) => {
    setFilters(f => ({ ...f, [field]: val }));
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: "relevance",
      brand: "all",
      specialTag: "all",
      maxPrice: 250
    });
    setSubCategoryFilter("all");
    setIsFilterSheetOpen(false);
  };

  const activeFiltersCount = (filters.brand !== "all" ? 1 : 0) + 
                             (filters.specialTag !== "all" ? 1 : 0) + 
                             (filters.sortBy !== "relevance" ? 1 : 0) +
                             (filters.maxPrice < 250 ? 1 : 0);

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* 1. Header with Title & Search */}
      <div className="px-4 pt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block">
            Catálogo Especializado
          </span>
          <h1 className="font-page-title text-[#0f172a]">
            {currentCategory.name}
          </h1>
        </div>

        <button
          onClick={onOpenSearch}
          className="tap-effect w-10 h-10 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-xs cursor-pointer"
          aria-label="Buscar en catálogo"
        >
          <Search className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* 2. Category Selector Pills */}
      <div className="px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setSubCategoryFilter("all");
              }}
              className={`tap-effect shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                selectedCategoryId === cat.id
                  ? "bg-[#059669] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-[#e2e8f0] hover:bg-slate-50"
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Subcategory Filter Chips & Bottom Sheet Button */}
      <div className="px-4 flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {subCategoryChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => setSubCategoryFilter(chip.id)}
              className={`tap-effect shrink-0 px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer transition ${
                subCategoryFilter === chip.id
                  ? "bg-slate-800 text-white font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Native Filter Trigger Button */}
        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className="tap-effect shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e2e8f0] text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#059669]" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#059669] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* 4. Products Count & Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
          <span>{filteredProducts.length} productos congelados disponibles</span>
          {selectedCategoryId !== "todos" && (
            <span className="text-[#059669] font-bold">100% IQF La Huerta / Frimart</span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
            <span className="text-2xl mb-2 block">❄️</span>
            <h3 className="font-card-title text-slate-800">
              No hay productos con los filtros seleccionados
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto mb-4">
              Prueba cambiando el rango de precio o la marca para ver más opciones.
            </p>
            <button
              onClick={handleResetFilters}
              className="tap-effect px-4 py-2 rounded-full bg-[#059669] text-white text-xs font-bold"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredProducts.map(product => (
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

      {/* Native Filter Bottom Sheet */}
      <FilterBottomSheet 
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onChangeFilter={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResultsCount={filteredProducts.length}
      />
    </div>
  );
}
