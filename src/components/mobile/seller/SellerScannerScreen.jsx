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
  Snowflake
} from "lucide-react";
import jsQR from "jsqr";

export default function SellerScannerScreen({
  onCodeDetected,
  onOpenBatchGenerator,
  existingCodes = ["FRM-0089", "FRM-0142", "FRM-0034"]
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
          className="tap-effect w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/10"
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
    </div>
  );
}
