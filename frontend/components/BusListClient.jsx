"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaBus } from "react-icons/fa6";
import SearchForm from "@/components/SearchForm";
import BusCard from "@/components/BusCard";
import { api } from "@/lib/api";

const FILTERS = [
  { key: "all", label: "All buses" },
  { key: "upcoming", label: "Upcoming buses" },
  { key: "current", label: "Current buses" },
];

export default function BusListClient({ cities }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFrom = searchParams.get("from") || cities[0]?.name;
  const initialTo = searchParams.get("to") || cities[1]?.name;
  const initialDate = searchParams.get("date") || "";

  const [query, setQuery] = useState({ fromCity: initialFrom, toCity: initialTo, travelDate: initialDate });
  const [filter, setFilter] = useState("all");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = useCallback(async (q, f) => {
    setLoading(true);
    setError(null);
    try {
      const results = await api.searchBuses({ ...q, filter: f });
      setBuses(results);
    } catch (err) {
      setError(err.message);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.fromCity && query.toCity) {
      runSearch(query, filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(newQuery) {
    setQuery(newQuery);
    setFilter("all");
    const params = new URLSearchParams({
      from: newQuery.fromCity,
      to: newQuery.toCity,
      ...(newQuery.travelDate ? { date: newQuery.travelDate } : {}),
    });
    router.replace(`/buslist?${params.toString()}`);
    runSearch(newQuery, "all");
  }

  function handleFilterChange(f) {
    setFilter(f);
    runSearch(query, f);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[340px_1fr] gap-6">
        {/* Search panel */}
        <aside className="lg:sticky lg:top-8 self-start">
          <SearchForm
            cities={cities}
            onSearch={handleSearch}
            initialFrom={initialFrom}
            initialTo={initialTo}
            initialDate={initialDate}
          />
        </aside>

        {/* Results */}
        <section>
          <div className="mb-5">
            <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold" style={{ color: "var(--color-navy)" }}>
              Buses from <span style={{ color: "var(--color-amber-soft)", background: "var(--color-navy)", padding: "1px 8px", borderRadius: 6 }}>{query.fromCity}</span>
              {" "}to{" "}
              <span style={{ color: "var(--color-amber-soft)", background: "var(--color-navy)", padding: "1px 8px", borderRadius: 6 }}>{query.toCity}</span>
            </h1>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
                style={
                  filter === f.key
                    ? { background: "var(--color-navy)", color: "var(--color-paper)", borderColor: "var(--color-navy)" }
                    : { background: "white", color: "var(--color-slate)", borderColor: "var(--color-line)" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: "var(--color-line)" }} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl p-5 text-sm" style={{ background: "#FDEDEA", color: "var(--color-danger)" }}>
              Couldn&apos;t load buses: {error}. Check that the backend API is running and reachable.
            </div>
          )}

          {!loading && !error && buses.length === 0 && (
            <div className="rounded-2xl border p-10 text-center" style={{ borderColor: "var(--color-line)" }}>
              <FaBus size={28} className="mx-auto mb-3" style={{ color: "var(--color-slate-light)" }} />
              <p className="font-medium" style={{ color: "var(--color-navy)" }}>No buses found</p>
              <p className="text-sm mt-1" style={{ color: "var(--color-slate)" }}>
                Try a different date, route, or filter.
              </p>
            </div>
          )}

          {!loading && !error && buses.length > 0 && (
            <div className="space-y-3">
              {buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
