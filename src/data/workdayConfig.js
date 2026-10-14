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

// Coordenadas de cada CEDIS (aproximadas por dirección; confirmar en admin web)
export const CEDIS_LOCATIONS = {
  "CEDIS-AGS": { lat: 21.7795, lng: -102.2975, name: "CEDIS Aguascalientes" },
  "CEDIS-01": { lat: 21.1619, lng: -86.8515, name: "CEDIS Cancún Principal" },
  "CEDIS-02": { lat: 20.9990, lng: -89.6820, name: "CEDIS Mérida Periférico" },
  "CEDIS-03": { lat: 20.6280, lng: -87.0890, name: "CEDIS Playa del Carmen" }
};

export const getCedisLocation = (cedisId) => CEDIS_LOCATIONS[cedisId] || null;
export const getStoreRadius = (store) => Number(store?.geofenceRadius) || WORKDAY_CONFIG.storeRadiusM;
