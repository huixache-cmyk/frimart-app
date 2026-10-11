// Modelos Oficiales y Catálogo para Planogramas Frimart & La Huerta
// 100% fiel a los dos modelos de congeladores: Puerta Metálica y Puerta de Vidrio (Imbera)

export const FREEZER_MODEL_TYPES = {
  GLASS_IMBERA: "imbera_cristal",
  METAL_DOOR: "puerta_metalica"
};

export const FREEZER_MODEL_CONFIGS = {
  [FREEZER_MODEL_TYPES.GLASS_IMBERA]: {
    id: FREEZER_MODEL_TYPES.GLASS_IMBERA,
    name: "Congelador Puerta de Vidrio (Imbera)",
    brand: "Imbera / La Huerta",
    shortName: "Imbera Cristal",
    description: "Exhibidor vertical con puerta de cristal templado, iluminación LED perimetral, display digital y cenefas de precio.",
    hasDoorShelves: false,
    allowedShelvesCount: [4, 5],
    defaultShelvesCount: 5,
    allowedFacingsPerShelf: [4, 5],
    defaultFacingsPerShelf: 5,
    doorShelvesCount: 0,
    facingsPerDoorShelf: 0
  },
  [FREEZER_MODEL_TYPES.METAL_DOOR]: {
    id: FREEZER_MODEL_TYPES.METAL_DOOR,
    name: "Congelador Puerta Metálica (Cofre / Vertical)",
    brand: "Frimart / La Huerta",
    shortName: "Puerta Metálica",
    description: "Congelador vertical de puerta sólida con luz cálida superior, parrillas interiores y anaqueles en contrapuerta.",
    hasDoorShelves: true,
    allowedShelvesCount: [5, 6],
    defaultShelvesCount: 5,
    allowedFacingsPerShelf: [5], // Siempre 5 frentes por charola
    defaultFacingsPerShelf: 5,
    allowedDoorShelvesCount: [5, 6],
    defaultDoorShelvesCount: 5,
    allowedFacingsPerDoorShelf: [4], // Siempre 4 frentes por repisa
    defaultFacingsPerDoorShelf: 4
  }
};

