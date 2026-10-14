// Base de Datos Central y Modelos Maestros para Frimart OS & La Huerta

export const INITIAL_SELLER = {
  id: "VEND-104",
  name: "Juan Pablo Morales",
  route: "Ruta 01 - Comercial & Detalle Aguascalientes",
  cedis: "CEDIS Aguascalientes (1205)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  currentLocation: {
    lat: 21.8853,
    lng: -102.2916,
    accuracy: 6, // metros
    timestamp: new Date().toISOString()
  },
  dailyGoal: {
    targetAmount: 38000,
    currentAmount: 26850,
    targetBoxes: 150,
    currentBoxes: 104,
    targetVisits: 7,
    completedVisits: 2,
    inProgressVisits: 1,
    commissionRate: 0.04
  }
};

export const LA_HUERTA_SKUS = [
  {
    id: "LH-101",
    name: "Mezcla California",
    brand: "La Huerta",
    weight: "500g",
    category: "Verduras",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #15803d, #166534)",
    price: 38.50,
    cost: 26.00,
    description: "Brócoli, coliflor y zanahorias selectas congeladas en su punto de frescura.",
    icon: "🥦"
  },
  {
    id: "LH-102",
    name: "Brócoli en Floretes",
    brand: "La Huerta",
    weight: "500g",
    category: "Verduras",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #16a34a, #14532d)",
    price: 42.00,
    cost: 28.50,
    description: "Floretes de brócoli de primera calidad, sin conservadores.",
    icon: "🥦"
  },
  {
    id: "LH-103",
    name: "Chícharo Tierno",
    brand: "La Huerta",
    weight: "500g",
    category: "Verduras",
    color: "#4ade80",
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    price: 36.00,
    cost: 24.00,
    description: "Chícharos dulces y tiernos, listos para cocinar.",
    icon: "🟢"
  },
  {
    id: "LH-104",
    name: "Elote Dorado Granos",
    brand: "La Huerta",
    weight: "500g",
    category: "Verduras",
    color: "#eab308",
    gradient: "linear-gradient(135deg, #ca8a04, #854d0e)",
    price: 35.00,
    cost: 23.00,
    description: "Granos de elote amarillo extra dulce de cosecha mexicana.",
    icon: "🌽"
  },
  {
    id: "LH-105",
    name: "Espinacas Cortadas",
    brand: "La Huerta",
    weight: "450g",
    category: "Verduras",
    color: "#15803d",
    gradient: "linear-gradient(135deg, #15803d, #052e16)",
    price: 39.00,
    cost: 26.50,
    description: "Espinacas tiernas lavadas, desinfectadas y picadas.",
    icon: "🥬"
  },
  {
    id: "LH-106",
    name: "Ensalada Campestre",
    brand: "La Huerta",
    weight: "500g",
    category: "Verduras",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #059669, #064e3b)",
    price: 41.00,
    cost: 27.00,
    description: "Zanahorias, chícharos, granos de elote y ejotes tiernos.",
    icon: "🥗"
  },
  {
    id: "LH-107",
    name: "Zanahorias Baby",
    brand: "La Huerta",
    weight: "500g",
    category: "Verduras",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #ea580c, #7c2d12)",
    price: 37.50,
    cost: 25.00,
    description: "Zanahorias enteras baby de sabor dulce y consistencia crujiente.",
    icon: "🥕"
  },
  {
    id: "LH-108",
    name: "Papas a la Francesa Corte Delgado",
    brand: "La Huerta",
    weight: "750g",
    category: "Papas",
    color: "#facc15",
    gradient: "linear-gradient(135deg, #eab308, #a16207)",
    price: 58.00,
    cost: 39.00,
    description: "Papas calidad premium para freír o hornear con textura crujiente dorada.",
    icon: "🍟"
  },
  {
    id: "LH-109",
    name: "Frutos Rojos Mixtos",
    brand: "La Huerta",
    weight: "450g",
    category: "Frutas",
    color: "#e11d48",
    gradient: "linear-gradient(135deg, #be123c, #881337)",
    price: 64.00,
    cost: 44.00,
    description: "Mezcla de zarzamoras, frambuesas, fresas y arándanos.",
    icon: "🫐"
  },
  {
    id: "LH-110",
    name: "Fresas Enteras",
    brand: "La Huerta",
    weight: "450g",
    category: "Frutas",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    price: 59.00,
    cost: 40.00,
    description: "Fresas maduras seleccionadas y congeladas IQF.",
    icon: "🍓"
  },
  {
    id: "FM-201",
    name: "Hamburguesa Res Frimart (8 pzas)",
    brand: "Frimart",
    weight: "800g",
    category: "Cárnicos",
    color: "#b91c1c",
    gradient: "linear-gradient(135deg, #991b1b, #450a0a)",
    price: 94.00,
    cost: 65.00,
    description: "Carne 100% res sazonada para asador o sartén.",
    icon: "🥩"
  },
  {
    id: "FM-202",
    name: "Arrachera Marinada Frimart",
    brand: "Frimart",
    weight: "600g",
    category: "Cárnicos",
    color: "#7f1d1d",
    gradient: "linear-gradient(135deg, #831843, #500724)",
    price: 145.00,
    cost: 102.00,
    description: "Corte suave con marinación tradicional mexicana.",
    icon: "🥩"
  }
];

// Generador de banco de 2000 códigos QR
export function generateQRBatch(total = 2000) {
  const list = [];
  for (let i = 1; i <= total; i++) {
    const codeNumber = String(i).padStart(4, "0");
    list.push({
      code: `FRM-${codeNumber}`,
      serial: i,
      assignedVendorId: i <= 500 ? "VEND-104" : "STOCK-CENTRAL",
      status: i === 42 || i === 89 || i === 115 || i === 198 ? "enrolled" : (i <= 50 ? "in_pocket" : "warehouse"),
      batchDate: "2026-09-01",
      brand: "La Huerta / Frimart"
    });
  }
  return list;
}

// Puntos de Venta Reales Extraídos de la Base de Datos Frimart (Ventas / CEDIS Aguascalientes 1205)
export const AGUASCALIENTES_STORES = [
  {
    id: "STORE-01",
    code: "133127",
    name: "Supermarket Las Fuentes",
    chain: "Supermarket Las Fuentes",
    type: "Autoservicio / Minisúper",
    address: "Av. Paseo de las Fuentes #102, Fracc. Las Fuentes, Aguascalientes, Ags.",
    lat: 21.9160,
    lng: -102.3115,
    geofenceRadius: 65,
    status: "completed",
    checkInTime: "08:30 AM",
    checkOutTime: "09:15 AM",
    salesToday: 9850,
    boxesToday: 38,
    freezersCount: 1,
    freezerIds: ["FRM-0042"],
    managerName: "Christian Hernández Alvarado",
    compliancePercent: 98,
    clientCode: "133127",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-01",
    routeName: "Ruta 01 - Ags Norte & Pocitos",
    vendorId: "USR-VEND-104",
    vendorName: "Juan Pablo Morales"
  },
  {
    id: "STORE-02",
    code: "133030",
    name: "Cremería Nueva Benjamín de Alba",
    chain: "Cremería Nueva Agropecuario",
    type: "Cremería y Lácteos",
    address: "Centro Comercial Agropecuario, Andador Benjamín de Alba #214, Aguascalientes, Ags.",
    lat: 21.9185,
    lng: -102.2952,
    geofenceRadius: 70,
    status: "in_progress", // El vendedor está aquí
    checkInTime: "10:45 AM",
    checkOutTime: null,
    salesToday: 4200,
    boxesToday: 16,
    freezersCount: 1,
    freezerIds: ["FRM-0089"],
    managerName: "Lic. Benjamín de Alba (Encargado)",
    compliancePercent: 92,
    clientCode: "133030",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-01",
    routeName: "Ruta 01 - Ags Norte & Pocitos",
    vendorId: "USR-VEND-104",
    vendorName: "Juan Pablo Morales"
  },
  {
    id: "STORE-03",
    code: "133185",
    name: "Súper Avenida",
    chain: "Súper Avenida",
    type: "Abarrotes y Minisúper",
    address: "Av. Adolfo López Mateos Pte. #405, Zona Centro, Aguascalientes, Ags.",
    lat: 21.8812,
    lng: -102.2965,
    geofenceRadius: 60,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 1,
    freezerIds: ["FRM-0115"],
    managerName: "Alejandro Gómez Pérez / Abel Márquez",
    compliancePercent: 0,
    clientCode: "133185",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-02",
    routeName: "Ruta 02 - Ags Centro & San Marcos",
    vendorId: "USR-VEND-106",
    vendorName: "Carlos Estrada Rincón"
  },
  {
    id: "STORE-04",
    code: "50SLZ",
    name: "Cadena Comercial OXXO - Bara San Lorenzo",
    chain: "OXXO / Bara Bajío",
    type: "Conveniencia",
    address: "Av. San Gabriel esq. San Lorenzo #302, Fracc. San Lorenzo, Aguascalientes, Ags.",
    lat: 21.8620,
    lng: -102.2920,
    geofenceRadius: 60,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 1,
    freezerIds: ["FRM-0198"],
    managerName: "Margarita Silva (Líder Tienda)",
    compliancePercent: 0,
    clientCode: "1000001393",
    sector: "Mayorista Detalle",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-03",
    routeName: "Ruta 03 - Ags Sur & Cd. Industrial",
    vendorId: "USR-VEND-107",
    vendorName: "María Elena Delgado"
  },
  {
    id: "STORE-05",
    code: "133077",
    name: "Carnicería y Cremería Tepeyac",
    chain: "Carnicería Tepeyac",
    type: "Cárnicos y Detalle",
    address: "Calzada Tepeyac #512, Col. Lindavista / Tepeyac, Aguascalientes, Ags.",
    lat: 21.8720,
    lng: -102.2980,
    geofenceRadius: 60,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 1,
    freezerIds: ["FRM-0220"],
    managerName: "Arturo Belmonte Torres",
    compliancePercent: 0,
    clientCode: "133077",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-02",
    routeName: "Ruta 02 - Ags Centro & San Marcos",
    vendorId: "USR-VEND-106",
    vendorName: "Carlos Estrada Rincón"
  },
  {
    id: "STORE-06",
    code: "133123",
    name: "Súper Casa Blanca",
    chain: "Súper Casa Blanca",
    type: "Minisúper",
    address: "Av. Mariano Hidalgo #802, Fracc. Casa Blanca, Aguascalientes, Ags.",
    lat: 21.8540,
    lng: -102.2780,
    geofenceRadius: 60,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 1,
    freezerIds: ["FRM-0245"],
    managerName: "María Alejandra Guillén Pérez",
    compliancePercent: 0,
    clientCode: "133123",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-03",
    routeName: "Ruta 03 - Ags Sur & Cd. Industrial",
    vendorId: "USR-VEND-107",
    vendorName: "María Elena Delgado"
  },
  {
    id: "STORE-07",
    code: "133249",
    name: "Tiendamax Pocitos Universidad",
    chain: "Tiendamax",
    type: "Conveniencia",
    address: "Av. Universidad #1102, Fracc. Pocitos, Aguascalientes, Ags.",
    lat: 21.9245,
    lng: -102.3210,
    geofenceRadius: 65,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 0,
    freezerIds: [],
    managerName: "Gerencia Tiendamax",
    compliancePercent: 0,
    clientCode: "133249",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-01",
    routeName: "Ruta 01 - Ags Norte & Pocitos",
    vendorId: "USR-VEND-104",
    vendorName: "Juan Pablo Morales"
  },
  {
    id: "STORE-08",
    code: "133280",
    name: "Minisúper Las Cumbres Oriente",
    chain: "Minisúper Cumbres",
    type: "Abarrotes y Lácteos",
    address: "Av. Siglo XXI #410, Fracc. Ojocaliente / Cumbres, Aguascalientes, Ags.",
    lat: 21.8850,
    lng: -102.2600,
    geofenceRadius: 65,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 1,
    freezerIds: ["FRM-0280"],
    managerName: "Don Gonzalo Espinoza",
    compliancePercent: 0,
    clientCode: "133280",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-04",
    routeName: "Ruta 04 - Ags Oriente & Morelos",
    vendorId: "USR-VEND-108",
    vendorName: "Fernando Ruiz Esparza"
  },
  {
    id: "STORE-09",
    code: "133310",
    name: "Abarrotes y Cremería Las Canteras",
    chain: "Cremería Las Canteras",
    type: "Cremería y Abarrotes",
    address: "Av. Canteras #520, Fracc. Canteras de San Javier, Aguascalientes, Ags.",
    lat: 21.8790,
    lng: -102.3280,
    geofenceRadius: 65,
    status: "pending",
    checkInTime: null,
    checkOutTime: null,
    salesToday: 0,
    boxesToday: 0,
    freezersCount: 1,
    freezerIds: ["FRM-0310"],
    managerName: "Sra. Teresa Romo",
    compliancePercent: 0,
    clientCode: "133310",
    sector: "Clientes Comercial",
    cedis: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-05",
    routeName: "Ruta 05 - Ags Poniente & Calvillo",
    vendorId: "USR-VEND-109",
    vendorName: "Brenda Morales Valdivia"
  }
];


