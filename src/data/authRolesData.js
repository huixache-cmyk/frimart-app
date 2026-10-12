// ============================================================================
// Frimart OS & La Huerta - Módulo de Autenticación, Roles y Gobernanza de Datos
// ============================================================================

export const ROLES = {
  vendedor: {
    id: "vendedor",
    name: "Vendedor de Ruta",
    shortName: "Vendedor",
    icon: "Truck",
    color: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    badge: "Ruta & Ventas",
    description: "Acceso exclusivo a sus rutas, metas diarias, pendientes de visita y registro de ventas."
  },
  supervisor: {
    id: "supervisor",
    name: "Supervisor de Zona",
    shortName: "Supervisor",
    icon: "ShieldCheck",
    color: "#0284c7",
    bgColor: "#f0f9ff",
    borderColor: "#bae6fd",
    badge: "Supervisión",
    description: "Monitoreo en tiempo real de los vendedores a su cargo, telemetría GPS y auditorías de planograma."
  },
  gerente_cedis: {
    id: "gerente_cedis",
    name: "Gerente de CEDIS",
    shortName: "Gerente CEDIS",
    icon: "Building2",
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    badge: "Centro Distribución",
    description: "Control de todas las rutas, metas mensuales, clientes y volumen de ventas de su centro de distribución."
  },
  director_comercial: {
    id: "director_comercial",
    name: "Director Comercial",
    shortName: "Director",
    icon: "BarChart3",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    badge: "Corporativo Nacional",
    description: "Vista global consolidada con acceso a todos los CEDIS, comparativas regionales y ranking de rutas."
  },
  propietario: {
    id: "propietario",
    name: "Modo Propietario",
    shortName: "Propietario",
    icon: "Crown",
    color: "#e11d48",
    bgColor: "#fff1f2",
    borderColor: "#fecdd3",
    badge: "Master / Owner",
    description: "Control maestro absoluto: administración de claves de acceso, ajustes de la app y despliegue de actualizaciones OTA a la flota."
  }
};

// ----------------------------------------------------------------------------
// Directorio Maestro de Centros de Distribución (CEDIS)
// ----------------------------------------------------------------------------
export const MASTER_CEDIS = [
  {
    id: "CEDIS-AGS",
    code: "AGS",
    name: "CEDIS Aguascalientes (1205)",
    state: "Aguascalientes",
    address: "Km 13.5 Carretera Panamericana Sur, Peñuelas / Cd. Industrial",
    phone: "449-910-2500",
    managerId: "USR-003",
    managerName: "Ing. Guillermo Salcedo",
    monthlyTarget: 4500000,
    currentMonthSales: 3890000,
    dailyTarget: 175000,
    todaySales: 158400,
    activeRoutesCount: 7,
    totalClientsCount: 401,
    freezersInstalled: 520,
    status: "active"
  },
  {
    id: "CEDIS-01",
    code: "CUN",
    name: "CEDIS Cancún Principal",
    state: "Quintana Roo",
    address: "Av. José López Portillo Km 7.5, Bodega 14, Sm 98",
    phone: "998-880-1420",
    managerId: "USR-003-CUN",
    managerName: "Lic. Roberto Pech",
    monthlyTarget: 3800000,
    currentMonthSales: 2795400,
    dailyTarget: 145000,
    todaySales: 112450,
    activeRoutesCount: 6,
    totalClientsCount: 142,
    freezersInstalled: 384,
    status: "active"
  },
  {
    id: "CEDIS-02",
    code: "MID",
    name: "CEDIS Mérida Periférico",
    state: "Yucatán",
    address: "Anillo Periférico Poniente #1200, Complejo Industrial",
    phone: "999-940-8800",
    managerId: "USR-004",
    managerName: "Lic. Patricia Ceballos",
    monthlyTarget: 4200000,
    currentMonthSales: 3410000,
    dailyTarget: 160000,
    todaySales: 138600,
    activeRoutesCount: 8,
    totalClientsCount: 198,
    freezersInstalled: 512,
    status: "active"
  },
  {
    id: "CEDIS-03",
    code: "PDC",
    name: "CEDIS Playa del Carmen Express",
    state: "Quintana Roo",
    address: "Carretera Federal Cancún-Tulum Sm 54 Mz 2",
    phone: "984-873-5510",
    managerId: "USR-005",
    managerName: "Raúl Castañeda",
    monthlyTarget: 2100000,
    currentMonthSales: 1620000,
    dailyTarget: 80000,
    todaySales: 64200,
    activeRoutesCount: 3,
    totalClientsCount: 86,
    freezersInstalled: 195,
    status: "active"
  }
];