// Catálogo enriquecido y unificado de productos visibles en las fotos de congeladores
export const PLANOGRAM_PRODUCTS = [
  // --- VEGETALES LA HUERTA ---
  {
    id: "LH-101",
    name: "Mezcla California",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 38.50,
    cost: 26.00,
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #15803d, #166534)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
    description: "Brócoli, coliflor y zanahorias selectas congeladas en su punto de frescura IQF."
  },
  {
    id: "LH-102",
    name: "Brócoli en Floretes",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 42.00,
    cost: 28.50,
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #16a34a, #14532d)",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&auto=format&fit=crop&q=80",
    description: "Floretes de brócoli de primera calidad, sin tallo sobrante y sin conservadores."
  },
  {
    id: "LH-103",
    name: "Chícharo Tierno",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 36.00,
    cost: 24.00,
    color: "#4ade80",
    gradient: "linear-gradient(135deg, #22c55e, #15803d)",
    image: "https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=300&auto=format&fit=crop&q=80",
    description: "Chícharos dulces y tiernos, listos para cocinar o guisar."
  },
  {
    id: "LH-104",
    name: "Elote Dorado Granos",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 35.00,
    cost: 23.00,
    color: "#eab308",
    gradient: "linear-gradient(135deg, #ca8a04, #854d0e)",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&auto=format&fit=crop&q=80",
    description: "Granos de elote amarillo extra dulce de cosecha mexicana."
  },
  {
    id: "LH-105",
    name: "Espinacas Cortadas",
    brand: "La Huerta",
    weight: "450g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 39.00,
    cost: 26.50,
    color: "#15803d",
    gradient: "linear-gradient(135deg, #15803d, #052e16)",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&auto=format&fit=crop&q=80",
    description: "Espinacas tiernas lavadas, desinfectadas y picadas en hojas prácticas."
  },
  {
    id: "LH-106",
    name: "Ensalada Campestre",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 41.00,
    cost: 27.00,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #059669, #064e3b)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
    description: "Zanahorias, chícharos, granos de elote y ejotes tiernos."
  },
  {
    id: "LH-107",
    name: "Zanahorias Baby",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 37.50,
    cost: 25.00,
    color: "#f97316",
    gradient: "linear-gradient(135deg, #ea580c, #7c2d12)",
    image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=300&auto=format&fit=crop&q=80",
    description: "Zanahorias enteras baby dulces y crujientes."
  },
  {
    id: "LH-111",
    name: "Mezcla con Rajas",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 43.00,
    cost: 29.00,
    color: "#15803d",
    gradient: "linear-gradient(135deg, #15803d, #365314)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
    description: "Elote dorado, rajas de poblano y cebolla selecta."
  },
  {
    id: "LH-112",
    name: "Mezcla Oriental",
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 45.00,
    cost: 30.00,
    color: "#047857",
    gradient: "linear-gradient(135deg, #047857, #134e4a)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
    description: "Brócoli, col china, pimientos, ejotes y champiñones para saltear al wok."
  },

  // --- FRUTAS LA HUERTA ---
  {
    id: "LH-109",
    name: "Frutos Rojos Mixtos",
    brand: "La Huerta",
    weight: "450g",
    category: "frutas",
    categoryLabel: "Frutas",
    price: 64.00,
    cost: 44.00,
    color: "#e11d48",
    gradient: "linear-gradient(135deg, #be123c, #881337)",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&auto=format&fit=crop&q=80",
    description: "Zarzamoras, frambuesas, fresas y arándanos congelados IQF."
  },
  {
    id: "LH-110",
    name: "Fresas Enteras",
    brand: "La Huerta",
    weight: "450g",
    category: "frutas",
    categoryLabel: "Frutas",
    price: 59.00,
    cost: 40.00,
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&auto=format&fit=crop&q=80",
    description: "Fresas mexicanas de cosecha madura, enteras y desinfectadas."
  },
  {
    id: "LH-113",
    name: "Smoothie Mix Frutos Rojos",
    brand: "La Huerta",
    weight: "450g",
    category: "frutas",
    categoryLabel: "Frutas & Smoothies",
    price: 56.00,
    cost: 38.00,
    color: "#be185d",
    gradient: "linear-gradient(135deg, #be185d, #701a75)",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=80",
    description: "Porciones listas para licuadora de fresa, plátano y moras silvestres."
  },
  {
    id: "LH-114",
    name: "Jugo Verde Funcional",
    brand: "La Huerta",
    weight: "500g",
    category: "frutas",
    categoryLabel: "Frutas & Smoothies",
    price: 48.00,
    cost: 32.00,
    color: "#15803d",
    gradient: "linear-gradient(135deg, #15803d, #064e3b)",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&auto=format&fit=crop&q=80",
    description: "Nopal, apio, piña, perejil y espinaca en empaque listo para licuar."
  },

  // --- PAPAS LA HUERTA ---
  {
    id: "LH-108",
    name: "Papas Francesas Corte Delgado",
    brand: "La Huerta",
    weight: "750g",
    category: "papas",
    categoryLabel: "Papas",
    price: 58.00,
    cost: 39.00,
    color: "#facc15",
    gradient: "linear-gradient(135deg, #eab308, #a16207)",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80",
    description: "Papas premium corte delgado para freidora de aire o aceite."
  },
  {
    id: "LH-115",
    name: "Papas Corte Casero Grueso",
    brand: "La Huerta",
    weight: "750g",
    category: "papas",
    categoryLabel: "Papas",
    price: 59.00,
    cost: 40.00,
    color: "#eab308",
    gradient: "linear-gradient(135deg, #ca8a04, #713f12)",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80",
    description: "Papas estilo rústico corte grueso con piel y textura esponjosa."
  },

  // --- DEL CHEF (ELABORADOS EN PUERTA Y CHAROLAS) ---
  {
    id: "DC-301",
    name: "Medallones Espinaca y Elote",
    brand: "Del Chef",
    weight: "400g",
    category: "elaborados",
    categoryLabel: "Del Chef",
    price: 52.00,
    cost: 36.00,
    color: "#166534",
    gradient: "linear-gradient(135deg, #14532d, #052e16)",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80",
    description: "Medallones empanizados vegetales con corazón de elote y espinacas tiernas."
  },
  {
    id: "DC-302",
    name: "Medallones Elote y Rajas",
    brand: "Del Chef",
    weight: "400g",
    category: "elaborados",
    categoryLabel: "Del Chef",
    price: 52.00,
    cost: 36.00,
    color: "#15803d",
    gradient: "linear-gradient(135deg, #15803d, #14532d)",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80",
    description: "Medallones Del Chef con toque mexicano de rajas y queso gouda."
  },
  {
    id: "DC-303",
    name: "Pikes Rajas con Queso",
    brand: "Del Chef",
    weight: "400g",
    category: "elaborados",
    categoryLabel: "Del Chef",
    price: 56.00,
    cost: 39.00,
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #c2410c, #7c2d12)",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=300&auto=format&fit=crop&q=80",
    description: "Botana crujiente rellena de rajas de jalapeño y queso fundido."
  },
  {
    id: "DC-304",
    name: "Crepas Congeladas con Pollo",
    brand: "Del Chef",
    weight: "380g",
    category: "elaborados",
    categoryLabel: "Del Chef",
    price: 68.00,
    cost: 48.00,
    color: "#0284c7",
    gradient: "linear-gradient(135deg, #0369a1, #0c4a6e)",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=300&auto=format&fit=crop&q=80",
    description: "Crepas listas para microondas bañadas en salsa cremosa de poblano."
  },
  {
    id: "DC-305",
    name: "Chiles Rellenos de Queso",
    brand: "Del Chef",
    weight: "450g",
    category: "elaborados",
    categoryLabel: "Del Chef",
    price: 74.00,
    cost: 51.00,
    color: "#b45309",
    gradient: "linear-gradient(135deg, #b45309, #78350f)",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=300&auto=format&fit=crop&q=80",
    description: "Chiles poblanos capeados rellenos de queso panela y salsa roja."
  },

  // --- CÁRNICOS Y POLLO (FRIMART & PILGRIM'S) ---
  {
    id: "FM-201",
    name: "Hamburguesa Res Frimart (8 pzas)",
    brand: "Frimart",
    weight: "800g",
    category: "carnicos",
    categoryLabel: "Cárnicos",
    price: 94.00,
    cost: 65.00,
    color: "#b91c1c",
    gradient: "linear-gradient(135deg, #991b1b, #450a0a)",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
    description: "Carne 100% res sazonada para asador o sartén en 8 porciones individuales."
  },
  {
    id: "FM-202",
    name: "Arrachera Marinada Frimart",
    brand: "Frimart",
    weight: "600g",
    category: "carnicos",
    categoryLabel: "Cárnicos",
    price: 145.00,
    cost: 102.00,
    color: "#7f1d1d",
    gradient: "linear-gradient(135deg, #831843, #500724)",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=300&auto=format&fit=crop&q=80",
    description: "Corte suave con marinación tradicional mexicana listo para asar."
  },
  {
    id: "PG-401",
    name: "Nuggets de Pollo Pilgrim's",
    brand: "Pilgrim's",
    weight: "500g",
    category: "carnicos",
    categoryLabel: "Pollo & Nuggets",
    price: 65.00,
    cost: 45.00,
    color: "#d97706",
    gradient: "linear-gradient(135deg, #d97706, #92400e)",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=300&auto=format&fit=crop&q=80",
    description: "Bocaditos de pechuga de pollo empanizados dorados y crujientes."
  },
  {
    id: "PG-402",
    name: "Nuggets Dinosaurios Pilgrim's",
    brand: "Pilgrim's",
    weight: "500g",
    category: "carnicos",
    categoryLabel: "Pollo & Nuggets",
    price: 68.00,
    cost: 47.00,
    color: "#b45309",
    gradient: "linear-gradient(135deg, #b45309, #78350f)",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=300&auto=format&fit=crop&q=80",
    description: "Figuras divertidas de dinosaurios de pollo para niños."
  },

  // --- PESCADOS Y MARISCOS (PUERTA Y BASE) ---
  {
    id: "SEA-501",
    name: "Salmón Porcionado con Piel",
    brand: "Studio Mar",
    weight: "500g",
    category: "pescados",
    categoryLabel: "Pescados & Mariscos",
    price: 135.00,
    cost: 95.00,
    color: "#e11d48",
    gradient: "linear-gradient(135deg, #e11d48, #9f1239)",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&auto=format&fit=crop&q=80",
    description: "Filetes de salmón del Atlántico porcionados y empacados al vacío."
  },
  {
    id: "SEA-502",
    name: "Camarón Cocido Pelado",
    brand: "Frimart Mar",
    weight: "400g",
    category: "pescados",
    categoryLabel: "Pescados & Mariscos",
    price: 110.00,
    cost: 78.00,
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #ea580c, #9a3412)",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300&auto=format&fit=crop&q=80",
    description: "Camarones medianos listos para cóctel, ensaladas o ceviches."
  }
];

