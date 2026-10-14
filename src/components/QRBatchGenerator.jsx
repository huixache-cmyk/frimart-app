import React, { useState, useMemo } from "react";
import {
  Printer,
  Download,
  Search,
  Filter,
  QrCode,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Store,
  CheckSquare,
  Square
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import QRPrintModal from "./supervisor/QRPrintModal";

export default function QRBatchGenerator({ 
  qrBatch = [], 
  freezers = [], 
  onTestQrCode 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'virgin' | 'enrolled'
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState(null);
  const itemsPerPage = 24; // Formato estándar de planilla A4 (3 x 8)

  // Selection & Print Assistant State
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printModalScope, setPrintModalScope] = useState("full_sheet"); // 'full_sheet' | 'selected' | 'single'
  const [printTargetCode, setPrintTargetCode] = useState("FRM-0001");

  // Map enrolled freezers by QR code
  const enrolledMap = useMemo(() => {
    const map = {};
    (freezers || []).forEach(f => {
      map[f.qrCode] = f;
    });
    return map;
  }, [freezers]);

  // Filtered list
  const filteredList = useMemo(() => {
    return qrBatch.filter(item => {
      const isEnrolled = !!enrolledMap[item.code];
      if (filterStatus === "virgin" && isEnrolled) return false;
      if (filterStatus === "enrolled" && !isEnrolled) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return item.code.toLowerCase().includes(query) || 
               String(item.serial).includes(query) ||
               (enrolledMap[item.code]?.storeName || "").toLowerCase().includes(query);
      }
      return true;
    });
  }, [qrBatch, filterStatus, searchQuery, enrolledMap]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Toggle selection for multiple stickers
  const handleToggleSelect = (code) => {
    setSelectedCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSelectAllPage = () => {
    const pageCodes = paginatedList.map(item => item.code);
    const allSelected = pageCodes.every(c => selectedCodes.includes(c));
    if (allSelected) {
      setSelectedCodes(prev => prev.filter(c => !pageCodes.includes(c)));
    } else {
      setSelectedCodes(prev => Array.from(new Set([...prev, ...pageCodes])));
    }
  };

  const handleClearSelection = () => {
    setSelectedCodes([]);
  };

  // Open Print Modal with specific scope
  const handleOpenPrintModal = (scope = "full_sheet", targetCode = null) => {
    setPrintModalScope(scope);
    if (targetCode) {
      setPrintTargetCode(targetCode);
    } else if (selectedCodes.length > 0 && scope === "selected") {
      setPrintTargetCode(selectedCodes[0]);
    } else if (paginatedList.length > 0) {
      setPrintTargetCode(paginatedList[0].code);
    }
    setIsPrintModalOpen(true);
  };

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = "Codigo,Numero_Serial,Estado,Punto_de_Venta,Fecha_Lote\n";
    const rows = qrBatch.map(item => {
      const enrolled = enrolledMap[item.code];
      const statusStr = enrolled ? "Enrolado" : "Virgen_Disponible";
      const storeStr = enrolled ? `"${enrolled.storeName.replace(/"/g, '""')}"` : "Sin_Asignar";
      return `${item.code},${item.serial},${statusStr},${storeStr},${item.batchDate}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Lote_2000_Codigos_QR_Frimart_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Metrics */}
      <div className="glass-panel p-4 sm:p-5 border border-slate-200 shadow-sm bg-white rounded-2xl">
        <div className="flex flex-col gap-3.5 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit']">
                Lote de 2,000 Stickers QR
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-[10.5px] px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                Bobina Activa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Stickers oficiales con branding <strong>La Huerta / Frimart</strong>. Los vendedores llevan rollos impresos y adhieren un código virgen en la puerta del congelador para capturar su GPS y enrolarlo en campo.
            </p>
          </div>

          {/* Action Buttons: 2-column full width */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={() => handleOpenPrintModal("full_sheet")}
              className="tactile-btn flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-105 active:scale-98 text-white text-xs font-black py-2.5 px-3 rounded-xl shadow-md transition cursor-pointer"
              title="Abrir asistente de impresión y búsqueda de impresora más cercana"
            >
              <Printer className="w-4 h-4 stroke-[2.2] shrink-0" />
              <span className="truncate">Imprimir Planilla</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="tactile-btn flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Counter Pills: 2x2 Clean Mobile Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-card p-3 border border-slate-200 shadow-xs rounded-xl bg-slate-50/70">
            <span className="text-[10.5px] text-slate-500 font-semibold block leading-tight">Total Folios Generados</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              {qrBatch.length.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-700 font-mono mt-0.5 block truncate">FRM-0001 al FRM-2000</span>
          </div>

          <div className="glass-card p-3 border border-emerald-200 bg-emerald-50/50 shadow-xs rounded-xl">
            <span className="text-[10.5px] text-emerald-800 font-semibold block leading-tight">Vírgenes Disponibles</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 font-mono mt-0.5">
              {(qrBatch.length - Object.keys(enrolledMap).length).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block truncate">Listos para pegar en campo</span>
          </div>

          <div className="glass-card p-3 border border-sky-200 bg-sky-50/50 shadow-xs rounded-xl">
            <span className="text-[10.5px] text-sky-800 font-semibold block leading-tight">Enrolados en Tiendas</span>
            <div className="text-xl sm:text-2xl font-black text-sky-800 font-mono mt-0.5">
              {Object.keys(enrolledMap).length.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-700 font-medium mt-0.5 block truncate">Con GPS y planograma</span>
          </div>

          <div className="glass-card p-3 border border-slate-200 shadow-xs rounded-xl bg-slate-50/70">
            <span className="text-[10.5px] text-slate-500 font-semibold block leading-tight">Formato de Bobina</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              50 x 50 mm
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">Polipropileno laminado UV</span>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Bar for Multi-selection */}
      {selectedCodes.length > 0 && (
        <div className="sticky top-2 z-20 p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-emerald-500 shadow-xl flex items-center justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-900">
              {selectedCodes.length} {selectedCodes.length === 1 ? "Sticker QR seleccionado" : "Stickers QR seleccionados"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearSelection}
              className="px-2.5 py-1 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
            >
              Deseleccionar
            </button>
            <button
              type="button"
              onClick={() => handleOpenPrintModal("selected")}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-105 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Selección ({selectedCodes.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 border border-slate-200 bg-white rounded-2xl flex flex-col gap-2.5 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por folio (ej. FRM-0089) o tienda..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full pb-0.5">
          {/* Quick Page Select All */}
          <button
            type="button"
            onClick={handleSelectAllPage}
            className="tactile-btn px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0"
            title="Seleccionar o deseleccionar los 24 stickers de esta página"
          >
            {paginatedList.length > 0 && paginatedList.every(i => selectedCodes.includes(i.code)) ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Página Lista ({paginatedList.length})</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-slate-400" />
                <span>Hoja Actual ({paginatedList.length})</span>
              </>
            )}
          </button>

          <button
            onClick={() => { setFilterStatus("all"); setCurrentPage(1); }}
            className={`tactile-btn px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0 ${
              filterStatus === "all" ? "bg-emerald-600 text-white font-bold shadow-xs" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Todos ({qrBatch.length})
          </button>
          <button
            onClick={() => { setFilterStatus("virgin"); setCurrentPage(1); }}
            className={`tactile-btn px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0 ${
              filterStatus === "virgin" ? "bg-emerald-600 text-white font-bold shadow-xs" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Vírgenes ({(qrBatch.length - Object.keys(enrolledMap).length)})
          </button>
          <button
            onClick={() => { setFilterStatus("enrolled"); setCurrentPage(1); }}
            className={`tactile-btn px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer shrink-0 ${
              filterStatus === "enrolled" ? "bg-emerald-600 text-white font-bold shadow-xs" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Enrolados ({Object.keys(enrolledMap).length})
          </button>
        </div>
      </div>

      {/* Grid of Printable / Interactive QR Stickers (2 Columns Clean Mobile Layout) */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 qr-label-grid">
        {paginatedList.map((item) => {
          const enrolled = enrolledMap[item.code];
          const isSelected = selectedCodes.includes(item.code);
          return (
            <div 
              key={item.code}
              className={`bg-white rounded-2xl p-3 text-slate-900 shadow-xs border transition-all duration-200 flex flex-col justify-between relative overflow-hidden group hover:shadow-md ${
                isSelected 
                  ? "border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/20" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Top Branding on Sticker with Checkbox */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(item.code)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    title="Seleccionar para imprimir en planilla"
                  />
                  <span className="bg-emerald-800 text-white font-black text-[8px] px-1 py-0.2 rounded">
                    LA HUERTA
                  </span>
                  <span className="text-[9px] font-bold text-slate-800 font-mono">
                    FRIMART
                  </span>
                </div>
                <span className="text-[8.5px] font-bold text-slate-400 font-mono">
                  #{String(item.serial).padStart(4, "0")}
                </span>
              </div>

              {/* Centered QR Code */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50/80 rounded-xl my-0.5 border border-slate-100">
                <QRCodeSVG
                  value={item.code}
                  size={92}
                  level="M"
                  includeMargin={false}
                />
                <span className="text-sm font-black font-mono tracking-wider text-slate-900 mt-1.5">
                  {item.code}
                </span>
                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">
                  Sticker Congelador
                </span>
              </div>

              {/* Status Badge & Actions */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  {enrolled ? (
                    <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 truncate max-w-[150px]">
                      <Store className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{enrolled.storeName}</span>
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full">
                      Virgen Disponible
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(item.code)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    title="Copiar folio"
                  >
                    {copiedCode === item.code ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Print & Test Buttons */}
                <div className="flex items-center gap-1.5 w-full">
                  {/* BOTÓN PARA IMPRESIÓN DEL QR VIGENTE */}
                  <button
                    type="button"
                    onClick={() => handleOpenPrintModal("single", item.code)}
                    className="tactile-btn flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10.5px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                    title="Imprimir este sticker individual en la impresora más cercana"
                  >
                    <Printer className="w-3 h-3 text-emerald-700 stroke-[2.2] shrink-0" />
                    <span>Imprimir</span>
                  </button>

                  {onTestQrCode && (
                    <button
                      type="button"
                      onClick={() => onTestQrCode(item.code)}
                      className="tactile-btn text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-1 rounded-lg cursor-pointer"
                      title="Simular escaneo en cámara"
                    >
                      Probar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="glass-panel p-4 border border-slate-200 flex items-center justify-between text-xs text-slate-600 shadow-sm">
          <div>
            Mostrando <strong>{((currentPage - 1) * itemsPerPage) + 1}</strong> - <strong>{Math.min(filteredList.length, currentPage * itemsPerPage)}</strong> de <strong>{filteredList.length}</strong> códigos
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="tactile-btn p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-slate-900 font-bold px-2">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="tactile-btn p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Asistente de Impresión y Búsqueda de Impresora Más Cercana */}
      <QRPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        qrBatch={qrBatch}
        enrolledMap={enrolledMap}
        initialScope={printModalScope}
        initialSelectedCodes={selectedCodes.length > 0 ? selectedCodes : (printTargetCode ? [printTargetCode] : [])}
        currentPageItems={paginatedList}
      />
    </div>
  );
}
