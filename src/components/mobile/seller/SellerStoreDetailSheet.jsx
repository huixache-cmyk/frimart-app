import React from "react";
import {
  X,
  Store,
  MapPin,
  Phone,
  Snowflake,
  Navigation,
  Layers,
  Compass,
  QrCode
} from "lucide-react";
import { calculateDistanceMeters } from "../../../data/mockData";

export default function SellerStoreDetailSheet({
  isOpen,
  onClose,
  store,
  freezers = [],
  sellerLocation,
  onStartAudit,
  onStartVisit,
  onOpenQuickSale,
  onOpenMap,
  onEnrollFreezer
}) {
  if (!isOpen || !store) return null;

  const storeFreezer = freezers.find((f) => f.storeId === store.id);
  const sellerLat = sellerLocation?.lat || 21.1485;
  const sellerLng = sellerLocation?.lng || -86.8402;
  const distanceM = calculateDistanceMeters(sellerLat, sellerLng, store.lat, store.lng);
  const isInsideGeofence = distanceM <= (store.geofenceRadius || 200);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div className="w-full max-w-md mx-auto p-5 bg-white rounded-t-[28px] shadow-2xl space-y-4 animate-sheet-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-section-title text-[#0f172a] line-clamp-1">
                {store.name}
              </h3>
              <p className="text-[11px] text-slate-500">Detalle de Punto de Venta</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location & GPS Info */}
        <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
            <span>{store.address}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
            <span className={`font-semibold flex items-center gap-1 ${
              isInsideGeofence ? "text-[#059669]" : "text-slate-500"
            }`}>
              <Navigation className="w-3 h-3" />
              {isInsideGeofence 
                ? "Dentro de Geocerca GPS" 
                : `A ${Math.round(distanceM)} metros (${(distanceM / 1000).toFixed(1)} km)`
              }
            </span>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMap?.(store.id);
              }}
              className="text-[#059669] font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Ver en Mapa</span>
            </button>
          </div>
        </div>

        {/* Freezer Info Box */}
        {storeFreezer ? (
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-blue-600" />
                Congelador La Huerta Asignado
              </span>
              <span className="text-[10px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                {storeFreezer.currentTemp || "-18.4°C"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Sticker QR:</span>
                <strong className="font-mono">{storeFreezer.qrCode}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Última Auditoría:</span>
                <strong>{storeFreezer.lastAudit || "Hoy, 10:15 AM"}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2.5">
            <p>⚠️ Esta tienda no tiene congelador enrolado aún.</p>
            {onEnrollFreezer && (
              <button
                type="button"
                onClick={() => onEnrollFreezer(store)}
                className="tap-effect w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Registrar congelador en Auditar QR</span>
              </button>
            )}
          </div>
        )}

        {/* Manager Contact */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Encargado de Tienda:</span>
            <strong className="text-slate-800">{store.contactName || "Gerente en turno"}</strong>
          </div>
          {store.phone && (
            <a
              href={`tel:${store.phone}`}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#059669] flex items-center gap-1 font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar</span>
            </a>
          )}
        </div>

        {/* Action Buttons - Compact & Elegant (No heavy black) */}
        <div className="space-y-2 pt-1">
          {storeFreezer && (
            <>
              <button
                onClick={() => {
                  onClose();
                  (onStartVisit || onStartAudit)(storeFreezer.id);
                }}
                className="tap-effect w-full py-3 rounded-xl bg-[#059669] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#047857] transition cursor-pointer shadow-sm"
              >
                <Snowflake className="w-4 h-4 stroke-[2.2]" />
                <span>{store.status === "completed" ? "Repetir visita guiada" : "Iniciar visita guiada"}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onStartAudit(storeFreezer.id);
                }}
                className="tap-effect w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ver planograma ({storeFreezer.qrCode})</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
