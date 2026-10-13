import React, { useMemo, useState, useEffect } from "react";
import {
  X, MapPin, QrCode, ChevronLeft, ChevronRight, Check, Camera, Thermometer,
  Lightbulb, DoorClosed, Sparkles, Snowflake, AlertTriangle, ClipboardCheck,
  PackageCheck, Award, Minus, Plus
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  FREEZER_MODEL_TYPES,
  createDefaultMetalDoorPlanogram,
  createDefaultImberaPlanogram,
  getProductById
} from "../../../data/planogramModels";
import { calculateDistanceMeters } from "../../../data/mockData";

/**
 * VISITA GUIADA — flujo de trabajo del vendedor en un punto de venta con congelador
 * 1 Llegada → 2 Conteo inicial → 3 Resurtido → 4 Revisión del equipo → 5 Evidencia y cierre
 * Venta = bolsas surtidas × precio (el vendedor cobra lo que surte).
 */

const STEPS = [
  { id: "arrival", label: "Llegada", icon: MapPin },
  { id: "count", label: "Conteo", icon: ClipboardCheck },
  { id: "restock", label: "Resurtido", icon: PackageCheck },
  { id: "equipment", label: "Equipo", icon: Thermometer },
  { id: "evidence", label: "Evidencia", icon: Camera }
];

const TEMP_MAX_OK = -15; // °C: por encima es alerta

function detectModelType(f) {
  if (!f) return FREEZER_MODEL_TYPES.GLASS_IMBERA;
  if (f.modelType) return f.modelType;
  const m = (f.model || "").toLowerCase();
  return m.includes("metal") || m.includes("cofre") || m.includes("solida")
    ? FREEZER_MODEL_TYPES.METAL_DOOR
    : FREEZER_MODEL_TYPES.GLASS_IMBERA;
}

// Lista plana de charolas (con sección) a partir del registro del congelador
function getShelves(freezer) {
  const type = detectModelType(freezer);
  if (type === FREEZER_MODEL_TYPES.METAL_DOOR) {
    const p = freezer?.metalPlanogram || createDefaultMetalDoorPlanogram(freezer?.shelvesCount === 6 ? 6 : 5, freezer?.doorShelvesCount === 6 ? 6 : 5);
    return [
      ...p.cabinetShelves.map((s) => ({ ...s, section: "cabinet", sectionLabel: "Gabinete", label: `Charola ${s.shelfNumber}` })),
      ...p.doorShelves.map((s) => ({ ...s, section: "door", sectionLabel: "Contrapuerta", label: `Repisa ${s.shelfNumber}` }))
    ];
  }
  const p = freezer?.imberaPlanogram || createDefaultImberaPlanogram(freezer?.shelvesCount === 4 ? 4 : 5, freezer?.facingsPerShelf === 4 ? 4 : 5);
  return p.shelves.map((s) => ({ ...s, section: "imbera_shelf", sectionLabel: "Puerta de vidrio", label: `Charola ${s.shelfNumber}` }));
}

const keyOf = (shelf, facing) => `${shelf.section}-${shelf.shelfNumber}-${facing.facingIndex}`;
const targetOf = (facing) => Math.max(1, (facing.facingsExpected || 1) * (facing.capacityUnits || 8));

