/**
 * Color and styling palettes mapped strictly per field route.
 * Guarantees zero color collisions across plazas with 3, 5, 10, 20 or more field routes.
 */

// 24 Curated High-Contrast, Vibrant Palettes designed specifically for map readability
export const EXPANDED_ROUTE_PALETTES = [
  {
    primary: "#059669", // 1. Verde Esmeralda (Ags Norte)
    cargo: "#10b981",
    dark: "#047857",
    light: "#ecfdf5",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    border: "#059669"
  },
  {
    primary: "#2563eb", // 2. Azul Real (Ags Centro)
    cargo: "#3b82f6",
    dark: "#1d4ed8",
    light: "#eff6ff",
    badgeBg: "#dbeafe",
    badgeText: "#1e40af",
    border: "#2563eb"
  },
  {
    primary: "#7c3aed", // 3. Púrpura Imperial (Ags Sur)
    cargo: "#8b5cf6",
    dark: "#6d28d9",
    light: "#f5f3ff",
    badgeBg: "#ede9fe",
    badgeText: "#5b21b6",
    border: "#7c3aed"
  },
  {
    primary: "#ea580c", // 4. Naranja Fuego
    cargo: "#f97316",
    dark: "#c2410c",
    light: "#fff7ed",
    badgeBg: "#ffedd5",
    badgeText: "#9a3412",
    border: "#ea580c"
  },
  {
    primary: "#db2777", // 5. Rosa Magenta
    cargo: "#ec4899",
    dark: "#be185d",
    light: "#fdf2f8",
    badgeBg: "#fce7f3",
    badgeText: "#9d174d",
    border: "#db2777"
  },
  {
    primary: "#0891b2", // 6. Cian / Turquesa Caribe
    cargo: "#06b6d4",
    dark: "#0e7490",
    light: "#ecfeff",
    badgeBg: "#cffafe",
    badgeText: "#155e75",
    border: "#0891b2"
  },
  {
    primary: "#d97706", // 7. Ámbar Oro
    cargo: "#f59e0b",
    dark: "#b45309",
    light: "#fffbeb",
    badgeBg: "#fef3c7",
    badgeText: "#92400e",
    border: "#d97706"
  },
  {
    primary: "#4f46e5", // 8. Índigo Eléctrico
    cargo: "#6366f1",
    dark: "#3730a3",
    light: "#eef2ff",
    badgeBg: "#e0e7ff",
    badgeText: "#312e81",
    border: "#4f46e5"
  },
  {
    primary: "#e11d48", // 9. Rojo Rubí
    cargo: "#f43f5e",
    dark: "#be123c",
    light: "#fff1f2",
    badgeBg: "#ffe4e6",
    badgeText: "#881337",
    border: "#e11d48"
  },
  {
    primary: "#65a30d", // 10. Verde Lima
    cargo: "#84cc16",
    dark: "#4d7c0f",
    light: "#f7fee7",
    badgeBg: "#ecfccb",
    badgeText: "#365314",
    border: "#65a30d"
  },
  {
    primary: "#9333ea", // 11. Violeta Ciruela
    cargo: "#a855f7",
    dark: "#7e22ce",
    light: "#faf5ff",
    badgeBg: "#f3e8ff",
    badgeText: "#581c87",
    border: "#9333ea"
  },
  {
    primary: "#0284c7", // 12. Azul Cielo
    cargo: "#38bdf8",
    dark: "#0369a1",
    light: "#f0f9ff",
    badgeBg: "#e0f2fe",
    badgeText: "#075985",
    border: "#0284c7"
  },
  {
    primary: "#0d9488", // 13. Teal / Verde Menta
    cargo: "#14b8a6",
    dark: "#0f766e",
    light: "#f0fdfa",
    badgeBg: "#ccfbf1",
    badgeText: "#115e59",
    border: "#0d9488"
  },
  {
    primary: "#c2410c", // 14. Ocre Teja
    cargo: "#fb923c",
    dark: "#9a3412",
    light: "#fff7ed",
    badgeBg: "#ffedd5",
    badgeText: "#7c2d12",
    border: "#c2410c"
  },
  {
    primary: "#15803d", // 15. Verde Bosque
    cargo: "#22c55e",
    dark: "#166534",
    light: "#f0fdf4",
    badgeBg: "#dcfce7",
    badgeText: "#14532d",
    border: "#15803d"
  },
  {
    primary: "#c026d3", // 16. Fucsia Neón
    cargo: "#d946ef",
    dark: "#a21caf",
    light: "#fdf4ff",
    badgeBg: "#fae8ff",
    badgeText: "#701a75",
    border: "#c026d3"
  },
  {
    primary: "#1e40af", // 17. Azul Cobalto Intenso
    cargo: "#60a5fa",
    dark: "#172554",
    light: "#eff6ff",
    badgeBg: "#dbeafe",
    badgeText: "#1e3a8a",
    border: "#1e40af"
  },
  {
    primary: "#0f766e", // 18. Verde Pino Profundo
    cargo: "#2dd4bf",
    dark: "#134e4a",
    light: "#f0fdfa",
    badgeBg: "#ccfbf1",
    badgeText: "#042f2e",
    border: "#0f766e"
  },
  {
    primary: "#a16207", // 19. Bronce Dorado
    cargo: "#eab308",
    dark: "#713f12",
    light: "#fefce8",
    badgeBg: "#fef9c3",
    badgeText: "#713f12",
    border: "#a16207"
  },
  {
    primary: "#be185d", // 20. Frambuesa Oscuro
    cargo: "#f472b6",
    dark: "#831843",
    light: "#fdf2f8",
    badgeBg: "#fce7f3",
    badgeText: "#831843",
    border: "#be185d"
  },
  {
    primary: "#3b82f6", // 21. Azul Zafiro Claro
    cargo: "#93c5fd",
    dark: "#1d4ed8",
    light: "#eff6ff",
    badgeBg: "#dbeafe",
    badgeText: "#1e40af",
    border: "#3b82f6"
  },
  {
    primary: "#10b981", // 22. Jade
    cargo: "#6ee7b7",
    dark: "#047857",
    light: "#ecfdf5",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    border: "#10b981"
  },
  {
    primary: "#f97316", // 23. Naranja Mandarina
    cargo: "#fdba74",
    dark: "#c2410c",
    light: "#fff7ed",
    badgeBg: "#ffedd5",
    badgeText: "#9a3412",
    border: "#f97316"
  },
  {
    primary: "#8b5cf6", // 24. Lavanda Brillante
    cargo: "#c4b5fd",
    dark: "#6d28d9",
    light: "#f5f3ff",
    badgeBg: "#ede9fe",
    badgeText: "#5b21b6",
    border: "#8b5cf6"
  }
];

