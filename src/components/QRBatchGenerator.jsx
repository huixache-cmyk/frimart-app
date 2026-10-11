import React, { useState, useMemo } from "react";
import { 
  Printer, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Tag, 
  Layers, 
  ExternalLink,
  Sparkles, 
  QrCode, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Store
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
      <div className="glass-panel p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Generador y Banco de 2,000 Códigos QR Físicos
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                Bobina Activa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-10 max-w-3xl">
              Stickers oficiales con branding <strong>La Huerta / Frimart</strong>. Los vendedores llevan rollos impresos y adhieren un código virgen en la puerta del congelador para capturar sus coordenadas GPS y enrolarlo en campo.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => window.print()}
              className="tactile-btn flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Imprimir Planilla A4</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="tactile-btn flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV (2,000 QR)</span>
            </button>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="glass-card p-3.5 border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold">Total Folios Generados</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {qrBatch.length.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-700 font-mono mt-0.5 block">FRM-0001 al FRM-2000</span>
          </div>

          <div className="glass-card p-3.5 border border-emerald-200 bg-emerald-50/50 shadow-xs">
            <span className="text-[11px] text-slate-600 font-semibold">Vírgenes Disponibles</span>
            <div className="text-2xl font-black text-emerald-800 font-mono mt-1">
              {(qrBatch.length - Object.keys(enrolledMap).length).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">Listos para pegar en campo</span>
          </div>

          <div className="glass-card p-3.5 border border-sky-200 bg-sky-50/50 shadow-xs">
            <span className="text-[11px] text-slate-600 font-semibold">Enrolados en Tiendas</span>
            <div className="text-2xl font-black text-sky-800 font-mono mt-1">
              {Object.keys(enrolledMap).length.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-700 font-medium mt-0.5 block">Con GPS y planograma activo</span>
          </div>

          <div className="glass-card p-3.5 border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold">Formato de Bobina</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              50 x 50 mm
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Polipropileno laminado UV</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por folio (FRM-0089) o tienda..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 transition font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => { setFilterStatus("all"); setCurrentPage(1); }}
            className={`tactile-btn px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
              filterStatus === "all" ? "bg-sky-600 text-white font-bold shadow-sm" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Todos ({qrBatch.length})
          </button>
          <button
            onClick={() => { setFilterStatus("virgin"); setCurrentPage(1); }}
            className={`tactile-btn px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
              filterStatus === "virgin" ? "bg-emerald-600 text-white font-bold shadow-sm" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Vírgenes ({(qrBatch.length - Object.keys(enrolledMap).length)})
          </button>
          <button
            onClick={() => { setFilterStatus("enrolled"); setCurrentPage(1); }}
            className={`tactile-btn px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
              filterStatus === "enrolled" ? "bg-sky-600 text-white font-bold shadow-sm" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Enrolados ({Object.keys(enrolledMap).length})
          </button>
        </div>
      </div>

      {/* Grid of Printable / Interactive QR Stickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 qr-label-grid">
        {paginatedList.map((item) => {
          const enrolled = enrolledMap[item.code];
          return (
            <div 
              key={item.code}
              className="bg-white rounded-2xl p-4 text-slate-900 shadow-md border border-slate-200 flex flex-col justify-between relative overflow-hidden group transition-all duration-200 hover:shadow-xl hover:border-slate-300"
            >
              {/* Top Branding on Sticker */}
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-800 text-white font-black text-[9px] px-1.5 py-0.5 rounded">
                    LA HUERTA
                  </span>
                  <span className="text-[10px] font-bold text-slate-800 font-mono">
                    FRIMART
                  </span>
                </div>
                <span className="text-[9px] font-extrabold text-slate-500 font-mono">
                  #{String(item.serial).padStart(4, "0")}
                </span>
              </div>

              {/* Centered QR Code */}
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl my-1 border border-slate-100">
                <QRCodeSVG
                  value={item.code}
                  size={105}
                  level="M"
                  includeMargin={false}
                />
                <span className="text-base font-black font-mono tracking-wider text-slate-950 mt-2">
                  {item.code}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  Sticker de Congelador
                </span>
              </div>

              {/* Status Badge */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                {enrolled ? (
                  <div className="truncate max-w-[150px]">
                    <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      <span className="truncate">{enrolled.storeName}</span>
                    </span>
                  </div>
                ) : (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Virgen Disponible
                  </span>
                )}

                {/* Quick Test / Copy Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(item.code)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                    title="Copiar folio"
                  >
                    {copiedCode === item.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onTestQrCode(item.code)}
                    className="tactile-btn text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded cursor-pointer"
                    title="Simular escaneo en cámara"
                  >
                    Probar
                  </button>
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
    </div>
  );
}
