import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Store, 
  User, 
  Phone, 
  MapPin, 
  LocateFixed, 
  Route, 
  Building2, 
  Truck, 
  Snowflake, 
  QrCode, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Sparkles,
  ShieldCheck,
  Compass,
  Radio
} from "lucide-react";
import QRScannerModal from "../QRScannerModal";

export default function NewStoreOnboardingModal({
  isOpen,
  onClose,
  onSave,
  existingStores = [],
  defaultGps = null
}) {
  // Form State
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // GPS Coordinates & Status
  const [coordinates, setCoordinates] = useState(() => {
    return defaultGps || { lat: 21.8853, lng: -102.2916, accuracy: 5 };
  });
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [gpsError, setGpsError] = useState("");

  // Route & CEDIS Selection
  const [routeNumber, setRouteNumber] = useState("Ruta 01 - Ags Norte & Pocitos");
  const [cedis, setCedis] = useState("CEDIS Aguascalientes (1205)");
  const [assignedSeller, setAssignedSeller] = useState("Juan Pablo Morales (Ruta 01)");

  // Freezer Equipment
  const [freezerClass, setFreezerClass] = useState("Vertical Puerta Cristal (Imbera VR-12 / 320L)");
  const [freezerQrCode, setFreezerQrCode] = useState("");
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Freezer Configuration
  const [targetTemp, setTargetTemp] = useState(-19.5); // °C
  const [boxCapacity, setBoxCapacity] = useState(24);
  const [planogramModel, setPlanogramModel] = useState("Planograma A1 - Verduras & Frutas IQF La Huerta");
  const [iotActive, setIotActive] = useState(true);

  // Form Validation & Feedback
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Automatic CEDIS determination based on GPS latitude
  useEffect(() => {
    if (coordinates?.lat) {
      const lat = coordinates.lat;
      if (lat >= 21.6 && lat <= 22.3) {
        setCedis("CEDIS Aguascalientes (1205)");
      } else if (lat >= 20.8 && lat <= 21.5) {
        setCedis("CEDIS Cancún (01)");
      } else if (lat >= 20.5 && lat <= 21.1) {
        setCedis("CEDIS Mérida Periférico");
      }
    }
  }, [coordinates?.lat]);

  // Synchronize assigned seller when route changes
  useEffect(() => {
    if (routeNumber.includes("01")) {
      setAssignedSeller("Juan Pablo Morales (Ruta 01)");
    } else if (routeNumber.includes("02")) {
      setAssignedSeller("Carlos Estrada Rincón (Ruta 02)");
    } else if (routeNumber.includes("03")) {
      setAssignedSeller("María Elena Delgado (Ruta 03)");
    }
  }, [routeNumber]);

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

  // Generate automatic QR code for freezer if none available
  const handleGenerateNextQr = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFreezerQrCode(`FRM-0${randomNum}`);
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

    setIsSaving(true);

    const storeId = `STORE-AGS-${Date.now().toString().slice(-4)}`;
    const hasFreezer = freezerClass !== "Sin Congelador";
    const assignedFreezerId = hasFreezer ? (freezerQrCode.trim() || `FRM-0${Math.floor(100 + Math.random() * 900)}`) : null;

    const newStore = {
      id: storeId,
      code: `AGS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: businessName.trim(),
      chain: businessName.trim(),
      type: "Punto de Venta Frimart",
      contactName: contactName.trim() || "Encargado de Tienda",
      phone: phone.trim() || "449-000-0000",
      address: address.trim(),
      lat: coordinates.lat,
      lng: coordinates.lng,
      geofenceRadius: 60,
      status: "pending",
      checkInTime: null,
      checkOutTime: null,
      salesToday: 0,
      boxesToday: 0,
      freezersCount: hasFreezer ? 1 : 0,
      freezerIds: assignedFreezerId ? [assignedFreezerId] : [],
      managerName: contactName.trim() || "Encargado",
      compliancePercent: 0,
      clientCode: `CL-${Math.floor(100000 + Math.random() * 900000)}`,
      sector: "Clientes Detalle Ags",
      cedis: cedis,
      route: routeNumber,
      sellerAssigned: assignedSeller,
      createdAt: new Date().toISOString()
    };

    let newFreezer = null;
    if (hasFreezer && assignedFreezerId) {
      newFreezer = {
        id: assignedFreezerId,
        qrCode: assignedFreezerId,
        storeId: storeId,
        storeName: businessName.trim(),
        model: freezerClass,
        brand: "Frimart / La Huerta",
        serialNumber: `SN-${assignedFreezerId}-2026`,
        capacityPcs: boxCapacity * 10,
        currentStock: 0,
        temperature: targetTemp,
        shelvesCount: 4,
        doorShelvesCount: 4,
        facingsPerShelf: 4,
        facingsPerDoorShelf: 4,
        installedAt: new Date().toISOString().split("T")[0],
        lastAuditedAt: null,
        planogramModel: planogramModel,
        iotActive: iotActive,
        locationCoordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng,
          accuracy: coordinates.accuracy || 5
        },
        conditions: {
          compressor: "Nuevo / Óptimo",
          doorSeals: "Hermético",
          ledLighting: "100% Funcional",
          frostLevel: "Limpio / Sin Escarcha",
          cleanliness: "Excelente"
        }
      };
    }

    setTimeout(() => {
      onSave?.(newStore, newFreezer);
      setIsSaving(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Nuevo Punto de Venta
              </h2>
              <p className="text-[11px] text-slate-300">
                Alta de cliente y enrolamiento de congelador en campo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
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
                <span className="font-bold text-sky-700">{coordinates.lat}</span>
                <span className="text-slate-400 mx-2">|</span>
                <span className="font-bold text-slate-500">Lng: </span>
                <span className="font-bold text-sky-700">{coordinates.lng}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ±{coordinates.accuracy || 5}m satélite
              </span>
            </div>

            {gpsError && (
              <p className="text-[11px] text-rose-600 font-medium">{gpsError}</p>
            )}
          </div>

          {/* 3. ASIGNACIÓN OPERATIVA (RUTA, CEDIS, VENDEDOR) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Route className="w-3.5 h-3.5 text-sky-600" />
              <span>3. Asignación de Ruta y CEDIS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CEDIS (Predeterminada según ubicación GPS) */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  CEDIS (Detectado x GPS) *
                </label>
                <select
                  value={cedis}
                  onChange={(e) => setCedis(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="CEDIS Aguascalientes (1205)">CEDIS Aguascalientes (1205)</option>
                  <option value="CEDIS Cancún (01)">CEDIS Cancún (01)</option>
                  <option value="CEDIS Mérida Periférico">CEDIS Mérida Periférico</option>
                  <option value="CEDIS Playa del Carmen">CEDIS Playa del Carmen</option>
                </select>
              </div>

              {/* Asignar Número de Ruta */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Número de Ruta *
                </label>
                <select
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="Ruta 01 - Ags Norte & Pocitos">Ruta 01 - Ags Norte & Pocitos</option>
                  <option value="Ruta 02 - Ags Centro & San Marcos">Ruta 02 - Ags Centro & San Marcos</option>
                  <option value="Ruta 03 - Ags Sur & Cd. Industrial">Ruta 03 - Ags Sur & Cd. Industrial</option>
                  <option value="Ruta 04 - Especial Foránea">Ruta 04 - Especial Foránea</option>
                </select>
              </div>

              {/* Vendedor Asignado */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Vendedor Asignado *
                </label>
                <select
                  value={assignedSeller}
                  onChange={(e) => setAssignedSeller(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="Juan Pablo Morales (Ruta 01)">Juan Pablo Morales (R01)</option>
                  <option value="Carlos Estrada Rincón (Ruta 02)">Carlos Estrada Rincón (R02)</option>
                  <option value="María Elena Delgado (Ruta 03)">María Elena Delgado (R03)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. EQUIPAMIENTO DE FRÍO (CLASE CONGELADOR, ESCANEO Y CONFIGURACIÓN) */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Snowflake className="w-3.5 h-3.5 text-emerald-600" />
              <span>4. Congelador, Escaneo QR & Configuración</span>
            </div>

            {/* Clase de Congelador */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Clase / Modelo de Congelador Asignado
              </label>
              <select
                value={freezerClass}
                onChange={(e) => setFreezerClass(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Vertical Puerta Cristal (Imbera VR-12 / 320L)">Vertical Puerta Cristal (Imbera VR-12 / 320L)</option>
                <option value="Vertical Doble Puerta Cristal (Imbera VR-24 / 650L)">Vertical Doble Puerta Cristal (Imbera VR-24 / 650L)</option>
                <option value="Horizontal Tapa Cofre Metálica 1.5m (Frimart CF-150)">Horizontal Tapa Cofre Metálica 1.5m (Frimart CF-150)</option>
                <option value="Horizontal Tapa Vidrio Curvo Deslizable (Frimart HD-200)">Horizontal Tapa Vidrio Curvo Deslizable (Frimart HD-200)</option>
                <option value="Isla Panorámica Autoservicio 2.5m (La Huerta Master)">Isla Panorámica Autoservicio 2.5m (La Huerta Master)</option>
                <option value="Sin Congelador">Sin Congelador (Solo Producto)</option>
              </select>
            </div>

            {freezerClass !== "Sin Congelador" && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                {/* Escaneo QR de Congelador */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Escaneo de Código QR de Congelador *</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateNextQr}
                      className="text-[10px] text-emerald-700 font-bold underline hover:text-emerald-900"
                    >
                      Asignar siguiente QR libre
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={freezerQrCode}
                      onChange={(e) => setFreezerQrCode(e.target.value.toUpperCase())}
                      placeholder="Ej: FRM-0520"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-emerald-300 text-xs font-mono font-bold text-emerald-900 uppercase bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />

                    <button
                      type="button"
                      onClick={() => setIsQrScannerOpen(true)}
                      className="tap-effect px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Escanear QR</span>
                    </button>
                  </div>
                </div>

                {/* Configuración del Congelador */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/80">
                  {/* Temperatura Objetivo */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Temperatura Objetivo: {targetTemp}°C
                    </label>
                    <select
                      value={targetTemp}
                      onChange={(e) => setTargetTemp(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs text-slate-900 bg-white"
                    >
                      <option value={-18.0}>-18.0°C (Estándar Comercial)</option>
                      <option value={-19.5}>-19.5°C (Recomendado Frimart)</option>
                      <option value={-22.0}>-22.0°C (Pulpa & Frutas)</option>
                      <option value={-25.0}>-25.0°C (IQF La Huerta)</option>
                    </select>
                  </div>

                  {/* Capacidad en Cajas */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Capacidad Asignada (Cajas)
                    </label>
                    <select
                      value={boxCapacity}
                      onChange={(e) => setBoxCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs text-slate-900 bg-white"
                    >
                      <option value={18}>18 Cajas (~180 piezas)</option>
                      <option value={24}>24 Cajas (~240 piezas)</option>
                      <option value={36}>36 Cajas (~360 piezas)</option>
                      <option value={48}>48 Cajas (~480 piezas)</option>
                    </select>
                  </div>

                  {/* Planograma Asignado */}
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Planograma Maestro La Huerta Asignado
                    </label>
                    <select
                      value={planogramModel}
                      onChange={(e) => setPlanogramModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs text-slate-900 bg-white"
                    >
                      <option value="Planograma A1 - Verduras & Frutas IQF La Huerta">Planograma A1 - Verduras & Frutas IQF La Huerta</option>
                      <option value="Planograma B2 - 50% La Huerta / 50% Helados & Paletas">Planograma B2 - 50% La Huerta / 50% Helados & Paletas</option>
                      <option value="Planograma C3 - Mixto Carnicerías & Tiendas Detalle">Planograma C3 - Mixto Carnicerías & Tiendas Detalle</option>
                    </select>
                  </div>
                </div>

                {/* IoT Sensor Switch */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold">
                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Monitoreo Térmico & Sensor IoT Satelital</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={iotActive}
                    onChange={(e) => setIotActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
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

      {/* Camera QR Scanner Integration Modal */}
      {isQrScannerOpen && (
        <QRScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          onScan={(scannedCode) => {
            setFreezerQrCode(scannedCode.toUpperCase());
            setIsQrScannerOpen(false);
          }}
        />
      )}
    </div>
  );
}
