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
  panel: "#F7F3EA",
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

function renderIsland(dest, osm, W, H, { frame = true, scale = 1, bounds: forced = null, overlay = null, noTitle = false } = {}) {
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
  if (!noTitle) {
  const labelSize = 26 * s;
  const lx = W - 18 * s, ly = 18 * s + labelSize;
  g += text(lx, ly, name, { size: labelSize, fill: C.islandText, font: SERIF, weight: 700, anchor: "end", spacing: 3 * s, halo: "rgba(255,255,255,0.9)" });
  g += text(lx, ly + 18 * s, dest.en_name || "", { size: 11 * s, fill: C.islandText, anchor: "end", weight: 400, halo: "rgba(255,255,255,0.9)" });
  }
  // スケールバー
  const midLat = (bounds.north + bounds.south) / 2;
  const kmPerPx = (6371 * Math.cos(rad(midLat))) / proj.k;
  const sc = niceScale(kmPerPx, W * 0.22);
  const sx = noTitle ? W - 18 * s - sc.px : 18 * s, sy = noTitle ? 30 * s : H - 18 * s;
  g += `<g id="scale" stroke="${C.islandText}" stroke-width="${1.4 * s}" fill="none"><path d="M${fmt(sx)} ${fmt(sy - 5 * s)}V${fmt(sy)}H${fmt(sx + sc.px)}V${fmt(sy - 5 * s)}"/></g>`;
  g += text(sx + sc.px / 2, sy - 8 * s, `${sc.km}km`, { size: 11 * s, fill: C.islandText, weight: 500, halo: "rgba(255,255,255,0.9)" });
  return { body: g, proj, marker: [px, py] };
}

