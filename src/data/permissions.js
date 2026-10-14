/**
 * Permisos jerárquicos FRIMART
 * Cada rol hereda TODO lo del rol inferior:
 *   vendedor (1) < supervisor (2) < gerente (3) < director (4) < propietario (5, sin límites)
 * Para dar un acceso nuevo basta con indicar el nivel mínimo que lo requiere.
 */

export const ROLE_LEVEL = {
  vendedor: 1,
  supervisor: 2,
  gerente: 3,
  gerente_cedis: 3,
  director_comercial: 4,
  propietario: 5
};

export const LEVEL = { VENDEDOR: 1, SUPERVISOR: 2, GERENTE: 3, DIRECTOR: 4, PROPIETARIO: 5 };

export const getRoleLevel = (role) => ROLE_LEVEL[role] || 0;

// Pantallas (pestañas) y nivel mínimo para verlas
export const TAB_MIN_LEVEL = {
  // Vendedor
  ruta: LEVEL.VENDEDOR,
  pendientes: LEVEL.VENDEDOR,
  escanear: LEVEL.VENDEDOR,
  congeladores: LEVEL.VENDEDOR,
  perfil: LEVEL.VENDEDOR,
  // Supervisor
  supervision: LEVEL.SUPERVISOR,
  // Gerente
  cedis: LEVEL.GERENTE,
  catalogo: LEVEL.GERENTE,
  // Director
  direccion: LEVEL.DIRECTOR,
  // Propietario
  propietario_hub: LEVEL.PROPIETARIO
};

// Acciones y nivel mínimo para ejecutarlas
export const CAPABILITY_MIN_LEVEL = {
  enrollFreezer: LEVEL.VENDEDOR,
  editPlanogram: LEVEL.VENDEDOR,
  viewTeamRoutes: LEVEL.SUPERVISOR,
  changeFreezerType: LEVEL.SUPERVISOR,
  auditFreezer: LEVEL.SUPERVISOR,
  createStore: LEVEL.SUPERVISOR,
  printQrBatch: LEVEL.SUPERVISOR,
  viewCedisData: LEVEL.GERENTE,
  editCatalog: LEVEL.GERENTE,
  viewAllCedis: LEVEL.DIRECTOR,
  manageUsers: LEVEL.PROPIETARIO,
  deployOta: LEVEL.PROPIETARIO,
  systemSettings: LEVEL.PROPIETARIO
};

export const canSeeTabForRole = (role, tabId) => {
  if (role === "propietario") return true; // acceso total
  const min = TAB_MIN_LEVEL[tabId];
  return min !== undefined && getRoleLevel(role) >= min;
};

export const canDo = (role, capability) => {
  if (role === "propietario") return true; // acceso total
  const min = CAPABILITY_MIN_LEVEL[capability];
  return min !== undefined && getRoleLevel(role) >= min;
};

export const isAtLeast = (role, level) => role === "propietario" || getRoleLevel(role) >= level;

// Pantalla de inicio por rol
export const HOME_TAB = {
  vendedor: "ruta",
  supervisor: "supervision",
  gerente: "cedis",
  gerente_cedis: "cedis",
  director_comercial: "direccion",
  propietario: "propietario_hub"
};
