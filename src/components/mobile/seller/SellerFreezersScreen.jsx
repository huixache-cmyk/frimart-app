import React, { useState, useMemo } from "react";
import { 
  Snowflake, 
  Thermometer, 
  Store, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  RefreshCw,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Layers,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import SectionHeader from "../SectionHeader";
import PlanogramViewer from "../../PlanogramViewer";
import { LA_HUERTA_SKUS } from "../../../data/mockData";
import { INITIAL_PRODUCTS } from "../../../data/mobileFrimartData";

export default function SellerFreezersScreen({
  freezers = [],
  stores = [],
  selectedFreezerId,
  onSelectFreezerId,
  onUpdateSlot,
  onSaveAudit,
  onPlanogramChange,
  onStartVisit,
  canAudit = false,
  reviewer = null
}) {
  const currentFreezer = freezers.find((f) => f.id === selectedFreezerId) || freezers[0];
  const currentStore = stores.find((s) => s.id === currentFreezer?.storeId) || {
    name: currentFreezer?.storeName || "Cadena Comercial OXXO",
    code: "50NCP"
  };
  // La "Lista de Resurtido" quedó reemplazada por la visita guiada; se conserva el código por referencia
  const [activeScreenMode] = useState("visual"); // 'visual' | 'list'
  const [auditSaved, setAuditSaved] = useState(false);
  const [stepperOverrides, setStepperOverrides] = useState({});

  // Flatten planogram shelves into clean tactile items with product images and details
  const shelfItems = useMemo(() => {
    if (!currentFreezer) return [];

    // If freezer has planogram shelves structure from mockData
    if (currentFreezer.planogram && Array.isArray(currentFreezer.planogram)) {
      const itemsList = [];
      currentFreezer.planogram.forEach((shelf) => {
        shelf.items?.forEach((item, itemIdx) => {
          const sku = LA_HUERTA_SKUS.find((s) => s.id === item.skuId) ||
                      INITIAL_PRODUCTS.find((p) => p.id === item.skuId) || {
                        id: item.skuId,
                        name: "Producto La Huerta " + item.skuId,
                        presentation: "Bolsa 500g",
                        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=80",
                        brand: "La Huerta"
                      };

          const key = `${shelf.shelfNumber}-${itemIdx}`;
          const currentFacing = stepperOverrides[key] !== undefined ? stepperOverrides[key] : (item.facingsCurrent * 6);
          const maxCapacity = item.facingsExpected * 6;

          itemsList.push({
            key,
            skuId: item.skuId,
            shelfNumber: shelf.shelfNumber,
            shelfTitle: shelf.title,
            name: sku.name,
            brand: sku.brand || "La Huerta",
            presentation: sku.presentation || sku.weight || "500g",
            image: sku.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=80",
            currentStock: currentFacing,
            maxCapacity,
            statusTag: item.statusTag
          });
        });
      });
      return itemsList;
    }

    // Fallback if slots array exists
    if (currentFreezer.slots && Array.isArray(currentFreezer.slots)) {
      return currentFreezer.slots.map((s, idx) => ({
        key: `slot-${idx}`,
        name: s.productName || s.name,
        brand: s.brand || "La Huerta",
        presentation: s.presentation || "500g",
        image: s.image,
        currentStock: s.currentStock || 10,
        maxCapacity: s.maxCapacity || 16,
        shelfNumber: s.shelf || 1
      }));
    }

    return [];
  }, [currentFreezer, stepperOverrides]);

  if (!currentFreezer) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No hay congeladores registrados en esta ruta.
      </div>
    );
  }

  // Calculate stats
  const totalCapacity = currentFreezer.capacityPcs || shelfItems.reduce((acc, s) => acc + s.maxCapacity, 0) || 120;
  const currentTotalStock = shelfItems.reduce((acc, s) => acc + s.currentStock, 0) || currentFreezer.currentStock || 85;
  const occupancyPercent = Math.min(100, Math.round((currentTotalStock / totalCapacity) * 100));
  const criticalSlotsCount = shelfItems.filter((s) => s.currentStock <= 4).length;

  const handleIncrement = (itemKey) => {
    setStepperOverrides(prev => {
      const current = prev[itemKey] !== undefined 
        ? prev[itemKey] 
        : (shelfItems.find(i => i.key === itemKey)?.currentStock || 0);
      return { ...prev, [itemKey]: current + 1 };
    });
  };

  const handleDecrement = (itemKey) => {
    setStepperOverrides(prev => {
      const current = prev[itemKey] !== undefined 
        ? prev[itemKey] 
        : (shelfItems.find(i => i.key === itemKey)?.currentStock || 0);
      return { ...prev, [itemKey]: Math.max(0, current - 1) };
    });
  };

  const handleSaveAuditClick = () => {
    setAuditSaved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 }
    });
    if (onSaveAudit) onSaveAudit();
    setTimeout(() => setAuditSaved(false), 2500);
  };

  const tempDisplay = currentFreezer.temperature 
    ? `${currentFreezer.temperature}°C` 
    : (currentFreezer.currentTemp || "-19.2°C");

  return (
    <div className="space-y-3 pb-32 animate-fade-in pt-1">

      {/* Acción principal: flujo de trabajo en el punto de venta */}
      {onStartVisit && (
        <div className="px-4">
          <button
            type="button"
            onClick={() => onStartVisit(currentFreezer.id)}
            className="tap-effect w-full p-4 rounded-[22px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="text-left min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-100">{currentStore?.name}</span>
              <span className="block font-['Outfit'] text-lg font-black leading-tight">Iniciar visita guiada</span>
              <span className="block text-[11px] text-emerald-50">Contar → Resurtir → Revisar equipo → Foto</span>
            </div>
            <Snowflake className="w-8 h-8 shrink-0 opacity-90" />
          </button>
        </div>
      )}

      {activeScreenMode === "visual" ? (
        <div className="px-3 sm:px-4">
          <PlanogramViewer
            freezer={currentFreezer}
            store={currentStore}
            canAudit={canAudit}
            reviewer={reviewer}
            onSaveAudit={(fId, auditData) => {
              if (onSaveAudit) onSaveAudit(fId, auditData);
            }}
            onPlanogramChange={onPlanogramChange}
          />
        </div>
      ) : (
        <>
          {/* 3. Freezer Health & Temperature Banner */}
          <div className="px-4">
            <div className="p-4 rounded-[22px] bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Auditoría de Planograma
                  </span>
                  <h3 className="font-['Outfit'] font-bold text-base text-white">
                    {currentFreezer.storeName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sticker ID: <strong className="text-white font-mono">{currentFreezer.qrCode}</strong> • {currentFreezer.model || "Vertical 1 Puerta"}
                  </p>
                </div>

                {/* Live Temp Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold shrink-0">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>{tempDisplay} OK</span>
                </div>
              </div>

              {/* Occupancy and Alert Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Capacidad</span>
                  <strong className="text-xs text-white">
                    {currentTotalStock} / {totalCapacity} pzas
                  </strong>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Llenado</span>
                  <strong className="text-xs text-emerald-400">
                    {occupancyPercent}%
                  </strong>
                </div>

                <div className={`p-2 rounded-xl ${
                  criticalSlotsCount > 0 ? "bg-rose-500/20 text-rose-300" : "bg-slate-800/60 text-slate-300"
                }`}>
                  <span className="text-[10px] block opacity-80">Por Resurtir</span>
                  <strong className="text-xs font-bold">
                    {criticalSlotsCount} ranuras
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Section Title */}
          <div className="px-4">
            <SectionHeader 
              title="Ranuras del Planograma" 
              subtitle="Ajusta con [+] el resurtido de cajas colocado en tienda"
            />
          </div>

      {/* 4. Planogram Slots List (Mobile-First Touch Architecture) */}
      <div className="px-4 space-y-3">
        {shelfItems.map((slot) => {
          const max = slot.maxCapacity || 18;
          const isCritical = slot.currentStock <= 4;
          const isFull = slot.currentStock >= max;
          const missing = max - slot.currentStock;

          return (
            <div 
              key={slot.key}
              className={`p-3.5 rounded-[20px] bg-white border transition shadow-2xs flex items-center justify-between gap-3 ${
                isCritical 
                  ? "border-rose-200 bg-rose-50/20" 
                  : "border-[#eeeeee] hover:border-slate-300"
              }`}
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-13 h-13 rounded-xl bg-[#f8fafc] border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img 
                    src={slot.image} 
                    alt={slot.name} 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">
                      Charola {slot.shelfNumber}
                    </span>
                    {isCritical && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold">
                        Bajo Stock (-{missing})
                      </span>
                    )}
                    {slot.statusTag === "new" && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <h4 className="font-card-title text-xs text-slate-900 line-clamp-1 mt-0.5">
                    {slot.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{slot.brand}</span>
                    <span>•</span>
                    <strong className="text-slate-800">
                      {slot.currentStock} de {max} pzas
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tactile One-Hand Stepper Controls */}
              <div className="flex items-center gap-1.5 shrink-0 bg-[#f8fafc] p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleDecrement(slot.key)}
                  disabled={slot.currentStock <= 0}
                  className="tap-effect w-8 h-8 rounded-lg bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  aria-label="Restar 1 pieza"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <span className="w-6 text-center text-xs font-bold text-slate-900">
                  {slot.currentStock}
                </span>

                <button
                  onClick={() => handleIncrement(slot.key)}
                  disabled={isFull}
                  className="tap-effect w-8 h-8 rounded-lg bg-[#059669] text-white shadow-2xs flex items-center justify-center hover:bg-[#047857] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  aria-label="Agregar 1 pieza"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Sticky Bottom Action Bar */}
      <div className="fixed bottom-16 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#eeeeee] z-30 max-w-md mx-auto">
        <button
          onClick={handleSaveAuditClick}
          className="tap-effect w-full py-3.5 rounded-2xl bg-[#059669] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:bg-[#047857] transition cursor-pointer"
        >
          {auditSaved ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>¡Auditoría Guardada y Sincronizada!</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              <span>Guardar Auditoría del Congelador ({currentTotalStock} pzas)</span>
            </>
          )}
        </button>
      </div>
        </>
      )}
    </div>
  );
}