// ---------------------------------------------------------------- 経由ルート（行き方マップ）
// 各記事の「行き方」セクション（と destinations.yml の flight_hours）に書かれている基本ルートを写したもの。
// 記事の行き方を変えたら、ここも合わせて直すこと。記事に書いていない時間は書かない（ラベルは手段だけにする）。
//
// from : 日本側の出発空港の表記
// legs : [到着地点名, lng, lat, 手段, ラベル, メモ]  最後の要素は行き先（地点名・座標は null で destinations.yml の値を使う）
//        手段: air=飛行機（実線） / car=車・バス（破線） / boat=船（点線）
// alt  : 別ルートの注記。altFrom があれば拡大図に細い点線で描く
const P = {
  bkk: ["バンコク", 100.75, 13.69], kul: ["クアラルンプール", 101.71, 2.74], mnl: ["マニラ", 121.02, 14.51],
  sgn: ["ホーチミン", 106.66, 10.82], cgk: ["ジャカルタ", 106.66, -6.13], ceb: ["セブ", 123.98, 10.31],
  dps: ["デンパサール", 115.17, -8.75],
};
const L = (pt, by, label, note) => [...pt, by, label, note];
const D = (by, label, note) => [null, null, null, by, label, note];
// 国際線（日本→乗継空港）の所要時間。出典：同じ乗継空港を使う既存記事の記載
const INTL_BKK = "国際線 約6〜6.5時間"; // koh-chang-guide ほか（成田・羽田・関西→バンコク）
const INTL_MNL = "国際線 直行 約5時間"; // coron-guide（成田→マニラ）
const INTL_CEB = "国際線 直行 約5時間"; // cebu-guide（成田→セブ。関西発は約4時間25分）
const INTL_SGN = "国際線 直行 約6時間"; // con-dao-guide・nhatrang-guide（→ホーチミン）
const INTL_CGK = "国際線 直行 約8時間"; // pulau-pari-guide（ANA直行便→ジャカルタ）
const INTL_KUL = "国際線 直行 約7〜8時間"; // 記事に記載なし。成田→KL直行の時刻表（7時間15分〜7時間40分）をWebSearchで確認、2026-11-20
const ROUTES = {
  "bali-guide": { from: "成田（関西発はKL乗継）", legs: [D("air", "国際線 直行 約7〜8時間")] },
  "cebu-guide": { from: "成田・関西", legs: [D("air", "国際線 直行 約5時間")] },
  "danang-hoian-guide": { from: "成田・関西", legs: [D("air", "国際線 直行 約5時間40分")] },
  "boracay-guide": { from: "成田・羽田・関西", legs: [L(P.mnl, "air", INTL_MNL), L(["カティクラン空港", 121.95, 11.93], "air", "国内線"), D("boat", "車＋船 合わせて1〜2時間")] },
  "phuket-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), D("air", "国内線 約1時間20分")] },
  "langkawi-guide": { from: "成田・関西", legs: [L(P.kul, "air", INTL_KUL), D("air", "国内線 約1時間15分")], alt: "ペナン島から高速フェリーの別ルートあり" },
  "koh-lipe-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["ハジャイ", 100.39, 6.93], "air", "国内線 約1時間半", "ここで1泊"), L(["パクバラ桟橋", 99.73, 6.86], "car", "車"), D("boat", "スピードボート 約1時間30分", "最終便 13:30頃")], alt: "ランカウイ島（マレーシア）からフェリーの別ルートあり", altFrom: ["ランカウイ島", 99.85, 6.30] },
  "redang-guide": { from: "成田・関西", legs: [L(P.kul, "air", INTL_KUL), L(["クアラトレンガヌ", 103.10, 5.38], "air", "国内線 約1時間"), D("boat", "車 約30分＋フェリー 約1時間")] },
  "koh-phiphi-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["プーケット", 98.32, 8.11], "air", "国内線 約1時間半"), D("boat", "フェリー 約1.5〜2時間")], alt: "クラビ経由（フェリー同程度）の別ルートあり" },
  "koh-chang-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["トラート", 102.32, 12.27], "air", "国内線"), D("boat", "車＋フェリー")], alt: "バンコクの空港から直行バスの別ルートあり" },
  "pulau-pari-guide": { from: "成田（関西発はシンガポール乗継）", legs: [L(P.cgk, "air", "国際線 直行 約8時間"), D("boat", "高速船（1日1往復）")] },
  "phuquoc-guide": { from: "成田・関西", legs: [L(P.sgn, "air", "国際線 約6〜7時間"), D("air", "国内線 約1時間")], alt: "ハノイ経由の別ルートあり" },
  "koh-samui-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), D("air", "国内線 約1時間")], alt: "スラタニ＋フェリーの節約ルートあり" },
  "koh-tao-guide": { from: "成田・関西", legs: [L(P.bkk, "air", "国際線 約6〜7時間"), L(["サムイ島", 100.06, 9.55], "air", "国内線 約1時間"), D("boat", "高速船")], alt: "チュンポン経由（安いが乗継多め）の別ルートあり" },
  "el-nido-guide": { from: "成田・関西", legs: [L(P.ceb, "air", INTL_CEB), D("air", "国内線 約1時間45分")], alt: "クラーク経由の別ルートあり" },
  "nusa-penida-guide": { from: "成田（関西発はKL乗継）", legs: [L(P.dps, "air", "国際線 直行 約7〜8時間"), L(["サヌール", 115.26, -8.68], "car", "車", "ここで1泊"), D("boat", "高速ボート 約30〜45分")] },
  "nusa-lembongan-guide": { from: "成田（関西発はKL乗継）", legs: [L(P.dps, "air", "国際線 直行 約7〜8時間"), L(["サヌール", 115.26, -8.68], "car", "車", "ここで1泊"), D("boat", "高速ボート 約30分")] },
  "gili-trawangan-guide": { from: "成田（関西発はKL乗継）", legs: [L(P.dps, "air", "国際線 直行 約7〜8時間"), L(["パダンバイ", 115.51, -8.53], "car", "車 1時間半〜2時間", "ここで前泊"), D("boat", "高速ボート 約1時間半")] },
  "gili-air-guide": { from: "成田（関西発はKL乗継）", legs: [L(P.dps, "air", "国際線 直行 約7〜8時間"), L(["パダンバイ", 115.51, -8.53], "car", "車"), D("boat", "高速ボート 約2時間")] },
  "coron-guide": { from: "成田・関西", legs: [L(P.mnl, "air", "国際線 直行 約5時間", "ここで1泊"), D("air", "国内線 約1時間")] },
  "con-dao-guide": { from: "成田・関西", legs: [L(P.sgn, "air", "国際線 直行 約6時間", "ここで1泊"), D("air", "国内線 約50分")] },
  "siargao-guide": { from: "成田・関西", legs: [L(P.ceb, "air", INTL_CEB, "ここで1泊"), D("air", "国内線 約50分")] },
  "camiguin-guide": { from: "成田・関西", legs: [L(P.mnl, "air", INTL_MNL, "ここで1泊"), D("air", "国内線（1日1便）")] },
  "nhatrang-guide": { from: "成田・関西", legs: [L(P.sgn, "air", "国際線 直行 約6時間", "ここで1泊"), D("air", "国内線 約1時間10分")] },
  "krabi-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["クラビ空港", 98.99, 8.10], "air", "国内線 約1時間20分"), D("boat", "車 約50分＋ロングテールボート 約20分")] },
  "tioman-guide": { from: "成田・関西", legs: [L(P.kul, "air", INTL_KUL), L(["メルシン", 103.84, 2.43], "car", "バス 約5時間", "ここで前泊"), D("boat", "フェリー 約1.5〜2時間")] },
  "koh-larn-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", "国際線 約6〜7時間"), L(["パタヤ", 100.88, 12.93], "car", "車 約1.5〜2時間"), D("boat", "スピードボート 約15〜20分")] },
  "perhentian-guide": { from: "成田・関西", legs: [L(P.kul, "air", INTL_KUL), L(["クアラブス桟橋", 102.56, 5.83], "car", "バス"), D("boat", "スピードボート 約40分")] },
  "koh-kood-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["トラート", 102.32, 12.27], "air", "国内線"), D("boat", "車＋フェリー（船は約1時間）")] },
  "koh-phangan-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["サムイ島", 100.06, 9.55], "air", "国内線 約1時間"), D("boat", "フェリー 約30分")] },
  "koh-rong-guide": { from: "成田・関西", legs: [L(P.sgn, "air", INTL_SGN), L(["シアヌークビル", 103.64, 10.58], "air", "国内線 約1時間15分"), D("boat", "車 約15分＋フェリー 約1時間")] },
  "koh-rong-samloem-guide": { from: "成田・関西", legs: [L(P.sgn, "air", INTL_SGN), L(["シアヌークビル", 103.64, 10.58], "air", "国内線 約1時間15分"), D("boat", "車 約15分＋フェリー 約45分〜1時間")] },
  "komodo-guide": { from: "成田（関西発はKL乗継）", legs: [L(P.dps, "air", "国際線 直行 約7〜8時間", "ここで1泊"), L(["ラブアンバジョ", 119.89, -8.49], "air", "国内線 約1時間15分"), D("boat", "ボート")] },
  "pulau-weh-guide": { from: "成田（関西発はKL経由）", legs: [L(P.cgk, "air", INTL_CGK), L(["バンダアチェ", 95.42, 5.52], "air", "国内線"), D("boat", "車 約35分＋高速船 約1時間")] },
  "bohol-guide": { from: "成田・関西", legs: [L(P.ceb, "air", INTL_CEB), D("boat", "高速船 約2時間")], alt: "マニラ経由で国内線の別ルートあり（マニラで1泊）" },
  "lombok-guide": { from: "成田（関西発はKL乗継）", legs: [L(P.dps, "air", "国際線 直行 約7時間55分"), D("air", "国内線 約45分＋車 約25分")] },
  "koh-lanta-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["クラビ空港", 98.99, 8.10], "air", "国内線 約1時間20分"), D("car", "ミニバン＋車両フェリー 約2.5〜3.5時間")] },
  "pattaya-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), D("car", "直行バス 約2時間30分")] },
  "koh-samet-guide": { from: "成田・羽田・関西", legs: [L(P.bkk, "air", INTL_BKK), L(["バンペー桟橋", 101.44, 12.63], "car", "直行ミニバン 約3時間"), D("boat", "フェリー 約30〜40分")] },
  "mui-ne-guide": { from: "成田・関西", legs: [L(P.sgn, "air", "国際線 直行 約6時間", "ここで1泊"), D("car", "バス 約5.5時間")] },
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

