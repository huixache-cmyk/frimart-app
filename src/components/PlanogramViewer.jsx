import React, { useState, useEffect, useMemo, useRef } from "react";
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
  onSaveAudit,
  onPlanogramChange
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

  // Persistencia inmediata: cada edición del usuario se envía al estado global
  const dirtyRef = useRef(false);
  const updateMetal = (fn) => { dirtyRef.current = true; setMetalPlanogram(fn); };
  const updateImbera = (fn) => { dirtyRef.current = true; setImberaPlanogram(fn); };

  useEffect(() => {
    if (!dirtyRef.current || !freezer?.id) return;
    dirtyRef.current = false;
    onPlanogramChange?.(freezer.id, {
      metalPlanogram: activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR ? metalPlanogram : null,
      imberaPlanogram: activeModelType === FREEZER_MODEL_TYPES.GLASS_IMBERA ? imberaPlanogram : null
    });
  }, [metalPlanogram, imberaPlanogram]);

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
      updateMetal(prev => {
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
      updateImbera(prev => ({
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
      updateMetal(prev => {
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
      updateImbera(prev => ({
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
      updateMetal(prev => {
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
      updateImbera(prev => ({
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

              {/* RENDER UNIFICADO: mismo estilo de tarjeta clara para todos los modelos de congelador */}
              {(() => {
                const STATUS_BADGES = {
                  new: { label: "NUEVO", cls: "bg-emerald-600", card: "border-emerald-500 ring-1 ring-emerald-500/30" },
                  shelf_change: { label: "CAMBIO", cls: "bg-sky-600", card: "border-sky-500 ring-1 ring-sky-500/30" },
                  discontinued: { label: "SALIÓ", cls: "bg-rose-600", card: "border-rose-400 bg-rose-50/50 opacity-60" },
                };

                const renderFacingCard = (facing, shelf, section) => {
                  const product = getProductById(facing.skuId);
                  const isCompliant = facing.facingsCurrent >= facing.facingsExpected;
                  const badge = STATUS_BADGES[facing.statusTag];

                  return (
                    <div
                      key={facing.facingIndex}
                      className={`group relative rounded-xl p-1.5 transition-all flex flex-col justify-between bg-white border cursor-pointer hover:shadow-md min-h-[150px] ${
                        badge ? badge.card : "border-slate-200"
                      }`}
                      onClick={() => handleOpenFacingEditor(facing, shelf.shelfNumber, shelf.title, section)}
                    >
                      {badge && (
                        <span className={`absolute -top-1.5 left-1.5 ${badge.cls} text-white text-[7px] font-black px-1.5 py-0.2 rounded shadow-2xs z-10`}>
                          {badge.label}
                        </span>
                      )}

                      <span className="absolute top-1 right-1 text-[8px] font-mono text-slate-400 font-bold">
                        F{facing.facingNumber ?? facing.facingIndex + 1}
                      </span>

                      {product ? (
                        <>
                          <div className="w-full h-14 rounded-lg bg-slate-50 p-1 flex items-center justify-center overflow-hidden mb-1">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-2xs" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-[10px] text-slate-900 leading-tight line-clamp-2">{product.name}</h5>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] text-slate-400 font-mono">{product.weight}</span>
                              <span className="text-[10px] font-mono font-black text-emerald-800">
                                ${Number(product.price || 0).toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-20 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                          <Plus className="w-4 h-4 text-slate-400 mb-0.5" />
                          <span className="text-[9px] font-bold">Asignar</span>
                        </div>
                      )}

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
                            onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, -1, section)}
                            className="w-4 h-4 rounded bg-white text-slate-700 text-[10px] font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                          >
                            -
                          </button>
                          <span className={`text-[10px] font-mono font-black px-1 ${isCompliant ? "text-emerald-700" : "text-amber-700"}`}>
                            {facing.facingsCurrent}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickFacingChange(shelf.shelfNumber, facing.facingIndex, 1, section)}
                            className="w-4 h-4 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500 flex items-center justify-center cursor-pointer shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                };

                const renderShelfRow = (shelf, section, columns, tagLabel, total) => {
                  const minWidth = `${columns * 86}px`;
                  return (
                    <div key={shelf.shelfNumber} className="relative">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1 px-1 font-mono">
                        <span className="text-emerald-800 truncate">{shelf.title}</span>
                        <span className="text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                          {tagLabel} {shelf.shelfNumber}/{total}
                        </span>
                      </div>
                      <div className="overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-0.5 px-0.5">
                        <div
                          className="grid gap-2 bg-slate-50 p-2 rounded-t-xl border border-slate-200 items-end shadow-inner"
                          style={{ gridTemplateColumns: `repeat(${columns}, minmax(82px, 1fr))`, minWidth }}
                        >
                          {shelf.facings.map((facing) => renderFacingCard(facing, shelf, section))}
                        </div>
                        <div className="h-2 bg-slate-300 rounded-b-md shadow-2xs border-t border-slate-400" style={{ minWidth }} />
                      </div>
                    </div>
                  );
                };

                const renderSectionCard = ({ key, title, subtitle, icon, extra, children, span }) => (
                  <div key={key} className={`${span} bg-white rounded-2xl p-2.5 sm:p-4 shadow-md border-2 border-slate-300 relative`}>
                    <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 p-2 rounded-xl mb-3 border border-amber-200 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {icon}
                        <strong className="text-amber-950 font-mono text-[10px] truncate">{title}</strong>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-amber-800 text-[9px] font-bold">{subtitle}</span>
                        {extra}
                      </div>
                    </div>
                    <div className="space-y-3">{children}</div>
                  </div>
                );

                const statusDot = <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm animate-pulse shrink-0" />;

                if (activeModelType === FREEZER_MODEL_TYPES.GLASS_IMBERA) {
                  return renderSectionCard({
                    key: "imbera",
                    span: "",
                    title: "PUERTA DE VIDRIO • IMBERA VR",
                    subtitle: `${imberaShelvesCount} Charolas (${imberaFacingsPerShelf} ftes c/u)`,
                    icon: statusDot,
                    extra: (
                      <span className="flex items-center gap-1 bg-white border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-800">
                        <QrCode className="w-3 h-3" />
                        {freezer?.qrCode || "FRM-0089"}
                      </span>
                    ),
                    children: imberaPlanogram.shelves.map((shelf) =>
                      renderShelfRow(shelf, "imbera_shelf", imberaFacingsPerShelf, "Ch", imberaShelvesCount)
                    ),
                  });
                }

                if (activeModelType === FREEZER_MODEL_TYPES.METAL_DOOR) {
                  const both = metalViewSection === "both";
                  return (
                    <div className="space-y-3">
                      <div className={`grid gap-3 ${both ? "grid-cols-1 md:grid-cols-12" : "grid-cols-1"}`}>
                        {(both || metalViewSection === "cabinet") &&
                          renderSectionCard({
                            key: "cabinet",
                            span: both ? "md:col-span-7" : "col-span-12",
                            title: "PUERTA METÁLICA • GABINETE",
                            subtitle: `${metalShelvesCount} Charolas (5 ftes c/u)`,
                            icon: statusDot,
                            children: metalPlanogram.cabinetShelves.map((shelf) =>
                              renderShelfRow(shelf, "cabinet", 5, "Ch", metalShelvesCount)
                            ),
                          })}
                        {(both || metalViewSection === "door") &&
                          renderSectionCard({
                            key: "door",
                            span: both ? "md:col-span-5" : "col-span-12",
                            title: "PUERTA METÁLICA • CONTRAPUERTA",
                            subtitle: `${metalDoorShelvesCount} Repisas (4 ftes c/u)`,
                            icon: <DoorOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />,
                            children: metalPlanogram.doorShelves.map((shelf) =>
                              renderShelfRow(shelf, "door", 4, "Rep", metalDoorShelvesCount)
                            ),
                          })}
                      </div>
                    </div>
                  );
                }

                return null;
              })()}
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
