// src/utils/amadeus.js
const KEY = import.meta.env.VITE_AMA_KEY;
const SECRET = import.meta.env.VITE_AMA_SECRET;
const CURRENCY = import.meta.env.VITE_CURRENCY || "EUR";

// --- helper: fetch me timeout që të mos ngecë
async function safeFetch(resource, options = {}, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(resource, { ...options, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

let tokenCache = { token: null, expTs: 0 };

async function getToken() {
  // Nëse s’ka çelësa, mos hedh error – kthe null
  if (!KEY || !SECRET) {
    console.warn("⚠️ Amadeus: mungon VITE_AMA_KEY ose VITE_AMA_SECRET në .env");
    return null;
  }
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expTs) return tokenCache.token;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: KEY,
    client_secret: SECRET,
  });

  try {
    const res = await safeFetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.access_token) {
      console.warn("⚠️ Amadeus auth dështoi:", data);
      return null;
    }
    tokenCache = {
      token: data.access_token,
      expTs: Date.now() + (Number(data.expires_in || 1800) - 60) * 1000,
    };
    return tokenCache.token;
  } catch (e) {
    console.warn("⚠️ Amadeus auth exception:", e);
    return null;
  }
}

/** Kërkim bazë për one-way offers – gjithmonë kthen [] në dështim */
export async function amadeusSearch({ from, to, date, pax = 1, max = 20 }) {
  // Guard parametra minimalë
  if (!from || !to || !date) {
    console.warn("⚠️ amadeusSearch: parametra të paplotë:", { from, to, date });
    return [];
  }

  const token = await getToken();
  if (!token) return []; // s’kriset UI

  const url = new URL("https://test.api.amadeus.com/v2/shopping/flight-offers");
  url.searchParams.set("originLocationCode", from);
  url.searchParams.set("destinationLocationCode", to);
  url.searchParams.set("departureDate", date); // YYYY-MM-DD
  url.searchParams.set("adults", String(pax));
  url.searchParams.set("max", String(max));
  url.searchParams.set("currencyCode", CURRENCY);

  try {
    const res = await safeFetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        json?.errors?.[0]?.detail ||
        json?.errors?.[0]?.title ||
        `HTTP ${res.status}`;
      console.warn("⚠️ Amadeus search dështoi:", msg);
      return [];
    }

    const offers = json.data || [];
    return offers.map((o) => {
      const it = o.itineraries?.[0];
      const segs = it?.segments || [];
      const first = segs[0];
      const last = segs[segs.length - 1];

      const dep = first?.departure?.at || "";
      const arr = last?.arrival?.at || "";
      const time = dep && arr ? `${dep.slice(11, 16)} → ${arr.slice(11, 16)}` : "—";

      const stops = Math.max(0, segs.length - 1);
      const carrier = first?.carrierCode || "—";
      const flightNo = `${carrier}${first?.number || ""}`;
      const price = Number(o.price?.grandTotal || o.price?.total || 0) || 0;

      return { id: o.id, carrier, flightNo, time, stops, price, raw: o };
    });
  } catch (e) {
    console.warn("⚠️ Amadeus search exception:", e);
    return [];
  }
}