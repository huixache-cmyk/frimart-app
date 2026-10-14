/**
 * CONFIGURACIÓN DE JORNADA LABORAL Y GEOCERCAS
 * Valores iniciales; más adelante se administrarán desde el admin web.
 */
export const WORKDAY_CONFIG = {
  autoCloseHour: 22,     // 10:00 pm: cierre automático de la jornada
  cedisRadiusM: 300,     // tolerancia para abrir/cerrar jornada en el CEDIS
  storeRadiusM: 150,     // tolerancia para iniciar visita en una tienda (si la tienda no define la suya)
  maxGpsAccuracyM: 120   // lecturas GPS menos precisas se rechazan y se pide reintentar
};

// Coordenadas de cada CEDIS. Piloto: solo Aguascalientes (ubicación real confirmada).
// Las demás plazas se agregarán con datos reales al expandir el piloto.
export const CEDIS_LOCATIONS = {
  "CEDIS-AGS": { lat: 21.984525, lng: -102.268591, name: "CEDIS Aguascalientes (HS Distribución)" }
};

export const getCedisLocation = (cedisId) => CEDIS_LOCATIONS[cedisId] || null;
export const getStoreRadius = (store) => Number(store?.geofenceRadius) || WORKDAY_CONFIG.storeRadiusM;
