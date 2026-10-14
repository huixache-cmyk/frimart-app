import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  X,
  AlertCircle,
  Zap,
  RefreshCw
} from "lucide-react";
import jsQR from "jsqr";

export default function QRScannerModal({ 
  isOpen, 
  onClose, 
  onCodeDetected,
  existingFreezerCodes = []
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(null); // null = unknown, true = granted, false = denied
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [activeFacingMode, setActiveFacingMode] = useState("environment");

  // Play audio beep when QR is detected
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}

    if (window.navigator?.vibrate) {
      try { window.navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    stopCamera();
    setErrorMessage("");

    if (!navigator?.mediaDevices?.getUserMedia) {
      setHasCameraPermission(false);
      setErrorMessage("Tu navegador no soporta acceso directo a la cámara. Usa el botón 'Tomar Foto'.");
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: activeFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setHasCameraPermission(true);
        setIsScanning(true);
        scanFrame();
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      setHasCameraPermission(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Permiso de cámara denegado. Concede permisos en tu navegador o usa el botón 'Tomar Foto con Cámara'.");
      } else {
        setErrorMessage("No se pudo iniciar el stream de video. Usa el botón 'Tomar Foto con Cámara'.");
      }
    }
  };

  // Continuous frame scanner using jsQR + BarcodeDetector
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isOpen) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      if (code && code.data) {
        const detected = code.data.trim().toUpperCase();
        playBeep();
        stopCamera();
        onCodeDetected(detected);
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Process image captured from native camera input
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
          playBeep();
          stopCamera();
          onCodeDetected(code.data.trim().toUpperCase());
        } else {
          alert("No se detectó un código QR legible en la foto. Intenta enfocar más de cerca o escribe el código manualmente.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Toggle flashlight if supported
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && track.getCapabilities && track.getCapabilities().torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch (e) {}
    }
  };

  // Toggle front/back camera
  const handleFlipCamera = () => {
    setActiveFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeFacingMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-5 w-full max-w-sm shadow-2xl relative text-white space-y-3.5">
        {/* Hidden Canvas and Native File Input */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleNativeImageCapture}
          style={{ display: "none" }}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold mb-1.5">
            <Camera className="w-3.5 h-3.5" />
            Cámara Activa en Vivo
          </div>
          <h3 className="text-lg font-bold font-['Outfit'] text-white">
            Escanear Sticker QR
          </h3>
          <p className="text-xs text-slate-400">
            Apunta la cámara al sticker metálico del congelador
          </p>
        </div>

        {/* Video Viewfinder Container */}
        <div className="relative aspect-square w-full rounded-2xl bg-black overflow-hidden border-2 border-emerald-500/50 shadow-inner flex items-center justify-center">
          {/* Live Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Viewfinder Overlay with Target Corners */}
          <div className="absolute inset-6 border border-emerald-500/30 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-5 h-5 border-t-3 border-l-3 border-emerald-400 rounded-tl-md"></span>
              <span className="w-5 h-5 border-t-3 border-r-3 border-emerald-400 rounded-tr-md"></span>
            </div>
            <div className="flex justify-between">
              <span className="w-5 h-5 border-b-3 border-l-3 border-emerald-400 rounded-bl-md"></span>
              <span className="w-5 h-5 border-b-3 border-r-3 border-emerald-400 rounded-br-md"></span>
            </div>
          </div>

          {/* Animated Laser Scanning Beam */}
          {isScanning && (
            <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser-scan shadow-[0_0_12px_#34d399]" />
          )}

          {/* Floating Controls Inside Video */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs px-2 z-10 pointer-events-auto">
            <button
              onClick={handleFlipCamera}
              className="tap-effect px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Girar
            </button>

            <button
              onClick={handleToggleTorch}
              className={`tap-effect px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition ${
                torchOn ? "bg-amber-400 text-slate-950 font-bold" : "bg-black/60 hover:bg-black/80 text-white"
              }`}
            >
              <Zap className="w-3 h-3" />
              Flash
            </button>
          </div>
        </div>

        {/* Error message or Permission Denied Helper */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-[11px] text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Fallback Native Camera Button: ALWAYS works on any Android phone */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="tap-effect w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>Tomar Foto con Cámara Nativa Android</span>
        </button>

        {/* Manual Input Backup */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualCode.trim()) {
              playBeep();
              stopCamera();
              onCodeDetected(manualCode.trim().toUpperCase());
            }
          }}
          className="pt-1 flex gap-2"
        >
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="O escribe el folio del sticker"
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="tap-effect px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            OK
          </button>
        </form>

      </div>
    </div>
  );
}
