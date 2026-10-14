import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  X,
  Check,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  ShieldCheck
} from "lucide-react";

export default function FreezerCameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  freezerName = "Congelador La Huerta",
  qrCode = "",
  gpsCoordinates = null
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  const stopCamera = () => {
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
          facingMode: { ideal: facingMode },
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
      }
    } catch (err) {
      console.warn("Camera start error:", err);
      setCameraError("No se pudo iniciar la cámara en vivo. Toca 'Tomar Foto con Cámara Nativa'.");
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedImage]);

  // Capture frame from live video
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Watermark / timestamp
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    const dateStr = new Date().toLocaleDateString("es-MX") + " " + new Date().toLocaleTimeString();
    ctx.fillText(`FRIMART OS • ${qrCode} • ${dateStr}`, 20, canvas.height - 24);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();

    if (window.navigator?.vibrate) {
      try { window.navigator.vibrate(50); } catch (e) {}
    }
  };

  // Capture from Android Native Camera file input
  const handleNativeFileChange = (e) => {
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

        // Watermark
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        const barHeight = Math.max(60, Math.round(canvas.height * 0.06));
        ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(18, Math.round(barHeight * 0.4))}px monospace`;
        const dateStr = new Date().toLocaleDateString("es-MX") + " " + new Date().toLocaleTimeString();
        ctx.fillText(`FRIMART OS • ${qrCode} • ${dateStr}`, 20, canvas.height - Math.round(barHeight * 0.35));

        const finalUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCapturedImage(finalUrl);
        stopCamera();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-4 sm:p-5 w-full max-w-sm shadow-2xl relative text-white space-y-3.5">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleNativeFileChange}
          style={{ display: "none" }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            setCapturedImage(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Auditoría de Planograma La Huerta
          </div>
          <h3 className="text-base font-bold font-['Outfit'] text-white">
            Capturar Foto del Congelador
          </h3>
          <p className="text-xs text-slate-400">
            {freezerName} • Sticker: <strong className="text-emerald-400 font-mono">{qrCode}</strong>
          </p>
        </div>

        {/* Viewfinder or Captured Image */}
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-black overflow-hidden border-2 border-emerald-500/60 shadow-inner flex items-center justify-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Foto capturada"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />

              {/* Freezer Guide Grid Lines */}
              <div className="absolute inset-4 border border-white/30 rounded-xl pointer-events-none flex flex-col justify-between">
                <div className="h-1/3 border-b border-dashed border-white/20" />
                <div className="h-1/3 border-b border-dashed border-white/20" />
              </div>

              {/* Sticker QR Targeting Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-300 border border-emerald-400/40">
                Sticker: {qrCode}
              </div>

              {/* Bottom live camera toolbar */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs cursor-pointer"
                  title="Girar cámara"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* Big Shutter Button */}
                <button
                  type="button"
                  onClick={handleSnap}
                  className="tap-effect w-14 h-14 rounded-full bg-white hover:bg-slate-200 border-4 border-emerald-500 shadow-xl flex items-center justify-center cursor-pointer active:scale-90 transition"
                  title="Tomar foto ahora"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-emerald-400 text-xs cursor-pointer"
                  title="Abrir cámara Android"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Camera error message if any */}
        {cameraError && !capturedImage && (
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Buttons / Actions */}
        {capturedImage ? (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleRetake}
              className="tap-effect flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Repetir Foto
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="tap-effect flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Usar Esta Foto
            </button>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tap-effect w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Tomar Foto con Cámara Nativa Android</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              La fotografía se estampa automáticamente con sello GPS y hora de visita.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