// sp=false：PC用（1500×1000、拡大図・タイトル・凡例を地図に重ねる）
// sp=true ：スマホ用（幅750の縦長。タイトル→全体図→拡大図→凡例を縦に積み、文字を大きくする）
function renderRoute(dest, countries, osm, sp = false) {
  const route = ROUTES[dest.slug];
  if (!route) throw new Error(`ROUTES に ${dest.slug} の経由ルートがありません（記事の行き方を見て追加してください）`);
  const shortName = SHORT_NAMES[dest.slug] || dest.name;
  // 文字・線の大きさ
  const K = sp
    ? { pill: 25, stop: 28, stopIn: 25, pillIn: 22, dest: 28, jp: 32, from: 21, alt: 19, lw: 3.2, lwIn: 3.4, base: 1.7, short: 230 }
    : { pill: 17, stop: 19, stopIn: 17, pillIn: 14, dest: 19, jp: 22, from: 14, alt: 13, lw: 2.2, lwIn: 2.4, base: 1.2, short: 170 };
  const legs = route.legs.map((l) => (l[0] === null ? [shortName, dest.lng, dest.lat, ...l.slice(3)] : l));
  // 最後の飛行機の到着地点までを全体図、そこから先（車・船）を拡大図に描く
  let lastAir = -1;
  legs.forEach((l, i) => { if (l[3] === "air") lastAir = i; });
  const mainLegs = legs.slice(0, lastAir + 1);
  const localLegs = legs.slice(lastAir + 1);
  const hasLocal = localLegs.length > 0;
  const insetStart = lastAir >= 0 ? legs[lastAir] : null;

  // ---- レイアウト
  const path = ["日本", ...legs.slice(0, -1).filter((l) => l[3] === "air" || l === legs[lastAir]).map((l) => l[0]), shortName];
  const summary = [...new Set(path)].join(" → ");
  let W, H, MX, MY, MW, MH, IX, IY, IW, IH, titleH = 0, altLines = [];
  if (sp) {
    W = 750;
    // 記事の見出し（行き方）の直下に置く前提で、タイトル・凡例は付けず高さを抑える。
    // 拡大図は車・船の区間がある行き先だけ（飛行機だけで着く行き先は全体図1枚）。
    altLines = route.alt ? wrapJa(`※${route.alt}`, 34) : [];
    MX = 0; MY = 0; MW = W; MH = 560;
    IX = 20; IY = MH + 24; IW = W - 40; IH = 460;
    var footY = (hasLocal ? IY + IH : MH) + 40;
    H = footY + altLines.length * 30 + 50;
  } else {
    W = 1500; H = 1000; MX = 0; MY = 0; MW = W; MH = H;
    IW = 580; IH = 420; IX = W - IW - 30; IY = H - IH - 46;
  }

  // ---- 全体図の範囲（日本は右上の端に置くので、東南アジア側の地点だけで決める）
  const pts = legs.map((l) => [l[1], l[2]]);
  let w = Math.min(...pts.map((p) => p[0])), e = Math.max(...pts.map((p) => p[0]));
  let so = Math.min(...pts.map((p) => p[1])), n = Math.max(...pts.map((p) => p[1]));
  const span = Math.max(e - w, n - so, sp ? 9 : 11);
  const bounds = sp
    ? { west: w - span * 0.3, east: e + span * 0.45, south: so - span * 0.18, north: n + span * 0.35 }
    : { west: w - span * 0.45, east: e + span * 0.95, south: so - span * 0.4, north: n + span * 0.3 };
  // 重ねている要素（PC：拡大図・タイトル・凡例／スマホ：日本マーカー）の下に経由地が隠れないよう範囲を広げる
  const blocked = sp ? [[MW - 300, 0, MW, 120]] : [[IX - 30, IY - 30, W, H], [0, 0, 460, 150], [0, H - 190, 200, H]];
  for (let k = 0; k < 12; k++) {
    const pj = makeProj(bounds, MW, MH);
    const hitRect = (r) => pts.some((q) => { const [x, y] = pj(q); return x > r[0] && x < r[2] && y > r[1] && y < r[3]; });
    if (sp) { if (hitRect(blocked[0])) { bounds.north += span * 0.2; bounds.east += span * 0.15; continue; } break; }
    if (hitRect(blocked[0])) { bounds.east += span * 0.25; bounds.south -= span * 0.25; continue; }
    if (hitRect(blocked[1])) { bounds.west -= span * 0.15; bounds.north += span * 0.15; continue; }
    if (hitRect(blocked[2])) { bounds.west -= span * 0.2; bounds.south -= span * 0.1; continue; }
    break;
  }
  const base = renderBase(bounds, MW, MH, { countries, scale: K.base, cities: [] });
  const proj = base.proj;
  let m = base.body; // 全体図の中身（全体図の座標系）

  // ---- 部品
  const arc = ([x1, y1], [x2, y2], bend) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    const c = [mx + nx * len * bend, my + ny * len * bend];
    return { d: `M${fmt(x1)} ${fmt(y1)}Q${fmt(c[0])} ${fmt(c[1])} ${fmt(x2)} ${fmt(y2)}`, mid: [0.25 * x1 + 0.5 * c[0] + 0.25 * x2, 0.25 * y1 + 0.5 * c[1] + 0.25 * y2], len, c, p0: [x1, y1], p2: [x2, y2], n: [nx * Math.sign(bend || 1), ny * Math.sign(bend || 1)] };
  };
  const dash = sp
    ? { air: "", car: ` stroke-dasharray="15 10"`, boat: ` stroke-dasharray="1 10"` }
    : { air: "", car: ` stroke-dasharray="10 7"`, boat: ` stroke-dasharray="1 7"` };
  const sw = (by, b) => (by === "boat" ? b * 1.5 : b);
  const textW = (t, size) => [...(t || "")].reduce((a, ch) => a + (/[\x00-\x7F]/.test(ch) ? 0.58 : 1), 0) * size;
  const pill = (x, y, label, sub, size, maxW) => {
    const wpx = Math.max(textW(label, size), textW(sub, size * 0.72)) + size * 1.4;
    const hpx = sub ? size * 2.6 : size * 1.75;
    if (maxW) x = Math.min(Math.max(x, wpx / 2 + 6), maxW - wpx / 2 - 6); // はみ出さないように寄せる
    return `<rect x="${fmt(x - wpx / 2)}" y="${fmt(y - hpx / 2)}" width="${fmt(wpx)}" height="${fmt(hpx)}" rx="3" fill="${C.pill}"/>` +
      text(x, y + (sub ? -size * 0.2 : size * 0.36), label, { size, fill: "#fff", weight: 700 }) +
      (sub ? text(x, y + size * 0.95, sub, { size: size * 0.72, fill: "#fff", weight: 400 }) : "");
  };
  const stopMark = (x, y, name, note, size, side = "r") => {
    const g0 = size * 0.65;
    const pos = {
      r: [g0, size * 0.36, "start"], l: [-g0, size * 0.36, "end"],
      t: [0, -size * (note ? 1.6 : 0.8), "middle"], b: [0, size * 1.45, "middle"],
    }[side];
    return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${size * 0.36}" fill="${C.route}" stroke="#fff" stroke-width="${size * 0.085}"/>` +
      text(x + pos[0], y + pos[1], name, { size, fill: C.cityText, weight: 700, anchor: pos[2], halo: "rgba(255,255,255,0.85)" }) +
      (note ? text(x + pos[0], y + pos[1] + size * 1.15, note, { size: size * 0.72, fill: C.cityText, weight: 500, anchor: pos[2], halo: "rgba(255,255,255,0.85)" }) : "");
  };
  // 隣の地点と反対側にラベルを置く（はみ出すなら上下）
  const sideFor = (p, neighbors, name, size, Wmax) => {
    let vx = 0, vy = 0;
    for (const q of neighbors) { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; vx += (q[0] - p[0]) / d; vy += (q[1] - p[1]) / d; }
    let side = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? "l" : "r") : (vy > 0 ? "t" : "b");
    const tw = textW(name, size);
    if (side === "r" && p[0] + size + tw > Wmax - 8) side = vy > 0 ? "t" : "b";
    if (side === "l" && p[0] - size - tw < 8) side = vy > 0 ? "t" : "b";
    if ((side === "t" || side === "b") && (p[0] - tw / 2 < 8 || p[0] + tw / 2 > Wmax - 8)) side = p[0] > Wmax / 2 ? "l" : "r";
    return side;
  };

  // ---- 全体図：日本（右上の端）→ 経由地
  // 日本は地図の外にあるので、右上の角に「日本から」の札を置き、そこから線を出す
  const jb = sp ? { w: 0, h: 74, y: 14, t: 26, f: 19 } : { w: 0, h: 62, y: 24, t: 20, f: 14 };
  jb.w = Math.max(textW("日本から", jb.t), textW(route.from, jb.f)) + 36;
  jb.x = MW - jb.w - (sp ? 14 : 24);
  const jp = [jb.x + 14, jb.y + jb.h];
  let routeSvg = `<g id="routes" fill="none" stroke="${C.route}" stroke-linecap="round">`;
  let labelSvg = "";
  let prev = jp;
  const mainArcs = [];
  const mainBoxes = [[jb.x - 6, jb.y - 6, jb.x + jb.w + 6, jb.y + jb.h + 6]];
  mainLegs.forEach((l, i) => {
    const to = proj([l[1], l[2]]);
    const a = arc(prev, to, i === 0 ? -0.08 : -0.18);
    routeSvg += `<path d="${a.d}" stroke-width="${sw(l[3], K.lw)}"${dash[l[3]]}/>`;
    mainArcs.push([a, l[4]]);
    prev = to;
  });
  routeSvg += `</g>`;
  m += routeSvg;
  const japanBadge = `<g id="from-japan"><rect x="${fmt(jb.x)}" y="${jb.y}" width="${fmt(jb.w)}" height="${jb.h}" rx="4" fill="#fff" fill-opacity="0.96" stroke="${C.route}" stroke-width="1.5"/>` +
    text(jb.x + 18, jb.y + jb.t * 1.15, "日本から", { size: jb.t, fill: C.cityText, weight: 700, anchor: "start" }) +
    text(jb.x + 18, jb.y + jb.t * 1.15 + jb.f * 1.35, route.from, { size: jb.f, fill: C.cityText, weight: 500, anchor: "start" }) + `</g>`;
  mainLegs.forEach((l, i) => {
    if (i === legs.length - 1) return;
    const [x, y] = proj([l[1], l[2]]);
    const side = x + K.stop + textW(l[0], K.stop) > MW - 8 ? "l" : "r";
    const nt = hasLocal && i === lastAir ? null : l[5];
    m += stopMark(x, y, l[0], nt, K.stop, side);
    const tw = Math.max(textW(l[0], K.stop), nt ? textW(nt, K.stop * 0.72) : 0), g0 = K.stop * 0.65;
    mainBoxes.push([x - K.stop * 0.5, y - K.stop * 0.5, x + K.stop * 0.5, y + K.stop * 0.5]);
    mainBoxes.push(side === "r" ? [x + g0, y - K.stop * 0.7, x + g0 + tw, y + K.stop * (nt ? 1.6 : 0.5)] : [x - g0 - tw, y - K.stop * 0.7, x - g0, y + K.stop * (nt ? 1.6 : 0.5)]);
  });

  // ---- 拡大図
  const ib = islandBounds(dest, osm).bounds;
  let insetBounds = ib;
  const insetPts = [...(insetStart ? [insetStart] : []), ...localLegs].map((l) => [l[1], l[2]]);
  if (route.altFrom) insetPts.push([route.altFrom[1], route.altFrom[2]]);
  if (hasLocal) {
    let iw = Math.min(ib.west, ...insetPts.map((p) => p[0])), ie = Math.max(ib.east, ...insetPts.map((p) => p[0]));
    let is = Math.min(ib.south, ...insetPts.map((p) => p[1])), inn = Math.max(ib.north, ...insetPts.map((p) => p[1]));
    const pw = (ie - iw) * 0.3 + 0.03, ph = (inn - is) * 0.25 + 0.03;
    insetBounds = { west: iw - pw, east: ie + pw, south: is - ph, north: inn + ph * (sp ? 1.6 : 2.2) };
  }
  const insetName = hasLocal ? `拡大図：${insetStart ? insetStart[0] : ""}〜${shortName}` : `拡大図：${shortName}`;
  const headH = sp ? 0 : 36; // PCは枠の中に見出し、スマホは枠の上に見出し
  const MAPH = IH - headH;
  const island = renderIsland(dest, osm, IW, MAPH, {
    frame: true, scale: sp ? 1.7 : 1.1, bounds: insetBounds, noTitle: true,
    overlay: (ip) => {
      let o = "";
      if (route.altFrom) {
        const a = arc(ip([route.altFrom[1], route.altFrom[2]]), ip([dest.lng, dest.lat]), 0.15);
        o += `<path d="${a.d}" fill="none" stroke="${C.route}" stroke-opacity="0.55" stroke-width="${K.lwIn * 0.8}" stroke-dasharray="${sp ? "1 10" : "2 6"}" stroke-linecap="round"/>`;
        const [x, y] = ip([route.altFrom[1], route.altFrom[2]]);
        o += text(x, y + K.alt * 1.7, route.altFrom[0] + "（別ルート）", { size: K.alt, fill: C.cityText, weight: 500, halo: "rgba(255,255,255,0.9)" });
      }
      // ---- ラベル配置（重なりを避ける）：地点の点 → 地名 → 区間ラベル の順に置く
      let lbl = "", stops = "";
      const chain = [...(insetStart ? [insetStart] : []), ...localLegs];
      const xy = chain.map((l) => ip([l[1], l[2]]));
      const dxy = ip([dest.lng, dest.lat]);
      const off = insetStart ? 1 : 0;
      const boxes = [];
      const over = (A, B) => A[0] < B[2] && A[2] > B[0] && A[1] < B[3] && A[3] > B[1];
      const inside = (A) => A[0] > 4 && A[1] > 4 && A[2] < IW - 4 && A[3] < MAPH - 4;
      const free = (A) => inside(A) && !boxes.some((B) => over(A, B));
      for (const q of xy) boxes.push([q[0] - 9, q[1] - 9, q[0] + 9, q[1] + 9]);
      const arcs = localLegs.map((l, i) => arc(xy[i + off - 1], xy[i + off], -0.12));
      arcs.forEach((a, i) => {
        o += `<path d="${a.d}" fill="none" stroke="${C.route}" stroke-width="${sw(localLegs[i][3], K.lwIn)}" stroke-linecap="round"${dash[localLegs[i][3]]}/>`;
      });
      // 地名：好みの向き → 残りの向き の順に、空いている所へ置く
      const placeName = (q, name, note, size, gap, pref, color, dot) => {
        const tw = textW(name, size), nw = note ? textW(note, size * 0.72) : 0, w2 = Math.max(tw, nw);
        const hh = size * (note ? 2.1 : 1.1);
        const box = (side) => side === "r" ? [q[0] + gap, q[1] - size * 0.6, q[0] + gap + w2, q[1] - size * 0.6 + hh]
          : side === "l" ? [q[0] - gap - w2, q[1] - size * 0.6, q[0] - gap, q[1] - size * 0.6 + hh]
          : side === "t" ? [q[0] - w2 / 2, q[1] - gap - hh, q[0] + w2 / 2, q[1] - gap]
          : [q[0] - w2 / 2, q[1] + gap, q[0] + w2 / 2, q[1] + gap + hh];
        const order = [pref, ...["r", "l", "b", "t"].filter((x) => x !== pref)];
        const side = order.find((sd) => free(box(sd))) || pref;
        const B = box(side); boxes.push(B);
        const anchor = side === "r" ? "start" : side === "l" ? "end" : "middle";
        const tx = side === "r" ? B[0] : side === "l" ? B[2] : q[0];
        const ty = B[1] + size * 0.88;
        return dot + text(tx, ty, name, { size, fill: color, weight: 700, anchor, halo: "rgba(255,255,255,0.9)" }) +
          (note ? text(tx, ty + size * 1.05, note, { size: size * 0.72, fill: C.cityText, weight: 500, anchor, halo: "rgba(255,255,255,0.9)" }) : "");
      };
      const r = K.dest * 0.58;
      const destDot = `<circle cx="${fmt(dxy[0])}" cy="${fmt(dxy[1])}" r="${fmt(r)}" fill="none" stroke="${C.dest}" stroke-width="${K.lwIn * 0.8}"/><circle cx="${fmt(dxy[0])}" cy="${fmt(dxy[1])}" r="${fmt(r * 0.45)}" fill="${C.dest}"/>`;
      boxes.push([dxy[0] - r - 2, dxy[1] - r - 2, dxy[0] + r + 2, dxy[1] + r + 2]);
      const dsNb = xy.length > 1 ? [xy[xy.length - 2]] : [];
      stops += placeName(dxy, shortName, null, K.dest, r + 6, dsNb.length ? sideFor(dxy, dsNb, shortName, K.dest, IW) : "b", C.dest, destDot);
      chain.slice(0, -1).forEach((l, i) => {
        const nb = [xy[i - 1], xy[i + 1]].filter(Boolean);
        const dot = `<circle cx="${fmt(xy[i][0])}" cy="${fmt(xy[i][1])}" r="${K.stopIn * 0.36}" fill="${C.route}" stroke="#fff" stroke-width="${K.stopIn * 0.085}"/>`;
        stops += placeName(xy[i], l[0], l[5], K.stopIn, K.stopIn * 0.65, sideFor(xy[i], nb, l[0], K.stopIn, IW), C.cityText, dot);
      });
      // 区間ラベル：線に沿って位置をずらし、横にも逃がして、空いている所に置く
      arcs.forEach((a, i) => {
        const l = localLegs[i], sub = i === localLegs.length - 1 ? l[5] : null, size = K.pillIn;
        const wpx = Math.max(textW(l[4], size), textW(sub, size * 0.72)) + size * 1.4, hpx = sub ? size * 2.6 : size * 1.75;
        const at = (t) => [(1 - t) ** 2 * a.p0[0] + 2 * (1 - t) * t * a.c[0] + t * t * a.p2[0], (1 - t) ** 2 * a.p0[1] + 2 * (1 - t) * t * a.c[1] + t * t * a.p2[1]];
        let best = null;
        outer: for (const d of [0, 1, -1, 2, -2, 3, -3, 4, -4]) for (const t of [0.5, 0.38, 0.62, 0.26, 0.74]) {
          const [px, py] = at(t);
          const cx = px + a.n[0] * d * hpx * 0.95, cy = py + a.n[1] * d * hpx * 0.95;
          const B = [cx - wpx / 2, cy - hpx / 2, cx + wpx / 2, cy + hpx / 2];
          if (free(B)) { best = [cx, cy, B]; break outer; }
        }
        if (!best) { const [px, py] = at(0.5); best = [px, py, [px - wpx / 2, py - hpx / 2, px + wpx / 2, py + hpx / 2]]; }
        boxes.push(best[2]);
        lbl += pill(best[0], best[1], l[4], sub, size, IW);
      });
      return o + stops + lbl;
    },
  });
  // 全体図上の拡大範囲の枠
  const [rx0, ry0] = proj([insetBounds.west, insetBounds.north]), [rx1, ry1] = proj([insetBounds.east, insetBounds.south]);
  const rw = Math.max(rx1 - rx0, 14), rh = Math.max(ry1 - ry0, 10);
  const rcx = (rx0 + rx1) / 2, rcy = (ry0 + ry1) / 2;
  const box = [rcx - rw / 2, rcy - rh / 2, rw, rh];
  const showInset = !sp || hasLocal;
  if (showInset) m += `<rect x="${fmt(box[0])}" y="${fmt(box[1])}" width="${fmt(box[2])}" height="${fmt(box[3])}" fill="none" stroke="${C.route}" stroke-width="${sp ? 2 : 1.2}"/>`;
  const [dx, dy] = proj([dest.lng, dest.lat]);
  const sq = sp ? 12 : 8;
  m += `<rect x="${fmt(dx - sq / 2)}" y="${fmt(dy - sq / 2)}" width="${sq}" height="${sq}" fill="${C.dest}"/>`;
  if (sp && !hasLocal) m += `<circle cx="${fmt(dx)}" cy="${fmt(dy)}" r="16" fill="none" stroke="${C.dest}" stroke-width="2.5"/>`;
  if (!hasLocal) m += text(dx - sq - (sp ? 14 : 4), dy + K.dest * 0.33, shortName, { size: K.dest, fill: C.dest, weight: 700, anchor: "end", halo: "rgba(255,255,255,0.85)" });
  // 行き先の印・名前も避ける対象にしてから、区間ラベルを空いている所に置く
  mainBoxes.push([dx - 18, dy - 18, dx + 18, dy + 18]);
  if (!hasLocal) { const tw = textW(shortName, K.dest), x1 = dx - sq - (sp ? 14 : 4); mainBoxes.push([x1 - tw, dy - K.dest * 0.7, x1, dy + K.dest * 0.45]); }
  for (const [a, label] of mainArcs) {
    const wpx = textW(label, K.pill) + K.pill * 1.4, hpx = K.pill * 1.75;
    const at = (t) => [(1 - t) ** 2 * a.p0[0] + 2 * (1 - t) * t * a.c[0] + t * t * a.p2[0], (1 - t) ** 2 * a.p0[1] + 2 * (1 - t) * t * a.c[1] + t * t * a.p2[1]];
    let best = null;
    outer: for (const d of [0, 1, -1, 2, -2]) for (const t of [0.5, 0.4, 0.6, 0.3, 0.7]) {
      const [px, py] = at(t);
      const cx = Math.min(Math.max(px + a.n[0] * d * hpx, wpx / 2 + 6), MW - wpx / 2 - 6), cy = py + a.n[1] * d * hpx;
      const B = [cx - wpx / 2, cy - hpx / 2, cx + wpx / 2, cy + hpx / 2];
      if (B[1] > 4 && B[3] < MH - 4 && !mainBoxes.some((Q) => B[0] < Q[2] && B[2] > Q[0] && B[1] < Q[3] && B[3] > Q[1])) { best = [cx, cy, B]; break outer; }
    }
    if (!best) { const [px, py] = at(0.5); best = [px, py, [px - wpx / 2, py - hpx / 2, px + wpx / 2, py + hpx / 2]]; }
    mainBoxes.push(best[2]);
    labelSvg += pill(best[0], best[1], label, null, K.pill, MW);
  }
  m += labelSvg + japanBadge;

  // スマホ版で飛行機だけで着く行き先：拡大図（島の形）を全体図の空いている角に小窓で入れる
  if (sp && !hasLocal) {
    const mg = 14;
    const hitAny = (B) => mainBoxes.some((Q) => B[0] < Q[2] && B[2] > Q[0] && B[1] < Q[3] && B[3] > Q[1]) ||
      pts.some((q) => { const [x, y] = proj(q); return x > B[0] - 10 && x < B[2] + 10 && y > B[1] - 10 && y < B[3] + 10; });
    // 右下 → 左下 → 左上 → 右上（日本からの札の下）の順に、大きめから小さめへ空いている所を探す
    let cw = 320, ch = 250, cx0 = MW - cw - mg, cy0 = MH - ch - mg;
    // 角の優先順位を先に、その角で入る一番大きいサイズを選ぶ
    search: for (const corner of ["br", "bl", "tl", "tr"]) {
      for (const h of [250, 220, 190]) {
        const w = Math.round(h * 1.28);
        const [x, y] = { br: [MW - w - mg, MH - h - mg], bl: [mg, MH - h - mg], tl: [mg, mg + 10], tr: [MW - w - mg, mg + jb.h + 30] }[corner];
        if (!hitAny([x, y, x + w, y + h])) { cw = w; ch = h; cx0 = x; cy0 = y; break search; }
      }
    }
    const head = 40;
    const isl = renderIsland(dest, osm, cw, ch - head, {
      frame: true, scale: 1.3, bounds: ib, noTitle: true,
      overlay: (ip) => { const [x, y] = ip([dest.lng, dest.lat]); return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="13" fill="none" stroke="${C.dest}" stroke-width="2.5"/><circle cx="${fmt(x)}" cy="${fmt(y)}" r="5.5" fill="${C.dest}"/>`; },
    });
    // 引き出し線（全体図上の行き先の枠 → 小窓の近い2つの角）
    const bx = box[0] + box[2] / 2, by = box[1] + box[3] / 2;
    const near = cx0 > bx ? [[cx0, cy0], [cx0, cy0 + ch]] : [[cx0 + cw, cy0], [cx0 + cw, cy0 + ch]];
    m += `<rect x="${fmt(box[0])}" y="${fmt(box[1])}" width="${fmt(box[2])}" height="${fmt(box[3])}" fill="none" stroke="${C.route}" stroke-width="2"/>`;
    m += `<path d="M${fmt(box[0] + (cx0 > bx ? box[2] : 0))} ${fmt(box[1])}L${near[0][0]} ${near[0][1]}M${fmt(box[0] + (cx0 > bx ? box[2] : 0))} ${fmt(box[1] + box[3])}L${near[1][0]} ${near[1][1]}" fill="none" stroke="${C.route}" stroke-width="1.5" stroke-opacity="0.7"/>`;
    m += `<g id="inset-mini" transform="translate(${cx0} ${cy0})"><rect width="${cw}" height="${ch}" fill="#fff" stroke="${C.route}" stroke-width="2"/>` +
      `<rect width="${cw}" height="${head}" fill="${C.pill}"/>` + text(14, 28, `拡大：${shortName}`, { size: 22, fill: "#fff", weight: 700, anchor: "start" }) +
      `<svg x="0" y="${head}" width="${cw}" height="${ch - head}" viewBox="0 0 ${cw} ${ch - head}" overflow="hidden">${isl.body}</svg></g>`;
  }

  // ---- 組み立て
  let g = "";
  const insetSvg = `<g id="inset" transform="translate(${IX} ${IY})"><rect width="${IW}" height="${IH}" fill="#fff" stroke="${C.route}" stroke-width="1.5"/>` +
    (sp ? "" : text(14, 25, insetName, { size: 16, fill: C.cityText, weight: 700, anchor: "start" })) +
    `<svg x="0" y="${headH}" width="${IW}" height="${MAPH}" viewBox="0 0 ${IW} ${MAPH}" overflow="hidden">${island.body}</svg></g>`;
  const legendItems = [["飛行機", "air"], ["車・バス", "car"], ["船", "boat"]];
  const note = "所要時間は目安です。便・船の時刻は季節や運航会社で変わります。";
  if (sp) {
    g += `<rect width="${W}" height="${H}" fill="${C.panel}"/>`;
    g += `<svg x="${MX}" y="${MY}" width="${MW}" height="${MH}" viewBox="0 0 ${MW} ${MH}" overflow="hidden">${m}</svg>`;
    if (hasLocal) {
      // 引き出し線（全体図の枠 → 拡大図の上辺）
      g += `<path d="M${fmt(box[0])} ${fmt(MY + box[1] + box[3])}L${IX} ${IY}M${fmt(box[0] + box[2])} ${fmt(MY + box[1] + box[3])}L${IX + IW} ${IY}" fill="none" stroke="${C.route}" stroke-width="1.5" stroke-opacity="0.6"/>`;
      g += `<rect x="0" y="${MY + MH}" width="${W}" height="${IY - MY - MH}" fill="${C.panel}"/>`;
      g += insetSvg;
      const hw = textW(insetName, 24) + 30;
      g += `<rect x="${IX}" y="${IY}" width="${fmt(Math.min(hw, IW))}" height="44" fill="${C.pill}"/>` + text(IX + 15, IY + 31, insetName, { size: 24, fill: "#fff", weight: 700, anchor: "start" });
    }
    altLines.forEach((l, i) => { g += text(24, footY + i * 30, l, { size: 21, fill: C.cityText, weight: 500, anchor: "start" }); });
    const ny = footY + altLines.length * 30;
    g += text(24, ny, "※所要時間は目安です。時刻は季節・運航会社で変わります。", { size: 19, fill: C.cityText, anchor: "start", weight: 400 });
    g += text(W - 16, H - 10, "地図データ: Natural Earth / GSHHG", { size: 13, fill: "rgba(75,46,30,0.55)", anchor: "end", weight: 400 });
  } else {
    g += m;
    g += `<path d="M${fmt(box[0] + box[2])} ${fmt(box[1])}L${IX} ${IY}M${fmt(box[0] + box[2])} ${fmt(box[1] + box[3])}L${IX} ${IY + IH}" fill="none" stroke="${C.route}" stroke-width="1.2" stroke-opacity="0.7"/>`;
    g += insetSvg;
    const tw = Math.max(330, textW(summary, 14) + 40, route.alt ? textW(route.alt, 13.5) + 60 : 0);
    const th = route.alt ? 104 : 84;
    g += `<g id="title"><rect x="24" y="24" width="${fmt(tw)}" height="${th}" rx="4" fill="#fff" fill-opacity="0.95"/>` +
      text(44, 62, `${shortName}への行き方`, { size: 26, fill: C.cityText, weight: 700, anchor: "start" }) +
      text(44, 90, summary, { size: 14, fill: C.cityText, weight: 400, anchor: "start" }) +
      (route.alt ? text(44, 112, `※${route.alt}`, { size: 13, fill: C.cityText, weight: 400, anchor: "start" }) : "") + `</g>`;
    const lx = 24, ly = H - 170;
    g += `<g id="legend"><rect x="${lx}" y="${ly}" width="150" height="124" rx="4" fill="#fff" fill-opacity="0.95"/>` +
      legendItems.map(([lab, by], i) => `<path d="M${lx + 18} ${ly + 30 + i * 34}h44" fill="none" stroke="${C.route}" stroke-linecap="round" stroke-width="${sw(by, 2.2)}"${dash[by]}/>` +
        text(lx + 74, ly + 35 + i * 34, lab, { size: 15, fill: C.cityText, anchor: "start", weight: 500 })).join("") + `</g>`;
    g += text(W - 30, H - 18, note, { size: 13, fill: C.cityText, anchor: "end", weight: 400 });
    g += text(30, H - 18, "地図データ: Natural Earth / GSHHG", { size: 11, fill: "rgba(75,46,30,0.55)", anchor: "start", weight: 400 });
  }
  return svgDoc(W, H, g, { title: `${dest.name}への行き方` });
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
    fs.writeFileSync(path.join(OUT, `routes/${d.slug}-sp.svg`), renderRoute(d, countries, osm, true));
    console.log(`islands/${d.slug}.svg, routes/${d.slug}.svg`);
  }
}

main();
