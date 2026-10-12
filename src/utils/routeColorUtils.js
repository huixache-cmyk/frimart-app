/**
 * Color and styling palettes mapped strictly per field route.
 * Ensures consistent color association between delivery trucks and their assigned stores.
 */
export const ROUTE_PALETTE = {
  "RUTA-01": {
    routeId: "RUTA-01",
    label: "Ruta 01",
    short: "R-01",
    name: "Ags Norte & Pocitos",
    primary: "#059669",      // Vibrant Emerald Green
    cargo: "#10b981",        // Bright Cargo Box Green
    dark: "#047857",
    light: "#ecfdf5",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    border: "#059669",
    radarFill: "rgba(5, 150, 105, 0.18)",
    radarStroke: "#059669",
    hexText: "#ffffff"
  },
  "RUTA-02": {
    routeId: "RUTA-02",
    label: "Ruta 02",
    short: "R-02",
    name: "Ags Centro & San Marcos",
    primary: "#2563eb",      // Vibrant Royal Blue
    cargo: "#3b82f6",        // Bright Cargo Box Blue
    dark: "#1d4ed8",
    light: "#eff6ff",
    badgeBg: "#dbeafe",
    badgeText: "#1e40af",
    border: "#2563eb",
    radarFill: "rgba(37, 99, 235, 0.18)",
    radarStroke: "#2563eb",
    hexText: "#ffffff"
  },
  "RUTA-03": {
    routeId: "RUTA-03",
    label: "Ruta 03",
    short: "R-03",
    name: "Ags Sur & Cd. Industrial",
    primary: "#7c3aed",      // Vibrant Imperial Purple
    cargo: "#8b5cf6",        // Bright Cargo Box Purple
    dark: "#6d28d9",
    light: "#f5f3ff",
    badgeBg: "#ede9fe",
    badgeText: "#5b21b6",
    border: "#7c3aed",
    radarFill: "rgba(124, 58, 237, 0.18)",
    radarStroke: "#7c3aed",
    hexText: "#ffffff"
  },
  "RUTA-04": {
    routeId: "RUTA-04",
    label: "Ruta 04",
    short: "R-04",
    name: "Ags Oriente",
    primary: "#ea580c",      // Vibrant Warm Orange
    cargo: "#f97316",
    dark: "#c2410c",
    light: "#fff7ed",
    badgeBg: "#ffedd5",
    badgeText: "#9a3412",
    border: "#ea580c",
    radarFill: "rgba(234, 88, 12, 0.18)",
    radarStroke: "#ea580c",
    hexText: "#ffffff"
  },
  "RUTA-CUN": {
    routeId: "RUTA-CUN",
    label: "Ruta Cancún",
    short: "R-CUN",
    name: "Cancún Zona Hotelera",
    primary: "#0891b2",      // Cyan / Teal
    cargo: "#06b6d4",
    dark: "#0e7490",
    light: "#ecfeff",
    badgeBg: "#cffafe",
    badgeText: "#155e75",
    border: "#0891b2",
    radarFill: "rgba(8, 145, 178, 0.18)",
    radarStroke: "#0891b2",
    hexText: "#ffffff"
  }
};

const DYNAMIC_FALLBACK_PALETTE = [
  ROUTE_PALETTE["RUTA-01"],
  ROUTE_PALETTE["RUTA-02"],
  ROUTE_PALETTE["RUTA-03"],
  ROUTE_PALETTE["RUTA-04"],
  {
    routeId: "RUTA-05",
    label: "Ruta 05",
    short: "R-05",
    name: "Ags Poniente",
    primary: "#db2777",
    cargo: "#ec4899",
    dark: "#be185d",
    light: "#fdf2f8",
    badgeBg: "#fce7f3",
    badgeText: "#9d174d",
    border: "#db2777",
    radarFill: "rgba(219, 39, 119, 0.18)",
    radarStroke: "#db2777",
    hexText: "#ffffff"
  },
  {
    routeId: "RUTA-06",
    label: "Ruta 06",
    short: "R-06",
    name: "Ags Metrópoli",
    primary: "#0d9488",
    cargo: "#14b8a6",
    dark: "#0f766e",
    light: "#f0fdfa",
    badgeBg: "#ccfbf1",
    badgeText: "#115e59",
    border: "#0d9488",
    radarFill: "rgba(13, 148, 136, 0.18)",
    radarStroke: "#0d9488",
    hexText: "#ffffff"
  }
];

/**
 * Returns the theme object for a given routeId.
 * Guarantees a valid, high-contrast, beautiful palette.
 */
export function getRouteTheme(routeId, fallbackIndex = 0) {
  if (routeId && ROUTE_PALETTE[routeId]) {
    return ROUTE_PALETTE[routeId];
  }
  
  if (typeof routeId === "string") {
    const num = parseInt(routeId.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num > 0) {
      return DYNAMIC_FALLBACK_PALETTE[(num - 1) % DYNAMIC_FALLBACK_PALETTE.length];
    }
    const hash = routeId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DYNAMIC_FALLBACK_PALETTE[hash % DYNAMIC_FALLBACK_PALETTE.length];
  }

  return DYNAMIC_FALLBACK_PALETTE[fallbackIndex % DYNAMIC_FALLBACK_PALETTE.length];
}

/**
 * Resolves the routeId for a store object.
 */
export function getStoreRouteId(store, assignedVendors = []) {
  if (store?.routeId) return store.routeId;
  if (store?.vendorId && assignedVendors.length > 0) {
    const vendor = assignedVendors.find((v) => v.id === store.vendorId);
    if (vendor?.routeId) return vendor.routeId;
  }
  // Default to RUTA-01 if unspecified
  return "RUTA-01";
}