// ----------------------------------------------------------------------------
// Usuarios Iniciales del Sistema con Claves de Acceso y Roles
// ----------------------------------------------------------------------------
export const INITIAL_USERS = [
  {
    id: "USR-VEND-104",
    name: "Juan Pablo Morales",
    email: "j.morales@frimart.com.mx",
    role: "vendedor",
    accessKey: "1041", // Clave / PIN oficial (también acepta 1234)
    phone: "449-123-4567",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-01",
    routeName: "Ruta 01 - Ags Norte & Pocitos",
    supervisorId: "USR-SUP-01",
    supervisorName: "Ing. Roberto Almanza",
    status: "active",
    lastLogin: "Hoy 08:30 AM",
    dailyQuota: 38000,
    dailyBoxes: 150
  },
  {
    id: "USR-VEND-106",
    name: "Carlos Estrada Rincón",
    email: "c.estrada@frimart.com.mx",
    role: "vendedor",
    accessKey: "1062",
    phone: "449-234-5678",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-02",
    routeName: "Ruta 02 - Ags Centro & San Marcos",
    supervisorId: "USR-SUP-01",
    supervisorName: "Ing. Roberto Almanza",
    status: "active",
    lastLogin: "Hoy 07:50 AM",
    dailyQuota: 42000,
    dailyBoxes: 165
  },
  {
    id: "USR-VEND-107",
    name: "María Elena Delgado",
    email: "m.delgado@frimart.com.mx",
    role: "vendedor",
    accessKey: "1073",
    phone: "449-345-6789",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-03",
    routeName: "Ruta 03 - Ags Sur & Cd. Industrial",
    supervisorId: "USR-SUP-01",
    supervisorName: "Ing. Roberto Almanza",
    status: "active",
    lastLogin: "Hoy 08:05 AM",
    dailyQuota: 36000,
    dailyBoxes: 140
  },
  {
    id: "USR-VEND-108",
    name: "Fernando Ruiz Esparza",
    email: "f.ruiz@frimart.com.mx",
    role: "vendedor",
    accessKey: "1084",
    phone: "449-456-7890",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-04",
    routeName: "Ruta 04 - Ags Oriente & Morelos",
    supervisorId: "USR-SUP-01",
    supervisorName: "Ing. Roberto Almanza",
    status: "active",
    lastLogin: "Hoy 08:15 AM",
    dailyQuota: 40000,
    dailyBoxes: 155
  },
  {
    id: "USR-VEND-109",
    name: "Brenda Morales Valdivia",
    email: "b.morales@frimart.com.mx",
    role: "vendedor",
    accessKey: "1095",
    phone: "449-567-8901",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    routeId: "RUTA-05",
    routeName: "Ruta 05 - Ags Poniente & Calvillo",
    supervisorId: "USR-SUP-01",
    supervisorName: "Ing. Roberto Almanza",
    status: "active",
    lastLogin: "Hoy 07:40 AM",
    dailyQuota: 39000,
    dailyBoxes: 148
  },
  {
    id: "USR-SUP-01",
    name: "Ing. Roberto Almanza",
    email: "r.almanza@frimart.com.mx",
    role: "supervisor",
    accessKey: "2022", // Clave / PIN oficial (también acepta 4321)
    phone: "449-123-4567",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    zone: "Zona Aguascalientes Metropolitana",
    assignedVendors: ["USR-VEND-104", "USR-VEND-106", "USR-VEND-107", "USR-VEND-108", "USR-VEND-109"],
    status: "active",
    lastLogin: "Hoy 08:10 AM"
  },
  {
    id: "USR-003",
    name: "Ing. Guillermo Salcedo",
    email: "g.salcedo@frimart.com.mx",
    role: "gerente_cedis",
    accessKey: "3033", // Clave / PIN oficial (también acepta 5678)
    phone: "449-910-2501",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-AGS",
    cedisName: "CEDIS Aguascalientes (1205)",
    status: "active",
    lastLogin: "Hoy 07:15 AM"
  },
  {
    id: "USR-004",
    name: "Lic. Patricia Ceballos",
    email: "p.ceballos@frimart.com.mx",
    role: "gerente_cedis",
    accessKey: "6789",
    phone: "999-940-8801",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    cedisId: "CEDIS-02",
    cedisName: "CEDIS Mérida Periférico",
    status: "active",
    lastLogin: "Ayer 06:40 PM"
  },
  {
    id: "USR-DIR-01",
    name: "Lic. Roberto Garza",
    email: "r.garza@frimart.com.mx",
    role: "director_comercial",
    accessKey: "4044", // Clave / PIN oficial (también acepta 7890)
    phone: "55-4123-9000",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    cedisId: "ALL",
    cedisName: "Todos los CEDIS (Nivel Nacional)",
    status: "active",
    lastLogin: "Hoy 09:00 AM"
  },
  {
    id: "USR-OWNER-01",
    name: "Director General & Propietario Frimart",
    email: "propietario@frimart.com.mx",
    role: "propietario",
    accessKey: "9999", // Clave Maestra
    phone: "55-5555-0001",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    cedisId: "ALL",
    cedisName: "Control Maestro Corporativo",
    status: "active",
    lastLogin: "En sesión activa"
  }
];