// Piloto: Ruta 01 arranca sin tiendas demo (el supervisor da de alta las reales con GPS)
export const INITIAL_STORES = []; // Piloto: sin tiendas demo; el catálogo real vive en Supabase
export const DEMO_STORES_REFERENCE = AGUASCALIENTES_STORES;

const DEMO_FREEZERS = [
  {
    id: "FRM-0042",
    qrCode: "FRM-0042",
    storeId: "STORE-01",
    storeName: "Supermarket Las Fuentes",
    model: "Congelador Puerta Metálica (Cofre / Vertical)",
    brand: "Frimart / La Huerta",
    serialNumber: "VFR-AGS-0042",
    capacityPcs: 320,
    currentStock: 285,
    temperature: -19.2, // °C
    shelvesCount: 5,
    doorShelvesCount: 5,
    facingsPerShelf: 5,
    facingsPerDoorShelf: 4,
    installedAt: "2026-05-10",
    lastAuditedAt: "2026-10-09T09:15:00",
    locationCoordinates: {
      lat: 21.9160,
      lng: -102.3115,
      accuracy: 6
    },
    conditions: {
      compressor: "Optimo",
      doorSeals: "Hermético",
      ledLighting: "100% Funcional",
      frostLevel: "Limpio / Sin Escarcha",
      cleanliness: "Excelente"
    }
  },
  {
    id: "FRM-0089",
    qrCode: "FRM-0089",
    storeId: "STORE-02",
    storeName: "Cremería Nueva Benjamín de Alba",
    model: "Congelador Puerta de Vidrio (Imbera)",
    brand: "Imbera / La Huerta",
    serialNumber: "VFR-AGS-0089",
    capacityPcs: 250,
    currentStock: 198,
    temperature: -22.0,
    shelvesCount: 5,
    doorShelvesCount: 0,
    facingsPerShelf: 5,
    installedAt: "2026-06-20",
    lastAuditedAt: "2026-10-10T11:30:00",
    locationCoordinates: {
      lat: 21.9185,
      lng: -102.2952,
      accuracy: 6
    },
    conditions: {
      compressor: "Optimo",
      doorSeals: "Hermético",
      ledLighting: "100% Funcional",
      frostLevel: "Ligera Escarcha",
      cleanliness: "Bueno"
    }
  },
  {
    id: "FRM-0115",
    qrCode: "FRM-0115",
    storeId: "STORE-03",
    storeName: "Súper Avenida",
    model: "Congelador Puerta Metálica (Cofre / Vertical)",
    brand: "Frimart / La Huerta",
    serialNumber: "VFR-AGS-0115",
    capacityPcs: 384,
    currentStock: 340,
    temperature: -20.5,
    shelvesCount: 6,
    doorShelvesCount: 6,
    facingsPerShelf: 5,
    facingsPerDoorShelf: 4,
    installedAt: "2026-04-12",
    lastAuditedAt: "2026-10-08T11:00:00",
    locationCoordinates: {
      lat: 21.8812,
      lng: -102.2965,
      accuracy: 5
    },
    conditions: {
      compressor: "Optimo",
      doorSeals: "Hermético",
      ledLighting: "100% Funcional",
      frostLevel: "Limpio",
      cleanliness: "Excelente"
    }
  },
  {
    id: "FRM-0198",
    qrCode: "FRM-0198",
    storeId: "STORE-04",
    storeName: "Cadena Comercial OXXO - Bara San Lorenzo",
    model: "Congelador Puerta de Vidrio (Imbera)",
    brand: "Imbera / La Huerta",
    serialNumber: "VFR-AGS-0198",
    capacityPcs: 160,
    currentStock: 142,
    temperature: -21.8,
    shelvesCount: 4,
    doorShelvesCount: 0,
    facingsPerShelf: 4,
    installedAt: "2026-07-05",
    lastAuditedAt: "2026-10-07T16:20:00",
    locationCoordinates: {
      lat: 21.8620,
      lng: -102.2920,
      accuracy: 6
    },
    conditions: {
      compressor: "Optimo",
      doorSeals: "Hermético",
      ledLighting: "100% Funcional",
      frostLevel: "Limpio",
      cleanliness: "Excelente"
    }
  },
  {
    id: "FRM-0220",
    qrCode: "FRM-0220",
    storeId: "STORE-05",
    storeName: "Carnicería y Cremería Tepeyac",
    model: "Congelador Horizontal Tapa Cristal (Torrey)",
    brand: "Torrey / La Huerta",
    serialNumber: "VFR-AGS-0220",
    capacityPcs: 210,
    currentStock: 185,
    temperature: -19.5,
    shelvesCount: 4,
    doorShelvesCount: 0,
    facingsPerShelf: 4,
    installedAt: "2026-08-14",
    lastAuditedAt: "2026-10-09T12:00:00",
    locationCoordinates: {
      lat: 21.8720,
      lng: -102.2980,
      accuracy: 5
    },
    conditions: {
      compressor: "Optimo",
      doorSeals: "Hermético",
      ledLighting: "100% Funcional",
      frostLevel: "Limpio",
      cleanliness: "Excelente"
    }
  }
];

// Cálculo de distancia en metros usando la fórmula de Haversine
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const INITIAL_FREEZERS = []; // Piloto: sin congeladores demo
export const DEMO_FREEZERS_REFERENCE = DEMO_FREEZERS;
