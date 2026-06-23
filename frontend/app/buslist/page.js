import { Suspense } from "react";
import BusListClient from "@/components/BusListClient";
import { api } from "@/lib/api";

async function getCitiesSafe() {
  try {
    return await api.getCities();
  } catch {
    // Backend unreachable at build/request time — fall back to an empty
    // list so the page still renders with a clear error state client-side.
    return [];
  }
}

export default async function BusListPage() {
  const cities = await getCitiesSafe();

  if (cities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-paper)" }}>
        <div className="text-center max-w-sm">
          <p className="font-semibold mb-2" style={{ color: "var(--color-navy)" }}>
            Can&apos;t reach the bus schedule service
          </p>
          <p className="text-sm" style={{ color: "var(--color-slate)" }}>
            The backend API isn&apos;t responding. Make sure it&apos;s running and
            <code className="mx-1 px-1.5 py-0.5 rounded bg-black/5">NEXT_PUBLIC_API_URL</code>
            is set correctly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <BusListClient cities={cities} />
    </Suspense>
  );
}
