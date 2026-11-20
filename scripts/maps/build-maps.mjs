// TRIP×TRIP 地図ジェネレーター
//
// 出力（assets/images/maps/ 以下）:
//   base/asia.svg               … 日本〜東南アジアのベース地図（使い回し用）
//   base/asia-destinations.svg  … ベース地図＋全行き先のドット
//   islands/<slug>.svg          … 各行き先の島（エリア）拡大図
//   routes/<slug>.svg           … 東京・大阪からのアーチ＋所要時間＋島の拡大図インセット（記事用の完成形）
//
// 使い方は scripts/maps/README.md を参照。
// データ: Natural Earth（world-atlas, パブリックドメイン）／GSHHG 全解像度海岸線（Wessel & Smith, LGPL）

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const topojson = require("topojson-client");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "assets/images/maps");
const CACHE = path.join(HERE, ".cache");

// ---------------------------------------------------------------- スタイル
const C = {
  sea: "#E3ECEC",
  land: "#A9BCA3",
  landEdge: "#97AC92",
  border: "#EEF1E8",
  countryText: "#5D7260",
  seaText: "#6F8D96",
  city: "#4B2E1E",
  cityText: "#4B2E1E",
  route: "#8C7A5B",
  dest: "#C8364B",
  pill: "#6E5A32",
  panel: "#FFFFFF",
  islandLand: "#D3BF94",
  islandEdge: "#B39F75",
  islandOther: "#EBE5D8",
  islandSea: "#FFFFFF",
  islandText: "#4B2E1E",
};
const SERIF = `'Noto Serif JP','Hiragino Mincho ProN','Yu Mincho',serif`;
const SANS = `'Noto Sans JP','Hiragino Sans','Yu Gothic',sans-serif`;

// ---------------------------------------------------------------- ラベル
const COUNTRIES = [
  ["日本", 136.2, 37.6, 22],
  ["韓国", 128.0, 36.3, 15],
  ["中華人民共和国", 113.0, 29.5, 20],
  ["台湾", 121.0, 23.7, 14],
  ["フィリピン", 122.6, 15.6, 17],
  ["ベトナム", 107.6, 14.2, 15],
  ["ラオス", 102.7, 19.3, 14],
  ["タイ", 100.9, 15.6, 17],
  ["カンボジア", 104.8, 12.8, 14],
  ["ミャンマー", 96.0, 21.4, 16],
  ["マレーシア", 102.3, 4.0, 15],
  ["マレーシア", 116.3, 4.6, 15],
  ["インドネシア", 113.6, -1.1, 18],
  ["インドネシア", 102.0, -2.5, 15],
];
const SEAS = [
  ["日本海", 134.5, 40.4, 16],
  ["東シナ海", 125.2, 29.6, 16],
  ["太平洋", 141.5, 27.0, 20],
  ["フィリピン海", 132.0, 18.5, 16],
  ["南シナ海", 113.5, 13.5, 18],
  ["アンダマン海", 96.0, 10.5, 14],
  ["タイランド湾", 101.4, 9.4, 13],
  ["スールー海", 120.4, 8.4, 13],
  ["セレベス海", 122.6, 3.6, 13],
  ["ジャワ海", 112.0, -5.2, 14],
  ["インド洋", 100.0, -7.5, 18],
];
// [名前, lng, lat, ラベル位置] 位置: r/l/t/b
const CITIES = [
  ["東京", 139.77, 35.68, "r"],
  ["大阪", 135.50, 34.69, "b"],
  ["ソウル", 126.98, 37.57, "t"],
  ["那覇", 127.68, 26.21, "r"],
  ["台北", 121.56, 25.04, "r"],
  ["香港", 114.17, 22.32, "b"],
  ["マニラ", 120.98, 14.60, "l"],
  ["ハノイ", 105.85, 21.03, "r"],
  ["バンコク", 100.50, 13.76, "l"],
  ["ホーチミン", 106.66, 10.76, "r"],
  ["クアラルンプール", 101.69, 3.14, "l"],
  ["シンガポール", 103.82, 1.35, "r"],
  ["ジャカルタ", 106.85, -6.21, "b"],
];
const ORIGINS = { tokyo: ["東京", 139.77, 35.68], osaka: ["大阪", 135.50, 34.69] };

