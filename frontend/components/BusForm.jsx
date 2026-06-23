"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaBus } from "react-icons/fa6";
import { api } from "@/lib/api";

const emptyStop = () => ({ name: "", arrival_time: "", latitude: "", longitude: "" });

export default function BusForm({ cities }) {
  const router = useRouter();
  const [form, setForm] = useState({
    operator_name: "",
    from_city_id: cities[0]?.id || "",
    to_city_id: cities[1]?.id || "",
    travel_date: "",
    departure_time: "",
    arrival_time: "",
    fare: "",
  });
  const [stops, setStops] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateStop(index, key, value) {
    setStops((s) => s.map((stop, i) => (i === index ? { ...stop, [key]: value } : stop)));
  }

  function addStop() {
    setStops((s) => [...s, emptyStop()]);
  }

  function removeStop(index) {
    setStops((s) => s.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.from_city_id === form.to_city_id) {
      setError("Origin and destination cities must be different.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        operator_name: form.operator_name,
        from_city_id: Number(form.from_city_id),
        to_city_id: Number(form.to_city_id),
        travel_date: form.travel_date,
        departure_time: form.departure_time,
        arrival_time: form.arrival_time,
        fare: Number(form.fare) || 0,
        stops: stops
          .filter((s) => s.name && s.arrival_time)
          .map((s, i) => ({
            name: s.name,
            sequence: i,
            arrival_time: s.arrival_time,
            latitude: Number(s.latitude) || 0,
            longitude: Number(s.longitude) || 0,
          })),
      };
      const created = await api.createBus(payload);
      setSuccess(`Schedule for "${created.operator_name}" added successfully.`);
      setTimeout(() => router.push(`/bus/${created.id}`), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 transition-shadow";
  const inputStyle = { borderColor: "var(--color-line)", color: "var(--color-navy)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border p-6" style={{ borderColor: "var(--color-line)", background: "white" }}>
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-navy)" }}>
          <FaBus size={15} style={{ color: "var(--color-amber)" }} /> Schedule details
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>Operator name</label>
            <input
              required
              value={form.operator_name}
              onChange={(e) => updateField("operator_name", e.target.value)}
              placeholder="e.g. Volvo Express"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>From city</label>
            <select
              value={form.from_city_id}
              onChange={(e) => updateField("from_city_id", e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>To city</label>
            <select
              value={form.to_city_id}
              onChange={(e) => updateField("to_city_id", e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>Travel date</label>
            <input
              required
              type="date"
              value={form.travel_date}
              onChange={(e) => updateField("travel_date", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>Fare (₹)</label>
            <input
              required
              type="number"
              min="0"
              value={form.fare}
              onChange={(e) => updateField("fare", e.target.value)}
              placeholder="450"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>Departure time</label>
            <input
              required
              type="time"
              value={form.departure_time}
              onChange={(e) => updateField("departure_time", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-slate)" }}>Arrival time</label>
            <input
              required
              type="time"
              value={form.arrival_time}
              onChange={(e) => updateField("arrival_time", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6" style={{ borderColor: "var(--color-line)", background: "white" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold" style={{ color: "var(--color-navy)" }}>
            Stops <span className="font-normal text-sm" style={{ color: "var(--color-slate)" }}>(optional)</span>
          </h2>
          <button
            type="button"
            onClick={addStop}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "var(--color-amber-soft)", color: "var(--color-navy)" }}
          >
            <FaPlus size={11} /> Add stop
          </button>
        </div>

        {stops.length === 0 && (
          <p className="text-sm" style={{ color: "var(--color-slate)" }}>No intermediate stops added yet.</p>
        )}

        <div className="space-y-3">
          {stops.map((stop, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2 items-end p-3 rounded-xl" style={{ background: "var(--color-paper)" }}>
              <div>
                <label className="block text-[11px] mb-1" style={{ color: "var(--color-slate)" }}>Stop name</label>
                <input
                  value={stop.name}
                  onChange={(e) => updateStop(i, "name", e.target.value)}
                  placeholder="e.g. Kashmiri Gate"
                  className="w-full rounded-lg border px-2.5 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-[11px] mb-1" style={{ color: "var(--color-slate)" }}>Arrival</label>
                <input
                  type="time"
                  value={stop.arrival_time}
                  onChange={(e) => updateStop(i, "arrival_time", e.target.value)}
                  className="rounded-lg border px-2.5 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  value={stop.latitude}
                  onChange={(e) => updateStop(i, "latitude", e.target.value)}
                  placeholder="Lat"
                  className="w-20 rounded-lg border px-2 py-2 text-sm outline-none"
                  style={inputStyle}
                />
                <input
                  type="number"
                  step="any"
                  value={stop.longitude}
                  onChange={(e) => updateStop(i, "longitude", e.target.value)}
                  placeholder="Lng"
                  className="w-20 rounded-lg border px-2 py-2 text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <button
                type="button"
                onClick={() => removeStop(i)}
                aria-label="Remove stop"
                className="p-2 rounded-lg"
                style={{ color: "var(--color-danger)" }}
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-4 text-sm" style={{ background: "#FDEDEA", color: "var(--color-danger)" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl p-4 text-sm" style={{ background: "#E8F5EC", color: "var(--color-success)" }}>
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl py-3.5 font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        style={{ background: "var(--color-amber)", color: "var(--color-navy-deep)" }}
      >
        {submitting ? "Adding schedule…" : "Add schedule"}
      </button>
    </form>
  );
}
