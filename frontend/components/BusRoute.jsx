"use client";

import dynamic from "next/dynamic";
import { FaCircle } from "react-icons/fa6";

// Leaflet touches `window` on import, so the map must be loaded client-side only.
const BusMap = dynamic(() => import("./BusMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 sm:h-96 rounded-xl animate-pulse" style={{ background: "var(--color-line)" }} />
  ),
});

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function BusRoute({ bus }) {
  const { from_city, to_city, stops } = bus;

  return (
    <div>
      <BusMap fromCity={from_city} toCity={to_city} stops={stops} />

      <div className="mt-5">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold mb-3" style={{ color: "var(--color-navy)" }}>
          🚌 Route: {from_city.name} → {to_city.name}
        </h3>

        <ol className="relative border-l-2 pl-5 space-y-4" style={{ borderColor: "var(--color-amber)" }}>
          <li className="relative">
            <FaCircle size={9} className="absolute -left-[25px] top-1" style={{ color: "var(--color-navy)" }} />
            <div className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>{from_city.name}</div>
            <div className="text-xs" style={{ color: "var(--color-slate)" }}>Departure: {formatTime(bus.departure_time)}</div>
          </li>

          {stops
            .slice()
            .sort((a, b) => a.sequence - b.sequence)
            .map((stop) => (
              <li key={stop.id} className="relative">
                <FaCircle size={9} className="absolute -left-[25px] top-1" style={{ color: "var(--color-amber)" }} />
                <div className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>{stop.name}</div>
                <div className="text-xs" style={{ color: "var(--color-slate)" }}>
                  Arrival: {formatTime(stop.arrival_time)}
                </div>
              </li>
            ))}

          <li className="relative">
            <FaCircle size={9} className="absolute -left-[25px] top-1" style={{ color: "var(--color-success)" }} />
            <div className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>{to_city.name}</div>
            <div className="text-xs" style={{ color: "var(--color-slate)" }}>Arrival: {formatTime(bus.arrival_time)}</div>
          </li>
        </ol>
      </div>
    </div>
  );
}
