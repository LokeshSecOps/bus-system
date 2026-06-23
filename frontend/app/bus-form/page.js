import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import BusForm from "@/components/BusForm";
import { api } from "@/lib/api";

export default async function BusFormPage() {
  let cities = [];
  try {
    cities = await api.getCities();
  } catch {
    cities = [];
  }

  if (cities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-paper)" }}>
        <p className="text-sm" style={{ color: "var(--color-slate)" }}>
          Can&apos;t reach the backend API right now — try again shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/buslist"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6"
          style={{ color: "var(--color-slate)" }}
        >
          <FaArrowLeft size={12} />
          Back to results
        </Link>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-1" style={{ color: "var(--color-navy)" }}>
          Add a bus schedule
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-slate)" }}>
          Enter the route, timings, and fare. Stops are optional but power the route map.
        </p>

        <BusForm cities={cities} />
      </div>
    </div>
  );
}