// 島マップの表示範囲（km）を自動判定から上書きしたいもの。半径ではなく「一辺」の目安
// spanKm: 表示範囲の一辺の目安（km）／center: [lat, lng]
// marker: 島全体ではなく「島の一部・本土の街」を指す行き先なので赤いピンを立てる
// highlightKm: 中心からこの距離以内の島をすべて主役色で塗る（諸島の場合）
const ISLAND_OVERRIDES = {
  "bali-guide": { spanKm: 175, center: [-8.4, 115.18] },
  "bohol-guide": { spanKm: 110, center: [9.85, 124.15], targetAt: [[9.85, 124.15], [9.57, 123.78]] },
  "cebu-guide": { spanKm: 230, center: [10.3, 123.85] },
  "lombok-guide": { spanKm: 110, center: [-8.6, 116.35] },
  "el-nido-guide": { spanKm: 60, marker: true },
  "coron-guide": { spanKm: 55, center: [11.95, 120.15], marker: true },
  "danang-hoian-guide": { spanKm: 60, center: [16.0, 108.3], marker: true },
  "nhatrang-guide": { spanKm: 45, marker: true },
  "mui-ne-guide": { spanKm: 45, marker: true },
  "pattaya-guide": { spanKm: 45, center: [12.88, 100.85], marker: true },
  "krabi-guide": { spanKm: 45, center: [8.0, 98.85], marker: true },
  // パリ島は小さすぎてGSHHSに輪郭が無いので、ジャカルタ湾ごと見せてピンで示す
  "pulau-pari-guide": { spanKm: 70, center: [-5.95, 106.72], marker: true },
  "komodo-guide": { spanKm: 70, center: [-8.6, 119.55], highlightKm: 22 },
  "perhentian-guide": { spanKm: 18, highlightKm: 5 },
  "gili-trawangan-guide": { spanKm: 14, center: [-8.36, 116.06] },
  "gili-air-guide": { spanKm: 14, center: [-8.36, 116.06] },
  "nusa-penida-guide": { spanKm: 36, center: [-8.72, 115.5] },
  "nusa-lembongan-guide": { spanKm: 36, center: [-8.72, 115.5] },
  "koh-rong-guide": { spanKm: 45, center: [10.6, 103.3] },
  "koh-rong-samloem-guide": { spanKm: 45, center: [10.6, 103.3] },
  "koh-phiphi-guide": { spanKm: 20 },
  "koh-larn-guide": { spanKm: 20, center: [12.92, 100.83] },
  "redang-guide": { spanKm: 30 },
  "koh-lipe-guide": { spanKm: 22, center: [6.52, 99.27] },
};
// 島マップのラベル（長い名前を短く）
const SHORT_NAMES = {
  "el-nido-guide": "エルニド",
  "coron-guide": "コロン",
  "krabi-guide": "ライレイビーチ",
  "danang-hoian-guide": "ダナン・ホイアン",
};

// ---------------------------------------------------------------- 投影（メルカトル）
const rad = (d) => (d * Math.PI) / 180;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));
function makeProj(b, W, H) {
  // b = {west, east, south, north}; 縦横比は W/H に合わせて自動で広げる
  let x0 = rad(b.west), x1 = rad(b.east);
  let y0 = mercY(b.south), y1 = mercY(b.north);
  const k = Math.min(W / (x1 - x0), H / (y1 - y0));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const f = ([lng, lat]) => [W / 2 + (rad(lng) - cx) * k, H / 2 - (mercY(lat) - cy) * k];
  f.inv = ([x, y]) => {
    const lng = ((x - W / 2) / k + cx) * 180 / Math.PI;
    const lat = (2 * Math.atan(Math.exp((H / 2 - y) / k + cy)) - Math.PI / 2) * 180 / Math.PI;
    return [lng, lat];
  };
  f.k = k;
  return f;
}

// ---------------------------------------------------------------- データ
function polysOf(geom) {
  if (!geom) return [];
  if (geom.type === "Polygon") return [geom.coordinates];
  if (geom.type === "MultiPolygon") return geom.coordinates;
  if (geom.type === "GeometryCollection") return geom.geometries.flatMap(polysOf);
  return [];
}
function ringBBox(r) {
  let w = 1e9, e = -1e9, s = 1e9, n = -1e9;
  for (const [x, y] of r) { if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y; }
  return { west: w, east: e, south: s, north: n };
}
const hit = (a, b) => a.west <= b.east && a.east >= b.west && a.south <= b.north && a.north >= b.south;

function loadCountries() {
  const topo = require("world-atlas/countries-10m.json");
  const fc = topojson.feature(topo, topo.objects.countries);
  const area = { west: 85, east: 155, south: -15, north: 50 };
  const polys = [];
  for (const f of fc.features) for (const p of polysOf(f.geometry)) {
    const bb = ringBBox(p[0]);
    if (hit(bb, area)) polys.push({ rings: p, bb });
  }
  return polys;
}

function loadCoast() {
  // extract_gshhs.py が作るキャッシュ（GSHHS全解像度の海岸線）
  const f = path.join(CACHE, "gshhs-f.json");
  if (!fs.existsSync(f)) throw new Error("先に scripts/maps/extract_gshhs.py を実行してください（README参照）");
  const all = JSON.parse(fs.readFileSync(f, "utf8"));
  return { land: all.filter((p) => p.type === 1 || p.type === 3), water: all.filter((p) => p.type === 2 || p.type === 4) };
}

// ---------------------------------------------------------------- SVG部品
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => Math.round(n * 10) / 10;

