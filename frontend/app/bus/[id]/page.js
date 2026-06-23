import Link from "next/link";
import { FaArrowLeft, FaClock, FaIndianRupeeSign, FaBus } from "react-icons/fa6";
import BusRoute from "@/components/BusRoute";
import { api } from "@/lib/api";

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default async function BusDetailPage({ params }) {
  const { id } = await params;

  let bus;
  try {
    bus = await api.getBus(id);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-paper)" }}>
        <div className="text-center">
          <p className="font-semibold mb-2" style={{ color: "var(--color-navy)" }}>Bus not found</p>
          <Link href="/buslist" className="text-sm underline" style={{ color: "var(--color-amber)" }}>
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/buslist"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6"
          style={{ color: "var(--color-slate)" }}
        >
          <FaArrowLeft size={12} />
          Back to results
        </Link>

        <div className="rounded-2xl border p-6 mb-6" style={{ borderColor: "var(--color-line)", background: "white" }}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "var(--color-navy)" }}>
                <FaBus size={18} style={{ color: "var(--color-amber)" }} />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold" style={{ color: "var(--color-navy)" }}>
                  {bus.operator_name}
                </h1>
                <p className="text-xs" style={{ color: "var(--color-slate)" }}>{bus.travel_date}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-lg font-semibold"
              style={{ color: "var(--color-success)" }}
            >
              <FaIndianRupeeSign size={14} />
              {bus.fare % 1 === 0 ? bus.fare.toFixed(0) : bus.fare}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="rounded-xl p-4" style={{ background: "var(--color-paper)" }}>
              <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--color-slate)" }}>
                <FaClock size={11} /> Departs
              </div>
              <div className="font-[family-name:var(--font-mono)] text-base font-medium" style={{ color: "var(--color-navy)" }}>
                {formatTime(bus.departure_time)}
              </div>
              <div className="text-sm" style={{ color: "var(--color-slate)" }}>{bus.from_city.name}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "var(--color-paper)" }}>
              <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--color-slate)" }}>
                <FaClock size={11} /> Arrives
              </div>
              <div className="font-[family-name:var(--font-mono)] text-base font-medium" style={{ color: "var(--color-navy)" }}>
                {formatTime(bus.arrival_time)}
              </div>
              <div className="text-sm" style={{ color: "var(--color-slate)" }}>{bus.to_city.name}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6" style={{ borderColor: "var(--color-line)", background: "white" }}>
          <BusRoute bus={bus} />
        </div>
      </div>
    </div>
  );
}