// Helper para encontrar datos de un producto por ID
export function getProductById(id) {
  if (!id) return null;
  return PLANOGRAM_PRODUCTS.find((p) => p.id === id) || {
    id,
    name: "Producto La Huerta " + id,
    brand: "La Huerta",
    weight: "500g",
    category: "vegetales",
    categoryLabel: "Vegetales",
    price: 40.00,
    cost: 27.00,
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
    description: "Producto congelado seleccionado La Huerta Frimart."
  };
}

// Generador de planograma por defecto para Congelador Puerta Metálica
// Gabinete: 5 o 6 charolas, cada una con exactamente 5 frentes
// Puerta interior: 5 o 6 repisas, cada una con exactamente 4 frentes
export function createDefaultMetalDoorPlanogram(shelvesCount = 5, doorShelvesCount = 5) {
  const cabinetShelves = [];

  // Charolas de Gabinete (5 frentes c/u)
  const defaultCabinetSkusByShelf = [
    // Charola 1
    ["LH-101", "LH-102", "LH-103", "LH-104", "LH-107"],
    // Charola 2
    ["LH-105", "LH-106", "LH-111", "LH-102", "LH-101"],
    // Charola 3
    ["LH-104", "LH-106", "LH-109", "LH-107", "LH-103"],
    // Charola 4
    ["LH-105", "LH-101", "LH-112", "LH-106", "LH-102"],
    // Charola 5
    ["PG-401", "PG-402", "LH-108", "LH-115", "LH-108"],
    // Charola 6 (si aplica)
    ["FM-201", "FM-202", "FM-201", "SEA-501", "SEA-502"]
  ];

  const titlesCabinet = [
    "Charola 1 (Superior) - Vegetales La Huerta",
    "Charola 2 - Mezclas Selectas & Rajas",
    "Charola 3 - Ensaladas & Frutos Rojos",
    "Charola 4 - Vegetales Orientales & Especialidades",
    "Charola 5 - Nuggets Pilgrim's & Papas Francesas",
    "Charola 6 (Base) - Proteínas Frimart & Mariscos"
  ];

  for (let s = 1; s <= shelvesCount; s++) {
    const skuRow = defaultCabinetSkusByShelf[s - 1] || defaultCabinetSkusByShelf[0];
    const facings = [];
    for (let f = 1; f <= 5; f++) {
      const skuId = skuRow[f - 1] || "LH-101";
      facings.push({
        facingIndex: f - 1,
        facingNumber: f,
        skuId,
        facingsExpected: 1,
        facingsCurrent: 1,
        capacityUnits: 8,
        currentStockUnits: 8,
        statusTag: s === 1 && f === 5 ? "new" : (s === 3 && f === 3 ? "shelf_change" : "normal")
      });
    }

    cabinetShelves.push({
      shelfNumber: s,
      title: titlesCabinet[s - 1] || `Charola ${s}`,
      type: "cabinet",
      facings
    });
  }

  // Repisas de Contrapuerta (4 frentes c/u)
  const doorShelves = [];
  const defaultDoorSkusByShelf = [
    // Repisa 1 (Superior)
    ["LH-114", "LH-114", "LH-113", "LH-113"],
    // Repisa 2
    ["LH-105", "LH-105", "DC-301", "DC-302"],
    // Repisa 3
    ["DC-303", "DC-302", "DC-301", "DC-301"],
    // Repisa 4
    ["DC-304", "DC-304", "DC-305", "DC-305"],
    // Repisa 5
    ["SEA-501", "SEA-502", "SEA-502", "SEA-501"],
    // Repisa 6 (si aplica)
    ["FM-201", "FM-201", "FM-202", "FM-202"]
  ];

  const titlesDoor = [
    "Repisa 1 (Superior) - Jugo Verde & Smoothies",
    "Repisa 2 - Champiñones & Del Chef Medallones",
    "Repisa 3 - Del Chef Pikes & Especialidades",
    "Repisa 4 - Del Chef Crepas & Chiles Rellenos",
    "Repisa 5 - Pescados & Camarones Congelados",
    "Repisa 6 (Inferior) - Cárnicos & Postres"
  ];

  for (let d = 1; d <= doorShelvesCount; d++) {
    const skuRow = defaultDoorSkusByShelf[d - 1] || defaultDoorSkusByShelf[0];
    const facings = [];
    for (let f = 1; f <= 4; f++) {
      const skuId = skuRow[f - 1] || "LH-114";
      facings.push({
        facingIndex: f - 1,
        facingNumber: f,
        skuId,
        facingsExpected: 1,
        facingsCurrent: 1,
        capacityUnits: 6,
        currentStockUnits: 6,
        statusTag: d === 1 && f === 3 ? "new" : "normal"
      });
    }

    doorShelves.push({
      shelfNumber: d,
      title: titlesDoor[d - 1] || `Repisa Puerta ${d}`,
      type: "door",
      facings
    });
  }

  return {
    cabinetShelves,
    doorShelves
  };
}

