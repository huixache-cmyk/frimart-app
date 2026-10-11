import React, { useState, useEffect, useMemo } from "react";
import { 
  Layers, 
  Search, 
  Printer, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ArrowLeft,
  SlidersHorizontal,
  Info,
  Sparkles,
  RefreshCw,
  QrCode,
  Thermometer,
  Calendar,
  PackageCheck,
  ShieldCheck,
  ChevronRight,
  X,
  Snowflake,
  DoorOpen,
  LayoutGrid,
  Check,
  Settings,
  Eye,
  Sliders,
  Store,
  Tag
} from "lucide-react";
import confetti from "canvas-confetti";
import FacingEditModal from "./FacingEditModal";
import FreezerCameraCaptureModal from "./camera/FreezerCameraCaptureModal";
import { 
  FREEZER_MODEL_TYPES, 
  FREEZER_MODEL_CONFIGS, 
  getProductById, 
  createDefaultMetalDoorPlanogram, 
  createDefaultImberaPlanogram 
} from "../data/planogramModels";

export default function PlanogramViewer({ 
  freezer, 
  store, 
  onBackToRoute, 
  onSaveAudit 
}) {
  // Detect or determine initial model type
  // Automatically identify fixed model type from freezer record
  const activeModelType = useMemo(() => {
    if (!freezer) return FREEZER_MODEL_TYPES.GLASS_IMBERA;
    if (freezer.modelType) return freezer.modelType;
    const modelStr = (freezer.model || "").toLowerCase();
    if (modelStr.includes("metal") || modelStr.includes("cofre") || modelStr.includes("solida")) {
      return FREEZER_MODEL_TYPES.METAL_DOOR;
    }
    return FREEZER_MODEL_TYPES.GLASS_IMBERA;
  }, [freezer]);

  // Model-specific fixed hardware configurations set during onboarding
  const metalShelvesCount = freezer?.shelvesCount === 6 ? 6 : 5;
  const metalDoorShelvesCount = freezer?.doorShelvesCount === 6 ? 6 : 5;
  const imberaShelvesCount = freezer?.shelvesCount === 4 ? 4 : 5;
  const imberaFacingsPerShelf = freezer?.facingsPerShelf === 4 ? 4 : 5;

  // Metal Door Visual Mode: 'cabinet' | 'door' | 'both' (default to 'cabinet' on mobile)
  const [metalViewSection, setMetalViewSection] = useState(() => typeof window !== "undefined" && window.innerWidth < 768 ? "cabinet" : "both");

  // Secondary Tab: 'planogram' | 'changes' | 'descriptive'
  const [activeViewMode, setActiveViewMode] = useState("planogram");

  // Planogram state for Metal Door model
  const [metalPlanogram, setMetalPlanogram] = useState(() => {
    if (freezer?.metalPlanogram) return freezer.metalPlanogram;
    return createDefaultMetalDoorPlanogram(
      freezer?.shelvesCount === 6 ? 6 : 5, 
      freezer?.doorShelvesCount === 6 ? 6 : 5
    );
  });

  // Planogram state for Imbera Glass model
  const [imberaPlanogram, setImberaPlanogram] = useState(() => {
    if (freezer?.imberaPlanogram) return freezer.imberaPlanogram;
    return createDefaultImberaPlanogram(
      freezer?.shelvesCount === 4 ? 4 : 5, 
      freezer?.facingsPerShelf === 4 ? 4 : 5
    );
  });

  // Sync state whenever selected freezer changes
  useEffect(() => {
    if (!freezer) return;
    if (freezer.metalPlanogram) {
      setMetalPlanogram(freezer.metalPlanogram);
    } else {
      setMetalPlanogram(createDefaultMetalDoorPlanogram(
        freezer?.shelvesCount === 6 ? 6 : 5, 
        freezer?.doorShelvesCount === 6 ? 6 : 5
      ));
    }

    if (freezer.imberaPlanogram) {
      setImberaPlanogram(freezer.imberaPlanogram);
    } else {
      setImberaPlanogram(createDefaultImberaPlanogram(
        freezer?.shelvesCount === 4 ? 4 : 5, 
        freezer?.facingsPerShelf === 4 ? 4 : 5
      ));
    }
  }, [freezer]);

  // Facing Edit Modal state
  const [editingFacingModal, setEditingFacingModal] = useState({
    isOpen: false,
    facingData: null,
    shelfNumber: 1,
    shelfTitle: "",
    shelfType: "cabinet" // 'cabinet' | 'door' | 'imbera_shelf'
  });

  // Audit Evidence
  const [photoEvidence, setPhotoEvidence] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [restockedBoxes, setRestockedBoxes] = useState(14);
  const [auditSuccess, setAuditSuccess] = useState(false);

  // Open Facing Edit Modal
  const handleOpenFacingEditor = (facing, shelfNumber, shelfTitle, shelfType) => {
    setEditingFacingModal({
      isOpen: true,
      facingData: facing,
      shelfNumber,
      shelfTitle,
      shelfType
    });
  };

  // Save Facing from Modal
  const handleSaveFacingFromModal = (updatedFacing) => {
    const { shelfNumber, shelfType } = editingFacingModal;

    if (activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR) {
      setMetalPlanogram(prev => {
        if (shelfType === "door") {
          return {
            ...prev,
            doorShelves: prev.doorShelves.map(shelf => {
              if (shelf.shelfNumber !== shelfNumber) return shelf;
              return {
                ...shelf,
                facings: shelf.facings.map(f => f.facingIndex === updatedFacing.facingIndex ? updatedFacing : f)
              };
            })
          };
        } else {
          return {
            ...prev,
            cabinetShelves: prev.cabinetShelves.map(shelf => {
              if (shelf.shelfNumber !== shelfNumber) return shelf;
              return {
                ...shelf,
                facings: shelf.facings.map(f => f.facingIndex === updatedFacing.facingIndex ? updatedFacing : f)
              };
            })
          };
        }
      });
    } else {
      // Imbera Glass model
      setImberaPlanogram(prev => ({
        shelves: prev.shelves.map(shelf => {
          if (shelf.shelfNumber !== shelfNumber) return shelf;
          return {
            ...shelf,
            facings: shelf.facings.map(f => f.facingIndex === updatedFacing.facingIndex ? updatedFacing : f)
          };
        })
      }));
    }
  };

  // Replicate to all facings on this shelf
  const handleReplicateToShelf = (templateData) => {
    const { shelfNumber, shelfType } = editingFacingModal;

    if (activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR) {
      setMetalPlanogram(prev => {
        if (shelfType === "door") {
          return {
            ...prev,
            doorShelves: prev.doorShelves.map(shelf => {
              if (shelf.shelfNumber !== shelfNumber) return shelf;
              return {
                ...shelf,
                facings: shelf.facings.map(f => ({ ...f, ...templateData }))
              };
            })
          };
        } else {
          return {
            ...prev,
            cabinetShelves: prev.cabinetShelves.map(shelf => {
              if (shelf.shelfNumber !== shelfNumber) return shelf;
              return {
                ...shelf,
                facings: shelf.facings.map(f => ({ ...f, ...templateData }))
              };
            })
          };
        }
      });
    } else {
      setImberaPlanogram(prev => ({
        shelves: prev.shelves.map(shelf => {
          if (shelf.shelfNumber !== shelfNumber) return shelf;
          return {
            ...shelf,
            facings: shelf.facings.map(f => ({ ...f, ...templateData }))
          };
        })
      }));
    }
  };

  // Direct Stepper increment/decrement on facing
  const handleQuickFacingChange = (shelfNumber, facingIndex, delta, shelfType) => {
    if (activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR) {
      setMetalPlanogram(prev => {
        const targetListKey = shelfType === "door" ? "doorShelves" : "cabinetShelves";
        return {
          ...prev,
          [targetListKey]: prev[targetListKey].map(shelf => {
            if (shelf.shelfNumber !== shelfNumber) return shelf;
            return {
              ...shelf,
              facings: shelf.facings.map(f => {
                if (f.facingIndex !== facingIndex) return f;
                const newCurrent = Math.max(0, (f.facingsCurrent || 0) + delta);
                return {
                  ...f,
                  facingsCurrent: newCurrent,
                  currentStockUnits: newCurrent * (f.capacityUnits || 8)
                };
              })
            };
          })
        };
      });
    } else {
      setImberaPlanogram(prev => ({
        shelves: prev.shelves.map(shelf => {
          if (shelf.shelfNumber !== shelfNumber) return shelf;
          return {
            ...shelf,
            facings: shelf.facings.map(f => {
              if (f.facingIndex !== facingIndex) return f;
              const newCurrent = Math.max(0, (f.facingsCurrent || 0) + delta);
              return {
                ...f,
                facingsCurrent: newCurrent,
                currentStockUnits: newCurrent * (f.capacityUnits || 10)
              };
            })
          };
        })
      }));
    }
  };

  // Calculate live statistics
  const currentActiveFacingsList = useMemo(() => {
    if (activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR) {
      const cabinet = metalPlanogram.cabinetShelves.flatMap(s => s.facings.map(f => ({ ...f, shelfNumber: s.shelfNumber, shelfTitle: s.title, shelfType: "cabinet" })));
      const door = metalPlanogram.doorShelves.flatMap(s => s.facings.map(f => ({ ...f, shelfNumber: s.shelfNumber, shelfTitle: s.title, shelfType: "door" })));
      return [...cabinet, ...door];
    } else {
      return imberaPlanogram.shelves.flatMap(s => s.facings.map(f => ({ ...f, shelfNumber: s.shelfNumber, shelfTitle: s.title, shelfType: "imbera_shelf" })));
    }
  }, [activeModelType, metalPlanogram, imberaPlanogram]);

  const totalExpectedFacings = currentActiveFacingsList.reduce((acc, f) => acc + (f.facingsExpected || 1), 0);
  const totalCurrentFacings = currentActiveFacingsList.reduce((acc, f) => acc + (f.facingsCurrent || 0), 0);
  const totalStockUnits = currentActiveFacingsList.reduce((acc, f) => acc + (f.currentStockUnits || ((f.facingsCurrent || 0) * (f.capacityUnits || 8))), 0);
  const totalCapacityUnits = currentActiveFacingsList.reduce((acc, f) => acc + ((f.facingsExpected || 1) * (f.capacityUnits || 8)), 0);
  const complianceScore = totalExpectedFacings > 0 ? Math.min(100, Math.round((totalCurrentFacings / totalExpectedFacings) * 100)) : 100;

  // Filter items for "Ver Cambios"
  const changesItems = useMemo(() => {
    return currentActiveFacingsList.filter(f => f.statusTag && f.statusTag !== "normal");
  }, [currentActiveFacingsList]);

  // Handle Save Audit
  const handleFinishAudit = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    setAuditSuccess(true);
    setTimeout(() => setAuditSuccess(false), 3000);

    if (onSaveAudit) {
      onSaveAudit(freezer?.id || "FRM-0089", {
        modelType: activeModelType,
        modelName: FREEZER_MODEL_CONFIGS[activeModelType].name,
        complianceScore,
        restockedBoxes,
        photoEvidence,
        metalPlanogram: activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR ? metalPlanogram : null,
        imberaPlanogram: activeModelType === FREEZER_MODEL_TYPES.GLASS_IMBERA ? imberaPlanogram : null,
        lastAuditDate: new Date().toISOString()
      });
    }
  };

  return (
    <div className="w-full space-y-4 pb-20 animate-fade-in text-slate-900">
      {/* 1. Header Bar: Compact & Mobile-First */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-700 rounded-2xl p-2.5 sm:p-3.5 shadow-md text-white flex items-center justify-between gap-2 border border-red-500/40">
        <div className="flex items-center gap-2 min-w-0">
          {onBackToRoute && (
            <button
              onClick={onBackToRoute}
              className="tactile-btn bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg text-xs font-bold transition cursor-pointer border border-white/30 shrink-0"
              title="Regresar a ruta"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="bg-white text-red-700 text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs font-mono shrink-0">
                {store?.code || "50NCP"}
              </span>
              <h2 className="font-extrabold text-xs sm:text-sm tracking-tight text-white font-['Outfit'] truncate">
                {store?.name || "OXXO Nichupté"}
              </h2>
            </div>
            <p className="text-[10px] text-red-100 font-mono flex items-center gap-1.5 truncate mt-0.5">
              <span>QR: <strong className="text-white">{freezer?.qrCode || "FRM-0089"}</strong></span>
              <span>•</span>
              <span className="truncate">{FREEZER_MODEL_CONFIGS[activeModelType].shortName}</span>
            </p>
          </div>
        </div>

        {/* Telemetry Pill */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/20 px-2 py-1 rounded-xl text-emerald-300 font-mono text-[11px] font-bold shrink-0">
          <Thermometer className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>{freezer?.temperature || -22.0}°C</span>
        </div>
      </div>

      {/* 2. Fixed Freezer Model Specifications & Operational Controls */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Active Model Indicator Tag (Fixed from QR Enrollment) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
              activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs"
                : "bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs"
            }`}>
              {activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR ? (
                <>
                  <DoorOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Puerta Metálica • {metalShelvesCount} ch (5 ftes) + {metalDoorShelvesCount} rep (4 ftes)</span>
                </>
              ) : (
                <>
                  <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                  <span>Imbera Vidrio • {imberaShelvesCount} charolas ({imberaFacingsPerShelf} ftes c/u)</span>
                </>
              )}
            </span>
          </div>

          {/* Section Selector for Metal Door (Gabinete vs Contrapuerta) */}
          {activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR && (
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-[10px] font-bold shrink-0">
              <button
                onClick={() => setMetalViewSection("cabinet")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
                  metalViewSection === "cabinet" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                📦 Gabinete (5 ftes)
              </button>
              <button
                onClick={() => setMetalViewSection("door")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
                  metalViewSection === "door" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                🚪 Puerta (4 ftes)
              </button>
              <button
                onClick={() => setMetalViewSection("both")}
                className={`hidden sm:inline-block px-2.5 py-1 rounded-lg cursor-pointer transition ${
                  metalViewSection === "both" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Ambos
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0 pl-1">
            <span className="text-slate-500">{totalCurrentFacings}/{totalExpectedFacings} ftes</span>
            <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              {complianceScore}%
            </span>
          </div>
        </div>

        {/* Secondary Operational Views Bar (Exhibición, Cambios, Descriptivo) */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 gap-1.5 text-xs overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveViewMode("planogram")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                activeViewMode === "planogram"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Exhibición
            </button>
            <button
              onClick={() => setActiveViewMode("changes")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition flex items-center gap-1 ${
                activeViewMode === "changes"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>Cambios</span>
              <span className="bg-amber-400 text-amber-950 px-1 py-0.2 rounded-full text-[9px] font-black">
                {changesItems.length}
              </span>
            </button>
            <button
              onClick={() => setActiveViewMode("descriptive")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                activeViewMode === "descriptive"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Descriptivo
            </button>
          </div>

          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-sans shrink-0">
            <span>⇄ Desliza charolas</span>
          </span>
        </div>
      </div>

      {/* 3. Main Operational Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Freezer Rack Graphics (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {activeViewMode === "planogram" && (
            <div className="space-y-3">
              {/* Instructions banner */}
              <div className="p-2.5 bg-amber-50/90 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900 gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] leading-tight truncate">
                    <strong>Toca cualquier frente</strong> para cambiar producto o cantidades.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[9px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Nuevo
                  </span>
                  <span className="flex items-center gap-1 text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Cambio
                  </span>
                </div>
              </div>

              {/* RENDER MODEL A: CONGELADOR PUERTA DE VIDRIO (IMBERA) */}
              {activeModelType === FREEZER_MODEL_TYPES.GLASS_IMBERA && (
                <div className="imbera-freezer-cabinet bg-slate-900 rounded-[28px] p-2.5 sm:p-5 shadow-xl border-3 border-slate-700 relative overflow-hidden">
                  {/* Top Imbera Curved Header Lightbox with La Huerta Brand Banner */}
                  <div className="bg-gradient-to-b from-white via-white to-slate-100 rounded-xl p-2.5 sm:p-3 mb-3 shadow-sm border-b-3 border-emerald-600 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-xs shadow-inner shrink-0">
                        LH
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-['Outfit'] font-black text-emerald-900 text-sm sm:text-base tracking-tight leading-none">
                          La Huerta.
                        </h3>
                        <p className="text-[10px] text-emerald-700 font-bold italic mt-0.5 truncate">
                          Cosecha una vida saludable.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg shrink-0">
                      <QrCode className="w-4 h-4 text-slate-800" />
                      <div className="text-[9px] leading-tight font-mono">
                        <strong className="text-slate-900">{freezer?.qrCode || "FRM-0089"}</strong>
                        <p className="text-emerald-700 font-bold">Imbera VR</p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Shelves Rack with Horizontal Touch Scroll */}
                  <div className="space-y-3.5 relative py-1 px-1 bg-slate-800/40 rounded-xl border border-slate-700/60 shadow-inner">
                    {imberaPlanogram.shelves.map((shelf) => (
                      <div key={shelf.shelfNumber} className="relative">
                        {/* Shelf Header Tag */}
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1 px-1 font-mono">
                          <span className="text-sky-300 truncate">{shelf.title}</span>
                          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-600 text-[9px] shrink-0">
                            Ch {shelf.shelfNumber}/{imberaShelvesCount}
                          </span>
                        </div>

                        {/* Shelf Facings Row - Horizontally Scrollable on Mobile so cards never squish */}
                        <div className="overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-0.5 px-0.5">
                          <div 
                            className="grid gap-2 bg-slate-100/95 p-2 rounded-t-xl border-t-2 border-slate-300 items-end shadow-inner"
                            style={{
                              gridTemplateColumns: `repeat(${imberaFacingsPerShelf}, minmax(82px, 1fr))`,
                              minWidth: `${imberaFacingsPerShelf * 86}px`
                            }}
                          >
                            {shelf.facings.map((facing) => {
                              const product = getProductById(facing.skuId);
                              const isCompliant = facing.facingsCurrent >= facing.facingsExpected;

                              return (
                                <div
                                  key={facing.facingIndex}
                                  className={`group relative rounded-xl p-1.5 transition-all flex flex-col justify-between bg-white border cursor-pointer hover:shadow-md min-h-[142px] ${
                                    facing.statusTag === "new"
                                      ? "border-emerald-500 ring-1 ring-emerald-500/30 shadow-xs"
                                      : facing.statusTag === "shelf_change"
                                      ? "border-sky-500 ring-1 ring-sky-500/30 shadow-xs"
                                      : facing.statusTag === "discontinued"
                                      ? "border-rose-400 bg-rose-50/50 opacity-60"
                                      : "border-slate-200"
                                  }`}
                                  onClick={() => handleOpenFacingEditor(facing, shelf.shelfNumber, shelf.title, "imbera_shelf")}
                                >
                                  {/* Status Pill Badge */}
                                  {facing.statusTag === "new" && (
                                    <span className="absolute -top-1.5 left-1.5 bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded shadow-2xs z-10">
                                      NUEVO
                                    </span>
                                  )}
                                  {facing.statusTag === "shelf_change" && (
                                    <span className="absolute -top-1.5 left-1.5 bg-sky-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded shadow-2xs z-10">
                                      CAMBIO
                                    </span>
                                  )}
                                  {facing.statusTag === "discontinued" && (
                                    <span className="absolute -top-1.5 left-1.5 bg-rose-600 text-white text-[7px] font-black px-1.5 py-0.2 rounded shadow-2xs z-10">
                                      SALIÓ
                                    </span>
                                  )}

                                  {/* Facing Index Pill */}
                                  <span className="absolute top-1 right-1 text-[8px] font-mono text-slate-400 font-bold">
                                    F{facing.facingNumber}
                                  </span>

                                  {/* Product Image & Details */}
                                  {product ? (
                                    <>
                                      <div className="w-full h-14 rounded-lg bg-slate-50 p-1 flex items-center justify-center overflow-hidden mb-1 relative">
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="w-full h-full object-contain drop-shadow-2xs"
                                        />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <h5 className="font-bold text-[10px] text-slate-900 leading-tight line-clamp-2">
                                          {product.name}
                                        </h5>
                                        <span className="text-[9px] text-slate-400 font-mono block">
                                          {product.weight}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="w-full h-20 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                                      <Plus className="w-4 h-4 text-slate-400 mb-0.5" />
                                      <span className="text-[9px] font-bold">Asignar</span>
                                    </div>
                                  )}

                                  {/* Bottom Facing Stepper */}
                                  <div 
                                    className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="text-[9px] font-mono text-slate-400">
                                      R:<strong className="text-slate-700">{facing.facingsExpected}</strong>
                                    </span>

                                    <div className="flex items-center gap-0.5 bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, -1, "imbera_shelf")}
                                        className="w-4 h-4 rounded bg-white text-slate-700 text-[10px] font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                                      >
                                        -
                                      </button>
                                      <span className={`text-[10px] font-mono font-black px-1 ${
                                        isCompliant ? "text-emerald-700" : "text-amber-700"
                                      }`}>
                                        {facing.facingsCurrent}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, 1, "imbera_shelf")}
                                        className="w-4 h-4 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500 flex items-center justify-center cursor-pointer shadow-2xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Red Price Rail that matches the columns exactly */}
                          <div 
                            className="bg-red-700 h-5 rounded-b-lg grid gap-2 px-2 text-[9px] text-white font-mono font-bold shadow-xs border-t border-red-800 items-center"
                            style={{
                              gridTemplateColumns: `repeat(${imberaFacingsPerShelf}, minmax(82px, 1fr))`,
                              minWidth: `${imberaFacingsPerShelf * 86}px`
                            }}
                          >
                            {shelf.facings.map((f, fIdx) => {
                              const p = getProductById(f.skuId);
                              return (
                                <span key={fIdx} className="bg-red-900/80 px-1 py-0.2 rounded text-center truncate border border-red-600/50">
                                  ${p ? p.price.toFixed(0) : "00"}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Imbera Digital Temperature Controller in Lower Kickplate */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-slate-400 text-[10px]">Refrigeración Imbera Eco-Smart</span>
                    </div>

                    <div className="bg-black border border-slate-600 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-inner">
                      <span className="text-[9px] text-slate-500 font-bold">DIGITAL</span>
                      <span className="text-emerald-400 font-bold text-xs tracking-wider">
                        -22.0°C
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER MODEL B: CONGELADOR PUERTA METÁLICA (COFRE / VERTICAL CON CONTRAPUERTA) */}
              {activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR && (
                <div className="space-y-3">
                  <div className={`grid gap-3 ${
                    metalViewSection === "both" ? "grid-cols-1 md:grid-cols-12" : "grid-cols-1"
                  }`}>
                    {/* 1. Main Interior Cabinet (5 o 6 charolas × 5 frentes) */}
                    {(metalViewSection === "both" || metalViewSection === "cabinet") && (
                      <div className={`${metalViewSection === "both" ? "md:col-span-7" : "col-span-12"} bg-white rounded-2xl p-2.5 sm:p-4 shadow-md border-2 border-slate-300 relative`}>
                        {/* Upper Warm Light Canopy */}
                        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 p-2 rounded-xl mb-3 border border-amber-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm animate-pulse" />
                            <strong className="text-amber-950 font-mono text-[10px]">FROST FREE • GABINETE</strong>
                          </div>
                          <span className="text-amber-800 text-[9px] font-bold">
                            {metalShelvesCount} Charolas (5 ftes c/u)
                          </span>
                        </div>

                        {/* Shelves List */}
                        <div className="space-y-3">
                          {metalPlanogram.cabinetShelves.map((shelf) => (
                            <div key={shelf.shelfNumber} className="relative">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1 px-1 font-mono">
                                <span className="text-emerald-800 truncate">{shelf.title}</span>
                                <span className="text-slate-400 bg-slate-50 px-1 py-0.2 rounded border border-slate-200 shrink-0">
                                  Nivel {shelf.shelfNumber}
                                </span>
                              </div>

                              {/* 5 Facings Grid with horizontal scroll on mobile */}
                              <div className="overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-0.5 px-0.5">
                                <div 
                                  className="grid gap-2 bg-slate-50 p-2 rounded-t-xl border border-slate-200 items-end shadow-inner"
                                  style={{
                                    gridTemplateColumns: "repeat(5, minmax(82px, 1fr))",
                                    minWidth: "430px"
                                  }}
                                >
                                  {shelf.facings.map((facing) => {
                                    const product = getProductById(facing.skuId);
                                    const isCompliant = facing.facingsCurrent >= facing.facingsExpected;

                                    return (
                                      <div
                                        key={facing.facingIndex}
                                        className={`relative rounded-xl p-1.5 transition-all flex flex-col justify-between bg-white border cursor-pointer hover:shadow-md min-h-[135px] ${
                                          facing.statusTag === "new"
                                            ? "border-emerald-500 bg-emerald-50/40"
                                            : facing.statusTag === "shelf_change"
                                            ? "border-sky-500 bg-sky-50/40"
                                            : "border-slate-200"
                                        }`}
                                        onClick={() => handleOpenFacingEditor(facing, shelf.shelfNumber, shelf.title, "cabinet")}
                                      >
                                        {product ? (
                                          <>
                                            <div className="w-full h-14 rounded-lg bg-slate-50 p-0.5 flex items-center justify-center overflow-hidden mb-1">
                                              <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <h6 className="font-bold text-[10px] text-slate-900 leading-tight line-clamp-2">
                                                {product.name}
                                              </h6>
                                              <span className="text-[9px] text-slate-400 font-mono block">
                                                {product.weight}
                                              </span>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="w-full h-20 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                                            <Plus className="w-4 h-4 text-slate-400" />
                                            <span className="text-[9px]">Libre</span>
                                          </div>
                                        )}

                                        {/* Quick Stepper */}
                                        <div 
                                          className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, -1, "cabinet")}
                                            className="w-3.5 h-3.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                                          >
                                            -
                                          </button>
                                          <span className={`text-[10px] font-mono font-bold ${
                                            isCompliant ? "text-emerald-700" : "text-amber-700"
                                          }`}>
                                            {facing.facingsCurrent}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, 1, "cabinet")}
                                            className="w-3.5 h-3.5 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500 flex items-center justify-center cursor-pointer"
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* White wire shelf rail */}
                                <div className="h-2 bg-slate-300 rounded-b-md shadow-2xs border-t border-slate-400" style={{ minWidth: "430px" }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Door Shelves (5 o 6 repisas × 4 frentes) */}
                    {(metalViewSection === "both" || metalViewSection === "door") && (
                      <div className={`${metalViewSection === "both" ? "md:col-span-5" : "col-span-12"} bg-slate-50 rounded-2xl p-2.5 sm:p-4 shadow-md border-2 border-slate-300 relative`}>
                        {/* Door Header */}
                        <div className="bg-amber-100/70 p-2 rounded-xl mb-3 border border-amber-300 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <DoorOpen className="w-3.5 h-3.5 text-amber-800" />
                            <strong className="text-amber-950 font-mono text-[10px]">CONTRAPUERTA</strong>
                          </div>
                          <span className="text-amber-900 text-[9px] font-bold">
                            {metalDoorShelvesCount} Repisas (4 ftes c/u)
                          </span>
                        </div>

                        {/* Door Shelves List */}
                        <div className="space-y-3">
                          {metalPlanogram.doorShelves.map((shelf) => (
                            <div key={shelf.shelfNumber} className="relative">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1 px-1 font-mono">
                                <span className="text-amber-900 truncate">{shelf.title}</span>
                                <span className="text-slate-400 bg-white px-1 py-0.2 rounded border border-slate-200 shrink-0">
                                  Rep {shelf.shelfNumber}
                                </span>
                              </div>

                              {/* 4 Facings Molded Plastic Guard with horizontal scroll */}
                              <div className="overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-0.5 px-0.5">
                                <div 
                                  className="grid gap-2 bg-white p-2 rounded-t-xl border border-slate-200 items-end shadow-inner"
                                  style={{
                                    gridTemplateColumns: "repeat(4, minmax(82px, 1fr))",
                                    minWidth: "344px"
                                  }}
                                >
                                  {shelf.facings.map((facing) => {
                                    const product = getProductById(facing.skuId);
                                    const isCompliant = facing.facingsCurrent >= facing.facingsExpected;

                                    return (
                                      <div
                                        key={facing.facingIndex}
                                        className="relative rounded-xl p-1.5 transition-all flex flex-col justify-between bg-slate-50 border border-slate-200 cursor-pointer hover:shadow-md min-h-[135px]"
                                        onClick={() => handleOpenFacingEditor(facing, shelf.shelfNumber, shelf.title, "door")}
                                      >
                                        {product ? (
                                          <>
                                            <div className="w-full h-14 rounded-lg bg-white p-0.5 flex items-center justify-center overflow-hidden mb-1">
                                              <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <h6 className="font-bold text-[10px] text-slate-900 leading-tight line-clamp-2">
                                                {product.name}
                                              </h6>
                                              <span className="text-[9px] text-slate-400 font-mono block">
                                                {product.weight}
                                              </span>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="w-full h-20 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                                            <Plus className="w-4 h-4 text-slate-400" />
                                            <span className="text-[9px]">Libre</span>
                                          </div>
                                        )}

                                        {/* Quick Stepper */}
                                        <div 
                                          className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, -1, "door")}
                                            className="w-3.5 h-3.5 rounded bg-white text-slate-700 text-[10px] font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer border border-slate-200"
                                          >
                                            -
                                          </button>
                                          <span className={`text-[10px] font-mono font-bold ${
                                            isCompliant ? "text-emerald-700" : "text-amber-700"
                                          }`}>
                                            {facing.facingsCurrent}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, 1, "door")}
                                            className="w-3.5 h-3.5 rounded bg-amber-600 text-white text-[10px] font-bold hover:bg-amber-500 flex items-center justify-center cursor-pointer"
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Molded white plastic guard rail */}
                                <div className="h-3 bg-white rounded-b-md shadow-2xs border-t-2 border-slate-300 border-x border-b" style={{ minWidth: "344px" }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: "VER CAMBIOS" */}
          {activeViewMode === "changes" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Resumen de Cambios del Planograma ({changesItems.length} SKUs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Productos nuevos, reubicaciones y bajas respecto a la versión anterior.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {changesItems.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No hay cambios pendientes registrados en este planograma.
                  </div>
                ) : (
                  changesItems.map((item, idx) => {
                    const prod = getProductById(item.skuId);
                    return (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{prod.name} ({prod.weight})</h4>
                            <p className="text-[11px] text-slate-500 font-mono">
                              Ubicación: <strong className="text-slate-800">{item.shelfTitle} • Frente #{item.facingNumber}</strong>
                            </p>
                          </div>
                        </div>

                        {item.statusTag === "new" && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                            + Artículo Nuevo
                          </span>
                        )}
                        {item.statusTag === "shelf_change" && (
                          <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                            Cambio de Charola
                          </span>
                        )}
                        {item.statusTag === "discontinued" && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                            Baja de Planograma
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW MODE 3: "VER DESCRIPTIVO" */}
          {activeViewMode === "descriptive" && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-sm text-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Descriptivo Oficial de Acomodo • {FREEZER_MODEL_CONFIGS[activeModelType].name}
                  </h3>
                  <p className="text-slate-500">
                    Guía de mercadeo visual para maximizar la venta de impulso y rotación en autoservicios y OXXO.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-sky-900 mb-1">
                    {activeModelType === FREEZER_MODEL_TYPES.GLASS_IMBERA ? "Charola 1 (Superior) - Del Chef y Especialidades" : "Nivel Superior de Gabinete - Vegetales La Huerta"}
                  </h4>
                  <p className="text-slate-600">
                    Ubicados a la altura visual prioritaria del cliente para captar la atención con productos de alto margen y empaques atractivos.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-emerald-900 mb-1">
                    Charolas Intermedias - Corazón de la Categoría (Verduras & Mezclas)
                  </h4>
                  <p className="text-slate-600">
                    Brócoli en Floretes, Mezcla California y Chícharo Tierno representan el 65% de la rotación diaria de congelados. Mantener frentes completos sin quiebres.
                  </p>
                </div>

                {activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-1">
                      Anaqueles de Contrapuerta - Jugos Funcionales, Crepas y Snacks
                    </h4>
                    <p className="text-amber-800">
                      Las 4 posiciones por repisa en la contrapuerta facilitan el agarre de bolsas delgadas de Jugo Verde, Smoothies y cajas Del Chef.
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">
                    Charola Base / Fondo - Proteínas Frimart, Papas Francesas y Nuggets
                  </h4>
                  <p className="text-slate-600">
                    Zona de mayor estabilidad térmica para carnes de res, alitas y papas de 750g. Conservar a temperatura de -18°C a -22°C.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audit Compliance & Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Compliance Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cumplimiento de Vistas
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {totalCurrentFacings} / {totalExpectedFacings} ftes
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-mono font-black text-4xl text-slate-900">
                {complianceScore}%
              </span>
              <span className={`text-xs font-bold ${
                complianceScore >= 90 ? "text-emerald-700" : "text-amber-700"
              }`}>
                {complianceScore >= 90 ? "Acomodo Óptimo" : "Faltan frentes"}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${complianceScore}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-sans">Stock Físico</span>
                <strong className="text-slate-800 text-sm">{totalStockUnits} pzas</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-sans">Capacidad Máx</span>
                <strong className="text-slate-800 text-sm">{totalCapacityUnits} pzas</strong>
              </div>
            </div>
          </div>

          {/* Resurtido & Foto de Auditoría */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Auditoría en Punto de Venta</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cajas Resurtidas en esta Tienda:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={restockedBoxes}
                  onChange={(e) => setRestockedBoxes(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-xs font-bold text-slate-500 shrink-0">cajas</span>
              </div>
            </div>

            {/* Photo Capture */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Foto de Evidencia:
              </label>
              {photoEvidence ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 shadow-sm">
                  <img 
                    src={photoEvidence} 
                    alt="Evidencia congelador" 
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => setPhotoEvidence(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-white/90 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                    Certificado GPS
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="tactile-btn w-full border-2 border-dashed border-slate-300 hover:border-emerald-500 p-3.5 rounded-2xl flex flex-col items-center justify-center text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer bg-slate-50"
                >
                  <Camera className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-semibold text-slate-700">Capturar Foto del Congelador</span>
                  <span className="text-[10px] text-slate-400">Verifica frentes y sticker QR</span>
                </button>
              )}
            </div>

            {/* Save Audit Button */}
            <button
              type="button"
              onClick={handleFinishAudit}
              className="tactile-btn w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              {auditSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Auditoría Guardada Exitosamente!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Auditoría del Planograma</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Print & Export Bar */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Exportar o Imprimir:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center gap-1.5 cursor-pointer text-[11px]"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimir Tira</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Facing Edit Modal */}
      <FacingEditModal
        isOpen={editingFacingModal.isOpen}
        onClose={() => setEditingFacingModal(prev => ({ ...prev, isOpen: false }))}
        facingData={editingFacingModal.facingData}
        shelfNumber={editingFacingModal.shelfNumber}
        shelfTitle={editingFacingModal.shelfTitle}
        shelfType={editingFacingModal.shelfType}
        onSaveFacing={handleSaveFacingFromModal}
        onReplicateToShelf={handleReplicateToShelf}
      />

      {/* Real Freezer Camera Capture Modal */}
      <FreezerCameraCaptureModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onCapture={(photoDataUrl) => {
          setPhotoEvidence(photoDataUrl);
          setIsPhotoModalOpen(false);
        }}
        freezerName={freezer?.storeName || "Congelador La Huerta"}
        qrCode={freezer?.qrCode || "FRM-0089"}
      />
    </div>
  );
}
