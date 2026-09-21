'use client';

/**
 * LeafletWardMap — Real OpenStreetMap tile map with authentic ward GeoJSON overlays.
 * Replaces the flat SVG canvas with a live geographic map using vanilla Leaflet.js.
 */

import React, { useEffect, useRef } from 'react';
import type { WardSpatialData, CitySpatialProfile } from '@/lib/city-wards';
import type { GisLayerMode, CategoricalIndicator } from './hyperlocal-ward-gis';

export interface LeafletWardMapProps {
  profile: CitySpatialProfile;
  activeLayer: GisLayerMode;
  activeIndicator: CategoricalIndicator | null;
  selectedWardId: string;
  baseTemp: number;
  baseHumidity?: number;
  onSelectWard: (ward: WardSpatialData) => void;
  isWardMatchingIndicator: (ward: WardSpatialData, ind: CategoricalIndicator) => boolean;
  getWardFill: (ward: WardSpatialData, isHovered: boolean, isSelected: boolean) => string;
}

// ── Real geographic bounding boxes for each monitored city ──────────────────
// [south, west, north, east] in WGS84 decimal degrees
const CITY_BOUNDS: Record<string, [number, number, number, number]> = {
  Delhi:       [28.404, 76.838, 28.883, 77.347],
  Hyderabad:   [17.237, 78.246, 17.584, 78.626],
  Jaipur:      [26.758, 75.652, 27.090, 75.942],
  Patna:       [25.536, 85.044, 25.692, 85.257],
  Ahmedabad:   [22.916, 72.486, 23.130, 72.706],
  Bhopal:      [23.143, 77.282, 23.338, 77.524],
  Lucknow:     [26.733, 80.826, 26.989, 81.072],
  Bhubaneswar: [20.193, 85.736, 20.388, 85.918],
  Nagpur:      [21.053, 78.989, 21.244, 79.183],
  Pune:        [18.447, 73.743, 18.629, 73.966],
  Mumbai:      [18.893, 72.775, 19.268, 72.987],
  Kolkata:     [22.430, 88.276, 22.641, 88.453],
  Bengaluru:   [12.832, 77.470, 13.148, 77.750],
  Chennai:     [12.895, 80.155, 13.237, 80.334],
  Chandigarh:  [30.649, 76.698, 30.790, 76.892],
  Varanasi:    [25.245, 82.922, 25.424, 83.091],
};

/**
 * Convert SVG canvas coordinates (viewBox 0 0 510 360) to real lat/lon
 * using each city geographic bounding box.
 */
function svgToLatLng(
  svgX: number,
  svgY: number,
  bounds: [number, number, number, number]
): [number, number] {
  const [south, west, north, east] = bounds;
  const lat = north - (svgY / 360) * (north - south);
  const lng = west + (svgX / 510) * (east - west);
  return [lat, lng];
}

/**
 * Parse SVG polygon points string into a GeoJSON coordinate ring.
 */
function svgPolygonToGeoJsonRing(
  polygonStr: string,
  bounds: [number, number, number, number]
): [number, number][] {
  const pts = polygonStr.trim().split(/\s+/).map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    const [lat, lng] = svgToLatLng(x, y, bounds);
    return [lng, lat] as [number, number]; // GeoJSON is [lng, lat]
  });
  if (pts.length > 0) pts.push(pts[0]); // close ring
  return pts;
}

function buildGeoJson(
  wards: WardSpatialData[],
  bounds: [number, number, number, number]
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: wards.map((ward) => ({
      type: 'Feature',
      properties: { id: ward.id },
      geometry: {
        type: 'Polygon',
        coordinates: [svgPolygonToGeoJsonRing(ward.polygon, bounds)],
      },
    })),
  };
}

