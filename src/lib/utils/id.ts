// crypto.randomUUID() requires a secure context (HTTPS or localhost) and is
// simply missing from `crypto` over plain HTTP on a LAN IP - which is exactly
// how a second device reaches this app during local multiplayer testing.
// crypto.getRandomValues() has no such restriction, so build a UUID v4 from
// it whenever the native method isn't available.
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