// Reduce la foto para no saturar el almacenamiento del celular
function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 800 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.65));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function Stepper({ value, onChange, max, accent = "emerald" }) {
  const accentCls = accent === "sky" ? "bg-sky-600 hover:bg-sky-500" : "bg-emerald-600 hover:bg-emerald-500";
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, (value ?? 0) - 1))}
        className="tap-effect w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer active:scale-95"
        aria-label="Restar"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-['Outfit'] text-xl font-black text-slate-900 tabular-nums">
        {value ?? "–"}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max ?? 999, (value ?? 0) + 1))}
        className={`tap-effect w-10 h-10 rounded-xl text-white flex items-center justify-center cursor-pointer active:scale-95 ${accentCls}`}
        aria-label="Sumar"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function YesNo({ icon: Icon, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[13px] font-semibold text-slate-800 leading-tight">{label}</span>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`tap-effect px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
            value === true ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`tap-effect px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
            value === false ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default function GuidedVisitFlow({ isOpen, freezer, store, sellerLocation, onClose, onComplete }) {
  const shelves = useMemo(() => getShelves(freezer), [freezer]);
  const [step, setStep] = useState(0);
  const [shelfIdx, setShelfIdx] = useState(0);
  const [startedAt] = useState(() => new Date().toISOString());
  const [found, setFound] = useState({});   // bolsas encontradas por frente
  const [left, setLeft] = useState({});     // bolsas que deja por frente
  const [temperature, setTemperature] = useState(Number(freezer?.temperature) || -18);
  const [checks, setChecks] = useState({ thermometer: null, led: null, seals: null, cleaned: null });
  const [frost, setFrost] = useState("bajo");
  const [photo, setPhoto] = useState(null);
  const [gps, setGps] = useState(null);

  useEffect(() => {
    if (!isOpen || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setGps({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }),
      () => setGps(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [isOpen]);

  // Al entrar a resurtido, propone llenar cada frente a lo que pide el planograma
  useEffect(() => {
    if (STEPS[step]?.id !== "restock") return;
    setLeft((prev) => {
      const next = { ...prev };
      shelves.forEach((s) => s.facings.forEach((f) => {
        const k = keyOf(s, f);
        if (next[k] === undefined) next[k] = Math.max(found[k] ?? 0, targetOf(f));
      }));
      return next;
    });
  }, [step]);

  const allFacings = useMemo(
    () => shelves.flatMap((s) => s.facings.map((f) => ({ shelf: s, facing: f, key: keyOf(s, f), product: getProductById(f.skuId), target: targetOf(f) }))),
    [shelves]
  );

  const totals = useMemo(() => {
    let bags = 0, amount = 0, target = 0, filled = 0, foundTotal = 0, empty = 0;
    allFacings.forEach(({ key, product, target: t }) => {
      const fo = found[key] ?? 0;
      const le = left[key] ?? fo;
      const surt = Math.max(0, le - fo);
      bags += surt;
      amount += surt * (product?.price || 0);
      target += t;
      filled += Math.min(le, t);
      foundTotal += fo;
      if (fo === 0) empty += 1;
    });
    return { bags, amount, compliance: target ? Math.round((filled / target) * 100) : 100, foundTotal, empty };
  }, [allFacings, found, left]);

  if (!isOpen || !freezer) return null;

  const currentShelf = shelves[shelfIdx];
  const shelfCounted = (s) => s.facings.every((f) => found[keyOf(s, f)] !== undefined);
  const allCounted = shelves.every(shelfCounted);
  const equipmentDone = Object.values(checks).every((v) => v !== null);
  const tempAlert = Number(temperature) > TEMP_MAX_OK;

  const distanceM = gps && store?.lat ? Math.round(calculateDistanceMeters(gps.lat, gps.lng, store.lat, store.lng)) : null;
  const insideGeofence = distanceM !== null && distanceM <= (store?.geofenceRadius || 200);

  const equipmentScore = (Object.values(checks).filter(Boolean).length / 4) * 0.8 + (tempAlert ? 0 : 0.2);
  const minutes = (Date.now() - new Date(startedAt).getTime()) / 60000;
  const score = Math.round(totals.compliance * 0.4 + equipmentScore * 30 + (photo ? 20 : 0) + (minutes >= 3 ? 10 : 5));

  const canNext =
    (STEPS[step].id === "arrival") ||
    (STEPS[step].id === "count" && allCounted) ||
    (STEPS[step].id === "restock") ||
    (STEPS[step].id === "equipment" && equipmentDone) ||
    (STEPS[step].id === "evidence" && !!photo);

  const goStep = (n) => { setStep(n); setShelfIdx(0); };

  const finish = () => {
    // Planograma actualizado con lo que quedó en cada frente
    const applyLeft = (list, section) => list.map((s) => ({
      ...s,
      facings: s.facings.map((f) => {
        const le = left[`${section}-${s.shelfNumber}-${f.facingIndex}`] ?? f.currentStockUnits;
        return { ...f, currentStockUnits: le, facingsCurrent: le > 0 ? f.facingsExpected || 1 : 0 };
      })
    }));
    const type = detectModelType(freezer);
    let metalPlanogram = null, imberaPlanogram = null;
    if (type === FREEZER_MODEL_TYPES.METAL_DOOR) {
      const base = freezer.metalPlanogram || createDefaultMetalDoorPlanogram(freezer.shelvesCount === 6 ? 6 : 5, freezer.doorShelvesCount === 6 ? 6 : 5);
      metalPlanogram = { ...base, cabinetShelves: applyLeft(base.cabinetShelves, "cabinet"), doorShelves: applyLeft(base.doorShelves, "door") };
    } else {
      const base = freezer.imberaPlanogram || createDefaultImberaPlanogram(freezer.shelvesCount === 4 ? 4 : 5, freezer.facingsPerShelf === 4 ? 4 : 5);
      imberaPlanogram = { ...base, shelves: applyLeft(base.shelves, "imbera_shelf") };
    }

    const lines = allFacings
      .map(({ key, product, facing }) => ({
        skuId: facing.skuId,
        name: product?.name,
        found: found[key] ?? 0,
        left: left[key] ?? found[key] ?? 0,
        restocked: Math.max(0, (left[key] ?? 0) - (found[key] ?? 0)),
        price: product?.price || 0
      }))
      .filter((l) => l.restocked > 0);

    confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } });
    onComplete?.({
      id: `VIS-${Date.now()}`,
      freezerId: freezer.id,
      storeId: freezer.storeId || store?.id,
      storeName: store?.name || freezer.storeName,
      startedAt,
      endedAt: new Date().toISOString(),
      gps,
      distanceM,
      bagsRestocked: totals.bags,
      amount: Math.round(totals.amount * 100) / 100,
      compliance: totals.compliance,
      emptyFacingsFound: totals.empty,
      lines,
      temperature: Number(temperature),
      tempAlert,
      checks: { ...checks, frost },
      photo,
      score,
      metalPlanogram,
      imberaPlanogram
    });
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div className="fixed inset-0 z-[55] bg-slate-50 flex flex-col animate-fade-in">
      {/* Encabezado + progreso */}
      <div className="bg-white border-b border-slate-200 px-4 pt-3 pb-2.5 shadow-xs">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Visita guiada · Paso {step + 1} de 5</span>
              <h2 className="font-['Outfit'] text-base font-black text-slate-900 truncate">{store?.name || freezer.storeName}</h2>
            </div>
            <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer shrink-0" aria-label="Salir de la visita">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${i < step ? "bg-emerald-500" : i === step ? "bg-emerald-600" : "bg-slate-200"}`} />
                <span className={`block text-[9px] mt-1 font-bold text-center ${i === step ? "text-emerald-700" : "text-slate-400"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-4 space-y-3 pb-32">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><StepIcon className="w-4 h-4" /></div>
            <h3 className="font-section-title text-[#0f172a]">
              {["Confirma tu llegada", "¿Cuántas bolsas encontraste?", "Resurte cada frente", "Revisa el congelador", "Foto final y cierre"][step]}
            </h3>
          </div>

          {/* PASO 1: LLEGADA */}
          {STEPS[step].id === "arrival" && (
            <div className="space-y-3">
              <div className="p-4 rounded-[22px] bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700"><MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>{store?.address || "Dirección no registrada"}</span></div>
                <div className="flex items-center gap-2 text-slate-700"><QrCode className="w-4 h-4 text-emerald-600" /><span>Congelador <strong className="font-mono">{freezer.qrCode}</strong> · {detectModelType(freezer) === FREEZER_MODEL_TYPES.METAL_DOOR ? "Puerta metálica" : "Puerta de vidrio (Imbera)"}</span></div>
                <div className={`mt-1 p-2.5 rounded-xl text-[11px] font-semibold ${distanceM === null ? "bg-slate-50 text-slate-500" : insideGeofence ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                  {distanceM === null ? "Obteniendo ubicación GPS…" : insideGeofence ? `✓ Estás en la tienda (${distanceM} m)` : `Estás a ${distanceM} m de la tienda. Puedes continuar; quedará registrado.`}
                </div>
              </div>
              <div className="p-4 rounded-[22px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <strong className="block">Lo que harás en esta visita:</strong>
                <span className="block">1. Contar las bolsas que hay en cada frente.</span>
                <span className="block">2. Resurtir según el planograma (lo surtido es la venta).</span>
                <span className="block">3. Limpiar y revisar el equipo.</span>
                <span className="block">4. Tomar la foto final como evidencia.</span>
              </div>
            </div>
          )}

          {/* PASO 2: CONTEO */}
          {STEPS[step].id === "count" && currentShelf && (
            <div className="space-y-3">
              <ShelfNav shelves={shelves} shelfIdx={shelfIdx} setShelfIdx={setShelfIdx} isDone={shelfCounted} />
              {currentShelf.facings.map((f) => {
                const k = keyOf(currentShelf, f);
                const product = getProductById(f.skuId);
                const v = found[k];
                return (
                  <FacingRow key={k} product={product} facing={f} subtitle={`Objetivo: ${targetOf(f)} bolsas`} state={v === undefined ? "pending" : v === 0 ? "empty" : v < targetOf(f) ? "low" : "full"}>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setFound((p) => ({ ...p, [k]: 0 }))} className={`tap-effect px-2.5 py-2 rounded-xl text-[11px] font-bold border cursor-pointer ${v === 0 ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-700 border-rose-200"}`}>Vacío</button>
                      <Stepper value={v} onChange={(n) => setFound((p) => ({ ...p, [k]: n }))} max={targetOf(f) * 3} accent="sky" />
                    </div>
                  </FacingRow>
                );
              })}
              <ShelfFooter shelves={shelves} shelfIdx={shelfIdx} setShelfIdx={setShelfIdx} ready={shelfCounted(currentShelf)} hint="Cuenta todos los frentes de esta charola para continuar" />
            </div>
          )}

          {/* PASO 3: RESURTIDO */}
          {STEPS[step].id === "restock" && currentShelf && (
            <div className="space-y-3">
              <ShelfNav shelves={shelves} shelfIdx={shelfIdx} setShelfIdx={setShelfIdx} isDone={() => true} />
              {currentShelf.facings.map((f) => {
                const k = keyOf(currentShelf, f);
                const product = getProductById(f.skuId);
                const fo = found[k] ?? 0;
                const le = left[k] ?? fo;
                const surt = Math.max(0, le - fo);
                return (
                  <FacingRow
                    key={k}
                    product={product}
                    facing={f}
                    subtitle={`Había ${fo} · Objetivo ${targetOf(f)}`}
                    state={le >= targetOf(f) ? "full" : le === 0 ? "empty" : "low"}
                    extra={
                      <span className={`text-[11px] font-bold ${surt > 0 ? "text-emerald-700" : "text-slate-400"}`}>
                        {surt > 0 ? `Surtir ${surt} · $${(surt * (product?.price || 0)).toFixed(0)}` : "Sin surtir"}
                      </span>
                    }
                  >
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setLeft((p) => ({ ...p, [k]: Math.max(fo, targetOf(f)) }))} className={`tap-effect px-2.5 py-2 rounded-xl text-[11px] font-bold border cursor-pointer ${le >= targetOf(f) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200"}`}>Lleno</button>
                      <Stepper value={le} onChange={(n) => setLeft((p) => ({ ...p, [k]: Math.max(fo, n) }))} max={targetOf(f) * 3} />
                    </div>
                  </FacingRow>
                );
              })}
              <ShelfFooter shelves={shelves} shelfIdx={shelfIdx} setShelfIdx={setShelfIdx} ready />
            </div>
          )}

          {/* PASO 4: EQUIPO */}
          {STEPS[step].id === "equipment" && (
            <div className="space-y-2.5">
              <div className={`p-4 rounded-[22px] border ${tempAlert ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Temperatura del termómetro</span>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setTemperature((t) => Math.round((Number(t) - 0.5) * 10) / 10)} className="tap-effect w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer"><Minus className="w-5 h-5" /></button>
                  <span className={`font-['Outfit'] text-4xl font-black tabular-nums ${tempAlert ? "text-rose-700" : "text-sky-800"}`}>{Number(temperature).toFixed(1)}°C</span>
                  <button type="button" onClick={() => setTemperature((t) => Math.round((Number(t) + 0.5) * 10) / 10)} className="tap-effect w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer"><Plus className="w-5 h-5" /></button>
                </div>
                {tempAlert && (
                  <p className="mt-2 text-[11px] font-semibold text-rose-700 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Arriba de {TEMP_MAX_OK}°C: se enviará alerta al supervisor.</p>
                )}
              </div>
              <YesNo icon={Thermometer} label="¿El termómetro funciona bien?" value={checks.thermometer} onChange={(v) => setChecks((c) => ({ ...c, thermometer: v }))} />
              <YesNo icon={Lightbulb} label="¿La luz LED funciona?" value={checks.led} onChange={(v) => setChecks((c) => ({ ...c, led: v }))} />
              <YesNo icon={DoorClosed} label="¿La puerta sella bien?" value={checks.seals} onChange={(v) => setChecks((c) => ({ ...c, seals: v }))} />
              <YesNo icon={Sparkles} label="¿Limpiaste el congelador?" value={checks.cleaned} onChange={(v) => setChecks((c) => ({ ...c, cleaned: v }))} />
              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><Snowflake className="w-4 h-4" /></div>
                  <span className="text-[13px] font-semibold text-slate-800">Nivel de escarcha</span>
                </div>
                <div className="flex gap-1.5">
                  {["bajo", "medio", "alto"].map((lvl) => (
                    <button key={lvl} type="button" onClick={() => setFrost(lvl)} className={`flex-1 py-2 rounded-xl text-xs font-bold border capitalize cursor-pointer ${frost === lvl ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>{lvl}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: EVIDENCIA */}
          {STEPS[step].id === "evidence" && (
            <div className="space-y-3">
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await compressImage(f)); }} />
                {photo ? (
                  <div className="relative rounded-[22px] overflow-hidden border-2 border-emerald-400">
                    <img src={photo} alt="Evidencia del congelador" className="w-full max-h-72 object-cover" />
                    <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-bold text-slate-800">Toca para repetir</span>
                  </div>
                ) : (
                  <div className="h-48 rounded-[22px] border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center gap-2 text-emerald-800">
                    <Camera className="w-8 h-8" />
                    <span className="text-sm font-bold">Tomar foto del congelador terminado</span>
                    <span className="text-[11px] text-emerald-700">Puerta abierta, producto acomodado y limpio</span>
                  </div>
                )}
              </label>

              <div className="p-4 rounded-[22px] bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Resumen de la visita</span>
                  <span className="flex items-center gap-1 text-xs font-bold"><Award className="w-4 h-4 text-amber-400" />{score}/100</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <SummaryCell label="Venta (cobrar)" value={`$${totals.amount.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`} highlight />
                  <SummaryCell label="Bolsas surtidas" value={totals.bags} />
                  <SummaryCell label="Planograma" value={`${totals.compliance}%`} />
                  <SummaryCell label="Temperatura" value={`${Number(temperature).toFixed(1)}°C`} alert={tempAlert} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-white border-t border-slate-200 px-4 pt-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="max-w-md mx-auto space-y-2">
          {(STEPS[step].id === "restock" || STEPS[step].id === "evidence") && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{totals.bags} bolsas surtidas</span>
              <strong className="font-['Outfit'] text-base text-emerald-700">${totals.amount.toLocaleString("es-MX", { maximumFractionDigits: 0 })} por cobrar</strong>
            </div>
          )}
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => goStep(step - 1)} className="tap-effect px-4 py-3.5 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold flex items-center gap-1 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />Atrás
              </button>
            )}
            <button
              type="button"
              disabled={!canNext}
              onClick={() => (step === STEPS.length - 1 ? finish() : goStep(step + 1))}
              className="tap-effect flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
            >
              {step === STEPS.length - 1 ? (<><Check className="w-4 h-4" />Finalizar visita</>) :
                step === 0 ? (<>Comenzar conteo<ChevronRight className="w-4 h-4" /></>) :
                (<>Siguiente: {STEPS[step + 1].label}<ChevronRight className="w-4 h-4" /></>)}
            </button>
          </div>
          {!canNext && (
            <p className="text-[11px] text-center text-slate-400">
              {STEPS[step].id === "count" ? "Cuenta todas las charolas para continuar" :
               STEPS[step].id === "equipment" ? "Responde todas las preguntas del equipo" :
               STEPS[step].id === "evidence" ? "Toma la foto final para cerrar la visita" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ShelfNav({ shelves, shelfIdx, setShelfIdx, isDone }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
      {shelves.map((s, i) => (
        <button
          key={`${s.section}-${s.shelfNumber}`}
          type="button"
          onClick={() => setShelfIdx(i)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border cursor-pointer flex items-center gap-1 ${
            i === shelfIdx ? "bg-slate-900 text-white border-slate-900" : isDone(s) ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          {isDone(s) && i !== shelfIdx && <Check className="w-3 h-3" />}
          {s.section === "door" ? `Rep ${s.shelfNumber}` : `Ch ${s.shelfNumber}`}
        </button>
      ))}
    </div>
  );
}

function ShelfFooter({ shelves, shelfIdx, setShelfIdx, ready, hint }) {
  const s = shelves[shelfIdx];
  const isLast = shelfIdx === shelves.length - 1;
  return (
    <div className="pt-1">
      <p className="text-[11px] text-slate-500 text-center mb-2">{s.sectionLabel} · {s.label} ({shelfIdx + 1} de {shelves.length})</p>
      {!isLast && (
        <button
          type="button"
          disabled={!ready}
          onClick={() => { setShelfIdx(shelfIdx + 1); window.scrollTo?.({ top: 0 }); }}
          className="tap-effect w-full py-3 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 text-sm font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          Siguiente charola<ChevronRight className="w-4 h-4" />
        </button>
      )}
      {!ready && hint && <p className="text-[11px] text-center text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function FacingRow({ product, facing, subtitle, state, extra, children }) {
  const stateCls = {
    pending: "border-slate-200",
    empty: "border-rose-300 bg-rose-50/40",
    low: "border-amber-300 bg-amber-50/40",
    full: "border-emerald-300 bg-emerald-50/30"
  }[state];
  return (
    <div className={`p-3 rounded-2xl bg-white border-2 ${stateCls} space-y-2.5`}>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-slate-50 p-1 flex items-center justify-center shrink-0">
          {product?.image ? <img src={product.image} alt={product.name} className="w-full h-full object-contain" /> : <Snowflake className="w-5 h-5 text-slate-300" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400">F{facing.facingNumber ?? facing.facingIndex + 1}</span>
            {facing.statusTag === "new" && <span className="text-[9px] font-black px-1.5 rounded bg-emerald-600 text-white">NUEVO</span>}
            {facing.statusTag === "shelf_change" && <span className="text-[9px] font-black px-1.5 rounded bg-sky-600 text-white">CAMBIO</span>}
          </div>
          <h4 className="text-[13px] font-bold text-slate-900 leading-tight line-clamp-2">{product?.name || "Producto sin asignar"}</h4>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {extra || <span />}
        {children}
      </div>
    </div>
  );
}

function SummaryCell({ label, value, highlight, alert }) {
  return (
    <div className={`p-2.5 rounded-xl ${highlight ? "bg-emerald-600" : "bg-white/10"}`}>
      <span className="block text-[10px] text-white/70 font-semibold">{label}</span>
      <span className={`block font-['Outfit'] text-lg font-black ${alert ? "text-rose-300" : ""}`}>{value}</span>
    </div>
  );
}
