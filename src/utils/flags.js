// Convert "DE" -> 🇩🇪  |  "IT" -> 🇮🇹
export function countryFlag(iso2 = "") {
    const cc = iso2.trim().toUpperCase();
    if (cc.length !== 2) return "";
    const codePoints = [...cc].map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }