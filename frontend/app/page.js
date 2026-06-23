import Link from "next/link";
import { FaBus, FaMapLocationDot, FaClock } from "react-icons/fa6";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--color-navy)" }}>
      {/* Top route-strip motif as ambient texture */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        {/* Decorative dotted road lines in the background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg, transparent 0 40px, var(--color-amber) 40px 44px)",
          }}
        />

        <div className="relative z-10 animate-fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs font-medium tracking-wide"
            style={{ background: "rgba(242,169,59,0.15)", color: "var(--color-amber)" }}
          >
            <FaBus size={12} />
            INTERCITY BUS SCHEDULES
          </div>

          <h1
            className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-semibold tracking-tight mb-4"
            style={{ color: "var(--color-paper)" }}
          >
            Welcome to<br />RouteWise
          </h1>

          <p
            className="max-w-md mx-auto mb-10 text-base sm:text-lg"
            style={{ color: "var(--color-slate-light)" }}
          >
            Departure times, travel routes, and live schedule information
            for buses running between Indian cities — all in one place.
          </p>

          <Link
            href="/buslist"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: "var(--color-amber)", color: "var(--color-navy-deep)" }}
          >
            Go to Bus Booking
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Feature strip */}
        <div className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { icon: FaClock, label: "Real-time schedules" },
            { icon: FaMapLocationDot, label: "Visual route maps" },
            { icon: FaBus, label: "Multiple operators" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              <Icon size={20} style={{ color: "var(--color-amber)" }} />
              <span className="text-sm" style={{ color: "var(--color-slate-light)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer
        className="text-center text-xs py-5"
        style={{ color: "var(--color-slate)" }}
      >
        Automated Bus Scheduling System
      </footer>
    </main>
  );
}
