import polyline from '@mapbox/polyline';

// o traçado da rota salva a partir da polyline, num quadrado de 100, sem mapa por baixo
export function trace(encoded: string) {
  const pts = polyline.decode(encoded);
  if (pts.length < 2) return '';
  const k = Math.cos((pts[0][0] * Math.PI) / 180);
  const xs = pts.map(([, lng]) => lng * k);
  const ys = pts.map(([lat]) => -lat);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0) || 1;
  const at = (v: number, v0: number) => (((v - v0) / span) * 100).toFixed(1);
  return xs.map((x, i) => `${at(x, x0)},${at(ys[i], y0)}`).join(' ');
}