// ----------------------------------------------------------------------------
// Pendientes Operativos para Vendedor (Ruta, Metas, Pendientes, Ventas)
// ----------------------------------------------------------------------------
export const INITIAL_SELLER_PENDIENTES = [
  {
    id: "PEND-01",
    vendorId: "USR-VEND-104",
    storeId: "STORE-02",
    storeName: "Cremería Nueva Benjamín de Alba",
    type: "audit_urgent",
    priority: "alta",
    title: "Auditoría prioritaria de Congelador FRM-0089",
    description: "Detectadas solo 2 bolsas de Brócoli La Huerta. Validar planograma y registrar temperatura.",
    dueTime: "12:30 PM",
    completed: false,
    badge: "Stock Crítico"
  },
  {
    id: "PEND-02",
    vendorId: "USR-VEND-104",
    storeId: "STORE-03",
    storeName: "Súper Avenida",
    type: "order_delivery",
    priority: "media",
    title: "Entrega de pedido programado (38 cajas)",
    description: "Entregar orden #ORD-9821 con factura contra entrega en área de recibo.",
    dueTime: "02:00 PM",
    completed: false,
    badge: "Entrega Facturada"
  },
  {
    id: "PEND-03",
    vendorId: "USR-VEND-104",
    storeId: "STORE-07",
    storeName: "Tiendamax Pocitos Universidad",
    type: "onboarding",
    priority: "media",
    title: "Alta de Nuevo Congelador con QR",
    description: "Instalar sticker metálico FRM-0520 y tomar coordenadas GPS del local.",
    dueTime: "04:15 PM",
    completed: false,
    badge: "Enrolamiento GPS"
  },
  {
    id: "PEND-04",
    vendorId: "USR-VEND-104",
    storeId: "STORE-01",
    storeName: "Supermarket Las Fuentes",
    type: "collection",
    priority: "baja",
    title: "Firma de contrarecibo de cobro",
    description: "Recoger contrarecibo firmado de la entrega de la mañana ($9,850 MXN).",
    dueTime: "05:00 PM",
    completed: true,
    badge: "Completado"
  }
];

// ----------------------------------------------------------------------------
// Ventas del Día del Vendedor
// ----------------------------------------------------------------------------
export const INITIAL_SELLER_SALES_LOG = [
  {
    id: "SALE-101",
    vendorId: "USR-VEND-104",
    storeName: "Supermarket Las Fuentes",
    time: "09:18 AM",
    amount: 9850,
    boxes: 38,
    ticketNumber: "TK-2026-9041",
    paymentType: "Crédito Frimart Comercial",
    itemsSummary: "18 Mezcla California, 12 Brócoli La Huerta, 8 Papas Francesa",
    commission: 394.0
  },
  {
    id: "SALE-102",
    vendorId: "USR-VEND-104",
    storeName: "Cremería Nueva Benjamín de Alba",
    time: "10:45 AM",
    amount: 17000,
    boxes: 66,
    ticketNumber: "TK-2026-9042",
    paymentType: "Transferencia Bancaria",
    itemsSummary: "32 Mezcla California, 20 Papas, 14 Frutas IQF",
    commission: 680.0
  }
];