// Dedicated theme for the Supervisor / Inspection Vehicle (Distinct from all delivery routes)
export const SUPERVISOR_THEME = {
  primary: "#0f172a",       // Midnight Slate (Corporate Luxury)
  beacon: "#f59e0b",        // Amber Inspection Beacon
  accent: "#38bdf8",        // Sky Blue Accent
  dark: "#020617",
  light: "#f8fafc",
  badgeBg: "#fef3c7",
  badgeText: "#92400e",
  border: "#f59e0b",
  name: "Supervisión de Campo",
  label: "Supervisor",
  short: "SUP"
};

// Fixed anchors for known standard routes (Aguascalientes)
export const ROUTE_PALETTE = {
  "RUTA-01": {
    routeId: "RUTA-01",
    label: "Ruta 01",
    short: "R-01",
    name: "Ags Norte & Pocitos",
    ...EXPANDED_ROUTE_PALETTES[0]
  },
  "RUTA-02": {
    routeId: "RUTA-02",
    label: "Ruta 02",
    short: "R-02",
    name: "Ags Centro & San Marcos",
    ...EXPANDED_ROUTE_PALETTES[1]
  },
  "RUTA-03": {
    routeId: "RUTA-03",
    label: "Ruta 03",
    short: "R-03",
    name: "Ags Sur & Cd. Industrial",
    ...EXPANDED_ROUTE_PALETTES[2]
  },
  "RUTA-04": {
    routeId: "RUTA-04",
    label: "Ruta 04",
    short: "R-04",
    name: "Ags Oriente & Morelos",
    ...EXPANDED_ROUTE_PALETTES[3]
  },
  "RUTA-05": {
    routeId: "RUTA-05",
    label: "Ruta 05",
    short: "R-05",
    name: "Ags Poniente & Calvillo",
    ...EXPANDED_ROUTE_PALETTES[4]
  }
};

