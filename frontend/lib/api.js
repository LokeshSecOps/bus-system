const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getCities: () => request("/cities"),

  searchBuses: ({ fromCity, toCity, travelDate, filter = "all" }) => {
    const params = new URLSearchParams({
      from_city: fromCity,
      to_city: toCity,
      filter,
    });
    if (travelDate) params.set("travel_date", travelDate);
    return request(`/buses/search?${params.toString()}`);
  },

  getBus: (id) => request(`/buses/${id}`),

  createBus: (payload) =>
    request("/buses", { method: "POST", body: JSON.stringify(payload) }),
};

export default API_BASE_URL;