// ----------------------------------------------------------------------------
// Versiones y Módulo de Despliegue de Actualizaciones OTA (Over-The-Air)
// ----------------------------------------------------------------------------
export const INITIAL_OTA_CONFIG = {
  currentVersion: "v2.4.2",
  releaseDate: "2026-10-01",
  activeFleetDevices: 52,
  synchronizedDevices: 49,
  pendingDevices: 3,
  systemStatus: "healthy",
  candidateUpdate: {
    version: "v2.5.0",
    releaseName: "Frimart OS • Sprint Cierre 2026 & Módulo Gobernanza",
    description: "Actualización integral de roles por clave, sincronización offline turbo y auditoría GPS de congeladores La Huerta.",
    changelog: [
      "Autenticación granular con 5 roles corporativos (Vendedor, Supervisor, Gerente CEDIS, Director Comercial y Propietario)",
      "Gestor de claves de acceso y configuración de comisiones en tiempo real",
      "Módulo de telemetría y despliegue OTA para enviar actualizaciones directas a la flota móvil",
      "Nuevo algoritmo de cálculo de distancias por geocerca GPS con tolerancia de 60 metros",
      "Actualización de precios y costos en catálogo La Huerta y Frimart"
    ],
    featureFlags: {
      enableStrictGeofencing: true,
      enableOfflineSyncTurbo: true,
      enableThermalAlertsPush: true,
      enableVoiceAssistantRoutes: false,
      enableLiveCameraQRScanner: true
    },
    targetAudience: "all", // 'all' | 'vendedores' | 'supervisores' | 'cedis'
    urgency: "recommended" // 'optional' | 'recommended' | 'critical'
  },
  deploymentHistory: [
    {
      id: "DEP-2026-10-01",
      version: "v2.4.2",
      deployedAt: "2026-10-01 08:00 AM",
      deployedBy: "Director General & Propietario",
      status: "success",
      devicesCount: 52,
      appliedCount: 52,
      notes: "Optimización de carga de fotos de planogramas en baja señal 3G/4G."
    },
    {
      id: "DEP-2026-09-15",
      version: "v2.3.8",
      deployedAt: "2026-09-15 07:30 AM",
      deployedBy: "Director General & Propietario",
      status: "success",
      devicesCount: 50,
      appliedCount: 50,
      notes: "Adición de 2,000 etiquetas QR al banco central de congeladores."
    }
  ]
};

// ----------------------------------------------------------------------------
// Métodos de Persistencia en LocalStorage
// ----------------------------------------------------------------------------
export function getStoredUsers() {
  const saved = localStorage.getItem("frimart_users");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const updated = parsed.map(u => {
        const fresh = INITIAL_USERS.find(fu => fu.id === u.id);
        if (fresh) {
          return {
            ...u,
            ...fresh,
            avatar: u.avatar || fresh.avatar,
            accessKey: u.accessKey || fresh.accessKey,
            assignedVendors: fresh.assignedVendors || u.assignedVendors
          };
        }
        return u;
      });

      // Add any users from INITIAL_USERS that were not stored in localStorage yet
      INITIAL_USERS.forEach(freshUser => {
        if (!updated.some(u => u.id === freshUser.id)) {
          updated.push(freshUser);
        }
      });

      localStorage.setItem("frimart_users", JSON.stringify(updated));
      return updated;
    } catch (e) {}
  }
  return INITIAL_USERS;
}

export function saveStoredUsers(users) {
  localStorage.setItem("frimart_users", JSON.stringify(users));
}

export function getStoredActiveUser() {
  const saved = localStorage.getItem("frimart_active_session");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const fresh = INITIAL_USERS.find(fu => fu.id === parsed.id);
      if (fresh) {
        return {
          ...parsed,
          ...fresh,
          avatar: parsed.avatar || fresh.avatar,
          accessKey: parsed.accessKey || fresh.accessKey,
          assignedVendors: fresh.assignedVendors || parsed.assignedVendors
        };
      }
      return parsed;
    } catch (e) {}
  }
  return null; // Requiere autenticación por clave PIN
}

export function saveStoredActiveUser(user) {
  localStorage.setItem("frimart_active_session", JSON.stringify(user));
}

export function getStoredOTAConfig() {
  const saved = localStorage.getItem("frimart_ota_config");
  return saved ? JSON.parse(saved) : INITIAL_OTA_CONFIG;
}

export function saveStoredOTAConfig(config) {
  localStorage.setItem("frimart_ota_config", JSON.stringify(config));
}

export function getStoredPendientes() {
  const saved = localStorage.getItem("frimart_seller_pendientes");
  return saved ? JSON.parse(saved) : INITIAL_SELLER_PENDIENTES;
}

export function saveStoredPendientes(pendientes) {
  localStorage.setItem("frimart_seller_pendientes", JSON.stringify(pendientes));
}