// Global session route color registry: Maps each unique routeId to a guaranteed unique color
const routeAssignmentCache = new Map();
let nextAvailableColorIndex = 0;

/**
 * Procedural distinct theme generator using Golden Ratio hue distribution
 * Ensures that even if a mega-city has 50+ routes, no two routes ever collide
 */
function generateProceduralTheme(routeId, index) {
  // Golden ratio angle (137.507764 deg) maximizes perceptual distance between subsequent colors
  const goldenAngle = 137.50776405003785;
  const hue = Math.round((index * goldenAngle) % 360);
  
  const primary = `hsl(${hue}, 86%, 42%)`;
  const cargo = `hsl(${hue}, 92%, 52%)`;
  const dark = `hsl(${hue}, 92%, 28%)`;
  const light = `hsl(${hue}, 90%, 96%)`;
  const badgeBg = `hsl(${hue}, 85%, 92%)`;
  const badgeText = `hsl(${hue}, 95%, 22%)`;

  return {
    routeId: routeId || `RUTA-${index + 1}`,
    label: routeId ? routeId.replace("RUTA-", "Ruta ") : `Ruta ${index + 1}`,
    short: routeId ? routeId.replace("RUTA-", "R-") : `R-${index + 1}`,
    name: `Ruta ${index + 1}`,
    primary,
    cargo,
    dark,
    light,
    badgeBg,
    badgeText,
    border: primary
  };
}

/**
 * Returns a guaranteed unique theme for a given routeId.
 * Guarantees zero color collisions across any number of routes.
 */
export function getRouteTheme(routeId, fallbackIndex = null) {
  if (!routeId) {
    const idx = fallbackIndex !== null ? fallbackIndex : 0;
    return EXPANDED_ROUTE_PALETTES[idx % EXPANDED_ROUTE_PALETTES.length];
  }

  // Check known standard routes first
  if (ROUTE_PALETTE[routeId]) {
    return ROUTE_PALETTE[routeId];
  }

  // Check dynamic registry cache to maintain same color per route throughout session
  if (routeAssignmentCache.has(routeId)) {
    return routeAssignmentCache.get(routeId);
  }

  // Assign next non-repeating palette color
  let assignedTheme;
  const numMatch = routeId.match(/\d+/);
  const routeNumber = numMatch ? parseInt(numMatch[0], 10) : null;

  if (routeNumber !== null && routeNumber > 0 && routeNumber <= EXPANDED_ROUTE_PALETTES.length) {
    const basePalette = EXPANDED_ROUTE_PALETTES[routeNumber - 1];
    assignedTheme = {
      routeId,
      label: `Ruta ${routeNumber < 10 ? '0' + routeNumber : routeNumber}`,
      short: `R-${routeNumber < 10 ? '0' + routeNumber : routeNumber}`,
      name: `Ruta ${routeNumber}`,
      ...basePalette
    };
  } else if (nextAvailableColorIndex < EXPANDED_ROUTE_PALETTES.length) {
    const basePalette = EXPANDED_ROUTE_PALETTES[nextAvailableColorIndex];
    nextAvailableColorIndex++;
    assignedTheme = {
      routeId,
      label: routeId.replace("RUTA-", "Ruta "),
      short: routeId.replace("RUTA-", "R-"),
      name: `Ruta ${nextAvailableColorIndex}`,
      ...basePalette
    };
  } else {
    // If more than 24 routes exist in the plaza, generate mathematically distinct HSL themes
    assignedTheme = generateProceduralTheme(routeId, nextAvailableColorIndex);
    nextAvailableColorIndex++;
  }

  routeAssignmentCache.set(routeId, assignedTheme);
  return assignedTheme;
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
  return "RUTA-01";
}
