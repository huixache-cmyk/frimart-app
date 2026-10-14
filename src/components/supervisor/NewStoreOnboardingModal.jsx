import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Store,
  User,
  Phone,
  MapPin,
  LocateFixed,
  Route,
  Snowflake,
  CheckCircle2,
  AlertCircle,
  Compass
} from "lucide-react";
import QRScannerModal from "../QRScannerModal";
import AppSelect from "../ui/AppSelect";

export default function NewStoreOnboardingModal({
  isOpen,
  onClose,
  onSave,
  existingStores = [],
  defaultGps = null,
  vendors = []
}) {
  // Form State
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // GPS: obligatorio capturarlo en sitio (sin coordenadas por defecto)
  const [coordinates, setCoordinates] = useState(() => defaultGps || null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [gpsError, setGpsError] = useState("");

  // Vendedor asignado (de los usuarios reales); la ruta y el CEDIS se toman de él
  const [vendorId, setVendorId] = useState(vendors[0]?.id || "");
  const selectedVendor = vendors.find((v) => v.id === vendorId) || null;

  // Form Validation & Feedback
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Live GPS capture on the spot
  const handleCaptureLiveGps = () => {
    if (!navigator?.geolocation) {
      setGpsError("Tu navegador no soporta geolocalización satelital.");
      return;
    }

    setIsLocating(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCoordinates({
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6)),
          accuracy: Math.round(accuracy)
        });
        setGpsLocked(true);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setGpsError("No se pudo obtener el GPS. Concede permiso de ubicación o ingresa manualmente.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!businessName.trim()) {
      setFormError("Por favor ingresa el Nombre del Negocio.");
      return;
    }
    if (!address.trim()) {
      setFormError("Por favor ingresa la Dirección del punto de venta.");
      return;
    }

    if (!gpsLocked || !coordinates) {
      setFormError("Fija las coordenadas GPS estando dentro de la tienda.");
      return;
    }
    if (!selectedVendor) {
      setFormError("Selecciona el vendedor asignado.");
      return;
    }

    setIsSaving(true);
    const storeId = `STORE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const newStore = {
      id: storeId,
      code: storeId.slice(6),
      name: businessName.trim(),
      chain: businessName.trim(),
      type: "Punto de Venta Frimart",
      contactName: contactName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      lat: coordinates.lat,
      lng: coordinates.lng,
      gpsAccuracy: coordinates.accuracy ?? null,
      status: "pending",
      salesToday: 0,
      boxesToday: 0,
      freezersCount: 0,
      freezerIds: [],
      compliancePercent: 0,
      routeId: selectedVendor.routeId || null,
      route: selectedVendor.routeName || selectedVendor.routeId || "",
      vendorId: selectedVendor.id,
      sellerAssigned: selectedVendor.name,
      cedisId: selectedVendor.cedisId || null,
      cedis: selectedVendor.cedisName || selectedVendor.cedisId || "",
      createdAt: new Date().toISOString()
    };

    onSave?.(newStore, null);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 bg-white sm:bg-slate-900/35 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-xl bg-white sm:rounded-[26px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-slate-200">
        
        {/* Header - Corporate Emerald (100% visible, safe area padding para que nunca se corte el título) */}
        <div className="pt-10 sm:pt-4 pb-3.5 px-4 sm:px-5 bg-gradient-to-r from-emerald-600 via-[#059669] to-teal-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight truncate">
                Nuevo Punto de Venta
              </h2>
              <p className="text-[11px] text-emerald-100 font-medium truncate">
                Alta de cliente con ubicación GPS
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

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. DATOS DEL NEGOCIO & CONTACTO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-sky-600" />
              <span>1. Identificación del Establecimiento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej: Abarrotes y Cremería La Huerta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nombre de Contacto / Encargado
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej: Doña Carmen Morales"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Celular / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 449 123 4567"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Dirección Completa *
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, colonia, Ags."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. FIJAR COORDENADAS GPS EN EL LUGAR */}
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>2. Geocerca y Coordenadas GPS del Lugar</span>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                gpsLocked 
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}>
                {gpsLocked ? "✓ GPS Fijado en Sitio" : "Por Fijar en Lugar"}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              Captura las coordenadas satelitales directamente de tu celular estando dentro de la tienda para registrar la geocerca de llegada del vendedor.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCaptureLiveGps}
                disabled={isLocating}
                className="tap-effect flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <LocateFixed className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "Obteniendo satélites..." : "Fijar Coordenadas GPS en el Lugar"}</span>
              </button>
            </div>

            {/* Readout of Coordinates */}
            <div className="p-2.5 rounded-xl bg-white border border-sky-200 text-[11px] font-mono flex items-center justify-between text-slate-700">
              <div>
                <span className="font-bold text-slate-500">Lat: </span>
                <span className="font-bold text-sky-700">{coordinates ? coordinates.lat : "—"}</span>
                <span className="text-slate-400 mx-2">|</span>
                <span className="font-bold text-slate-500">Lng: </span>
                <span className="font-bold text-sky-700">{coordinates ? coordinates.lng : "—"}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {coordinates ? `±${coordinates.accuracy}m` : "Sin capturar"}
              </span>
            </div>

            {gpsError && (
              <p className="text-[11px] text-rose-600 font-medium">{gpsError}</p>
            )}
          </div>

          {/* 3. VENDEDOR ASIGNADO (define ruta y CEDIS) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Route className="w-3.5 h-3.5 text-sky-600" />
              <span>3. Vendedor asignado *</span>
            </div>
            {vendors.length === 0 ? (
              <p className="text-[12px] text-slate-500">No tienes vendedores asignados.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {vendors.map((v) => (
                  <button key={v.id} type="button" onClick={() => setVendorId(v.id)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold border cursor-pointer ${vendorId === v.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"}`}>
                    {v.name}{v.routeId ? ` · ${v.routeId}` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. CONGELADOR: se enrola después escaneando su QR */}
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2 text-[12px] text-emerald-900">
            <Snowflake className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Después de guardar, abre la tienda y usa <strong>Agregar congelador</strong> para escanear su QR y configurar su planograma.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="tap-effect flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="tap-effect flex-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-[#059669] to-teal-700 hover:brightness-110 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? "Guardando..." : "Guardar y Dar de Alta Punto de Venta"}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
}
