import React, { useState, useMemo } from "react";
import { 
  X, 
  Search, 
  Check, 
  Plus, 
  Minus, 
  Sparkles, 
  Tag, 
  Trash2, 
  Copy, 
  Layers, 
  DollarSign, 
  Box, 
  CheckCircle2,
  Package
} from "lucide-react";
import { PLANOGRAM_PRODUCTS, getProductById } from "../data/planogramModels";

export default function FacingEditModal(props) {
  const { isOpen, facingData, shelfTitle } = props;
  if (!isOpen || !facingData) return null;
  // Remontar por frente para que el estado local arranque con los datos correctos
  return <FacingEditModalContent key={`${shelfTitle}-${facingData.facingIndex}-${facingData.skuId}`} {...props} />;
}

function FacingEditModalContent({
  isOpen,
  onClose,
  facingData,
  shelfTitle,
  shelfType = "cabinet", // 'cabinet' | 'door' | 'imbera_shelf'
  onSaveFacing,
  onReplicateToShelf
}) {
  const currentSku = getProductById(facingData.skuId);

  // Local state for editing
  const [selectedSkuId, setSelectedSkuId] = useState(facingData.skuId || null);
  const [facingsExpected, setFacingsExpected] = useState(facingData.facingsExpected || 1);
  const [facingsCurrent, setFacingsCurrent] = useState(facingData.facingsCurrent || 1);
  const [capacityUnits, setCapacityUnits] = useState(facingData.capacityUnits || (shelfType === "door" ? 6 : 8));
  const [statusTag, setStatusTag] = useState(facingData.statusTag || "normal");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");

  // Selected product object
  const activeSelectedProduct = selectedSkuId ? getProductById(selectedSkuId) : null;

  // Filtered product catalog
  const filteredProducts = useMemo(() => {
    return PLANOGRAM_PRODUCTS.filter((prod) => {
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = 
        activeCategory === "todos" || 
        prod.category === activeCategory ||
        (activeCategory === "frutas" && prod.categoryLabel?.includes("Smoothies"));

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  const handleSave = () => {
    onSaveFacing({
      ...facingData,
      skuId: selectedSkuId,
      facingsExpected: Math.max(1, Number(facingsExpected)),
      facingsCurrent: Math.max(0, Number(facingsCurrent)),
      capacityUnits: Math.max(1, Number(capacityUnits)),
      currentStockUnits: Math.max(0, Number(facingsCurrent)) * Number(capacityUnits),
      statusTag
    });
    onClose();
  };

  const handleReplicate = () => {
    if (onReplicateToShelf && selectedSkuId) {
      onReplicateToShelf({
        skuId: selectedSkuId,
        facingsExpected,
        facingsCurrent,
        capacityUnits,
        statusTag
      });
      onClose();
    }
  };

  const handleClearFacing = () => {
    setSelectedSkuId(null);
    setStatusTag("normal");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 w-full max-w-xl shadow-2xl relative text-slate-800 h-[88vh] max-h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                shelfType === "door" 
                  ? "bg-amber-100 text-amber-800 border border-amber-200" 
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                {shelfType === "door" ? "Contrapuerta" : "Charola Principal"} • Frente #{facingData.facingNumber || (facingData.facingIndex + 1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {shelfTitle}
              </span>
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 mt-1">
              Configurar Frente del Planograma
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Section 1: Active Product in this slot */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {activeSelectedProduct ? (
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden shadow-xs flex items-center justify-center">
                  <img
                    src={activeSelectedProduct.image}
                    alt={activeSelectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-200 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                  <Box className="w-6 h-6 stroke-[1.5]" />
                </div>
              )}

              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Producto Asignado
                </span>
                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {activeSelectedProduct ? activeSelectedProduct.name : "Casilla Vacía (Sin Asignar)"}
                </h4>
                {activeSelectedProduct && (
                  <p className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                    <span>{activeSelectedProduct.brand}</span>
                    <span>•</span>
                    <strong className="text-emerald-700">${activeSelectedProduct.price.toFixed(2)}</strong>
                    <span>•</span>
                    <span>{activeSelectedProduct.weight}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions for Current Facing */}
            <div className="flex items-center gap-2">
              {activeSelectedProduct && (
                <>
                  <button
                    type="button"
                    onClick={handleReplicate}
                    className="tactile-btn text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 flex items-center gap-1.5 transition cursor-pointer"
                    title="Asignar este producto a todos los frentes de esta charola"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Llenar Charola</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFacing}
                    className="tactile-btn text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 transition cursor-pointer"
                    title="Vaciar este frente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vaciar</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Quantities & Facings Configuration */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Cantidades, Vistas y Profundidad</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Frentes Requeridos */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Vistas Requeridas (Planograma)
                </span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setFacingsExpected(Math.max(1, facingsExpected - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {facingsExpected}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFacingsExpected(facingsExpected + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Estándar corporativo</span>
              </div>

              {/* 2. Frentes Físicos Actuales */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Vistas Actuales (En Mueble)
                </span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setFacingsCurrent(Math.max(0, facingsCurrent - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className={`font-mono font-bold text-base ${
                    facingsCurrent >= facingsExpected ? "text-emerald-700" : "text-amber-700"
                  }`}>
                    {facingsCurrent}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFacingsCurrent(facingsCurrent + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Físico auditado</span>
              </div>

              {/* 3. Capacidad de fondo / Piezas totales */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Fondo (Bolsas por frente)
                </span>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCapacityUnits(Math.max(1, capacityUnits - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {capacityUnits}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCapacityUnits(capacityUnits + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                  Total: {facingsCurrent * capacityUnits} pzas
                </span>
              </div>
            </div>

            {/* Status Tags */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-600 block mb-2">
                Estado Oficial de Planograma:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "normal", label: "Normal (Línea)", color: "border-slate-300 text-slate-700 bg-white" },
                  { id: "new", label: "+ Artículo Nuevo", color: "border-emerald-500 text-emerald-800 bg-emerald-50" },
                  { id: "shelf_change", label: "Cambio de Charola", color: "border-sky-500 text-sky-800 bg-sky-50" },
                  { id: "promo", label: "En Promoción", color: "border-amber-500 text-amber-800 bg-amber-50" },
                  { id: "discontinued", label: "Baja / Salió", color: "border-rose-400 text-rose-700 bg-rose-50" }
                ].map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setStatusTag(tag.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      statusTag === tag.id ? `${tag.color} ring-2 ring-emerald-500/40 shadow-xs` : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {statusTag === tag.id && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Select or Change Product from Catalog */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-sky-600" />
                <span>Seleccionar Producto para este Frente</span>
              </h4>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "todos", label: "Todos" },
                { id: "vegetales", label: "Vegetales" },
                { id: "frutas", label: "Frutas & Smoothies" },
                { id: "papas", label: "Papas" },
                { id: "elaborados", label: "Del Chef" },
                { id: "carnicos", label: "Cárnicos & Pollo" },
                { id: "pescados", label: "Pescados & Mariscos" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredProducts.map((prod) => {
                const isSelected = selectedSkuId === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedSkuId(prod.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer relative ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {prod.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {prod.brand} • {prod.weight}
                      </span>
                      <strong className="text-xs text-emerald-700 font-bold block mt-0.5">
                        ${prod.price.toFixed(2)}
                      </strong>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="tactile-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="tactile-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar Frente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
