"use client";

import { useState, useEffect } from "react";
import { FaMagnifyingGlass, FaArrowRightArrowLeft, FaLocationDot } from "react-icons/fa6";

const RECENT_KEY = "routewise_recent_searches";

export default function SearchForm({ cities, onSearch, initialFrom, initialTo, initialDate }) {
  const today = new Date().toISOString().split("T")[0];
  const [fromCity, setFromCity] = useState(initialFrom || cities[0]?.name || "");
  const [toCity, setToCity] = useState(initialTo || cities[1]?.name || "");
  const [travelDate, setTravelDate] = useState(initialDate || today);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      setRecent(stored);
    } catch {
      setRecent([]);
    }
  }, []);

  function saveRecent(from, to, date) {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const entry = { from, to, date };
      const next = [entry, ...stored.filter((r) => !(r.from === from && r.to === to))].slice(0, 4);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } catch {
      /* localStorage unavailable — skip persistence silently */
    }
  }

  function handleSwap() {
    setFromCity(toCity);
    setToCity(fromCity);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (fromCity === toCity) return;
    saveRecent(fromCity, toCity, travelDate);
    onSearch({ fromCity, toCity, travelDate });
  }

  function handleRecentClick(entry) {
    setFromCity(entry.from);
    setToCity(entry.to);
    setTravelDate(entry.date);
    onSearch({ fromCity: entry.from, toCity: entry.to, travelDate: entry.date });
  }

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: "var(--color-navy)" }}
    >
      <div className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: "var(--color-amber)" }}>
        <FaLocationDot size={13} />
        Location details
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex flex-col gap-2 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="px-3 py-2.5">
            <label className="block text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--color-slate-light)" }}>
              From
            </label>
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full bg-transparent outline-none font-medium"
              style={{ color: "var(--color-paper)" }}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name} style={{ color: "black" }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px mx-3" style={{ background: "rgba(255,255,255,0.1)" }} />

          <div className="px-3 py-2.5">
            <label className="block text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--color-slate-light)" }}>
              To
            </label>
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full bg-transparent outline-none font-medium"
              style={{ color: "var(--color-paper)" }}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name} style={{ color: "black" }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap from and to cities"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:rotate-180"
            style={{ background: "var(--color-amber)", color: "var(--color-navy-deep)" }}
          >
            <FaArrowRightArrowLeft size={13} />
          </button>
        </div>

        <div className="rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
          <label className="block text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--color-slate-light)" }}>
            Date
          </label>
          <input
            type="date"
            value={travelDate}
            min={today}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full bg-transparent outline-none font-medium [color-scheme:dark]"
            style={{ color: "var(--color-paper)" }}
          />
        </div>

        <button
          type="submit"
          disabled={fromCity === toCity}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--color-amber)", color: "var(--color-navy-deep)" }}
        >
          <FaMagnifyingGlass size={14} />
          Search buses
        </button>

        {fromCity === toCity && (
          <p className="text-xs text-center" style={{ color: "var(--color-danger)" }}>
            Origin and destination can&apos;t be the same.
          </p>
        )}
      </form>

      {recent.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-medium mb-2" style={{ color: "var(--color-slate-light)" }}>
            Recent searches
          </div>
          <div className="space-y-1.5">
            {recent.map((r, i) => (
              <button
                key={i}
                onClick={() => handleRecentClick(r)}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-white/5"
                style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-paper)" }}
              >
                <span>{r.from} → {r.to}</span>
                <span style={{ color: "var(--color-slate-light)" }} className="text-xs">{r.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
