import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  ArrowLeft, 
  Compass, 
  Navigation, 
  Store, 
  Snowflake, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LocateFixed,
  Car,
  ChevronRight,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
  Play,
  Pause,
  Square,
  FastForward,
  RotateCcw,
  Zap
} from "lucide-react";
import { calculateDistanceMeters } from "../../../data/mockData";
import DeliveryVanIcon, { DELIVERY_VAN_SVG_HTML } from "../../icons/DeliveryVanIcon";

// Calculate bearing angle between two coordinates in degrees (0 - 360)
function calculateBearing(lat1, lng1, lat2, lng2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const toDeg = rad => (rad * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export default function SellerRouteMapModal({
  isOpen,
  onClose,
  stores = [],
  seller,
  freezers = [],
  initialStoreId = null,
  activeTargetStoreId = null,
  onSetActiveTargetStore,
  onSelectStore,
  onOpenPlanogram
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLineRef = useRef(null);
  const radarsGroupRef = useRef(null);

  // Live Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [navProgressIndex, setNavProgressIndex] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [navSpeed, setNavSpeed] = useState(2); // 1x, 2x, 4x

  // Leaflet Layer References for direct 60fps updates
  const carMarkerRef = useRef(null);
  const coveredLineRef = useRef(null);
  const remainingLineRef = useRef(null);
  const remainingGlowRef = useRef(null);
  const navIntervalRef = useRef(null);

  // Live Phone GPS Tracking State
  const [phoneGpsLocation, setPhoneGpsLocation] = useState(null);
  const [isLocatingPhone, setIsLocatingPhone] = useState(false);
  const [phoneGpsError, setPhoneGpsError] = useState("");
  // Auto-center and fit bounds once live GPS is acquired
  const hasInitiallyCenteredGpsRef = useRef(false);

  // Request high-accuracy GPS position from the phone
  const handleGetLivePhoneGps = () => {
    if (!navigator?.geolocation) {
      setPhoneGpsError("Tu navegador o red no soporta geolocalización.");
      return;
    }
    setIsLocatingPhone(true);
    setPhoneGpsError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coords = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
        setPhoneGpsLocation(coords);
        setIsLocatingPhone(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 0.8 });
        }
      },
      (err) => {
        setIsLocatingPhone(false);
        console.warn("Phone GPS error:", err);
        setPhoneGpsError("No se pudo obtener el GPS. Concede permiso de ubicación en tu navegador o abre con HTTPS.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Watch GPS on modal mount
  useEffect(() => {
    if (!isOpen) return;
    handleGetLivePhoneGps();

    let watchId = null;
    if (navigator?.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setPhoneGpsLocation({ lat: latitude, lng: longitude, accuracy: Math.round(accuracy) });
        },
        (err) => {},
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOpen]);

  // Map Location Mode: 'real_phone_gps' (default) vs 'cancun_demo'
  const [mapLocationMode, setMapLocationMode] = useState("real_phone_gps");

  // Auto-center and fit bounds once live GPS is acquired
  useEffect(() => {
    if (phoneGpsLocation && mapLocationMode === "real_phone_gps" && !hasInitiallyCenteredGpsRef.current) {
      hasInitiallyCenteredGpsRef.current = true;
      if (mapInstanceRef.current) {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            fitMapBounds(mapInstanceRef.current);
          }
        }, 200);
      }
    }
  }, [phoneGpsLocation, mapLocationMode]);

  // Determine effective origin coordinates for the delivery van
  const isUsingRealPhoneGps = mapLocationMode === "real_phone_gps" && phoneGpsLocation !== null;
  const isCancunMode = mapLocationMode === "cancun_demo";
  const sellerLat = isUsingRealPhoneGps 
    ? phoneGpsLocation.lat 
    : isCancunMode 
    ? 21.1485 
    : (seller?.currentLocation?.lat || 21.8853);
  const sellerLng = isUsingRealPhoneGps 
    ? phoneGpsLocation.lng 
    : isCancunMode 
    ? -86.8402 
    : (seller?.currentLocation?.lng || -102.2916);

  // Projected or original stores: when in real GPS mode, adapt stores to user's local city/neighborhood
  const effectiveStores = useMemo(() => {
    if (isCancunMode) {
      return [
        { id: "STORE-CUN-01", code: "50XLG", name: "OXXO Constitución II CUN", address: "Av. Constitución #42, Cancún", lat: 21.1619, lng: -86.8515, status: "completed", freezersCount: 1, freezerIds: ["FRM-0042"], geofenceRadius: 60 },
        { id: "STORE-CUN-02", code: "50NCP", name: "OXXO Nichupté Mz 12", address: "Av. Nichupté esq. La Luna, Cancún", lat: 21.1482, lng: -86.8398, status: "in_progress", freezersCount: 1, freezerIds: ["FRM-0089"], geofenceRadius: 60 },
        { id: "STORE-CUN-03", code: "SOR-KB", name: "Soriana Híper Kabah", address: "Av. Kabah s/n, Cancún", lat: 21.1390, lng: -86.8520, status: "pending", freezersCount: 1, freezerIds: ["FRM-0115"], geofenceRadius: 90 },
        { id: "STORE-CUN-04", code: "50PLZ", name: "OXXO Plaza Las Américas", address: "Av. Tulum Sur #260, Cancún", lat: 21.1465, lng: -86.8225, status: "pending", freezersCount: 1, freezerIds: ["FRM-0198"], geofenceRadius: 60 }
      ];
    }
    if (!isUsingRealPhoneGps) return stores;
    const localOffsets = [
      { lat: 0.0032, lng: 0.0038 },   // ~450m NE
      { lat: -0.0041, lng: 0.0052 },  // ~650m SE
      { lat: 0.0065, lng: -0.0045 },  // ~850m NW
      { lat: -0.0072, lng: -0.0035 }, // ~950m SW
      { lat: 0.0085, lng: 0.0070 }    // ~1.3km NE
    ];
    return stores.map((store, idx) => {
      const offset = localOffsets[idx % localOffsets.length];
      return {
        ...store,
        lat: sellerLat + offset.lat,
        lng: sellerLng + offset.lng
      };
    });
  }, [stores, isUsingRealPhoneGps, isCancunMode, sellerLat, sellerLng]);

  // Switch between Real Phone GPS, Aguascalientes Route, and Cancun Demo modes
  const handleSwitchMode = (newMode) => {
    setMapLocationMode(newMode);
    setIsNavigating(false);
    setIsPaused(false);
    setNavProgressIndex(0);
    setHasArrived(false);
    setRoadRoute(null);

    setTimeout(() => {
      if (!mapInstanceRef.current) return;
      if (newMode === "real_phone_gps") {
        if (!phoneGpsLocation) {
          handleGetLivePhoneGps();
        } else {
          const localPoints = [
            [phoneGpsLocation.lat, phoneGpsLocation.lng],
            ...effectiveStores.map(s => [s.lat, s.lng])
          ];
          mapInstanceRef.current.fitBounds(L.latLngBounds(localPoints), { padding: [40, 40], maxZoom: 16 });
        }
      } else if (newMode === "ags_route") {
        // Real Aguascalientes coordinates from Ventas database
        const agsPoints = [
          [21.8853, -102.2916],
          ...stores.map(s => [s.lat, s.lng])
        ];
        mapInstanceRef.current.fitBounds(L.latLngBounds(agsPoints), { padding: [40, 40], maxZoom: 15 });
      } else {
        // Cancun demo
        const cancunPoints = [
          [21.1485, -86.8402],
          [21.1619, -86.8515],
          [21.1482, -86.8398],
          [21.1390, -86.8520],
          [21.1465, -86.8225]
        ];
        mapInstanceRef.current.fitBounds(L.latLngBounds(cancunPoints), { padding: [40, 40], maxZoom: 15 });
      }
    }, 150);
  };

  // Calculate distances for all stores and find the nearest one
  const storesWithDistance = useMemo(() => {
    return effectiveStores.map(store => {
      const distance = calculateDistanceMeters(sellerLat, sellerLng, store.lat, store.lng);
      return {
        ...store,
        distanceMeters: distance,
        isInsideGeofence: distance <= (store.geofenceRadius || 100)
      };
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [effectiveStores, sellerLat, sellerLng]);

  // Find nearest pending or in-progress store (or first store if all completed)
  const nearestStore = useMemo(() => {
    const unvisited = storesWithDistance.filter(s => s.status !== "completed");
    return unvisited[0] || storesWithDistance[0];
  }, [storesWithDistance]);

  // Selected store for detail HUD card & road trajectory routing
  const externalTargetId = initialStoreId || activeTargetStoreId;
  const [selectedStoreId, setSelectedStoreId] = useState(
    () => externalTargetId || nearestStore?.id || stores[0]?.id
  );

  // Synchronize ONLY when external prop changes, NEVER on GPS watch tick or nearestStore recalculation!
  const prevExternalPropIdRef = useRef(externalTargetId);

  useEffect(() => {
    const nextPropId = initialStoreId || activeTargetStoreId;
    if (nextPropId && nextPropId !== prevExternalPropIdRef.current) {
      prevExternalPropIdRef.current = nextPropId;
      setSelectedStoreId(nextPropId);
    } else if (!selectedStoreId && nearestStore?.id) {
      setSelectedStoreId(nearestStore.id);
    }
  }, [initialStoreId, activeTargetStoreId]);

  // Synchronized store selector: immediately locks destination on map and syncs with route cards
  const handleSelectTargetStore = (storeId, centerMap = true) => {
    if (!storeId) return;
    setSelectedStoreId(storeId);
    prevExternalPropIdRef.current = storeId;
    if (onSetActiveTargetStore) {
      onSetActiveTargetStore(storeId);
    }
    if (centerMap && mapInstanceRef.current) {
      const targetStore = effectiveStores.find((s) => s.id === storeId);
      if (targetStore) {
        mapInstanceRef.current.panTo([targetStore.lat, targetStore.lng], { animate: true, duration: 0.5 });
      }
    }
  };

  // Center on store handler for horizontal pills
  const handleCenterOnStore = (store) => {
    if (!store?.id) return;
    handleSelectTargetStore(store.id, true);
  };

  const activeStore = useMemo(() => {
    return storesWithDistance.find(s => s.id === selectedStoreId) || nearestStore || storesWithDistance[0];
  }, [selectedStoreId, storesWithDistance, nearestStore]);

  // Reset navigation when active store changes
  useEffect(() => {
    setIsNavigating(false);
    setIsPaused(false);
    setNavProgressIndex(0);
    setHasArrived(false);
  }, [activeStore?.id]);

  // Real street routing state & cache via OSRM (100% vialidades reales, curvas y giros)
  const [roadRoute, setRoadRoute] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const routesCacheRef = useRef({});

  // Fetch true turn-by-turn road geometry adhering to real street network
  useEffect(() => {
    if (!activeStore || !isOpen) return;

    const cacheKey = `${sellerLat.toFixed(4)},${sellerLng.toFixed(4)}->${activeStore.lat.toFixed(4)},${activeStore.lng.toFixed(4)}`;

    if (routesCacheRef.current[cacheKey]) {
      setRoadRoute(routesCacheRef.current[cacheKey]);
      return;
    }

    let isCancelled = false;
    setIsLoadingRoute(true);
    setRoadRoute(null);

    const fetchRoadRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${sellerLng},${sellerLat};${activeStore.lng},${activeStore.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Route network error");
        const data = await res.json();

        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM coordinates are [lng, lat], Leaflet polyline expects [lat, lng]
          const latLngCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const routeResult = {
            coordinates: latLngCoordinates,
            distanceMeters: Math.round(route.distance),
            durationMinutes: Math.max(1, Math.round(route.duration / 60))
          };

          routesCacheRef.current[cacheKey] = routeResult;
          if (!isCancelled) {
            setRoadRoute(routeResult);
          }
        } else {
          throw new Error("No route found");
        }
      } catch (err) {
        console.warn("OSRM routing fallback:", err);
        if (!isCancelled) {
          const dist = calculateDistanceMeters(sellerLat, sellerLng, activeStore.lat, activeStore.lng);
          setRoadRoute({
            coordinates: [[sellerLat, sellerLng], [activeStore.lat, activeStore.lng]],
            distanceMeters: Math.round(dist),
            durationMinutes: Math.max(1, Math.round(dist / 450))
          });
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingRoute(false);
        }
      }
    };

    fetchRoadRoute();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, activeStore, sellerLat, sellerLng]);

  // Real driving distance and time
  const streetDistanceMeters = roadRoute?.distanceMeters || activeStore?.distanceMeters || 900;
  const streetDrivingMinutes = roadRoute?.durationMinutes || Math.max(1, Math.round(streetDistanceMeters / 450));

  // Current car coordinates along route
  const currentCarCoord = useMemo(() => {
    if (roadRoute?.coordinates && navProgressIndex > 0 && navProgressIndex < roadRoute.coordinates.length) {
      return roadRoute.coordinates[navProgressIndex];
    }
    return [sellerLat, sellerLng];
  }, [roadRoute, navProgressIndex, sellerLat, sellerLng]);

  // Real-time remaining distance in meters to store
  const liveRemainingMeters = useMemo(() => {
    if (!activeStore) return 0;
    if (hasArrived) return 0;
    if (!isNavigating && navProgressIndex === 0) return streetDistanceMeters;
    return Math.round(calculateDistanceMeters(currentCarCoord[0], currentCarCoord[1], activeStore.lat, activeStore.lng));
  }, [isNavigating, hasArrived, navProgressIndex, currentCarCoord, activeStore, streetDistanceMeters]);

  // Percentage of route covered
  const progressPercent = useMemo(() => {
    if (hasArrived) return 100;
    if (!roadRoute?.coordinates || roadRoute.coordinates.length <= 1) return 0;
    return Math.min(100, Math.round((navProgressIndex / (roadRoute.coordinates.length - 1)) * 100));
  }, [hasArrived, roadRoute, navProgressIndex]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [sellerLat, sellerLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // OpenStreetMap standard tiles (100% libre, sin marcas de agua y sin requerir API Key)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Layer groups
    radarsGroupRef.current = L.layerGroup().addTo(map);
    markersGroupRef.current = L.layerGroup().addTo(map);
    routeLineRef.current = L.layerGroup().addTo(map);

    renderMapElements(map);

    setTimeout(() => {
      map.invalidateSize();
      fitMapBounds(map);
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Re-render markers and route when activeStore, roadRoute or data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMapElements(mapInstanceRef.current);
  }, [activeStore, storesWithDistance, sellerLat, sellerLng, roadRoute, phoneGpsLocation]);

  // Fit bounds to include seller and all active stores
  const fitMapBounds = (map) => {
    if (!map) return;
    const points = [[sellerLat, sellerLng], ...effectiveStores.map(s => [s.lat, s.lng])];
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  };

  // Render all map elements: Radars, Pins, Vendor Car, and Route Line
  const renderMapElements = (map) => {
    if (!radarsGroupRef.current || !markersGroupRef.current || !routeLineRef.current) return;

    // Clear previous layers
    radarsGroupRef.current.clearLayers();
    markersGroupRef.current.clearLayers();
    routeLineRef.current.clearLayers();

    // 1. RENDER RADARS AROUND EVERY STORE
    storesWithDistance.forEach(store => {
      const radius = store.geofenceRadius || 120;
      const isCompleted = store.status === "completed";
      const isInProgress = store.status === "in_progress";
      const isTarget = store.id === activeStore?.id;

      const radarColor = isCompleted 
        ? "#10b981" 
        : isInProgress 
        ? "#f59e0b" 
        : isTarget 
        ? "#059669" 
        : "#0284c7";

      const radarCircle = L.circle([store.lat, store.lng], {
        radius: radius,
        color: radarColor,
        weight: 1.5,
        opacity: isTarget ? 0.9 : 0.6,
        dashArray: "4, 6",
        fillColor: radarColor,
        fillOpacity: isTarget ? 0.16 : 0.08
      });
      radarsGroupRef.current.addLayer(radarCircle);

      // Store Marker Pin
      const storeIconHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -100%);">
          <!-- Pulsing Radar Animation Ripple -->
          <div class="absolute top-4 w-12 h-12 rounded-full pointer-events-none -translate-y-1/2" 
               style="background: radial-gradient(circle, ${radarColor}44 0%, transparent 70%); animation: frimart-radar-pulse 2s infinite ease-out;">
          </div>
          
          <!-- Store Marker Pin Card -->
          <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-md border transition-transform duration-200 hover:scale-110 ${
            isTarget 
              ? "bg-slate-900 text-white border-emerald-400 ring-2 ring-emerald-400/40" 
              : isCompleted
              ? "bg-white text-emerald-800 border-emerald-300 ring-1 ring-emerald-100"
              : isInProgress
              ? "bg-white text-amber-800 border-amber-300 ring-1 ring-amber-100"
              : "bg-white text-slate-800 border-slate-300"
          }">
            <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
              isCompleted 
                ? "bg-emerald-500 text-white" 
                : isInProgress 
                ? "bg-amber-500 text-white" 
                : "bg-slate-100 text-slate-700"
            }">
              <span style="font-size: 9px; font-weight: 800;">${
                isCompleted ? "✓" : isInProgress ? "●" : "🏪"
              }</span>
            </div>
            <span style="font-size: 10.5px; font-weight: 700; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">
              ${store.name.split("-")[0]?.trim()}
            </span>
          </div>

          <!-- Bottom Pin Pointer Triangle -->
          <div class="w-2 h-2 rotate-45 -mt-1 border-r border-b ${
            isTarget 
              ? "bg-slate-900 border-emerald-400" 
              : "bg-white border-slate-300"
          }"></div>
        </div>
      `;

      const storeMarker = L.marker([store.lat, store.lng], {
        icon: L.divIcon({
          html: storeIconHtml,
          className: "custom-store-pin",
          iconSize: [0, 0]
        })
      });

      storeMarker.on("click", () => {
        handleSelectTargetStore(store.id, true);
      });

      markersGroupRef.current.addLayer(storeMarker);
    });

    // 2. VENDOR REAL-TIME LOCATION WITH CUSTOM DELIVERY VAN ICON
    const carIconHtml = `
      <div class="relative flex flex-col items-center pointer-events-none" style="transform: translate(-50%, -50%);">
        <!-- Multi-stage GPS Pulse Halos -->
        <div class="absolute w-16 h-16 rounded-full ${isUsingRealPhoneGps ? "bg-sky-400/30" : "bg-emerald-500/20"} animate-ping"></div>
        <div class="absolute w-12 h-12 rounded-full ${isUsingRealPhoneGps ? "bg-sky-500/30" : "bg-emerald-500/30"}"></div>

        <!-- Custom Delivery Van Badge (Alta Definición Vectorial con halo de contraste) -->
        <div id="frimart-van-badge" class="relative flex items-center justify-center select-none" style="width: 72px; height: 54px; filter: drop-shadow(0 0 2px #ffffff) drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
          ${DELIVERY_VAN_SVG_HTML}
        </div>

        <!-- Real-Time Floating Badge -->
        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/95 text-white text-[9px] font-extrabold border ${isUsingRealPhoneGps ? "border-sky-400" : "border-emerald-400"} shadow-md whitespace-nowrap flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full ${isNavigating ? "bg-emerald-400 animate-ping" : isUsingRealPhoneGps ? "bg-sky-400" : "bg-emerald-400"}"></span>
          <span>${isNavigating ? "En camino..." : isUsingRealPhoneGps ? `Tú (GPS Real ±${phoneGpsLocation?.accuracy || 4}m)` : `Tú (${seller?.name?.split(" ")[0] || "Vendedor"})`}</span>
        </div>
      </div>
    `;

    // Accuracy Circle around Van when GPS is active
    if (isUsingRealPhoneGps && phoneGpsLocation?.accuracy) {
      const accuracyCircle = L.circle([sellerLat, sellerLng], {
        radius: Math.max(15, phoneGpsLocation.accuracy),
        color: "#0284c7",
        weight: 1.5,
        fillColor: "#38bdf8",
        fillOpacity: 0.15
      });
      radarsGroupRef.current.addLayer(accuracyCircle);
    }

    const carMarker = L.marker(currentCarCoord, {
      icon: L.divIcon({
        html: carIconHtml,
        className: "custom-car-pin",
        iconSize: [0, 0]
      }),
      zIndexOffset: 1000
    });
    markersGroupRef.current.addLayer(carMarker);
    carMarkerRef.current = carMarker;

    // 3. REAL STREET ROUTE TO TARGET STORE
    if (activeStore) {
      const coords = (roadRoute?.coordinates && roadRoute.coordinates.length > 1)
        ? roadRoute.coordinates
        : [[sellerLat, sellerLng], [activeStore.lat, activeStore.lng]];

      const currentIndex = Math.min(coords.length - 1, Math.max(0, navProgressIndex));

      if (isNavigating || navProgressIndex > 0) {
        // Path covered so far (Gray muted line showing completed stretch)
        const coveredPoints = coords.slice(0, currentIndex + 1);
        if (coveredPoints.length > 1) {
          const coveredLine = L.polyline(coveredPoints, {
            color: "#64748b",
            weight: 4,
            opacity: 0.6,
            dashArray: "3, 5",
            lineCap: "round"
          });
          routeLineRef.current.addLayer(coveredLine);
          coveredLineRef.current = coveredLine;
        }

        // Remaining Path to Destination (Vibrant pulsing emerald)
        const remainingPoints = coords.slice(currentIndex);
        if (remainingPoints.length > 1) {
          const remainingGlow = L.polyline(remainingPoints, {
            color: "#10b981",
            weight: 8,
            opacity: 0.4,
            lineCap: "round",
            lineJoin: "round"
          });
          routeLineRef.current.addLayer(remainingGlow);
          remainingGlowRef.current = remainingGlow;

          const remainingLine = L.polyline(remainingPoints, {
            color: "#059669",
            weight: 5,
            opacity: 0.95,
            dashArray: "8, 10",
            lineCap: "round",
            lineJoin: "round"
          });
          routeLineRef.current.addLayer(remainingLine);
          remainingLineRef.current = remainingLine;
        }
      } else {
        // Full route before starting trip
        const glowLine = L.polyline(coords, {
          color: "#10b981",
          weight: 8,
          opacity: 0.35,
          lineCap: "round",
          lineJoin: "round"
        });
        routeLineRef.current.addLayer(glowLine);

        const mainRouteLine = L.polyline(coords, {
          color: "#059669",
          weight: 4.5,
          opacity: 0.95,
          dashArray: "8, 10",
          lineCap: "round",
          lineJoin: "round"
        });
        routeLineRef.current.addLayer(mainRouteLine);
      }
    }
  };

  // TRIP NAVIGATION TICKER: Moves car smoothly along street route
  useEffect(() => {
    if (!isNavigating || isPaused || hasArrived || !roadRoute?.coordinates || roadRoute.coordinates.length < 2) {
      if (navIntervalRef.current) {
        clearInterval(navIntervalRef.current);
        navIntervalRef.current = null;
      }
      return;
    }

    const intervalMs = Math.max(35, Math.round(150 / navSpeed));

    navIntervalRef.current = setInterval(() => {
      setNavProgressIndex(prev => {
        const coords = roadRoute.coordinates;
        const total = coords.length;
        const next = prev + 1;

        if (next >= total) {
          // Reached the destination!
          setHasArrived(true);
          setIsNavigating(false);
          clearInterval(navIntervalRef.current);
          if (mapInstanceRef.current && coords[total - 1]) {
            mapInstanceRef.current.flyTo(coords[total - 1], 16, { duration: 0.5 });
          }
          return total - 1;
        }

        const curCoord = coords[next];

        // Move delivery van marker smoothly without rotating (stays upright)
        if (carMarkerRef.current) {
          carMarkerRef.current.setLatLng(curCoord);
        }

        // Camera follow car
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(curCoord, { animate: true, duration: 0.12 });
        }

        // Update route lines: covered vs remaining
        if (coveredLineRef.current) {
          coveredLineRef.current.setLatLngs(coords.slice(0, next + 1));
        }
        if (remainingLineRef.current) {
          remainingLineRef.current.setLatLngs(coords.slice(next));
        }
        if (remainingGlowRef.current) {
          remainingGlowRef.current.setLatLngs(coords.slice(next));
        }

        // Check if inside destination radar
        const distRemaining = calculateDistanceMeters(curCoord[0], curCoord[1], activeStore.lat, activeStore.lng);
        if (distRemaining <= (activeStore.geofenceRadius || 120)) {
          setHasArrived(true);
          setIsNavigating(false);
          clearInterval(navIntervalRef.current);
          return next;
        }

        return next;
      });
    }, intervalMs);

    return () => {
      if (navIntervalRef.current) {
        clearInterval(navIntervalRef.current);
        navIntervalRef.current = null;
      }
    };
  }, [isNavigating, isPaused, hasArrived, roadRoute, navSpeed, activeStore]);

  // Trip Controls
  const handleStartNavigation = () => {
    if (!roadRoute?.coordinates || roadRoute.coordinates.length < 2) return;
    if (activeStore?.id) {
      handleSelectTargetStore(activeStore.id, false);
    }
    setIsNavigating(true);
    setIsPaused(false);
    setHasArrived(false);
    setNavProgressIndex(0);

    // Zoom camera in on the car
    const startCoord = roadRoute.coordinates[0];
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(startCoord, 17, { duration: 0.8 });
    }
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleCycleSpeed = () => {
    setNavSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setIsPaused(false);
    setNavProgressIndex(0);
    setHasArrived(false);
    if (carMarkerRef.current) {
      carMarkerRef.current.setLatLng([sellerLat, sellerLng]);
    }
    if (mapInstanceRef.current) {
      fitMapBounds(mapInstanceRef.current);
    }
  };

  const handleFastForwardArrival = () => {
    if (!roadRoute?.coordinates) return;
    const lastIndex = roadRoute.coordinates.length - 1;
    const destCoord = roadRoute.coordinates[lastIndex];
    setNavProgressIndex(lastIndex);
    if (carMarkerRef.current) {
      carMarkerRef.current.setLatLng(destCoord);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(destCoord, 16, { duration: 0.5 });
    }
    setHasArrived(true);
    setIsNavigating(false);
  };

  // Center on car
  const handleCenterOnCar = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(currentCarCoord, 17, { duration: 0.8 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      {/* Container constrained to mobile frame */}
      <div className="relative w-full h-full max-w-md mx-auto bg-[#f8fafc] flex flex-col overflow-hidden shadow-2xl">
        
        {/* 1. TOP FLOATING NAVIGATION HEADER */}
        {isNavigating ? (
          <div className="absolute top-0 inset-x-0 z-30 p-3 sm:pt-11 pointer-events-none animate-slide-down">
            <div className="pointer-events-auto rounded-[22px] bg-slate-950/95 backdrop-blur-md text-white p-3.5 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-10 rounded-xl bg-slate-900 border border-slate-700 p-1 flex items-center justify-center shadow-lg shrink-0">
                  <DeliveryVanIcon className="w-8 h-7" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      {liveRemainingMeters > 0 ? `A ${liveRemainingMeters}m` : "Llegando"}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      {isPaused ? "En Pausa" : `~${35 * navSpeed} km/h`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[150px] block mt-0.5">
                    Hacia {activeStore.name.split("-")[0]?.trim()}
                  </span>
                </div>
              </div>

              {/* Controls: Speed, Pause, FastForward, Stop */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCycleSpeed}
                  className="tap-effect h-8 px-2 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 text-[11px] font-extrabold hover:bg-slate-700 transition cursor-pointer"
                  title="Cambiar velocidad de animación"
                >
                  {navSpeed}x
                </button>

                <button
                  onClick={handleTogglePause}
                  className="tap-effect w-8 h-8 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition cursor-pointer"
                  title={isPaused ? "Reanudar viaje" : "Pausar viaje"}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-white text-white" /> : <Pause className="w-3.5 h-3.5 fill-white text-white" />}
                </button>

                <button
                  onClick={handleFastForwardArrival}
                  className="tap-effect w-8 h-8 rounded-xl bg-slate-800 text-sky-400 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition cursor-pointer"
                  title="Simular llegada inmediata"
                >
                  <FastForward className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleStopNavigation}
                  className="tap-effect w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/30 transition cursor-pointer"
                  title="Detener viaje"
                >
                  <Square className="w-3 h-3 fill-rose-400 text-rose-400" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute top-0 inset-x-0 z-30 p-2.5 sm:pt-11 flex flex-col gap-1.5 pointer-events-none">
            <div className="flex items-center justify-between gap-2">
              {/* Back button */}
              <button
                onClick={onClose}
                className="tap-effect pointer-events-auto h-9 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-slate-100 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                <span>Volver</span>
              </button>

              {/* Mode Toggle Switch: [ 📍 Mi GPS ] [ 🏢 Aguascalientes ] [ 🏝️ Cancún ] */}
              <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md">
                <button
                  onClick={() => handleSwitchMode("real_phone_gps")}
                  className={`tap-effect px-2 py-1 rounded-xl text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    mapLocationMode === "real_phone_gps"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Usar la ubicación en tiempo real de tu celular"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${phoneGpsLocation ? "bg-sky-400 animate-ping" : "bg-emerald-400"}`} />
                  <span>Mi GPS</span>
                </button>

                <button
                  onClick={() => handleSwitchMode("ags_route")}
                  className={`tap-effect px-2 py-1 rounded-xl text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    mapLocationMode === "ags_route"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Ruta de Puntos de Venta Reales CEDIS Aguascalientes"
                >
                  <span>🏢 Aguascalientes</span>
                </button>

                <button
                  onClick={() => handleSwitchMode("cancun_demo")}
                  className={`tap-effect px-1.5 py-1 rounded-xl text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    mapLocationMode === "cancun_demo"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Ver la ruta de demostración de Cancún"
                >
                  <span>🏝️ Cancún</span>
                </button>
              </div>
            </div>

            {/* CEDIS Aguascalientes Banner Pill */}
            {mapLocationMode === "ags_route" && (
              <div className="self-center pointer-events-auto">
                <div className="px-3 py-1 rounded-full bg-emerald-950/90 text-white backdrop-blur-md border border-emerald-700 shadow-md text-[10px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300 font-semibold">CEDIS Aguascalientes (1205)</span>
                  <span className="text-emerald-100/70 font-mono">• {stores.length} Clientes de Base de Datos</span>
                </div>
              </div>
            )}

            {/* GPS Telemetry notification sub-pill if in real GPS mode */}
            {mapLocationMode === "real_phone_gps" && (
              <div className="self-center pointer-events-auto">
                <button
                  onClick={handleGetLivePhoneGps}
                  className="px-3 py-1 rounded-full bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 shadow-md text-[10px] flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                >
                  {isLocatingPhone ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-amber-300 font-medium">Buscando satélites GPS...</span>
                    </>
                  ) : phoneGpsLocation ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span className="text-sky-300 font-semibold">GPS Conectado (±{phoneGpsLocation.accuracy}m precisión)</span>
                      <span className="text-slate-400 font-mono">• Toca para recentrar</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span className="text-rose-300 font-semibold">GPS no detectado</span>
                      <span className="text-slate-300 underline font-bold ml-1">Toca para activar</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. LEAFLET INTERACTIVE MAP CANVAS */}
        <div className="flex-1 w-full h-full relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Controls: Center on Phone, Center on Car & Re-fit Bounds */}
          <div className="absolute right-3 bottom-56 z-30 flex flex-col gap-2">
            {/* Real Phone GPS center button */}
            <button
              onClick={handleGetLivePhoneGps}
              className={`tap-effect w-11 h-11 rounded-2xl bg-white border border-slate-300 shadow-lg flex items-center justify-center transition cursor-pointer ${
                phoneGpsLocation ? "text-sky-600 border-sky-300 ring-2 ring-sky-400/30" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Centrar en la ubicación GPS de mi celular"
            >
              <LocateFixed className={`w-5 h-5 ${isLocatingPhone ? "animate-spin text-sky-500" : ""}`} />
            </button>

            <button
              onClick={handleCenterOnCar}
              className={`tap-effect w-11 h-11 rounded-2xl bg-white border border-slate-300 text-slate-800 shadow-lg flex items-center justify-center hover:bg-emerald-50 transition cursor-pointer p-1 ${
                isNavigating ? "ring-2 ring-emerald-500" : ""
              }`}
              title="Centrar en mi camioneta (GPS)"
            >
              <DeliveryVanIcon className="w-8 h-6" />
            </button>

            <button
              onClick={() => fitMapBounds(mapInstanceRef.current)}
              className="tap-effect w-11 h-11 rounded-2xl bg-white border border-slate-300 text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
              title="Ver toda la ruta completa"
            >
              <Compass className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. BOTTOM FLOATING HUD: TRIP NAVIGATION / STORE DETAIL */}
        {activeStore && (
          <div className="relative z-30 px-3 pb-3 -mt-6">
            
            {/* A. ARRIVAL STATE: Destination Reached! */}
            {hasArrived ? (
              <div className="p-4 rounded-[22px] bg-white border-2 border-emerald-500 shadow-2xl space-y-3 animate-fade-in">
                <div className="flex items-center gap-3 text-emerald-900 bg-emerald-50/90 p-3 rounded-2xl border border-emerald-200">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">¡Has llegado a tu destino!</h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Dentro del radar de <strong>{activeStore.name}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectStore(activeStore);
                    }}
                    className="tap-effect flex-1 h-10 rounded-xl bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#047857] transition cursor-pointer shadow-md"
                  >
                    <span>Iniciar Visita en Tienda</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {activeStore.freezersCount > 0 && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPlanogram(activeStore.freezerIds[0]);
                      }}
                      className="tap-effect h-10 px-3 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-300 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                      title="Auditar Planograma"
                    >
                      <Snowflake className="w-4 h-4" />
                      <span>Planograma</span>
                    </button>
                  )}

                  <button
                    onClick={handleStopNavigation}
                    className="tap-effect h-10 px-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
                    title="Reiniciar viaje"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : isNavigating ? (
              /* B. ACTIVE TRIP NAVIGATION HUD: Real-time progress tracking */
              <div className="p-4 rounded-[22px] bg-white border border-slate-300 shadow-xl space-y-3 animate-fade-in">
                {/* Trip Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Progreso de Ruta: {progressPercent}%
                    </span>
                    <span className="font-bold text-[#059669] font-mono">
                      Restan {liveRemainingMeters}m
                    </span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-[#10b981] rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Target Store & Geofence Status */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="leading-snug">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{activeStore.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{activeStore.address}</p>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Radar: {activeStore.geofenceRadius || 120}m
                  </span>
                </div>

                {/* Action buttons during navigation */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleFastForwardArrival}
                    className="tap-effect flex-1 h-9 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Llegar Inmediatamente</span>
                  </button>

                  <button
                    onClick={handleStopNavigation}
                    className="tap-effect h-9 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Detener
                  </button>
                </div>
              </div>
            ) : (
              /* C. DEFAULT PRE-TRIP HUD: Overview & Iniciar Viaje Button */
              <div className="p-4 rounded-[22px] bg-white border border-slate-300 shadow-xl space-y-3">
                {/* Route Trajectory Banner */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                      {activeStore.id === (activeTargetStoreId || selectedStoreId)
                        ? "🎯 Siguiente a Atender"
                        : "Destino en Vista"}
                    </span>
                    <span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Navigation className="w-2.5 h-2.5 rotate-45" />
                      <span>Calles reales</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    <DeliveryVanIcon className="w-5 h-4 shrink-0" />
                    <span>
                      {streetDistanceMeters >= 1000
                        ? `${(streetDistanceMeters / 1000).toFixed(1)} km`
                        : `${streetDistanceMeters}m`} • ~{streetDrivingMinutes} min
                    </span>
                    {isLoadingRoute && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-0.5" title="Trazando por calles..." />
                    )}
                  </div>
                </div>

                {/* Store Identity & Geofence Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug truncate">
                        {activeStore.name}
                      </h3>
                      {activeStore.id === (activeTargetStoreId || selectedStoreId) ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-black border border-emerald-300">
                          ✓ Siguiente
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectTargetStore(activeStore.id, false)}
                          className="tap-effect shrink-0 px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[9.5px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
                          title="Fijar esta tienda como el siguiente punto a atender"
                        >
                          <span>🎯 Fijar siguiente</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {isUsingRealPhoneGps 
                        ? `A ${Math.round(activeStore.distanceMeters)}m de tu ubicación • Simulación en tu zona` 
                        : activeStore.address}
                    </p>
                  </div>

                  {/* Radar status */}
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border flex items-center gap-1 ${
                    activeStore.isInsideGeofence
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeStore.isInsideGeofence ? "bg-emerald-500 animate-ping" : "bg-sky-500"}`} />
                    {activeStore.isInsideGeofence ? "Dentro de Radar" : `Radar ${activeStore.geofenceRadius || 120}m`}
                  </span>
                </div>

                {/* Horizontal Store Switcher Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wide">
                    Paradas ({stores.length}):
                  </span>
                  {storesWithDistance.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleCenterOnStore(s)}
                      className={`tap-effect px-2.5 py-1 rounded-xl text-[10.5px] font-semibold shrink-0 border transition-all cursor-pointer ${
                        s.id === activeStore.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s.status === "completed" && "✓ "}
                      {s.name.split("-")[0]?.trim()} ({Math.round(s.distanceMeters)}m)
                    </button>
                  ))}
                </div>

                {/* Action Buttons: 1) Iniciar Viaje (Primary) | 2) Iniciar Visita | 3) Planograma */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  {/* Botón Principal: Iniciar Viaje */}
                  <button
                    onClick={handleStartNavigation}
                    disabled={isLoadingRoute}
                    className="tap-effect flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-[#059669] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50"
                  >
                    <Navigation className="w-4 h-4 -rotate-45 stroke-[2.5] animate-pulse" />
                    <span>Iniciar Viaje</span>
                  </button>

                  {/* Botón Visitar directo */}
                  <button
                    onClick={() => {
                      onClose();
                      onSelectStore(activeStore);
                    }}
                    className="tap-effect h-10 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                    title="Registrar o ver detalle de visita"
                  >
                    <span>Visitar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Planogram Shortcut if has freezer */}
                  {activeStore.freezersCount > 0 && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPlanogram(activeStore.freezerIds[0]);
                      }}
                      className="tap-effect h-10 px-2.5 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                      title="Auditar Planograma de Congelador"
                    >
                      <Snowflake className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Global CSS for Leaflet Radar Pulsing Animation */}
      <style>{`
        @keyframes frimart-radar-pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          70% {
            transform: scale(2.8);
            opacity: 0.15;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
          }
        }
        .custom-store-pin {
          background: transparent !important;
          border: none !important;
        }
        .custom-car-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
