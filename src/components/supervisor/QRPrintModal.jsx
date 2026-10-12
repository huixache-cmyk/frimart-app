import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Printer,
  Wifi,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  FileText
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QRPrintModal({
  isOpen,
  onClose,
  qrBatch = [],
  enrolledMap = {},
  initialScope = "full_sheet", // 'full_sheet' | 'selected' | 'single'
  initialSelectedCodes = [],
  currentPageItems = []
}) {
  // Print Mode / Scope: 'full_sheet' | 'selected' | 'single'
  const [printScope, setPrintScope] = useState(initialScope);
  const [selectedCodes, setSelectedCodes] = useState(initialSelectedCodes);
  const [singleCode, setSingleCode] = useState(initialSelectedCodes[0] || (currentPageItems[0]?.code) || "");
  const [copiesCount, setCopiesCount] = useState(1);

  // Resultado real del diálogo de impresión del sistema (evento afterprint)
  const [printSuccessFeedback, setPrintSuccessFeedback] = useState(null);

  // Plataforma real del dispositivo para mostrar instrucciones correctas
  const platform = useMemo(() => {
    if (typeof navigator === "undefined") return "other";
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "other";
  }, []);

  // Sync initial scope and selection when opening
  useEffect(() => {
    if (isOpen) {
      setPrintScope(initialScope);
      if (initialSelectedCodes.length > 0) {
        setSelectedCodes(initialSelectedCodes);
        setSingleCode(initialSelectedCodes[0]);
      } else if (currentPageItems.length > 0) {
        setSingleCode(currentPageItems[0].code);
      }
      setPrintSuccessFeedback(null);
    }
  }, [isOpen, initialScope, initialSelectedCodes]);

  // Determine items to print based on selected scope
  const itemsToPrint = useMemo(() => {
    if (printScope === "single") {
      // Solo folios reales existentes en el lote cargado
      const item = qrBatch.find(q => q.code === singleCode.trim());
      if (!item) return [];
      return Array(copiesCount).fill(item);
    }

    if (printScope === "selected") {
      return qrBatch.filter(q => selectedCodes.includes(q.code));
    }

    // Default: 'full_sheet' -> 24 items of the current page or first 24
    if (currentPageItems.length > 0) {
      return currentPageItems;
    }
    return qrBatch.slice(0, 24);
  }, [printScope, singleCode, copiesCount, selectedCodes, currentPageItems, qrBatch]);

  // Execute Print
  // Abre el servicio de impresión real del sistema operativo:
  // Android -> Servicio de impresión (Mopria / HP Print Service Plugin) detecta impresoras WiFi de la red.
  // iPhone  -> AirPrint detecta impresoras compatibles en la misma red WiFi.
  const handleExecutePrint = () => {
    if (itemsToPrint.length === 0) return;
    const count = itemsToPrint.length;
    const onAfterPrint = () => {
      window.removeEventListener("afterprint", onAfterPrint);
      // El navegador no informa si se imprimió o se canceló; solo que el diálogo se cerró.
      setPrintSuccessFeedback({ count });
    };
    window.addEventListener("afterprint", onAfterPrint);
    window.print();
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* 1. INTERACTIVE CONFIGURATION MODAL (Light Corporate Theme) */}
      <div className="frimart-print-ui fixed inset-0 z-[99999] flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 bg-slate-900/35 backdrop-blur-xs animate-fade-in font-sans">
        <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-white sm:rounded-[26px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-slate-200">
          
          {/* Header (Corporate Emerald) */}
          <div className="pt-10 sm:pt-4 pb-3.5 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 via-[#059669] to-teal-700 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Printer className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight truncate">
                  Imprimir Planilla de Stickers QR
                </h2>
                <p className="text-[11px] text-emerald-100 font-medium truncate">
                  Búsqueda de impresora cercana y configuración de etiquetas
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center text-white transition cursor-pointer shrink-0"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {/* Feedback Banner if print was submitted */}
            {printSuccessFeedback && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-extrabold block text-emerald-950">
                    Diálogo de impresión cerrado
                  </span>
                  <span className="text-emerald-800">
                    Se prepararon {printSuccessFeedback.count} etiquetas. Verifica en la impresora que salió la hoja.
                  </span>
                </div>
              </div>
            )}

            {/* SECCIÓN 1: IMPRESORA (detectada por el servicio de impresión real del sistema) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  Impresora WiFi de tu CEDIS
                </h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Al presionar <strong>Imprimir</strong> se abre el servicio de impresión de tu teléfono, que busca las
                impresoras disponibles en la red WiFi donde estás conectado. Elige ahí la impresora de tu zona.
              </p>
              {platform === "android" && (
                <p className="text-[10.5px] text-slate-500 flex gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <span>Android: si no aparece la impresora, activa en Ajustes › Dispositivos conectados › Impresión el "Servicio de impresión predeterminado" o instala "HP Print Service Plugin" / "Mopria".</span>
                </p>
              )}
              {platform === "ios" && (
                <p className="text-[10.5px] text-slate-500 flex gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <span>iPhone: la impresora debe ser compatible con AirPrint y estar en la misma red WiFi. Toca "Seleccionar impresora" en el menú.</span>
                </p>
              )}
            </div>

            {/* SECCIÓN 2: OPCIÓN DE IMPRESIÓN (1 QR, VARIOS QR O TODA LA PLANILLA) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¿Qué deseas imprimir?</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Total a imprimir: <strong>{itemsToPrint.length}</strong> etiquetas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Opción 1: Toda la Planilla */}
                <button
                  type="button"
                  onClick={() => setPrintScope("full_sheet")}
                  className={`tap-effect p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                    printScope === "full_sheet"
                      ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        Toda la Planilla
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        24 QR
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Hoja completa A4 en cuadrícula 3x8 de folios consecutivos.
                    </p>
                  </div>
                  <span className={`text-[10px] font-extrabold ${printScope === "full_sheet" ? "text-emerald-700" : "text-slate-400"}`}>
                    ✓ Planilla estándar
                  </span>
                </button>

                {/* Opción 2: Varios QR Seleccionados */}
                <button
                  type="button"
                  onClick={() => setPrintScope("selected")}
                  className={`tap-effect p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                    printScope === "selected"
                      ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        Varios QR Seleccionados
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {selectedCodes.length > 0 ? `${selectedCodes.length} QR` : "Elegir"}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      {selectedCodes.length > 0 
                        ? `${selectedCodes.slice(0, 3).join(", ")}${selectedCodes.length > 3 ? "..." : ""}`
                        : "Selecciona stickers específicos con las casillas del catálogo."}
                    </p>
                  </div>
                  <span className={`text-[10px] font-extrabold ${printScope === "selected" ? "text-emerald-700" : "text-slate-400"}`}>
                    ✓ Selección personalizada
                  </span>
                </button>

                {/* Opción 3: 1 QR Individual */}
                <button
                  type="button"
                  onClick={() => setPrintScope("single")}
                  className={`tap-effect p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                    printScope === "single"
                      ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        1 QR Individual
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                        {singleCode}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Imprime un solo sticker de reposición o prueba rápida.
                    </p>
                  </div>
                  <span className={`text-[10px] font-extrabold ${printScope === "single" ? "text-emerald-700" : "text-slate-400"}`}>
                    ✓ Reposición unitaria
                  </span>
                </button>
              </div>

              {/* Controles secundarios si seleccionó 1 QR Individual */}
              {printScope === "single" && (
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      Folio a Imprimir:
                    </span>
                    <input
                      type="text"
                      value={singleCode}
                      onChange={(e) => setSingleCode(e.target.value.toUpperCase())}
                      placeholder="FRM-0001"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 uppercase focus:border-emerald-500 focus:outline-none w-32"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      Número de copias:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCopiesCount(n)}
                          className={`tap-effect px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            copiesCount === n
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {n}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN 3: VISTA PREVIA DE LAS ETIQUETAS A IMPRIMIR */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Vista Previa de Impresión ({itemsToPrint.length} etiquetas)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Dimensión: 50 x 50 mm por sticker
                </span>
              </div>

              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 max-h-56 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {itemsToPrint.slice(0, 8).map((item, index) => {
                    const enrolled = enrolledMap[item.code];
                    return (
                      <div
                        key={`${item.code}-${index}`}
                        className="bg-white rounded-xl p-2.5 border-2 border-slate-300 shadow-2xs flex flex-col items-center justify-between text-center relative"
                      >
                        {/* Header Branding */}
                        <div className="w-full flex items-center justify-between border-b border-slate-100 pb-1 mb-1">
                          <span className="bg-emerald-800 text-white font-black text-[7.5px] px-1 py-0.2 rounded">
                            LA HUERTA
                          </span>
                          <span className="text-[8px] font-bold text-slate-500 font-mono">
                            #{String(item.serial).padStart(4, "0")}
                          </span>
                        </div>

                        {/* Vector QR */}
                        <div className="p-1 bg-white rounded-md my-0.5">
                          <QRCodeSVG
                            value={item.code}
                            size={56}
                            level="M"
                            includeMargin={false}
                          />
                        </div>

                        {/* Folio Code */}
                        <span className="font-mono font-black text-xs text-slate-950 tracking-wider">
                          {item.code}
                        </span>
                        <span className="text-[7px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Sticker Congelador
                        </span>
                      </div>
                    );
                  })}
                </div>

                {itemsToPrint.length > 8 && (
                  <p className="text-center text-[10.5px] text-slate-500 font-medium mt-2">
                    + {itemsToPrint.length - 8} etiquetas adicionales se imprimirán en esta orden.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="tap-effect px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleExecutePrint}
              disabled={itemsToPrint.length === 0}
              className="disabled:opacity-40 disabled:cursor-not-allowed tap-effect flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-[#059669] to-teal-700 hover:brightness-105 active:scale-98 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>
                Imprimir {itemsToPrint.length} Sticker{itemsToPrint.length !== 1 ? "s" : ""}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED PRINTABLE CONTAINER (Only visible during @media print) */}
      <div id="frimart-printable-sheet" className="hidden" style={{ background: "#fff" }}>
        <div style={{ padding: "8mm", fontFamily: "sans-serif" }}>
          {/* Print Sheet Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #059669", paddingBottom: "4mm", marginBottom: "6mm" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "16pt", fontWeight: "900", color: "#064e3b" }}>
                FRIMART • LA HUERTA
              </h1>
              <p style={{ margin: "2px 0 0 0", fontSize: "9pt", color: "#475569" }}>
                Planilla Oficial de Stickers QR para Congeladores en Campo • Folios {itemsToPrint[0]?.code} al {itemsToPrint[itemsToPrint.length - 1]?.code}
              </p>
            </div>
            <div style={{ textAlign: "right", fontSize: "8pt", color: "#64748b" }}>
              <span>Fecha: {new Date().toLocaleDateString()}</span>
              <br />
              <span>Total: {itemsToPrint.length} etiquetas</span>
            </div>
          </div>

          {/* Grid of 50x50 mm Stickers */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "5mm",
            pageBreakInside: "avoid" 
          }}>
            {itemsToPrint.map((item, idx) => (
              <div
                key={`print-${item.code}-${idx}`}
                className="frimart-print-sticker"
                style={{
                  border: "1.5px solid #059669",
                  borderRadius: "10px",
                  padding: "4mm",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                  minHeight: "52mm",
                  pageBreakInside: "avoid"
                }}
              >
                {/* Brand header */}
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", borderBottom: "1px solid #e2e8f0", paddingBottom: "2mm", marginBottom: "2mm" }}>
                  <span style={{ background: "#064e3b", color: "#ffffff", padding: "1px 5px", borderRadius: "3px", fontSize: "7pt", fontWeight: "900" }}>
                    LA HUERTA
                  </span>
                  <span style={{ fontSize: "8pt", fontWeight: "900", fontFamily: "monospace", color: "#059669" }}>
                    FRIMART
                  </span>
                  <span style={{ fontSize: "7pt", color: "#64748b", fontWeight: "700" }}>
                    #{String(item.serial).padStart(4, "0")}
                  </span>
                </div>

                {/* QR Code SVG */}
                <div style={{ margin: "2mm 0" }}>
                  <QRCodeSVG
                    value={item.code}
                    size={110}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {/* Folio Text */}
                <div style={{ width: "100%", borderTop: "1px solid #e2e8f0", paddingTop: "2mm", marginTop: "1mm" }}>
                  <span style={{ fontSize: "12pt", fontWeight: "900", fontFamily: "monospace", letterSpacing: "1px", color: "#0f172a", display: "block" }}>
                    {item.code}
                  </span>
                  <span style={{ fontSize: "6.5pt", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Sticker de Control de Congelador
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
}