// Generador de planograma por defecto para Congelador Puerta de Vidrio (Imbera)
// 4 o 5 charolas, cada una con 4 o 5 frentes
export function createDefaultImberaPlanogram(shelvesCount = 5, facingsPerShelf = 5) {
  const shelves = [];

  const defaultSkusByShelf = [
    // Charola 1
    ["DC-301", "DC-302", "DC-303", "DC-304", "FM-201"],
    // Charola 2
    ["LH-101", "LH-102", "LH-103", "LH-111", "LH-106"],
    // Charola 3
    ["LH-106", "LH-107", "LH-104", "LH-104", "LH-105"],
    // Charola 4
    ["LH-107", "LH-109", "LH-110", "LH-108", "LH-108"],
    // Charola 5
    ["FM-201", "FM-202", "LH-108", "LH-115", "PG-401"]
  ];

  const titles = [
    "Charola 1 (Superior) - Del Chef & Especialidades",
    "Charola 2 - Vegetales Corazón de Categoría La Huerta",
    "Charola 3 - Ensaladas, Elote & Granos Dulces",
    "Charola 4 - Frutas Congeladas & Papas Francesas",
    "Charola 5 (Base) - Proteínas Frimart & Nuggets"
  ];

  for (let s = 1; s <= shelvesCount; s++) {
    const skuRow = defaultSkusByShelf[s - 1] || defaultSkusByShelf[0];
    const facings = [];
    for (let f = 1; f <= facingsPerShelf; f++) {
      const skuId = skuRow[f - 1] || "LH-101";
      facings.push({
        facingIndex: f - 1,
        facingNumber: f,
        skuId,
        facingsExpected: 1,
        facingsCurrent: 1,
        capacityUnits: 10,
        currentStockUnits: 10,
        statusTag: s === 1 && f === 1 ? "new" : (s === 4 && f === 2 ? "shelf_change" : "normal")
      });
    }

    shelves.push({
      shelfNumber: s,
      title: titles[s - 1] || `Charola ${s}`,
      type: "imbera_shelf",
      facings
    });
  }

  return {
    shelves
  };
}