function clipRing(pts, x0, y0, x1, y1) {
  // Sutherland–Hodgman（画面の矩形でポリゴンを切り抜く）
  const edges = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]],
  ];
  let out = pts;
  for (const [inside, cut] of edges) {
    const input = out; out = [];
    if (!input.length) break;
    let prev = input[input.length - 1];
    for (const cur of input) {
      if (inside(cur)) { if (!inside(prev)) out.push(cut(prev, cur)); out.push(cur); }
      else if (inside(prev)) out.push(cut(prev, cur));
      prev = cur;
    }
  }
  return out;
}

function chaikin(pts, iter) {
  // 角を丸めて、GSHHSの階段状の海岸線をなめらかにする
  for (let k = 0; k < iter; k++) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    pts = out;
  }
  return pts;
}

function pathFor(polys, proj, view, tol = 0.6, W = 0, H = 0, smooth = 0) {
  // view: 画面範囲 {west,east,south,north}（経緯度）。範囲外のポリゴンは捨て、はみ出す部分は切り抜く
  const m = 20;
  let d = "";
  for (const { rings, bb } of polys) {
    if (!hit(bb, view)) continue;
    for (const ring of rings) {
      const rb = ring.length > 50 ? ringBBox(ring) : bb;
      if (!hit(rb, view)) continue;
      let pts = [], last = null;
      for (const c of ring) {
        const p = proj(c);
        if (last && Math.abs(p[0] - last[0]) < tol && Math.abs(p[1] - last[1]) < tol) continue;
        pts.push(p); last = p;
      }
      if (smooth && pts.length >= 4) pts = chaikin(pts, smooth);
      if (W) pts = clipRing(pts, -m, -m, W + m, H + m);
      if (pts.length < 3) continue;
      d += "M" + pts.map(([x, y]) => fmt(x) + " " + fmt(y)).join("L") + "Z";
    }
  }
  return d;
}

function viewOf(proj, W, H, pad = 0.05) {
  const [w, n] = proj.inv([-W * pad, -H * pad]);
  const [e, s] = proj.inv([W * (1 + pad), H * (1 + pad)]);
  return { west: w, east: e, south: s, north: n };
}

function text(x, y, s, { size = 14, fill = "#000", font = SANS, weight = 500, anchor = "middle", spacing = 0, halo = null, cls = "" } = {}) {
  const common = `x="${fmt(x)}" y="${fmt(y)}" font-family="${font}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${spacing}"${cls ? ` class="${cls}"` : ""}`;
  const h = halo ? `<text ${common} fill="none" stroke="${halo}" stroke-width="${Math.max(3, size / 4)}" stroke-linejoin="round">${esc(s)}</text>` : "";
  return h + `<text ${common} fill="${fill}">${esc(s)}</text>`;
}

function cityLabel(x, y, name, pos, size) {
  const off = size * 0.75;
  const [dx, dy, anchor] = { r: [off, size * 0.35, "start"], l: [-off, size * 0.35, "end"], t: [0, -off * 0.9, "middle"], b: [0, off + size * 0.75, "middle"] }[pos];
  return text(x + dx, y + dy, name, { size, fill: C.cityText, weight: 700, anchor, halo: "rgba(255,255,255,0.75)" });
}

// ---------------------------------------------------------------- ベース地図
function renderBase(bounds, W, H, { countries, scale = 1, cities = CITIES, showSeas = true, showCountries = true }) {
  const proj = makeProj(bounds, W, H);
  const view = viewOf(proj, W, H);
  const land = pathFor(countries, proj, view, 0.8, W, H);
  const s = scale;
  let g = "";
  g += `<rect id="sea" width="${W}" height="${H}" fill="${C.sea}"/>`;
  g += `<path id="land" d="${land}" fill="${C.land}" stroke="${C.border}" stroke-width="${0.9 * s}" stroke-linejoin="round"/>`;
  if (showSeas) {
    g += `<g id="labels-sea">`;
    for (const [n, lng, lat, size] of SEAS) { const [x, y] = proj([lng, lat]); g += text(x, y, n, { size: size * s, fill: C.seaText, font: SERIF, spacing: 2 * s }); }
    g += `</g>`;
  }
  if (showCountries) {
    g += `<g id="labels-country">`;
    for (const [n, lng, lat, size] of COUNTRIES) { const [x, y] = proj([lng, lat]); g += text(x, y, n, { size: size * s, fill: C.countryText, font: SERIF, spacing: 2 * s }); }
    g += `</g>`;
  }
  g += `<g id="cities">`;
  for (const [n, lng, lat, pos] of cities) {
    const [x, y] = proj([lng, lat]);
    g += `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${4.5 * s}" fill="${C.city}" stroke="#fff" stroke-width="${1.2 * s}"/>`;
    g += cityLabel(x, y, n, pos, 15 * s);
  }
  g += `</g>`;
  return { proj, body: g };
}

