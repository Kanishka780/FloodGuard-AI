"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet.heat";

// FIX ICON ISSUE
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function getMarkerIcon(level) {
  if (level === "HIGH") {
    return new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/564/564619.png", // warning red
      iconSize: [35, 35],
    });
  }

  if (level === "MEDIUM") {
    return new L.Icon({
      iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiB4PSIxIiB5PSIxIiBmaWxsPSIjZWFiMzA4IiByeD0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+",
      iconSize: [30, 30],
    });
  }

  return new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png", // green safe
    iconSize: [25, 25],
  });
}

function HeatmapLayer({ areasData }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !L.heatLayer || !areasData) return;

    const heatData = areasData.map((area) => {
      const intensity = area.risk.level === "HIGH" ? 1.0 : area.risk.level === "MEDIUM" ? 0.4 : 0.1;
      return [area.lat, area.lng, intensity];
    });

    const heatLayer = L.heatLayer(heatData, { 
      radius: 40,
      blur: 25,
      maxZoom: 14,
      gradient: { 0.4: 'yellow', 0.6: 'orange', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [areasData, map]);

  return null;
}

export default function MapComponent({ areasData = [], onSelect }) {
  console.log("MAP DATA:", areasData);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[28.65, 77.35]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <HeatmapLayer areasData={areasData} />

      {areasData.map((area, index) => {
        const risk = area.risk;

        return (
          <Marker
            key={index}
            position={[area.lat, area.lng]}
            icon={getMarkerIcon(risk.level)}
            eventHandlers={{
              click: () => {
                if(onSelect) onSelect(area);
              }
            }}
          >
            <Popup>
              <div className="text-sm">
                <h2 className="font-bold">{area.name}</h2>
                <p>Risk: {risk.level}</p>

                <p className="mt-2 font-semibold">Why?</p>
                <ul className="list-disc ml-4">
                  <li>Elevation: {area.elevation}</li>
                  <li>Drainage: {area.drainage}/10</li>
                </ul>

                <p className="mt-2 font-semibold">Action:</p>
                <p className={risk.level === 'HIGH' ? "text-red-500 font-bold" : ""}>{risk.action}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
}
