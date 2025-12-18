import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN, MAP_STYLE, isMapboxConfigured } from '@/lib/mapbox';
import { Loader2 } from 'lucide-react';

interface RoutePoint {
  lat: number;
  lng: number;
  label: string;
  isContainer?: boolean;
}

interface RouteMapPreviewProps {
  points: RoutePoint[];
  containerPoint: RoutePoint;
  className?: string;
}

export const RouteMapPreview: React.FC<RouteMapPreviewProps> = ({ 
  points, 
  containerPoint,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (!isMapboxConfigured()) {
      setIsLoading(false);
      return;
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    // Calculate center from all points
    const allPoints = [...points, containerPoint];
    const centerLat = allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length;
    const centerLng = allPoints.reduce((sum, p) => sum + p.lng, 0) / allPoints.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [centerLng, centerLat],
      zoom: 16,
      interactive: false,
    });

    map.current.on('load', () => {
      setIsLoading(false);

      // Create route coordinates (all waste points -> container)
      const routeCoordinates = points.map(p => [p.lng, p.lat]);
      routeCoordinates.push([containerPoint.lng, containerPoint.lat]);

      // Add route line
      map.current?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      map.current?.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-dasharray': [2, 1],
        },
      });

      // Add waste point markers
      points.forEach((point, index) => {
        const el = document.createElement('div');
        el.className = 'waste-marker';
        el.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm">
            ${index + 1}
          </div>
        `;
        
        new mapboxgl.Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .addTo(map.current!);
      });

      // Add container marker
      const containerEl = document.createElement('div');
      containerEl.innerHTML = `
        <div class="w-10 h-10 rounded-lg bg-green-600 border-2 border-white shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </div>
      `;
      
      new mapboxgl.Marker({ element: containerEl })
        .setLngLat([containerPoint.lng, containerPoint.lat])
        .addTo(map.current!);

      // Fit bounds to show all points
      const bounds = new mapboxgl.LngLatBounds();
      allPoints.forEach(p => bounds.extend([p.lng, p.lat]));
      map.current?.fitBounds(bounds, { padding: 40 });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [points, containerPoint]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};
