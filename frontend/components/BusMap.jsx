"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Build marker icons from inline SVG instead of fetching image assets from
// a CDN — keeps the map fully self-contained with no external icon requests.
function makeDivIcon(color) {
  return L.divIcon({
    className: "",
    html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 21 13 21s13-11.5 13-21C26 5.8 20.2 0 13 0z" fill="${color}"/>
      <circle cx="13" cy="13" r="5.5" fill="white"/>
    </svg>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });
}

const originIcon = makeDivIcon("#1B2A4A");
const stopIcon = makeDivIcon("#F2A93B");
const destinationIcon = makeDivIcon("#2F9E5B");

function FitBounds({ points }) {
  const map = useMap();
  useMemo(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 11);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);
  return null;
}

export default function BusMap({ fromCity, toCity, stops = [] }) {
  const points = useMemo(() => {
    const ordered = [
      [fromCity.latitude, fromCity.longitude],
      ...stops
        .slice()
        .sort((a, b) => a.sequence - b.sequence)
        .map((s) => [s.latitude, s.longitude]),
      [toCity.latitude, toCity.longitude],
    ];
    return ordered;
  }, [fromCity, toCity, stops]);

  const markers = [
    { name: fromCity.name, position: points[0], label: "Origin", icon: originIcon },
    ...stops.map((s) => ({ name: s.name, position: [s.latitude, s.longitude], label: `Arrival: ${s.arrival_time}`, icon: stopIcon })),
    { name: toCity.name, position: points[points.length - 1], label: "Destination", icon: destinationIcon },
  ];

  return (
    <div className="w-full h-72 sm:h-96 rounded-xl overflow-hidden">
      <MapContainer center={points[0]} zoom={9} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={points} pathOptions={{ color: "#1B2A4A", weight: 4, opacity: 0.85 }} />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position} icon={m.icon}>
            <Popup>
              <strong>{m.name}</strong>
              <br />
              {m.label}
            </Popup>
          </Marker>
        ))}
        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
