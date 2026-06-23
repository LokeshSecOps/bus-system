import Link from "next/link";
import { FaCircleArrowRight } from "react-icons/fa6";

function formatTime(t) {
  // t comes in as "HH:MM:SS" from the API
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function BusCard({ bus }) {
  return (
    <Link
      href={`/bus/${bus.id}`}
      className="group block rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ borderColor: "var(--color-line)", background: "white" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold" style={{ color: "var(--color-navy)" }}>
            {bus.operator_name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-slate)" }}>
            {bus.travel_date}
          </p>
        </div>
        <div className="text-right">
          <div
            className="font-[family-name:var(--font-mono)] text-lg font-medium"
            style={{ color: "var(--color-success)" }}
          >
            ₹{bus.fare % 1 === 0 ? bus.fare.toFixed(0) : bus.fare}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="font-[family-name:var(--font-mono)] text-base font-medium" style={{ color: "var(--color-navy)" }}>
            {formatTime(bus.departure_time)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--color-slate)" }}>
            {bus.from_city.name}
          </div>
        </div>

        <div className="route-strip">
          <span className="dot" />
          <span className="line" />
          <FaCircleArrowRight size={14} style={{ color: "var(--color-amber)" }} className="flex-shrink-0" />
          <span className="line" />
          <span className="dot amber" />
        </div>

        <div className="text-center">
          <div className="font-[family-name:var(--font-mono)] text-base font-medium" style={{ color: "var(--color-navy)" }}>
            {formatTime(bus.arrival_time)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--color-slate)" }}>
            {bus.to_city.name}
          </div>
        </div>
      </div>

      <div
        className="mt-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--color-amber)" }}
      >
        View route & stops →
      </div>
    </Link>
  );
}
