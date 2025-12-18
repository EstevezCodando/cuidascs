// ============================================
// Mapbox Configuration
// ============================================

// Token público do Mapbox - seguro para uso no frontend
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiamVhbmFsdmFyZXplIiwiYSI6ImNtaXY3Z3ZxbjF3NzIzZXEyNHViaHhidHgifQ.Pd4zhq5CF-0oPS5mW-NN9Q';

// Default map settings - Ponto principal
export const MAP_DEFAULT_CENTER: [number, number] = [-47.8870557, -15.7967737];
export const MAP_DEFAULT_ZOOM = 18;
export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';

// Validate token exists
export const isMapboxConfigured = (): boolean => {
  return Boolean(MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN.length > 0);
};

// Grid settings for hotspot calculation
export const GRID_SIZE_METERS = 100; // ~100m grid cells

// Calculate approximate grid cell from coordinates
export const coordsToGridKey = (lat: number, lng: number): string => {
  // Simple grid calculation (~100m cells)
  const latGrid = Math.floor(lat * 1000);
  const lngGrid = Math.floor(lng * 1000);
  return `${latGrid}_${lngGrid}`;
};

// Get center of grid cell
export const gridKeyToCoords = (key: string): { lat: number; lng: number } => {
  const [latGrid, lngGrid] = key.split('_').map(Number);
  return {
    lat: (latGrid + 0.5) / 1000,
    lng: (lngGrid + 0.5) / 1000,
  };
};

// Calculate distance between two points (Haversine formula)
export const calcularDistanciaKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate ETA based on euclidean distance (walking speed ~4km/h)
export const estimarETAMinutos = (distanciaKm: number): number => {
  const velocidadeKmH = 4;
  return Math.ceil((distanciaKm / velocidadeKmH) * 60);
};