function svgDoc(W, H, body, { title = "", credit = "" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"${title ? ` aria-label="${esc(title)}"` : ""}>` +
    (title ? `<title>${esc(title)}</title>` : "") + body +
    (credit ? text(W - 8, H - 8, credit, { size: 10, fill: "rgba(75,46,30,0.55)", anchor: "end", weight: 400 }) : "") +
    `</svg>\n`;
}

// ---------------------------------------------------------------- 島マップ
const KM_PER_DEG = 111.32;
function islandBounds(dest, osm) {
  const ov = ISLAND_OVERRIDES[dest.slug] || {};
  let [clat, clng] = ov.center || [dest.lat, dest.lng];
  let span = ov.spanKm;
  if (!span) {
    // 行き先の座標を含む（なければ最寄りの）陸地ポリゴンの大きさから表示範囲を決める
    let best = null, bestD = 1e9;
    for (const p of osm.land) {
      const bb = p.bb;
      const dx = Math.max(bb.west - dest.lng, 0, dest.lng - bb.east);
      const dy = Math.max(bb.south - dest.lat, 0, dest.lat - bb.north);
      const d = Math.hypot(dx, dy);
      const size = Math.hypot(bb.east - bb.west, bb.north - bb.south);
      if (d < bestD - 1e-9 || (d < 1e-9 && size < Math.hypot(best.bb.east - best.bb.west, best.bb.north - best.bb.south))) { best = p; bestD = d; }
    }
    const bb = best.bb;
    const wKm = (bb.east - bb.west) * KM_PER_DEG * Math.cos(rad(dest.lat));
    const hKm = (bb.north - bb.south) * KM_PER_DEG;
    span = Math.min(Math.max(wKm, hKm) * 1.35, 60);
    span = Math.max(span, 8);
    if (Math.max(wKm, hKm) * 1.35 <= 60) { clat = (bb.north + bb.south) / 2; clng = (bb.east + bb.west) / 2; }
  }
  const dLat = span / 2 / KM_PER_DEG, dLng = span / 2 / (KM_PER_DEG * Math.cos(rad(clat)));
  return { bounds: { west: clng - dLng, east: clng + dLng, south: clat - dLat, north: clat + dLat }, span };
}

function pointInRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function kmBetween([lng1, lat1], [lng2, lat2]) {
  return Math.hypot((lng2 - lng1) * KM_PER_DEG * Math.cos(rad(lat1)), (lat2 - lat1) * KM_PER_DEG);
}
// 行き先の主役となる島（ポリゴン）を選ぶ
function targetPolys(dest, land) {
  const ov = ISLAND_OVERRIDES[dest.slug] || {};
  if (ov.highlightKm) {
    const c = ov.center ? [ov.center[1], ov.center[0]] : [dest.lng, dest.lat];
    return new Set(land.filter((p) => Math.abs(p.bb.west - c[0]) < 1 && Math.abs(p.bb.south - c[1]) < 1 && p.rings[0].some((v) => kmBetween(c, v) <= ov.highlightKm)));
  }
  if (ov.marker) return new Set();
  const picks = (ov.targetAt || [[dest.lat, dest.lng]]).map(([lat, lng]) => [lng, lat]);
  const out = new Set();
  for (const pt of picks) {
    let best = null, bestD = 1e9;
    for (const p of land) {
      const bb = p.bb;
      if (bb.east - bb.west + bb.north - bb.south > 5) continue; // 大陸・大きな島は主役にしない
      if (pt[0] < bb.west - 0.3 || pt[0] > bb.east + 0.3 || pt[1] < bb.south - 0.3 || pt[1] > bb.north + 0.3) continue;
      let d = 0;
      if (!pointInRing(pt, p.rings[0])) { d = 1e9; for (const v of p.rings[0]) d = Math.min(d, kmBetween(pt, v)); }
      if (d < bestD) { bestD = d; best = p; }
    }
    if (best) out.add(best);
  }
  return out;
}

function niceScale(kmPerPx, maxPx) {
  const steps = [0.5, 1, 2, 3, 5, 10, 20, 30, 50, 100];
  let km = steps[0];
  for (const s of steps) if (s / kmPerPx <= maxPx) km = s;
  return { km, px: km / kmPerPx };
}

function renderIsland(dest, osm, W, H, { frame = true, scale = 1, bounds: forced = null, overlay = null } = {}) {
  const bounds = forced || islandBounds(dest, osm).bounds;
  const proj = makeProj(bounds, W, H);
  const view = viewOf(proj, W, H);
  const s = scale;
  const targets = targetPolys(dest, osm.land);
  const ov = ISLAND_OVERRIDES[dest.slug] || {};
  const d = pathFor(osm.land.filter((p) => !targets.has(p)), proj, view, 1.2, W, H, 2);
  const dt = pathFor([...targets], proj, view, 1.2, W, H, 2);
  const lakes = pathFor(osm.water, proj, view, 1.2, W, H, 2);
  let g = "";
  if (frame) g += `<rect width="${W}" height="${H}" fill="${C.islandSea}"/>`;
  const otherFill = targets.size ? C.islandOther : C.islandLand;
  g += `<path id="land-other" d="${d}" fill="${otherFill}" stroke="${C.islandEdge}" stroke-width="${0.8 * s}" stroke-linejoin="round"/>`;
  if (dt) g += `<path id="land-target" d="${dt}" fill="${C.islandLand}" stroke="${C.islandEdge}" stroke-width="${1.2 * s}" stroke-linejoin="round"/>`;
  if (lakes) g += `<path d="${lakes}" fill="${C.islandSea}" stroke="${C.islandEdge}" stroke-width="${0.6 * s}"/>`;
  // マーカー（行き先の代表地点）
  const [px, py] = proj([dest.lng, dest.lat]);
  if (ov.marker) g += `<g id="marker"><circle cx="${fmt(px)}" cy="${fmt(py)}" r="${9 * s}" fill="${C.dest}" fill-opacity="0.18"/><circle cx="${fmt(px)}" cy="${fmt(py)}" r="${5 * s}" fill="${C.dest}" stroke="#fff" stroke-width="${1.6 * s}"/></g>`;
  if (overlay) g += overlay(proj);
  // 名前ラベル
  const name = SHORT_NAMES[dest.slug] || dest.name;
  const labelSize = 26 * s;
  const lx = W - 18 * s, ly = 18 * s + labelSize;
  g += text(lx, ly, name, { size: labelSize, fill: C.islandText, font: SERIF, weight: 700, anchor: "end", spacing: 3 * s, halo: "rgba(255,255,255,0.9)" });
  g += text(lx, ly + 18 * s, dest.en_name || "", { size: 11 * s, fill: C.islandText, anchor: "end", weight: 400, halo: "rgba(255,255,255,0.9)" });
  // スケールバー
  const midLat = (bounds.north + bounds.south) / 2;
  const kmPerPx = (6371 * Math.cos(rad(midLat))) / proj.k;
  const sc = niceScale(kmPerPx, W * 0.22);
  const sx = 18 * s, sy = H - 18 * s;
  g += `<g id="scale" stroke="${C.islandText}" stroke-width="${1.4 * s}" fill="none"><path d="M${fmt(sx)} ${fmt(sy - 5 * s)}V${fmt(sy)}H${fmt(sx + sc.px)}V${fmt(sy - 5 * s)}"/></g>`;
  g += text(sx + sc.px / 2, sy - 8 * s, `${sc.km}km`, { size: 11 * s, fill: C.islandText, weight: 500, halo: "rgba(255,255,255,0.9)" });
  return { body: g, proj, marker: [px, py] };
}

// ---------------------------------------------------------------- 経由ルート
// 各記事の「行き方」セクションに書かれている基本ルートをそのまま線にしたもの。
// [地点名, lng, lat, その地点までの手段]  手段: "air"=飛行機（実線） / "ground"=陸路・船（点線）
// 最後の行き先までの手段は last で指定。via() で書いた主要ハブ以外の地点（現地の空港・桟橋など）は、全体地図では小さすぎるのでインセット側に描く。
//ベース地図の都市と同名の地点は、全体地図では都市ラベルと重なるので経由地ラベルを出さない。
// 記事の行き方を変えたら、ここも合わせて直すこと。
const H_ = {
  bkk: ["バンコク", 100.50, 13.76], kul: ["クアラルンプール", 101.69, 3.14], mnl: ["マニラ", 120.98, 14.60],
  sgn: ["ホーチミン", 106.66, 10.76], cgk: ["ジャカルタ", 106.85, -6.21],
  ceb: ["セブ", 123.98, 10.31], dps: ["デンパサール", 115.17, -8.75],
};
const via = (h, mode = "air") => [...h, mode, "hub"]; // 主要ハブ（全体地図に表示）。それ以外の地点はインセットの現地アクセス図に表示
const ROUTES = {
  "bali-guide": { legs: [], last: "air" },
  "cebu-guide": { legs: [], last: "air" },
  "danang-hoian-guide": { legs: [], last: "air" },
  "boracay-guide": { legs: [via(H_.mnl), ["カティクラン空港", 121.95, 11.93, "air"]], last: "ground" },
  "phuket-guide": { legs: [via(H_.bkk)], last: "air" },
  "langkawi-guide": { legs: [via(H_.kul)], last: "air" },
  "koh-lipe-guide": { legs: [via(H_.bkk), ["ハジャイ", 100.39, 6.93, "air"], ["パクバラ桟橋", 99.73, 6.86, "ground"]], last: "ground" },
  "redang-guide": { legs: [via(H_.kul), ["クアラトレンガヌ", 103.10, 5.38, "air"]], last: "ground" },
  "koh-phiphi-guide": { legs: [via(H_.bkk), ["プーケット", 98.32, 8.11, "air"]], last: "ground" },
  "koh-chang-guide": { legs: [via(H_.bkk), ["トラート", 102.32, 12.27, "air"]], last: "ground" },
  "pulau-pari-guide": { legs: [via(H_.cgk)], last: "ground", tokyoOnly: true },
  "phuquoc-guide": { legs: [via(H_.sgn)], last: "air" },
  "koh-samui-guide": { legs: [via(H_.bkk)], last: "air" },
  "koh-tao-guide": { legs: [via(H_.bkk), ["サムイ島", 100.06, 9.55, "air"]], last: "ground" },
  "el-nido-guide": { legs: [via(H_.ceb)], last: "air" },
  "nusa-penida-guide": { legs: [via(H_.dps), ["サヌール", 115.26, -8.68, "ground"]], last: "ground" },
  "nusa-lembongan-guide": { legs: [via(H_.dps), ["サヌール", 115.26, -8.68, "ground"]], last: "ground" },
  "gili-trawangan-guide": { legs: [via(H_.dps), ["パダンバイ", 115.51, -8.53, "ground"]], last: "ground" },
  "gili-air-guide": { legs: [via(H_.dps), ["パダンバイ", 115.51, -8.53, "ground"]], last: "ground" },
  "coron-guide": { legs: [via(H_.mnl)], last: "air" },
  "con-dao-guide": { legs: [via(H_.sgn)], last: "air" },
  "siargao-guide": { legs: [via(H_.ceb)], last: "air" },
  "camiguin-guide": { legs: [via(H_.mnl)], last: "air" },
  "nhatrang-guide": { legs: [via(H_.sgn)], last: "air" },
  "krabi-guide": { legs: [via(H_.bkk), ["クラビ空港", 98.99, 8.10, "air"]], last: "ground" },
  "tioman-guide": { legs: [via(H_.kul), ["メルシン", 103.84, 2.43, "ground"]], last: "ground" },
  "koh-larn-guide": { legs: [via(H_.bkk), ["パタヤ", 100.88, 12.93, "ground"]], last: "ground" },
  "perhentian-guide": { legs: [via(H_.kul), ["クアラブス桟橋", 102.56, 5.83, "ground"]], last: "ground" },
  "koh-kood-guide": { legs: [via(H_.bkk), ["トラート", 102.32, 12.27, "air"]], last: "ground" },
  "koh-phangan-guide": { legs: [via(H_.bkk), ["サムイ島", 100.06, 9.55, "air"]], last: "ground" },
  "koh-rong-guide": { legs: [via(H_.sgn), ["シアヌークビル", 103.52, 10.63, "air"]], last: "ground" },
  "koh-rong-samloem-guide": { legs: [via(H_.sgn), ["シアヌークビル", 103.52, 10.63, "air"]], last: "ground" },
  "komodo-guide": { legs: [via(H_.dps), ["ラブアンバジョ", 119.89, -8.49, "air"]], last: "ground" },
  "pulau-weh-guide": { legs: [via(H_.cgk), ["バンダアチェ", 95.42, 5.52, "air"]], last: "ground", tokyoOnly: true },
  "bohol-guide": { legs: [via(H_.ceb)], last: "ground" },
  "lombok-guide": { legs: [via(H_.dps)], last: "air" },
  "koh-lanta-guide": { legs: [via(H_.bkk), ["クラビ空港", 98.99, 8.10, "air"]], last: "ground" },
  "pattaya-guide": { legs: [via(H_.bkk)], last: "ground" },
  "koh-samet-guide": { legs: [via(H_.bkk), ["バンペー桟橋", 101.44, 12.63, "ground"]], last: "ground" },
  "mui-ne-guide": { legs: [via(H_.sgn)], last: "ground" },
};

// 日本語を表示幅（全角=1、半角=0.55）で折り返す。「、」「）」の直後か「（」の直前を優先し、
// 行頭に「）」「、」「。」が来ないようにする
function wrapJa(str, max) {
  const w = (ch) => (/[\x00-\x7F]/.test(ch) ? 0.55 : 1);
  const out = [];
  let rest = str;
  while (rest.length) {
    let width = 0, end = 0;
    while (end < rest.length && width + w(rest[end]) <= max) width += w(rest[end++]);
    if (end >= rest.length) { out.push(rest); break; }
    let cut = -1;
    for (let i = end; i >= Math.floor(end * 0.45); i--) {
      if ("、）＋。".includes(rest[i - 1]) || rest[i] === "（") { cut = i; break; }
    }
    if (cut < 0) {
      cut = end;
      // 「1時間15分」「1〜1.5時間」のような数字表現の途中では切らない
      const num = /[0-9.〜~時間分]/;
      while (cut > 1 && num.test(rest[cut - 1]) && num.test(rest[cut])) cut--;
    }
    while (cut < rest.length && "）、。".includes(rest[cut])) cut++;
    out.push(rest.slice(0, cut)); rest = rest.slice(cut);
  }
  return out;
}

// ---------------------------------------------------------------- ルート地図（記事用の完成形）

function renderRoute(dest, countries, osm) {
  const W = 1500, H = 850;
  const route = ROUTES[dest.slug];
  if (!route) throw new Error(`ROUTES に ${dest.slug} の経由ルートがありません（記事の行き方を見て追加してください）`);
  const origins = route.tokyoOnly ? [ORIGINS.tokyo] : [ORIGINS.tokyo, ORIGINS.osaka];
  const stops = [...route.legs, [dest.name, dest.lng, dest.lat, route.last]];
  const all = [...origins.map((o) => [o[1], o[2]]), ...stops.map((p) => [p[1], p[2]])];
  let west = Math.min(...all.map((p) => p[0])) - 9, east = Math.max(...all.map((p) => p[0])) + 4;
  let south = Math.min(...all.map((p) => p[1])) - 6, north = Math.max(...all.map((p) => p[1])) + 4.5;
  east = east + 14; // 右下にインセットを置く余白
  const base = renderBase({ west, east, south, north }, W, H, { countries, scale: 1.25 });
  const proj = base.proj;
  const [dx, dy] = proj([dest.lng, dest.lat]);

  const arc = (x1, y1, x2, y2, bend) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    return `M${fmt(x1)} ${fmt(y1)}Q${fmt(mx + nx * len * bend)} ${fmt(my + ny * len * bend)} ${fmt(x2)} ${fmt(y2)}`;
  };
  const legPath = ([x1, y1], [x2, y2], mode, bend) =>
    `<path d="${arc(x1, y1, x2, y2, bend)}"${mode === "ground" ? ` stroke-dasharray="2 6" stroke-width="3"` : ""}/>`;

  // 全体地図：日本 → 主要ハブ → 現地（最初のローカル地点、なければ行き先）
  const hubs = stops.filter((p) => p[4] === "hub");
  const local = stops.filter((p) => p[4] !== "hub"); // 末尾は行き先
  // ハブから先が陸路・船なら、そのハブもインセット（現地アクセス図）に含める
  const insetStops = local[0][3] === "ground" && hubs.length ? [hubs[hubs.length - 1], ...local] : local;
  const overview = [...hubs, local[0]];
  let g = base.body;
  g += `<g id="routes" fill="none" stroke="${C.route}" stroke-width="2" stroke-linecap="round">`;
  const first = proj([overview[0][1], overview[0][2]]);
  origins.forEach((o, i) => { g += legPath(proj([o[1], o[2]]), first, overview[0][3], i ? -0.14 : -0.18); });
  for (let i = 1; i < overview.length; i++) {
    g += legPath(proj([overview[i - 1][1], overview[i - 1][2]]), proj([overview[i][1], overview[i][2]]), overview[i][3], -0.15);
  }
  g += `</g><g id="stops">`;
  for (const [name, lng, lat] of hubs) {
    const [x, y] = proj([lng, lat]);
    g += `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="5" fill="${C.route}" stroke="#fff" stroke-width="1.5"/>`;
    if (!CITIES.some((c) => c[0] === name)) g += text(x - 10, y + 5, name, { size: 15, fill: C.cityText, weight: 700, anchor: "end", halo: "rgba(255,255,255,0.85)" });
  }
  g += `</g>`;

  // インセット：現地アクセス図（ローカル地点がある場合）／島の拡大図（ない場合）
  const IW = 520, IH = 400, ix = W - IW - 28, iy = H - IH - 28;
  let insetOpts = { frame: true, scale: 1.1 };
  if (insetStops.length > 1) {
    const pts = insetStops.map((p) => [p[1], p[2]]);
    const ib = islandBounds(dest, osm).bounds;
    let w = Math.min(ib.west, ...pts.map((p) => p[0])), e = Math.max(ib.east, ...pts.map((p) => p[0]));
    let so = Math.min(ib.south, ...pts.map((p) => p[1])), n = Math.max(ib.north, ...pts.map((p) => p[1]));
    const pw = (e - w) * 0.22 + 0.02, ph = (n - so) * 0.22 + 0.02;
    insetOpts.bounds = { west: w - pw, east: e + pw, south: so - ph, north: n + ph * 3.2 };
    insetOpts.overlay = (ip) => {
      let o = `<g fill="none" stroke="${C.route}" stroke-width="2.4" stroke-linecap="round">`;
      for (let i = 1; i < insetStops.length; i++) {
        const [x1, y1] = ip([insetStops[i - 1][1], insetStops[i - 1][2]]), [x2, y2] = ip([insetStops[i][1], insetStops[i][2]]);
        o += `<path d="${arc(x1, y1, x2, y2, -0.12)}"${insetStops[i][3] === "ground" ? ` stroke-dasharray="2 7" stroke-width="3.4"` : ""}/>`;
      }
      o += `</g>`;
      for (const [name, lng, lat] of insetStops.slice(0, -1)) {
        const [x, y] = ip([lng, lat]);
        o += `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="5.5" fill="${C.route}" stroke="#fff" stroke-width="1.6"/>`;
        o += text(x, y + 24, name, { size: 15, fill: C.cityText, weight: 700, halo: "rgba(255,255,255,0.9)" });
      }
      const [x, y] = ip([dest.lng, dest.lat]);
      o += `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="6" fill="${C.dest}" stroke="#fff" stroke-width="1.8"/>`;
      return o;
    };
  }
  const island = renderIsland(dest, osm, IW, IH, insetOpts);
  const callout = `<g id="callout"><path d="M${fmt(dx)} ${fmt(dy)}L${ix} ${iy}L${ix} ${iy + IH}Z" fill="#fff" fill-opacity="0.3"/><path d="M${ix} ${iy}L${fmt(dx)} ${fmt(dy)}L${ix} ${iy + IH}" fill="none" stroke="#fff" stroke-width="1.2"/></g>`;
  g = g.replace('<g id="labels-sea">', callout + '<g id="labels-sea">');
  g += `<g id="inset" transform="translate(${ix} ${iy})"><svg width="${IW}" height="${IH}" viewBox="0 0 ${IW} ${IH}" overflow="hidden">${island.body}</svg><rect width="${IW}" height="${IH}" fill="none" stroke="${C.islandEdge}" stroke-width="1"/></g>`;

  g += `<circle cx="${fmt(dx)}" cy="${fmt(dy)}" r="7" fill="${C.dest}" stroke="#fff" stroke-width="2"/>`;
  // 所要時間ボックス（destinations.yml の flight_hours をそのまま表示）＋線の凡例
  if (dest.flight_hours) {
    const lines = wrapJa(dest.flight_hours, 25);
    const lh = 24, bw = IW, bh = 82 + lines.length * lh, bx = ix, by = iy - bh - 14;
    const ly = by + bh - 20;
    g += `<g id="travel-time"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="4" fill="${C.pill}"/>` +
      text(bx + 20, by + 32, "日本からの所要時間", { size: 17, fill: "#fff", weight: 700, anchor: "start" }) +
      lines.map((l, i) => text(bx + 20, by + 32 + lh * (i + 1), l, { size: 17, fill: "#fff", weight: 400, anchor: "start" })).join("") +
      `<path d="M${bx + 20} ${ly - 5}h36" stroke="#fff" stroke-width="2"/>` + text(bx + 64, ly, "飛行機", { size: 14, fill: "#fff", anchor: "start", weight: 400 }) +
      `<path d="M${bx + 140} ${ly - 5}h36" stroke="#fff" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>` + text(bx + 184, ly, "陸路・船", { size: 14, fill: "#fff", anchor: "start", weight: 400 }) +
      `</g>`;
  }
  g += text(dx, dy - 16, dest.name, { size: 20, fill: C.dest, weight: 700, halo: "rgba(255,255,255,0.85)" });
  return svgDoc(W, H, g, { title: `${dest.name}への行き方（経由地と所要時間）`, credit: "地図データ: Natural Earth / GSHHG" });
}