export function LeafletWardMap({
  profile,
  activeLayer,
  activeIndicator,
  selectedWardId,
  baseTemp,
  onSelectWard,
  isWardMatchingIndicator,
  getWardFill,
}: LeafletWardMapProps) {
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<import('leaflet').GeoJSON | null>(null);
  const markersRef = useRef<import('leaflet').Marker[]>([]);

  const cityBounds = CITY_BOUNDS[profile.cityName] ?? CITY_BOUNDS['Delhi'];

  // ── Mount Leaflet once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return;

      // Fix bundler icon paths
      // @ts-ignore
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const [south, west, north, east] = cityBounds;

      const map = L.map(containerRef.current!, {
        center: [(south + north) / 2, (west + east) / 2],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

      mapRef.current = map;
      map.fitBounds([[south, west], [north, east]], { padding: [24, 24] });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      markersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-fit when city changes ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const [south, west, north, east] = cityBounds;
    mapRef.current.fitBounds([[south, west], [north, east]], { padding: [24, 24], animate: true, duration: 0.8 });
  }, [profile.cityName, cityBounds]);

  // ── Re-draw wards when anything interactive changes ───────────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      const map = mapRef.current;
      if (!map) return;

      layerRef.current?.remove();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const geojson = buildGeoJson(profile.wards, cityBounds);

      const layer = L.geoJSON(geojson, {
        style: (feature) => {
          const wardId = feature?.properties?.id as string;
          const ward = profile.wards.find((w) => w.id === wardId);
          if (!ward) return {};
          const isSelected = ward.id === selectedWardId;
          const fillColor = getWardFill(ward, false, isSelected);
          const matchesFilter = !activeIndicator || isWardMatchingIndicator(ward, activeIndicator);
          return {
            fillColor,
            fillOpacity: matchesFilter ? (isSelected ? 0.82 : 0.60) : 0.15,
            color: isSelected ? '#0f172a' : matchesFilter ? '#475569' : '#cbd5e1',
            weight: isSelected ? 3 : matchesFilter ? 1.4 : 0.6,
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const wardId = feature.properties?.id as string;
          const ward = profile.wards.find((w) => w.id === wardId);
          if (!ward) return;

          const localTemp = (baseTemp + ward.uhiOffsetC).toFixed(1);
          const metricLine =
            activeLayer === 'vulnerability' ? `PVS: ${ward.pvsScore}` :
            activeLayer === 'outdoor-workers' ? `Workers: ${ward.outdoorWorkersPct}%` :
            activeLayer === 'cooling-centers' ? `Cooling Centers: ${ward.coolingCenters}` :
            activeLayer === 'healthcare' ? `Hospitals: ${ward.hospitals}` :
            `Local Temp: ${localTemp}°C`;

          const riskColor =
            ward.vulnerabilityLevel === 'Critical' ? '#dc2626' :
            ward.vulnerabilityLevel === 'Very High' ? '#ea580c' :
            ward.vulnerabilityLevel === 'High' ? '#d97706' : '#059669';

          featureLayer.bindTooltip(
            `<div style="font-family:ui-sans-serif,system-ui,sans-serif;min-width:175px;line-height:1.4">
              <div style="font-weight:700;font-size:12.5px;color:#0f172a">${ward.name}</div>
              <div style="font-size:10.5px;color:#64748b;margin-top:1px">${ward.zone}</div>
              <div style="margin-top:6px;padding:4px 6px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">
                <div style="font-size:11px;font-weight:700;color:#0f172a">${metricLine}</div>
                <div style="font-size:10px;color:#64748b;margin-top:1px">Pop: ${ward.population.toLocaleString()}</div>
              </div>
              <div style="margin-top:5px;font-size:10.5px;font-weight:700;color:${riskColor}">● ${ward.vulnerabilityLevel} Risk</div>
              <div style="font-size:9.5px;color:#94a3b8;margin-top:3px;font-style:italic">${ward.primaryDriver}</div>
            </div>`,
            { permanent: false, direction: 'top', offset: [0, -4], className: 'ward-tooltip' }
          );

          featureLayer.on({
            mouseover: (e) => {
              (e.target as import('leaflet').Path).setStyle({
                fillColor: getWardFill(ward, true, ward.id === selectedWardId),
                fillOpacity: 0.88,
                weight: 2.8,
                color: '#334155',
              });
              (e.target as import('leaflet').Layer).openTooltip();
            },
            mouseout: (e) => { layer.resetStyle(e.target); },
            click: () => { onSelectWard(ward); },
          });
        },
      });

      layer.addTo(map);
      layerRef.current = layer;

      // Landmark dots
      const landmarkIcon = L.divIcon({
        className: '',
        html: `<div style="width:9px;height:9px;border-radius:50%;background:#0f172a;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
        iconSize: [9, 9],
        iconAnchor: [4, 4],
      });
      profile.landmarks.forEach((lm) => {
        const [lat, lng] = svgToLatLng(lm.x, lm.y, cityBounds);
        const marker = L.marker([lat, lng], { icon: landmarkIcon });
        marker.bindTooltip(lm.name, { permanent: false, direction: 'top', className: 'landmark-tooltip' });
        marker.addTo(map);
        markersRef.current.push(marker);
      });

      // Fly to selected ward
      const sel = profile.wards.find((w) => w.id === selectedWardId);
      if (sel) {
        const [lat, lng] = svgToLatLng(sel.center.x, sel.center.y, cityBounds);
        map.setView([lat, lng], Math.max(map.getZoom(), 13), { animate: true });
      }
    });
  }, [profile, activeLayer, activeIndicator, selectedWardId, cityBounds, baseTemp, getWardFill, isWardMatchingIndicator, onSelectWard]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-xs" style={{ height: '420px' }}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        crossOrigin=""
      />

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Overlay badge */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/92 backdrop-blur-sm px-2.5 py-1.5 shadow-sm pointer-events-none">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
        <span className="font-mono text-[10px] font-semibold text-slate-700 uppercase tracking-wider">
          {profile.municipalCorporation.split('(')[0].trim()}
        </span>
        <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.2 font-mono text-[9px] text-slate-600 uppercase">
          {activeLayer.replace(/-/g, ' ')}
        </span>
      </div>

      <style>{`
        .ward-tooltip .leaflet-tooltip-content { padding: 0; }
        .ward-tooltip {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 8px 11px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
        }
        .ward-tooltip::before { display: none !important; }
        .landmark-tooltip {
          background: #0f172a !important;
          color: #f1f5f9 !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 3px 8px !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
        }
        .landmark-tooltip::before { display: none !important; }
        .leaflet-container { background: #f1f5f9; font-family: ui-sans-serif, system-ui, sans-serif; }
        .leaflet-control-zoom {
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 1px 6px rgba(0,0,0,0.10) !important;
          border-radius: 10px !important;
          overflow: hidden;
          margin: 0 12px 12px 0 !important;
        }
        .leaflet-control-zoom a {
          color: #475569 !important;
          width: 28px !important;
          height: 28px !important;
          line-height: 28px !important;
          font-size: 15px !important;
        }
        .leaflet-control-zoom a:hover { background: #f8fafc !important; color: #0f172a !important; }
        .leaflet-bar { border: none !important; }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.7; }
      `}</style>
    </div>
  );
}
