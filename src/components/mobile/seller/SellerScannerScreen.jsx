import React, { useState, useEffect, useRef } from "react";
import { 
  QrCode, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  Zap, 
  Search, 
  Layers, 
  RefreshCw, 
  AlertCircle,
  Snowflake,
  DoorOpen,
  X
} from "lucide-react";
import jsQR from "jsqr";
import AppSelect from "../../ui/AppSelect";
import { FREEZER_MODEL_TYPES } from "../../../data/planogramModels";

function detectModelType(f) {
  if (!f) return FREEZER_MODEL_TYPES.GLASS_IMBERA;
  if (f.modelType) return f.modelType;
  const m = (f.model || "").toLowerCase();
  return m.includes("metal") || m.includes("cofre") || m.includes("solida")
    ? FREEZER_MODEL_TYPES.METAL_DOOR
    : FREEZER_MODEL_TYPES.GLASS_IMBERA;
}

function FreezerTypeChanger({ freezers, onChangeFreezerType }) {
  const [freezerId, setFreezerId] = useState(freezers[0]?.id || "");
  const freezer = freezers.find((f) => f.id === freezerId);
  const currentType = detectModelType(freezer);
  const [modelType, setModelType] = useState(currentType);
  const [shelves, setShelves] = useState(5);
  const [doorShelves, setDoorShelves] = useState(5);
  const [facings, setFacings] = useState(5);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setModelType(currentType);
    setShelves(freezer?.shelvesCount || 5);
    setDoorShelves(freezer?.doorShelvesCount || 5);
    setFacings(freezer?.facingsPerShelf || 5);
  }, [freezerId]);

  if (!freezers.length) return null;
  const isMetal = modelType === FREEZER_MODEL_TYPES.METAL_DOOR;
  const shelfOptions = isMetal ? [5, 6] : [4, 5];

  const pill = (active) =>
    `flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
      active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"
    }`;

  const apply = () => {
    if (!freezer) return;
    onChangeFreezerType(freezer.id, { modelType, shelvesCount: shelves, doorShelvesCount: doorShelves, facingsPerShelf: facings });
    setConfirming(false);
  };

  return (
    <div className="mx-4 p-4 rounded-[22px] bg-white border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-section-title text-[#0f172a]">Cambiar tipo de congelador</h2>
          <p className="text-[11px] text-slate-500">Solo supervisor o superior</p>
        </div>
      </div>

      <AppSelect
        value={freezerId}
        onChange={(e) => setFreezerId(e.target.value)}
        title="Congelador"
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
      >
        {freezers.map((f) => (
          <option key={f.id} value={f.id}>{`${f.qrCode} · ${f.storeName || "Sin tienda"}`}</option>
        ))}
      </AppSelect>

      {freezer && (
        <p className="text-[11px] text-slate-500">
          Tipo actual:{" "}
          <strong className="text-slate-800">
            {currentType === FREEZER_MODEL_TYPES.METAL_DOOR ? "Puerta Metálica" : "Puerta de Vidrio (Imbera)"}
          </strong>
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => { setModelType(FREEZER_MODEL_TYPES.GLASS_IMBERA); setShelves(5); setFacings(5); }}
          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition ${
            !isMetal ? "bg-sky-50 border-sky-500 ring-2 ring-sky-500/20" : "bg-white border-slate-200"
          }`}
        >
          <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-900 leading-tight">Puerta de Vidrio (Imbera)</span>
        </button>
        <button
          type="button"
          onClick={() => { setModelType(FREEZER_MODEL_TYPES.METAL_DOOR); setShelves(5); setDoorShelves(5); }}
          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition ${
            isMetal ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-white border-slate-200"
          }`}
        >
          <DoorOpen className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] font-bold text-slate-900 leading-tight">Puerta Metálica</span>
        </button>
      </div>

      <div className="space-y-2 text-[11px]">
        <div>
          <span className="font-bold text-slate-600 block mb-1">{isMetal ? "Charolas del gabinete" : "Charolas"}</span>
          <div className="flex gap-2">
            {shelfOptions.map((n) => (
              <button key={n} type="button" onClick={() => setShelves(n)} className={pill(shelves === n)}>{n} charolas</button>
            ))}
          </div>
        </div>
        {isMetal ? (
          <div>
            <span className="font-bold text-slate-600 block mb-1">Repisas de contrapuerta</span>
            <div className="flex gap-2">
              {[5, 6].map((n) => (
                <button key={n} type="button" onClick={() => setDoorShelves(n)} className={pill(doorShelves === n)}>{n} repisas</button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <span className="font-bold text-slate-600 block mb-1">Frentes por charola</span>
            <div className="flex gap-2">
              {[4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setFacings(n)} className={pill(facings === n)}>{n} frentes</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {confirming ? (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
          <p className="text-[11px] text-amber-900">
            El planograma de <strong>{freezer?.qrCode}</strong> se reiniciará con el formato de{" "}
            <strong>{isMetal ? "Puerta Metálica" : "Puerta de Vidrio (Imbera)"}</strong>. ¿Continuar?
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
              Cancelar
            </button>
            <button type="button" onClick={apply} className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer">
              Sí, cambiar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="tap-effect w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
        >
          Guardar tipo de congelador
        </button>
      )}
    </div>
  );
}

export default function SellerScannerScreen({
  onCodeDetected,
  onOpenBatchGenerator,
  existingCodes = ["FRM-0089", "FRM-0142", "FRM-0034"],
  pendingEnrollStore = null,
  onCancelEnroll,
  freezers = [],
  canChangeFreezerType = false,
  onChangeFreezerType
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [manualCode, setManualCode] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError("");

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("Navegador sin soporte de video en vivo. Usa el botón de captura nativa.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsCameraActive(true);
        scanLoop();
      }
    } catch (err) {
      console.warn("Live camera error:", err);
      setCameraError("Acceso a cámara en vivo bloqueado. Puedes usar el botón 'Tomar Foto con Cámara Android'.");
    }
  };

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        stopCamera();
        onCodeDetected(code.data.trim().toUpperCase());
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(scanLoop);
  };

  const handleNativeImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          stopCamera();
          onCodeDetected(code.data.trim().toUpperCase());
        } else {
          alert("No se detectó un código QR legible en la fotografía. Intenta tomar la foto más de cerca.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      stopCamera();
      onCodeDetected(manualCode.trim().toUpperCase());
      setManualCode("");
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeImageCapture}
        style={{ display: "none" }}
      />

      {/* Header */}
      <div className="pt-2 px-4">
        <h1 className="font-page-title text-[#0f172a]">
          Escanear Código QR
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Apunta la cámara al sticker metálico en el congelador La Huerta / Frimart
        </p>
      </div>

      {pendingEnrollStore && (
        <div className="mx-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
          <QrCode className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0 text-xs text-emerald-900">
            <strong className="block">Registrando congelador para:</strong>
            <span className="block truncate">{pendingEnrollStore.name}</span>
            <span className="text-[10px] text-emerald-700">Escanea el sticker para capturar ubicación GPS y tipo de congelador.</span>
          </div>
          <button
            type="button"
            onClick={onCancelEnroll}
            className="w-7 h-7 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 cursor-pointer shrink-0"
            aria-label="Cancelar registro"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Camera Live Viewfinder Box */}
      <div className="px-4">
        <div className="relative aspect-square max-h-[300px] w-full rounded-[28px] bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-4 border-slate-900 shadow-xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Target Corners */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-[#059669] rounded-tl-xl pointer-events-none" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-[#059669] rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-[#059669] rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-[#059669] rounded-br-xl pointer-events-none" />

          {/* Animated Laser Scanning Line */}
          {isCameraActive && (
            <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent animate-laser-scan shadow-[0_0_12px_#10b981]" />
          )}

          {/* Viewfinder Bottom Controls */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs px-2 z-10">
            <button
              onClick={() => startCamera()}
              className="tap-effect px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Lector Activo
            </span>
          </div>
        </div>
      </div>

      {cameraError && (
        <div className="mx-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <span>{cameraError}</span>
          </div>
        </div>
      )}

      {/* Button to open native Android Camera app directly */}
      <div className="px-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="tap-effect w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/10"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>Tomar Foto a Código con Cámara Android</span>
        </button>
      </div>

      {/* Manual Input Form */}
      <div className="px-4">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="O escribe el código (ej. FRM-0089)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#e2e8f0] text-xs font-mono uppercase text-slate-800 placeholder-slate-400 outline-none focus:border-[#059669]"
          />
          <button
            type="submit"
            className="tap-effect px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Fast Testing Simulation Pills */}
      <div className="px-4 space-y-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Simular Detección de Código
        </span>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              stopCamera();
              onCodeDetected("FRM-0520");
            }}
            className="tap-effect w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-left cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-emerald-900 font-mono block">QR Virgen: FRM-0520</span>
              <span className="text-[10px] text-emerald-700">Abre Asistente de Alta GPS de Congelador Nuevo</span>
            </div>
            <span className="text-xs font-bold text-emerald-700">Probar ➔</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              onCodeDetected("FRM-0089");
            }}
            className="tap-effect w-full p-3 rounded-2xl bg-sky-50 border border-sky-200 text-left cursor-pointer flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-sky-900 font-mono block">QR Enrolado: FRM-0089</span>
              <span className="text-[10px] text-sky-700">Abre Planograma y Auditoría de Cremería Nueva Benjamín de Alba (Agropecuario AGS)</span>
            </div>
            <span className="text-xs font-bold text-sky-700">Probar ➔</span>
          </button>
        </div>
      </div>

      {canChangeFreezerType && (
        <FreezerTypeChanger freezers={freezers} onChangeFreezerType={onChangeFreezerType} />
      )}
    </div>
  );
}