// ---------------------------------------------------------------- メイン
function loadDestinations() {
  // destinations.yml から name/slug/lat/lng/en_name だけを読む簡易パーサ
  const src = fs.readFileSync(path.join(ROOT, "_data/destinations.yml"), "utf8");
  const items = [];
  let cur = null;
  for (const line of src.split("\n")) {
    const m = line.match(/^(- |  )(name|slug|lat|lng|en_name|flight_hours):\s*"?(.*?)"?\s*$/);
    if (line.startsWith("- ")) { cur = {}; items.push(cur); }
    if (m && cur) cur[m[2]] = ["lat", "lng"].includes(m[2]) ? parseFloat(m[3]) : m[3];
  }
  return items.filter((d) => d.slug && Number.isFinite(d.lat));
}

function main() {
  const only = process.argv.slice(2);
  const countries = loadCountries();
  const osm = loadCoast();
  const dests = loadDestinations().filter((d) => !only.length || only.includes(d.slug));
  for (const sub of ["base", "islands", "routes"]) fs.mkdirSync(path.join(OUT, sub), { recursive: true });
  const credit = "地図データ: Natural Earth";

  if (!only.length) {
    const W = 1400, H = 1500;
    const bounds = { west: 92, east: 147, south: -11.5, north: 45.5 };
    const b = renderBase(bounds, W, H, { countries });
    fs.writeFileSync(path.join(OUT, "base/asia.svg"), svgDoc(W, H, b.body, { title: "日本と東南アジアの地図", credit }));
    let dots = `<g id="destinations">`;
    for (const d of dests) { const [x, y] = b.proj([d.lng, d.lat]); dots += `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="5" fill="${C.dest}" stroke="#fff" stroke-width="1.5"><title>${esc(d.name)}</title></circle>`; }
    dots += `</g>`;
    fs.writeFileSync(path.join(OUT, "base/asia-destinations.svg"), svgDoc(W, H, b.body + dots, { title: "TRIP×TRIPの行き先マップ", credit }));
    console.log("base/asia.svg, base/asia-destinations.svg");
  }

  for (const d of dests) {
    const isl = renderIsland(d, osm, 800, 600);
    fs.writeFileSync(path.join(OUT, `islands/${d.slug}.svg`), svgDoc(800, 600, isl.body, { title: `${d.name}の地図`, credit: "地図データ: GSHHG" }));
    fs.writeFileSync(path.join(OUT, `routes/${d.slug}.svg`), renderRoute(d, countries, osm));
    console.log(`islands/${d.slug}.svg, routes/${d.slug}.svg`);
  }
}

main();
