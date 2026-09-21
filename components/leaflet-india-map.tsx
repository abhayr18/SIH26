'use client';

/**
 * LeafletIndiaMap — Real OpenStreetMap tile national map with district risk markers.
 * Replaces the flat SVG India outline with a live Leaflet map.
 */

import React, { useEffect, useRef, useCallback } from 'react';

// ── Types mirrored from thermowatch-dashboard (kept local to avoid circular imports) ──
export type ImdWarningTier = 'No Warning' | 'Watch' | 'Alert' | 'Warning';

export interface IndiaMapDistrict {
  district: string;
  lat: number;
  lon: number;
  temp: number;
  humidity: number;
  htsi: number;
  risk: string;
  probability: number;
  source?: string;
  [key: string]: any;
}

export interface ImdWarningConfig {
  name: string;
  shortLabel: string;
  color: string;
  soft: string;
  badgeClass: string;
  action: string;
}

export interface ImdForecastDay {
  day: 1 | 2 | 3 | 4 | 5;
  title: string;
  sub: string;
  tempOffset: number;
  rhOffset: number;
}

export interface LeafletIndiaMapProps {
  districts: any[];
  selected: any;
  forecastDay: 1 | 2 | 3 | 4 | 5;
  imdWarningConfig: Record<ImdWarningTier, ImdWarningConfig>;
  imdForecastDays: ImdForecastDay[];
  onSelect: (district: any) => void;
  onZoomToCity: (district: any) => void;
  expanded?: boolean;
}

