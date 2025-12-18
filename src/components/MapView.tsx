import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { 
  MAPBOX_ACCESS_TOKEN, 
  MAP_DEFAULT_CENTER, 
  MAP_DEFAULT_ZOOM, 
  MAP_STYLE,
  isMapboxConfigured 
} from '@/lib/mapbox';
import { 
  TIPO_RESIDUO_COLORS, 
  TIPO_RESIDUO_ICONS,
  Camera,
} from '@/types';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface MapViewProps {
  onMapClick?: (lat: number, lng: number) => void;
  isAddingOccurrence?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ 
  onMapClick, 
  isAddingOccurrence = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const cameraMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const hotspotsLayerRef = useRef<string>('hotspots-layer');
  
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  
  const { 
    ocorrencias, 
    hotspots,
    cameras,
    selectedOcorrencia,
    setSelectedOcorrencia,
    selectedHotspot,
    setSelectedHotspot,
    setSelectedCamera,
  } = useApp();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (!isMapboxConfigured()) {
      setMapError('Token do Mapbox não configurado. Configure MAPBOX_ACCESS_TOKEN.');
      setIsLoading(false);
      return;
    }

    try {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: MAP_DEFAULT_CENTER,
        zoom: MAP_DEFAULT_ZOOM,
        pitch: 20,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-left'
      );

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        'top-left'
      );

      map.current.on('load', () => {
        setIsLoading(false);
        
        // Add hotspots source and layer
        map.current?.addSource('hotspots', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.current?.addLayer({
          id: hotspotsLayerRef.current,
          type: 'circle',
          source: 'hotspots',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'score'], 0, 15, 100, 50],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'score'],
              0, 'rgba(74, 222, 128, 0.3)',
              25, 'rgba(250, 204, 21, 0.4)',
              50, 'rgba(251, 146, 60, 0.5)',
              75, 'rgba(239, 68, 68, 0.6)',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': [
              'interpolate',
              ['linear'],
              ['get', 'score'],
              0, '#4ade80',
              25, '#facc15',
              50, '#fb923c',
              75, '#ef4444',
            ],
            'circle-opacity': 0.7,
          },
        });

        // Click handler for hotspots
        map.current?.on('click', hotspotsLayerRef.current, (e) => {
          if (e.features && e.features[0]) {
            const hotspotId = e.features[0].properties?.id;
            const hotspot = hotspots.find(h => h.id === hotspotId);
            if (hotspot) {
              setSelectedHotspot(hotspot);
              setSelectedOcorrencia(null);
            }
          }
        });

        // Cursor change on hover
        map.current?.on('mouseenter', hotspotsLayerRef.current, () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current?.on('mouseleave', hotspotsLayerRef.current, () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      });

      // Map click handler - use custom event to get current props
      map.current.on('click', (e) => {
        const event = new CustomEvent('mapClick', { 
          detail: { lat: e.lngLat.lat, lng: e.lngLat.lng } 
        });
        mapContainer.current?.dispatchEvent(event);
      });

    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      setMapError('Erro ao carregar o mapa. Verifique sua conexão.');
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle map clicks with current props
  useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;

    const handleMapClick = (e: Event) => {
      const customEvent = e as CustomEvent<{ lat: number; lng: number }>;
      if (onMapClick) {
        onMapClick(customEvent.detail.lat, customEvent.detail.lng);
      }
    };

    container.addEventListener('mapClick', handleMapClick);
    return () => container.removeEventListener('mapClick', handleMapClick);
  }, [onMapClick]);

  // Update hotspots layer
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('hotspots') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: hotspots.map(h => ({
          type: 'Feature' as const,
          properties: {
            id: h.id,
            score: h.score,
            categoria: h.categoria,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [h.longitudeCentro, h.latitudeCentro],
          },
        })),
      });
    }
  }, [hotspots]);

  // Update occurrence markers
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!map.current) return;

    // Add markers for occurrences
    ocorrencias
      .filter(o => o.status !== 'resolvido')
      .forEach(o => {
        const el = document.createElement('div');
        el.className = 'occurrence-marker';
        el.innerHTML = `
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg cursor-pointer transition-transform hover:scale-110" 
               style="background: ${TIPO_RESIDUO_COLORS[o.tipoResiduo]}">
            ${TIPO_RESIDUO_ICONS[o.tipoResiduo]}
          </div>
        `;
        
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedOcorrencia(o);
          setSelectedHotspot(null);
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([o.longitude, o.latitude])
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });
  }, [ocorrencias, setSelectedOcorrencia, setSelectedHotspot]);

  // Update camera markers
  useEffect(() => {
    // Clear existing camera markers
    cameraMarkersRef.current.forEach(m => m.remove());
    cameraMarkersRef.current = [];

    if (!map.current) return;

    // Add markers for cameras
    cameras.forEach(camera => {
      const el = document.createElement('div');
      el.className = 'camera-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all hover:scale-110 bg-slate-800 border-2 border-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 8-6 4 6 4V8Z"/>
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-white"></div>
        </div>
      `;
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedCamera(camera);
        setSelectedOcorrencia(null);
        setSelectedHotspot(null);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([camera.longitude, camera.latitude])
        .addTo(map.current!);
      
      cameraMarkersRef.current.push(marker);
    });
  }, [cameras, setSelectedCamera, setSelectedOcorrencia, setSelectedHotspot]);

  // Fly to selected item
  useEffect(() => {
    if (!map.current) return;
    
    if (selectedOcorrencia) {
      map.current.flyTo({
        center: [selectedOcorrencia.longitude, selectedOcorrencia.latitude],
        zoom: 16,
        duration: 1000,
      });
    } else if (selectedHotspot) {
      map.current.flyTo({
        center: [selectedHotspot.longitudeCentro, selectedHotspot.latitudeCentro],
        zoom: 15,
        duration: 1000,
      });
    }
  }, [selectedOcorrencia, selectedHotspot]);

  if (mapError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/50">
        <div className="text-center p-6">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Erro no Mapa</h3>
          <p className="text-muted-foreground">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carregando mapa...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs space-y-2">
        <div className="font-medium mb-2">Legenda</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="3">
              <path d="m22 8-6 4 6 4V8Z"/>
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
            </svg>
          </div>
          <span className="text-muted-foreground">Câmeras</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500/30 border border-green-500"></div>
          <span className="text-muted-foreground">Hotspot baixo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500/60 border border-red-500"></div>
          <span className="text-muted-foreground">Hotspot crítico</span>
        </div>
      </div>
    </div>
  );
};
