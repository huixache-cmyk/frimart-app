import React, { useState, useEffect } from "react";
import { 
  QrCode, 
  MapPin, 
  Store, 
  Thermometer, 
  Sliders, 
  CheckCircle, 
  Camera, 
  AlertTriangle, 
  X, 
  Check, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Snowflake,
  DoorOpen
} from "lucide-react";
import confetti from "canvas-confetti";

import { 
  FREEZER_MODEL_TYPES, 
  FREEZER_MODEL_CONFIGS, 
  createDefaultMetalDoorPlanogram, 
  createDefaultImberaPlanogram 
} from "../data/planogramModels";
import AppSelect from "./ui/AppSelect";

export default function FreezerOnboardingModal({ 
  isOpen, 
  onClose, 
  scannedCode, 
  qrCode,
  currentGps = { lat: 21.1482, lng: -86.8398, accuracy: 8 }, 
  stores = [], 
  onSaveNewFreezer,
  onSave,
  initialStoreId
}) {
  const activeCode = scannedCode || qrCode || "FRM-0520";
  const saveCallback = onSave || onSaveNewFreezer;
  const storeHasNoFreezer = (s) => !(s.freezerCount || s.freezersCount);

  // Form states
  const [selectedStoreId, setSelectedStoreId] = useState(initialStoreId || stores.find(storeHasNoFreezer)?.id || stores[0]?.id || "custom");
  const [customStoreName, setCustomStoreName] = useState("");
  const [customStoreAddress, setCustomStoreAddress] = useState("");
  
  // Model state: Imbera Glass vs Metal Door
  const [modelType, setModelType] = useState(FREEZER_MODEL_TYPES.GLASS_IMBERA);
  const [shelvesCount, setShelvesCount] = useState(5);
  const [doorShelvesCount, setDoorShelvesCount] = useState(5);
  const [imberaFacings, setImberaFacings] = useState(5);
  const [temperature, setTemperature] = useState(-22.0);
  const [conditions, setConditions] = useState({
    compressor: true,
    doorSeals: true,
    ledLighting: true,
    frostLevel: "bajo", // 'bajo' | 'medio' | 'alto'
    cleanliness: "excelente" // 'excelente' | 'bueno' | 'regular'
  });
  const [photoEvidence, setPhotoEvidence] = useState("https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80");

  // Al abrir con otra tienda preseleccionada, sincronizarla
  useEffect(() => {
    if (isOpen && initialStoreId) setSelectedStoreId(initialStoreId);
  }, [isOpen, initialStoreId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let storeName = "";
    let storeId = selectedStoreId;

    if (selectedStoreId === "custom") {
      storeName = customStoreName || "Punto de Venta Independiente";
      storeId = `STORE-${Date.now()}`;
    } else {
      const found = stores.find(s => s.id === selectedStoreId);
      storeName = found?.name || "Tienda Comercial";
    }

    const isMetal = modelType === FREEZER_MODEL_TYPES.METAL_DOOR;
    const modelConfig = FREEZER_MODEL_CONFIGS[modelType];

    const metalPlanogram = isMetal ? createDefaultMetalDoorPlanogram(shelvesCount, doorShelvesCount) : null;
    const imberaPlanogram = !isMetal ? createDefaultImberaPlanogram(shelvesCount, imberaFacings) : null;

    const newFreezerObject = {
      id: activeCode,
      qrCode: activeCode,
      storeId,
      storeName,
      model: modelConfig.name,
      modelType,
      brand: modelConfig.brand,
      serialNumber: `VFR-2026-${activeCode.replace("FRM-", "")}`,
      capacityPcs: isMetal ? (shelvesCount * 40 + doorShelvesCount * 24) : (shelvesCount * imberaFacings * 10),
      currentStock: isMetal ? (shelvesCount * 35 + doorShelvesCount * 20) : (shelvesCount * imberaFacings * 8),
      temperature: Number(temperature),
      shelvesCount,
      doorShelvesCount: isMetal ? doorShelvesCount : 0,
      facingsPerShelf: isMetal ? 5 : imberaFacings,
      installedAt: new Date().toISOString(),
      lastAuditedAt: new Date().toISOString(),
      locationCoordinates: {
        lat: currentGps.lat,
        lng: currentGps.lng,
        accuracy: currentGps.accuracy
      },
      conditions: {
        compressor: conditions.compressor ? "Optimo" : "Falla",
        doorSeals: conditions.doorSeals ? "Hermético" : "Desgaste",
        ledLighting: conditions.ledLighting ? "100% Funcional" : "Apagada",
        frostLevel: conditions.frostLevel,
        cleanliness: conditions.cleanliness
      },
      metalPlanogram,
      imberaPlanogram,
      photoUrl: photoEvidence
    };

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });

    if (saveCallback) {
      saveCallback(newFreezerObject);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-2xl shadow-2xl my-8 relative text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Asistente de Enrolamiento de Congelador
              </h3>
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                Alta con GPS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Asocia el sticker físico recién adherido al punto de venta y captura sus especificaciones técnicas
            </p>
          </div>
        </div>

        {/* GPS Coordinates Bar */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between mb-5 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-mono">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>GPS Capturado: <strong className="text-slate-900">{currentGps.lat.toFixed(4)}° N, {Math.abs(currentGps.lng).toFixed(4)}° W</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-mono">Precisión: ±{currentGps.accuracy}m</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-emerald-200">
              FOLIO: {activeCode}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Store Assignment */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Tienda / Punto de Venta Asignado
            </label>
            <AppSelect
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-sky-500 transition cursor-pointer font-medium"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.address}) - {storeHasNoFreezer(s) ? "Sin congelador" : `${s.freezerCount || s.freezersCount} congelador`}
                </option>
              ))}
              <option value="custom">+ Registrar Tienda Nueva en esta ubicación GPS</option>
            </AppSelect>

            {selectedStoreId === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Nombre de la nueva tienda"
                  value={customStoreName}
                  onChange={(e) => setCustomStoreName(e.target.value)}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="Dirección comercial"
                  value={customStoreAddress}
                  onChange={(e) => setCustomStoreAddress(e.target.value)}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Section 2: Technical Specifications & Initial Hardware Setup */}
          <div className="space-y-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Configuración Única de Charolas y Frentes
              </label>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                Se define solo al dar de alta
              </span>
            </div>

            {/* Model Selection Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setModelType(FREEZER_MODEL_TYPES.GLASS_IMBERA);
                  setShelvesCount(5);
                  setImberaFacings(5);
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                  modelType === FREEZER_MODEL_TYPES.GLASS_IMBERA
                    ? "bg-sky-50/80 border-sky-500 shadow-xs ring-2 ring-sky-500/30"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  modelType === FREEZER_MODEL_TYPES.GLASS_IMBERA ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  <Snowflake className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-slate-900 block font-['Outfit']">
                    Puerta de Vidrio (Imbera)
                  </strong>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    Cristal translúcido. 4 o 5 charolas (4 o 5 frentes cada una).
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModelType(FREEZER_MODEL_TYPES.METAL_DOOR);
                  setShelvesCount(5);
                  setDoorShelvesCount(5);
                }}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                  modelType === FREEZER_MODEL_TYPES.METAL_DOOR
                    ? "bg-emerald-50/80 border-emerald-500 shadow-xs ring-2 ring-emerald-500/30"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  modelType === FREEZER_MODEL_TYPES.METAL_DOOR ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  <DoorOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <strong className="text-xs text-slate-900 block font-['Outfit']">
                    Puerta Metálica (Cofre / Vertical)
                  </strong>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    Gabinete 5 o 6 charolas (5 ftes) + Contrapuerta 5 o 6 repisas (4 ftes).
                  </span>
                </div>
              </button>
            </div>

            {/* Hardware Options per Model */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 space-y-2.5">
              {modelType === FREEZER_MODEL_TYPES.METAL_DOOR ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                      Charolas Interiores (Gabinete):
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShelvesCount(5)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          shelvesCount === 5 ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        5 Charolas (25 frentes)
                      </button>
                      <button
                        type="button"
                        onClick={() => setShelvesCount(6)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          shelvesCount === 6 ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        6 Charolas (30 frentes)
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-900 block mb-1">
                      Repisas en Contrapuerta:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDoorShelvesCount(5)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          doorShelvesCount === 5 ? "bg-amber-600 text-white border-amber-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        5 Repisas (20 frentes)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDoorShelvesCount(6)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          doorShelvesCount === 6 ? "bg-amber-600 text-white border-amber-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        6 Repisas (24 frentes)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-sky-900 block mb-1">
                      Número de Charolas:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShelvesCount(4)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          shelvesCount === 4 ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        4 Charolas
                      </button>
                      <button
                        type="button"
                        onClick={() => setShelvesCount(5)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          shelvesCount === 5 ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        5 Charolas (Estándar)
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-sky-900 block mb-1">
                      Frentes por Charola:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setImberaFacings(4)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          imberaFacings === 4 ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        4 Frentes por charola
                      </button>
                      <button
                        type="button"
                        onClick={() => setImberaFacings(5)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          imberaFacings === 5 ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        5 Frentes por charola
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Calculation Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">
                  Total de Frentes a Auditar: <strong className="text-slate-900">{modelType === FREEZER_MODEL_TYPES.METAL_DOOR ? (shelvesCount * 5 + doorShelvesCount * 4) : (shelvesCount * imberaFacings)} ftes</strong>
                </span>
                <span className="text-emerald-700 font-bold">
                  Capacidad: {modelType === FREEZER_MODEL_TYPES.METAL_DOOR ? (shelvesCount * 40 + doorShelvesCount * 24) : (shelvesCount * imberaFacings * 10)} bolsas
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Physical Condition Checklist */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Verificación de Operatividad y Mantenimiento
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <label className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                conditions.compressor ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <span>Compresor OK</span>
                <input 
                  type="checkbox" 
                  checked={conditions.compressor} 
                  onChange={(e) => setConditions(c => ({ ...c, compressor: e.target.checked }))}
                  className="rounded text-emerald-600"
                />
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                conditions.doorSeals ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <span>Sellos Herméticos</span>
                <input 
                  type="checkbox" 
                  checked={conditions.doorSeals} 
                  onChange={(e) => setConditions(c => ({ ...c, doorSeals: e.target.checked }))}
                  className="rounded text-emerald-600"
                />
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                conditions.ledLighting ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <span>Luz LED Interna</span>
                <input 
                  type="checkbox" 
                  checked={conditions.ledLighting} 
                  onChange={(e) => setConditions(c => ({ ...c, ledLighting: e.target.checked }))}
                  className="rounded text-emerald-600"
                />
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="tactile-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="tactile-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar y Enrolar Congelador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