export function LeafletIndiaMap({
  districts,
  selected,
  forecastDay,
  imdWarningConfig,
  imdForecastDays,
  onSelect,
  onZoomToCity,
  expanded = false,
}: LeafletIndiaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').CircleMarker[]>([]);

  const getDistrictForecast = useCallback(
    (item: IndiaMapDistrict, dayNum: 1 | 2 | 3 | 4 | 5) => {
      const config = imdForecastDays[dayNum - 1];
      const temp = Number((item.temp + config.tempOffset).toFixed(1));
      const humidity = Math.min(95, Math.max(15, Math.round(item.humidity + config.rhOffset)));
      let warning: ImdWarningTier = 'No Warning';
      if (temp >= 44.5 || (temp >= 41.5 && humidity >= 50)) warning = 'Warning';
      else if (temp >= 41.5 || (temp >= 38.5 && humidity >= 55)) warning = 'Alert';
      else if (temp >= 38.0 || (temp >= 35.5 && humidity >= 60)) warning = 'Watch';
      return { temp, humidity, warning, warningConfig: imdWarningConfig[warning] };
    },
    [imdForecastDays, imdWarningConfig]
  );

  // ── Mount map once ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      if (!containerRef.current || mapRef.current) return;

      // @ts-ignore
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;

      const map = L.map(containerRef.current!, {
        center: [22.5, 82.5],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        minZoom: 4,
        maxZoom: 10,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

      // Fit to India bounds
      map.fitBounds([[6.5, 68.0], [37.5, 97.5]], { padding: [16, 16] });

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-draw markers whenever data changes ─────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      const map = mapRef.current;
      if (!map) return;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const activeDayConfig = imdForecastDays[forecastDay - 1];

      districts.forEach((item) => {
        const forecast = getDistrictForecast(item, forecastDay);
        const isSelected = selected.district === item.district;
        const color = forecast.warningConfig.color;
        const soft = forecast.warningConfig.soft;

        // Outer glow ring
        const outerRing = L.circleMarker([item.lat, item.lon], {
          radius: isSelected ? 20 : 16,
          fillColor: soft,
          fillOpacity: isSelected ? 0.55 : 0.38,
          color: color,
          weight: isSelected ? 2.5 : 1.2,
          className: 'district-outer-ring',
        }).addTo(map);

        // Inner solid dot
        const innerDot = L.circleMarker([item.lat, item.lon], {
          radius: isSelected ? 9 : 7,
          fillColor: color,
          fillOpacity: 1,
          color: '#ffffff',
          weight: 2,
          className: 'district-inner-dot',
        });

        innerDot.bindTooltip(
          `<div style="font-family:ui-sans-serif,system-ui,sans-serif;min-width:165px;line-height:1.4">
            <div style="font-weight:800;font-size:13px;color:#0f172a">${item.district}</div>
            <div style="margin-top:5px;padding:4px 7px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">
              <div style="font-size:11.5px;font-weight:700;color:#0f172a">${activeDayConfig.title}: ${forecast.temp}°C · ${forecast.humidity}% RH</div>
              <div style="font-size:10.5px;font-weight:700;color:${color};margin-top:2px">● ${forecast.warningConfig.name}</div>
            </div>
            <div style="font-size:9.5px;color:#94a3b8;margin-top:4px;font-style:italic">${forecast.warningConfig.action}</div>
            <div style="font-size:9.5px;color:#6366f1;margin-top:3px;font-weight:600">Click to select · Double-click for ward map</div>
          </div>`,
          {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'india-marker-tooltip',
          }
        );

        innerDot.on({
          click: () => {
            onSelect(item);
          },
          dblclick: () => {
            onSelect(item);
            onZoomToCity(item);
          },
          mouseover: (e) => {
            (e.target as import('leaflet').CircleMarker).setStyle({
              radius: isSelected ? 11 : 9,
              weight: 3,
            });
            (e.target as import('leaflet').Layer).openTooltip();
          },
          mouseout: (e) => {
            (e.target as import('leaflet').CircleMarker).setStyle({
              radius: isSelected ? 9 : 7,
              weight: 2,
            });
          },
        });

        innerDot.addTo(map);

        // Selected: pan map to it + add a pulsing ring
        if (isSelected) {
          const pulseRing = L.circleMarker([item.lat, item.lon], {
            radius: 24,
            fillColor: 'transparent',
            fillOpacity: 0,
            color: color,
            weight: 1.5,
            opacity: 0.5,
            className: 'selected-pulse',
          }).addTo(map);
          markersRef.current.push(pulseRing);

          map.panTo([item.lat, item.lon], { animate: true, duration: 0.6 });
        }

        markersRef.current.push(outerRing, innerDot);
      });
    });
  }, [districts, selected, forecastDay, getDistrictForecast, imdForecastDays, onSelect, onZoomToCity]);

  const mapHeight = expanded ? '520px' : '400px';

  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.6rem] border border-[#dbe1e8] shadow-[0_5px_25px_rgba(38,42,62,0.10)]"
      style={{ height: mapHeight }}
    >
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        crossOrigin=""
      />

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Overlay: selected district callout */}
      <div className="pointer-events-none absolute right-3 top-3 z-[1000] rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-right shadow-sm backdrop-blur-sm">
        <span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">
          Selected District
        </span>
        <strong className="text-sm text-slate-900 block truncate max-w-[140px]">
          {selected.district}
        </strong>
        <span className="text-[10px] text-slate-500">
          {selected.temp}°C · {selected.risk} Risk
        </span>
      </div>

      {/* Overlay: hint */}
      <div className="pointer-events-none absolute left-3 bottom-3 z-[1000] rounded-lg border border-white/80 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[9.5px] text-slate-500 shadow-sm">
        Click marker to select · Double-click to zoom into ward map
      </div>

      <style>{`
        .india-marker-tooltip {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 8px 11px !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.13) !important;
        }
        .india-marker-tooltip::before { display: none !important; }
        .leaflet-container { background: #e8f0f5; font-family: ui-sans-serif, system-ui, sans-serif; }
        .leaflet-control-zoom {
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 1px 6px rgba(0,0,0,0.10) !important;
          border-radius: 10px !important;
          overflow: hidden;
          margin: 0 12px 12px 0 !important;
        }
        .leaflet-control-zoom a { color: #475569 !important; width: 28px !important; height: 28px !important; line-height: 28px !important; font-size: 15px !important; }
        .leaflet-control-zoom a:hover { background: #f8fafc !important; color: #0f172a !important; }
        .leaflet-bar { border: none !important; }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.7; }
      `}</style>
    </div>
  );
}
