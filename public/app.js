/* Plainproof client. Renders the home page, each dossier (/i/<key>) and the review desk (/review)
   into one document. Visual layer carried over unchanged from the claude.ai pilot. */
"use strict";
const WORLD = {"step":1.6,"lat0":76,"lon0":-179.2,"enc":"10.1.3.2.2.1.3.3.3.2.j.p.1e.4.h.d.f.2.o|10.1.4.1.f.1.j.n.1b.2.h.f.18|y.8.3.1.2.1.1.2.1.1.2.6.g.k.1b.3.8.2.1.1.3.u.7.1.o|0.1.d.1.k.2.3.7.5.3.2.b.b.k.1b.2.6.14.1.c.h.1|b.e.3.1.1.5.1.1.3.9.1.2.1.2.4.2.3.6.8.2.1.g.r.9.h.2.2.4.1.1i.1.1.4.4.2|0.2.7.w.4.3.3.1.1.4.2.2.3.2.1.4.8.d.u.g.2.2.2.e.1.1u|0.3.1.2.3.1.1.1d.6.8.5.c.b.1.i.d.1.3.2.h.1.1v|3.2.3.1e.1.2.3.7.9.7.b.6.f.7.2.6.1.2.1.2f|6.1.4.19.c.2.1.1.9.5.v.7.2.2q.1|9.19.a.4.e.4.u.7.3.2d.1.2.1.6.4|8.1.1.7.1.2.4.t.b.5.1b.8.3.1.3.26.4.4.8|e.2.b.r.a.6.1.2.10.1.6.2.2.3.4.22.b.2.b|d.1.f.s.8.9.z.2.7.1.1.3.3.21.b.4.b|a.1.k.u.3.b.y.3.6.1.7.1z.d.4.b|t.1.2.t.2.e.u.2.2.2.4.2b.1.1.8.3.c|x.t.1.f.s.2.1.4.2.2f.8.1.e|w.1.1.15.y.1.3.2f.1.1.n|y.1.1.x.1.2.4.3.v.2i.1.1.n|z.x.1.3.13.2g.2.1.n|z.14.11.j.2.1.2.6.4.1g.r|z.y.2.1.14.6.1.1.2.8.7.5.2.1h.4.2.m|z.x.13.7.5.3.2.6.8.5.2.1d.6.2.n|z.w.14.6.8.3.1.3.1.1.1.c.3.16.1.4.7.1.o|z.u.16.5.6.1.3.1.2.2.2.e.3.14.2.1.2.1.8.1.o|10.t.16.5.8.2.4.1.2.e.3.15.4.2.6.2.o|11.s.1c.6.g.1h.4.1.4.3.p|12.q.18.b.g.1h.7.1.1.1.r|13.o.18.e.d.1i.6.2.t|14.1.1.k.18.h.2.5.1.1.2.1j.10|14.1.1.c.1.2.3.2.18.11.1.19.10|15.1.1.9.9.1.17.12.2.17.11|16.1.1.8.9.1.16.u.1.9.4.13.12|16.1.2.7.1f.v.2.9.2.1.6.x.1.1.10|1a.5.1f.x.2.c.7.t.14|1b.5.b.1.12.y.1.d.6.b.3.a.1.1.17|1b.5.4.2.6.2.10.y.2.b.9.8.5.8.2.1.17|1c.5.1.3.9.5.v.y.2.a.a.7.6.8.1a|1e.7.19.z.2.7.c.6.8.8.8.1.10|1i.6.16.10.1.6.e.4.b.7.6.1.11|1k.4.16.11.1.2.h.4.b.7.8.1.z|1m.2.7.1.y.12.k.2.c.1.2.4.9.1.y|1n.1.5.6.1.1.u.15.g.2.c.1.3.2.9.2.y|1o.4.1.a.t.14.g.1.1.1.b.1.f.1.y|1s.c.t.13.i.2.q.2.x|1s.f.r.7.3.r.w.2.8.2.12|1s.g.12.o.v.1.1.2.7.2.13|1r.i.12.m.x.1.1.1.5.4.13|1q.j.11.m.y.3.4.5.2.2.2.1.w|1q.l.z.l.10.2.4.5.1.1.1.1.5.1.t|1r.m.y.j.12.2.3.4.2.2.9.2.p|1q.r.u.i.14.2.8.2.8.6.m|1q.t.t.h.15.1.8.1.b.5.1.2.i|1r.s.u.g.16.4.g.5.l|1r.s.u.g.1d.3.2.1.8.2.2.1.k|1s.q.v.h.1w.1.6.1.b|1s.p.w.h.1l.1.1.1.3.1.n|1t.n.w.i.5.1.1e.4.3.1.n|1t.n.w.i.4.2.1a.7.4.2.m|1v.l.w.h.3.4.19.a.2.3.k.1|1x.j.w.f.5.3.1a.f.l|1x.i.y.d.6.3.18.i.k|1x.i.y.e.5.3.16.l.a.1.8|1x.g.10.e.5.2.16.n.i|1w.f.13.c.6.2.16.o.h|1w.e.14.b.1e.p.h|1w.e.14.b.1f.o.h|1w.d.16.9.1g.o.h|1w.d.17.7.1i.n.h|1w.c.18.6.1j.6.5.c.h|1v.c.19.1.1o.2.a.a.i|1v.a.3f.6.f.1.3|1v.a.3f.6.g.1.2|1v.7.43.2.2|1u.8.42.1.1.1.2|1u.7.3m.2.e.2.4|1v.5.42.2.5|1u.4.43.2.6|1u.5.4a|1t.5.4b|1t.4.4c|1u.4.4.2.45|1u.4.4b|1x.1.1.1.49","countries":[["Afghanistan",33.82,65.93],["Åland",60.23,19.94],["Albania",41.13,20.05],["Algeria",28.06,2.63],["American Samoa",-14.3,-170.72],["Andorra",42.54,1.56],["Angola",-12.31,17.56],["Anguilla",18.22,-63.07],["Antigua and Barbuda",17.08,-61.79],["Argentina",-34.54,-64.75],["Armenia",40.29,44.94],["Aruba",12.52,-69.98],["Australia",-25.63,134.21],["Austria",47.59,14.11],["Azerbaijan",40.34,47.67],["Bahamas",24.7,-78.04],["Bahrain",26.04,50.54],["Bangladesh",23.89,90.23],["Barbados",13.18,-59.56],["Belarus",53.52,28.02],["Belgium",50.64,4.65],["Belize",17.19,-88.72],["Benin",9.64,2.33],["Bermuda",32.31,-64.76],["Bhutan",27.41,90.4],["Bolivia",-16.68,-64.7],["Bosnia and Herzegovina",44.17,17.77],["Botswana",-22.17,23.81],["Brazil",-10.69,-53.24],["British Virgin Islands",18.42,-64.62],["Brunei",4.49,114.59],["Bulgaria",42.77,25.21],["Burkina Faso",12.27,-1.76],["Burundi",-3.36,29.88],["Cabo Verde",15.08,-23.64],["Cambodia",12.72,104.91],["Cameroon",5.68,12.73],["Canada",58.59,-99],["Cayman Islands",19.32,-81.29],["Central African Republic",6.57,20.46],["Chad",15.28,18.64],["Chile",-34.36,-70.95],["China",36.76,103.35],["Colombia",3.9,-73.08],["Comoros",-11.65,43.34],["Congo",-0.84,15.22],["Cook Islands",-21.22,-159.79],["Costa Rica",9.98,-84.19],["Côte d'Ivoire",7.63,-5.57],["Croatia",45.16,16.42],["Cuba",21.63,-78.91],["Curaçao",12.2,-68.97],["Cyprus",34.92,33.01],["Czechia",49.74,15.32],["Denmark",56.23,9.35],["Djibouti",11.75,42.56],["Dominica",15.44,-61.36],["Dominican Republic",18.9,-70.51],["DR Congo",-2.87,23.64],["Ecuador",-1.44,-78.39],["Egypt",26.46,29.88],["El Salvador",13.74,-88.87],["Equatorial Guinea",1.57,10.47],["Eritrea",15.36,38.85],["Estonia",58.68,25.84],["eSwatini",-26.56,31.48],["Ethiopia",8.61,39.61],["Falkland Islands",-51.74,-58.76],["Faroe Islands",62.17,-6.88],["Fiji",-17.82,177.97],["Finland",64.26,26.21],["France",46.57,2.46],["French Polynesia",-17.66,-149.42],["Gabon",-0.59,11.79],["Gambia",13.45,-15.4],["Georgia",42.17,43.52],["Germany",51.03,10.35],["Ghana",7.95,-1.22],["Greece",39.46,22.57],["Greenland",73.08,-41.8],["Grenada",12.12,-61.68],["Guam",13.44,144.77],["Guatemala",15.69,-90.37],["Guernsey",49.47,-2.57],["Guinea",10.44,-10.93],["Guinea-Bissau",12.06,-14.92],["Guyana",4.79,-58.98],["Haiti",18.93,-72.68],["Honduras",14.83,-86.62],["Hong Kong",22.44,114.14],["Hungary",47.17,19.38],["Iceland",65,-18.58],["India",22.8,79.53],["Indonesia",-0.19,114.01],["Iran",32.53,54.44],["Iraq",33.01,43.77],["Ireland",53.16,-8.14],["Isle of Man",54.22,-4.54],["Israel",31.45,35],["Italy",43.49,12.3],["Jamaica",18.16,-77.31],["Japan",36.63,137.88],["Jersey",49.22,-2.13],["Jordan",31.24,36.76],["Kazakhstan",48.36,67.25],["Kenya",0.6,37.8],["Kiribati",1.85,-157.37],["Kosovo",42.57,20.87],["Kuwait",29.32,47.56],["Kyrgyzstan",41.47,74.51],["Laos",18.49,103.78],["Latvia",56.86,24.92],["Lebanon",33.92,35.88],["Lesotho",-29.58,28.23],["Liberia",6.45,-9.32],["Libya",27.02,18.07],["Liechtenstein",47.14,9.54],["Lithuania",55.32,23.9],["Luxembourg",49.77,6.07],["Macao",22.22,113.51],["Macedonia",41.6,21.68],["Madagascar",-19.32,46.74],["Malawi",-13.21,34.28],["Malaysia",3.62,114.72],["Maldives",4.2,73.5],["Mali",17.32,-3.59],["Malta",35.89,14.44],["Marshall Islands",7.11,171.19],["Mauritania",20.22,-10.37],["Mauritius",-20.28,57.57],["Mexico",23.92,-102.15],["Micronesia",6.89,158.23],["Moldova",47.19,28.47],["Monaco",43.75,7.41],["Mongolia",46.96,103.12],["Montenegro",42.79,19.24],["Montserrat",16.74,-62.19],["Morocco",29.77,-8.73],["Mozambique",-17.2,35.6],["Myanmar",21.15,96.49],["Namibia",-22.07,17.2],["Nauru",-0.52,166.93],["Nepal",28.26,83.95],["Netherlands",52.28,5.63],["New Caledonia",-21.32,165.48],["New Zealand",-43.95,170.61],["Nicaragua",12.85,-85.03],["Niger",17.41,9.33],["Nigeria",9.59,8.08],["Niue",-19.05,-169.87],["Norfolk Island",-29.05,167.95],["North Korea",40.14,127.16],["Northern Cyprus",35.26,33.57],["Northern Mariana Islands",15.18,145.74],["Norway",63.79,12.16],["Oman",20.56,56.06],["Pakistan",29.88,69.17],["Palau",7.51,134.58],["Palestine",31.95,35.25],["Panama",8.53,-80.11],["Papua New Guinea",-6.6,144.23],["Paraguay",-23.21,-58.44],["Peru",-9.11,-74.42],["Philippines",15.95,121.42],["Poland",52.11,19.42],["Portugal",39.65,-7.98],["Puerto Rico",18.23,-66.48],["Qatar",25.3,51.18],["Romania",45.85,24.98],["Russia",65.89,95.53],["Rwanda",-1.99,29.92],["Saint Helena",-15.96,-5.72],["Saint Kitts and Nevis",17.33,-62.75],["Saint Lucia",13.89,-60.97],["Saint Pierre and Miquelon",46.94,-56.33],["Saint Vincent and the Grenadines",13.25,-61.2],["Samoa",-13.63,-172.44],["San Marino",43.94,12.46],["São Tomé and Principe",0.24,6.61],["Saudi Arabia",24.09,44.67],["Senegal",14.36,-14.47],["Serbia",44.21,20.81],["Seychelles",-4.66,55.48],["Sierra Leone",8.57,-11.79],["Singapore",1.36,103.82],["Sint Maarten",18.05,-63.06],["Slovakia",48.71,19.47],["Slovenia",46.12,14.8],["Solomon Islands",-9.62,160.17],["Somalia",4.74,45.68],["Somaliland",9.74,46.25],["South Africa",-28.97,25.19],["South Korea",36.45,127.87],["South Sudan",7.31,30.25],["Spain",40.37,-3.57],["Sri Lanka",7.61,80.7],["St-Barthélemy",17.9,-62.84],["St-Martin",18.09,-63.06],["Sudan",15.97,29.91],["Suriname",4.13,-55.91],["Sweden",62.43,16.25],["Switzerland",46.8,8.21],["Syria",35.02,38.49],["Taiwan",23.75,120.96],["Tajikistan",38.53,71.03],["Tanzania",-6.27,34.79],["Thailand",15.1,101],["Timor-Leste",-8.81,125.92],["Togo",8.52,0.96],["Tonga",-21.17,-175.22],["Trinidad and Tobago",10.42,-61.29],["Tunisia",34.09,9.55],["Turkey",39.06,35.41],["Turkmenistan",39.13,59.45],["Turks and Caicos Islands",21.81,-71.74],["U.S. Virgin Islands",17.74,-64.77],["Uganda",1.27,32.37],["Ukraine",49.2,31.32],["United Arab Emirates",23.9,54.3],["United Kingdom",53.83,-2.41],["United States",39.89,-98.82],["Uruguay",-32.79,-56.03],["Uzbekistan",41.78,63.29],["Vanuatu",-15.23,166.85],["Vatican",41.9,12.43],["Venezuela",7.12,-66.18],["Vietnam",16.55,106.35],["Wallis and Futuna",-14.29,-178.13],["Western Sahara",24.21,-12.27],["Yemen",15.94,47.52],["Zambia",-13.46,27.81],["Zimbabwe",-19,29.85]]};
const COUNTRY = new Map(WORLD.countries.map(c => [c[0], [c[1], c[2]]]));
const TYPES = [["official","Official data"],["news","Newspapers"],["tv","Television"],["portal","Portals"],["ngo","NGOs & intl."]];
const STAGES = ["received","researching","verifying","published"];
const STAGE_TXT = {received:"Received — research starts in a moment",researching:"Researching sources",verifying:"Three verifiers are checking the claims",review:"Held for a manual check before publishing",published:"Published",rejected:"Not published — the record could not support a dossier",failed:"Research could not finish; the editor can retry it"};
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "#";
const hashStr = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"}); } catch { return d || ""; } };
const whereOf = d => [d.place, d.country].filter(Boolean).join(", ") || d.municipality || "";
const issueHue = key => [195, 158, 28, 350, 262, 205, 42, 128][hashStr(key) % 8];

/* ---------- tokens for canvas ---------- */
let TOK = {};
function readTokens(){ const cs = getComputedStyle(document.documentElement); for (const k of ["ink","muted","line","contour","contour-strong","sea","amber","bg","issue","c-official","c-news","c-tv","c-portal","c-ngo"]) TOK[k] = cs.getPropertyValue("--"+k).trim(); }
readTokens();

/* ---------- noise + living contour terrain ---------- */
function makeNoise(seed){
  const perm = [...Array(256).keys()]; let s = (seed >>> 0) || 1;
  for (let i = 255; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const p = new Uint8Array(512); for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const f = t => t * t * (3 - 2 * t), L = (a, b, t) => a + (b - a) * t;
  const v = (x, y, z) => p[(p[(p[x & 255] + y) & 255] + z) & 255] / 255;
  return (x, y, z) => { const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), fx = f(x - X), fy = f(y - Y), fz = f(z - Z);
    return L(L(L(v(X,Y,Z), v(X+1,Y,Z), fx), L(v(X,Y+1,Z), v(X+1,Y+1,Z), fx), fy), L(L(v(X,Y,Z+1), v(X+1,Y,Z+1), fx), L(v(X,Y+1,Z+1), v(X+1,Y+1,Z+1), fx), fy), fz); };
}
function terrain(canvas, {seed = 7, accent = "amber", levels = 13, speed = 1} = {}){
  const ctx = canvas.getContext("2d"), n = makeNoise(seed);
  let w = 0, h = 0, dpr = 1, t = 0, raf = 0, visible = true, mouse = null, lift = 0;
  const cs = 11;
  function size(){ dpr = Math.min(2, devicePixelRatio || 1); const r = canvas.getBoundingClientRect(); w = r.width; h = r.height; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
  function draw(){
    if (!w) return; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / cs) + 1, rows = Math.ceil(h / cs) + 1, g = new Float32Array(cols * rows);
    lift += ((mouse ? 1 : 0) - lift) * 0.06;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = i * cs, y = j * cs;
      let v = 0.62 * n(x * 0.0055, y * 0.0055, t) + 0.38 * n(x * 0.014 + 40, y * 0.014, t * 1.4);
      if (mouse && lift > 0.01) { const dx = x - mouse.x, dy = y - mouse.y; v += 0.28 * lift * Math.exp(-(dx*dx + dy*dy) / 16000); }
      g[j * cols + i] = v;
    }
    for (let k = 0; k < levels; k++) {
      const Lv = 0.2 + k * 0.05, major = k % 4 === 2;
      ctx.beginPath();
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = g[j*cols+i], b = g[j*cols+i+1], c = g[(j+1)*cols+i+1], d = g[(j+1)*cols+i];
        const idx = (a > Lv) << 3 | (b > Lv) << 2 | (c > Lv) << 1 | (d > Lv);
        if (idx === 0 || idx === 15) continue;
        const x = i * cs, y = j * cs;
        const T = [x + cs * (Lv - a) / (b - a), y], R = [x + cs, y + cs * (Lv - b) / (c - b)], B = [x + cs * (Lv - d) / (c - d), y + cs], Lf = [x, y + cs * (Lv - a) / (d - a)];
        const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
        switch (idx) { case 1: case 14: seg(Lf, B); break; case 2: case 13: seg(B, R); break; case 3: case 12: seg(Lf, R); break; case 4: case 11: seg(T, R); break;
          case 5: seg(T, Lf); seg(B, R); break; case 6: case 9: seg(T, B); break; case 7: case 8: seg(T, Lf); break; case 10: seg(T, R); seg(Lf, B); break; }
      }
      ctx.strokeStyle = k === levels - 2 ? TOK[accent] : major ? TOK["contour-strong"] : TOK.contour;
      ctx.lineWidth = k === levels - 2 ? 1.6 : major ? 1.2 : 0.9;
      ctx.stroke();
    }
  }
  let last = 0;
  function loop(ts){ raf = requestAnimationFrame(loop); if (!visible || document.hidden) return; if (ts - last < 33) return; last = ts; t += 0.0045 * speed; draw(); }
  size(); draw();
  new ResizeObserver(() => { size(); draw(); }).observe(canvas);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);
  const host = canvas.parentElement;
  host.addEventListener("pointermove", e => { const r = canvas.getBoundingClientRect(); mouse = {x: e.clientX - r.left, y: e.clientY - r.top}; });
  host.addEventListener("pointerleave", () => { mouse = null; });
  if (!reduced) raf = requestAnimationFrame(loop);
  return { stop(){ cancelAnimationFrame(raf); }, redraw: draw };
}

/* ---------- world dot map ---------- */
const S = { published: new Map(), full: new Map(), mine: [], status: new Map(), admin: [], token: "", loaded: false };
const map = (() => {
  const cv = $("#map"), ctx = cv.getContext("2d"), tip = $("#mapTip");
  const EE = (lon, lat) => { const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2;
    const l = lon * Math.PI / 180, th = Math.asin(M * Math.sin(lat * Math.PI / 180)), t2 = th * th, t6 = t2 * t2 * t2;
    return [l * Math.cos(th) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), -th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))]; };
  const dots = [];
  WORLD.enc.split("|").forEach((row, ri) => { const lat = WORLD.lat0 - ri * WORLD.step; let lon = WORLD.lon0, land = 0;
    row.split(".").forEach(s => { const n = parseInt(s, 36); if (land) for (let k = 0; k < n; k++) dots.push({lon: lon + k * WORLD.step, lat}); lon += n * WORLD.step; land ^= 1; }); });
  dots.forEach(d => { [d.px, d.py] = EE(d.lon, d.lat); d.ph = Math.random() * 6.28; });
  const bx = [Math.min(...dots.map(d => d.px)), Math.max(...dots.map(d => d.px))], by = [Math.min(...dots.map(d => d.py)), Math.max(...dots.map(d => d.py))];
  let w, h, dpr, sc, ox, oy, pins = [], hover = null, mouse = null, t0 = performance.now(), visible = true;
  const P = (lon, lat) => { const [x, y] = EE(lon, lat); return [ox + (x - bx[0]) * sc, oy + (y - by[0]) * sc]; };
  function size(){ dpr = Math.min(2, devicePixelRatio || 1); const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr;
    const pad = 6; sc = Math.min((w - 2 * pad) / (bx[1] - bx[0]), (h - 2 * pad) / (by[1] - by[0])); ox = (w - (bx[1] - bx[0]) * sc) / 2; oy = (h - (by[1] - by[0]) * sc) / 2;
    dots.forEach(d => { d.x = ox + (d.px - bx[0]) * sc; d.y = oy + (d.py - by[0]) * sc; }); }
  function near(){ dots.forEach(d => { d.pin = 0; for (const p of pins) { const dd = Math.hypot((d.lon - p.lon) * Math.cos(d.lat * Math.PI / 180), d.lat - p.lat); if (dd < 7) d.pin = Math.max(d.pin, 1 - dd / 7); } }); }
  function draw(now){
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const el = (now - t0) / 1000, reveal = reduced ? 1e9 : el * 140, sweep = ((el * 22) % 420) - 210, ds = Math.max(1.1, sc * 0.0185);
    for (const d of dots) {
      const dist = Math.hypot(d.lon - 19.3, d.lat - 42.8); if (dist > reveal) continue;
      let a = 0.28 + 0.07 * Math.sin(el * 1.3 + d.ph);
      if (!reduced) { const s = Math.abs(d.lon - sweep); if (s < 14) a += (1 - s / 14) * 0.45; }
      if (mouse) { const m = Math.hypot(d.x - mouse.x, d.y - mouse.y); if (m < 70) a += (1 - m / 70) * 0.6; }
      const fresh = reveal - dist; if (fresh < 18) a += (1 - fresh / 18) * 0.7;
      ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = d.pin > 0 ? TOK.sea : TOK.muted;
      if (d.pin > 0) ctx.globalAlpha = Math.min(1, a + d.pin * 0.6);
      ctx.fillRect(d.x - ds / 2, d.y - ds / 2, ds, ds);
    }
    ctx.globalAlpha = 1;
    pins.forEach((p, i) => {
      const [x, y] = P(p.lon, p.lat); p.x = x; p.y = y;
      const ph = ((now / 1000) + i * .37) % 2.2 / 2.2, col = p.kind === "pub" ? TOK.sea : TOK.amber;
      if (!reduced) { ctx.strokeStyle = col; ctx.globalAlpha = 1 - ph; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 5 + ph * 20, 0, 7); ctx.stroke(); }
      ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, hover === p ? 7 : 5, 0, 7); ctx.fill(); ctx.strokeStyle = TOK.bg; ctx.lineWidth = 2; ctx.stroke();
    });
  }
  let last = 0;
  function loop(now){ requestAnimationFrame(loop); if (document.hidden || !visible || now - last < 33) return; last = now; draw(now); }
  function setPins(list){
    const seen = {}; pins = list.map(p => { let lat = +p.lat, lon = +p.lon;
      if (!isFinite(lat) || !isFinite(lon) || (p.lat == null)) { const c = COUNTRY.get(p.country); if (!c) return null; [lat, lon] = c; }
      const k = lat.toFixed(1) + lon.toFixed(1), i = seen[k] = (seen[k] || 0) + 1, r = i > 1 ? 0.9 * Math.sqrt(i) : 0;
      return {...p, lat: lat + Math.sin(i * 2.4) * r, lon: lon + Math.cos(i * 2.4) * r}; }).filter(Boolean);
    near(); if (reduced) draw(performance.now());
  }
  cv.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mouse = {x: e.clientX - r.left, y: e.clientY - r.top};
    hover = pins.find(p => Math.hypot(p.x - mouse.x, p.y - mouse.y) < 12) || null;
    tip.textContent = hover ? hover.title : ""; tip.classList.toggle("on", !!hover); tip.style.left = mouse.x + "px"; tip.style.top = mouse.y + "px";
    cv.style.cursor = hover ? "pointer" : "crosshair"; if (reduced) draw(performance.now()); });
  cv.addEventListener("pointerleave", () => { tip.classList.remove("on"); hover = null; mouse = null; if (reduced) draw(performance.now()); });
  cv.addEventListener("click", () => { if (hover && hover.key) go("/i/" + hover.key); });
  size(); new ResizeObserver(() => { size(); if (reduced) draw(performance.now()); }).observe(cv);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);
  if (reduced) draw(performance.now()); else requestAnimationFrame(loop);
  return { setPins };
})();

/* ---------- server ---------- */
const api = async (path, opts = {}) => {
  const headers = { ...(opts.body instanceof FormData ? {} : { "content-type": "application/json" }), ...(S.token ? { authorization: "Bearer " + S.token } : {}) };
  const res = await fetch(path, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.error || res.statusText), { status: res.status });
  return body;
};
const store = {
  get(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
S.mine = store.get("pp-mine", []);
S.token = store.get("pp-editor", "");
// On a dossier's own address (name.plainproof.me) the page names the dossier; every other
// link leads back to the main site.
const meta = n => document.querySelector(`meta[name="${n}"]`)?.content || "";
const PIN_KEY = meta("pp-key"), HOME = meta("pp-home"), ROOT = meta("pp-root") || "plainproof.me";

/* ---------- home rendering ---------- */
const cSel = $("#fCountry");
cSel.innerHTML = '<option value="">Choose…</option>' + WORLD.countries.map(c => `<option>${esc(c[0])}</option>`).join("");

function countUp(el, to){ const from = +el.dataset.count || 0; el.dataset.count = to; if (reduced || from === to) { el.textContent = to; return; }
  const t0 = performance.now(); const step = now => { const p = Math.min(1, (now - t0) / 900); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }

let cardsSig = "";
function renderHome(){
  const pubs = [...S.published.values()];
  countUp($("#stIssues"), pubs.length);
  countUp($("#stClaims"), pubs.reduce((s, d) => s + (d.claimCount || 0), 0));
  countUp($("#stSources"), pubs.reduce((s, d) => s + (d.sourceCount || 0), 0));
  const countries = new Set(pubs.map(d => d.country).filter(Boolean));
  countUp($("#stMun"), countries.size);
  $("#mapTag").textContent = `${pubs.length} verified issue${pubs.length === 1 ? "" : "s"} · ${countries.size} countr${countries.size === 1 ? "y" : "ies"}`;
  map.setPins(pubs.map(d => ({ key: d.key, country: d.country, lat: d.lat, lon: d.lon, title: whereOf(d) + " · " + (d.headline || d.title), kind: "pub" })));
  const box = $("#cards"), sig = pubs.map(d => d.key + d.publishedAt).join("|") + S.loaded;
  if (sig === cardsSig) return; cardsSig = sig;
  if (!pubs.length) {
    box.innerHTML = `<div class="empty" style="grid-column:1/-1"><h3>${S.loaded ? "No dossiers published yet" : "Loading…"}</h3><p>Verified issues appear here when research and verification finish. Each one opens as its own page with the claims, numbers, timeline and sources.</p><a class="btn sm ghost" href="/#report">Report the first issue</a></div>`;
    return;
  }
  box.innerHTML = pubs.map(d => `<a class="card" href="/i/${esc(d.key)}" style="--ih:${issueHue(d.key)}">
    <div class="label">${esc(whereOf(d))} · ${esc(d.category)}</div>
    <h3>${esc(d.headline || d.title)}</h3>
    <p class="sum">${esc(d.summary)}</p>
    <div class="meta"><span class="label">${d.claimCount} points · ${d.sourceCount} sources</span><span class="go" aria-hidden="true">›</span></div></a>`).join("");
  reveal(box);
}

/* ---------- my reports (remembered in this browser) ---------- */
const stageOf = key => S.status.get(key) || "received";
function renderMine(){
  const box = $("#mine");
  if (!S.mine.length) { box.innerHTML = `<div class="track"><span class="t">Nothing submitted yet</span><span class="label">After you submit, you can follow each report here: received, researching, verification, published. This browser remembers them.</span></div>`; return; }
  box.innerHTML = S.mine.slice().reverse().map(it => { const st = stageOf(it.key), si = STAGES.indexOf(st);
    const bars = STAGES.map((s, i) => `<i class="${st === "rejected" || st === "failed" ? "" : i < si ? "on" : i === si ? (st === "published" ? "on" : "now") : st === "review" && i < 3 ? "on" : ""}"></i>`).join("");
    return `<div class="track"><span class="t">${esc(it.title)}</span><span class="label">${esc(whereOf(it))} · ${fmtDate(it.createdAt)}</span>
      <div class="stages" aria-hidden="true">${bars}</div><span style="font-size:14px">${esc(STAGE_TXT[st] || st)}</span>
      ${st === "published" ? `<a class="btn sm sea" href="/i/${esc(it.key)}">Open the dossier</a>` : ""}</div>`; }).join("");
}
async function refreshMine(){
  if (!S.mine.length) return renderMine();
  try { (await api("/api/reports/status?keys=" + S.mine.map(m => encodeURIComponent(m.key)).join(","))).forEach(r => S.status.set(r.key, r.stage)); } catch {}
  renderMine();
}

/* ---------- form ---------- */
/** Phone photos are large; scale them to 1800 px so three fit in the 4 MB limit. */
async function shrinkImage(file){
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 900 * 1024) return file;
  try {
    const img = await createImageBitmap(file), k = Math.min(1, 1800 / Math.max(img.width, img.height));
    const c = Object.assign(document.createElement("canvas"), { width: Math.round(img.width * k), height: Math.round(img.height * k) });
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(res => c.toBlob(res, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }) : file;
  } catch { return file; }
}
$("#fFiles").addEventListener("change", e => {
  const fs = [...e.target.files], kb = fs.reduce((n, f) => n + f.size, 0) / 1024;
  $("#fFilesInfo").textContent = fs.length ? `${fs.length} file${fs.length > 1 ? "s" : ""} · ${kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : Math.round(kb) + " KB"} · photos are reduced before sending` : "The research reads them to know what to look for. They are not published.";
});
const fText = $("#fText");
fText.addEventListener("input", () => { $("#fCount").textContent = `${fText.value.length} / 1200`; });
function formMsg(t, err){ const m = $("#fMsg"); m.hidden = !t; m.textContent = t || ""; m.classList.toggle("err", !!err); }
$("#rf").addEventListener("submit", async e => {
  e.preventDefault();
  const r = { title: $("#fTitle").value.trim(), country: cSel.value, place: $("#fPlace").value.trim(), category: $("#fCat").value,
    text: fText.value.trim(), since: $("#fSince").value.trim(), website: $("#fWebsite").value };
  if (r.title.length < 6) return formMsg("Add a one-line title of at least a few words.", true);
  if (!r.country) return formMsg("Choose the country where this is happening.", true);
  if (r.place.length < 2) return formMsg("Name the town, city or area so the research can find local sources.", true);
  if (r.text.length < 40) return formMsg("Describe the problem in at least two sentences (40 characters or more), so there is something to check.", true);
  const files = [...$("#fFiles").files];
  if (files.length > 3) return formMsg("Attach at most 3 files.", true);
  const btn = $("#fSubmit"); btn.disabled = true; formMsg(files.length ? "Preparing files…" : "Sending…");
  try {
    const fd = new FormData();
    Object.entries(r).forEach(([k, v]) => fd.append(k, v));
    for (const f of files) fd.append("files", await shrinkImage(f), f.name);
    if (files.length && [...fd.getAll("files")].reduce((n, f) => n + f.size, 0) > 4 * 1024 * 1024) {
      btn.disabled = false; return formMsg("Attachments can be 4 MB in total. Leave out a file or send a smaller one.", true);
    }
    formMsg("Sending…");
    const saved = await api("/api/reports", { method: "POST", body: fd });
    if (saved.title) { S.mine.push(saved); store.set("pp-mine", S.mine.slice(-20)); S.status.set(saved.key, "received"); }
    $("#rf").reset(); $("#fCount").textContent = "0 / 1200"; $("#fFiles").dispatchEvent(new Event("change"));
    formMsg("Received. Research has started; follow its progress here. It usually takes 10 to 20 minutes.");
    renderMine(); pollMine();
  } catch (err) {
    formMsg(err.message && err.status < 500 ? err.message : "The report could not be saved right now. Try again in a minute.", true);
  }
  btn.disabled = false;
});

/* ---------- dossier mini-site ---------- */
let issueStops = [];
function niceStep(raw){ const p = Math.pow(10, Math.floor(Math.log10(raw || 1))), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function chartSVG(f){
  const pts = (f.points || []).filter(p => isFinite(+p.value)); if (!pts.length) return "";
  const W = 600, H = 260, ml = 52, mr = 18, mt = 22, mb = 46, iw = W - ml - mr, ih = H - mt - mb;
  const refV = f.reference && isFinite(+f.reference.value) ? +f.reference.value : null;
  const maxV = Math.max(...pts.map(p => +p.value), refV ?? 0, 0) || 1, step = niceStep(maxV / 4), top = Math.ceil(maxV / step) * step;
  const y = v => mt + ih - (v / top) * ih, n = pts.length, bw = iw / n;
  const every = Math.ceil(n / 8);
  let g = "";
  for (let v = 0; v <= top + 1e-9; v += step) g += `<line x1="${ml}" x2="${W - mr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${ml - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="Inter,system-ui,sans-serif">${+v.toFixed(2)}</text>`;
  const xl = pts.map((p, i) => i % every === 0 || i === n - 1 ? `<text x="${ml + bw * i + bw / 2}" y="${H - mb + 18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="Inter,system-ui,sans-serif">${esc(String(p.label).slice(0, 12))}</text>` : "").join("");
  let marks = "";
  if (f.kind === "line") {
    const xy = pts.map((p, i) => [ml + bw * i + bw / 2, y(+p.value)]);
    const d = xy.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + "," + q[1].toFixed(1)).join("");
    const len = Math.round(xy.reduce((s, q, i) => i ? s + Math.hypot(q[0] - xy[i-1][0], q[1] - xy[i-1][1]) : 0, 0)) + 5;
    marks = `<path d="${d}L${xy[n-1][0]},${y(0)}L${xy[0][0]},${y(0)}Z" fill="var(--issue)" opacity=".12"/><path class="chartLine" style="--len:${len}" d="${d}" fill="none" stroke="var(--issue)" stroke-width="2.6" stroke-linejoin="round"/>` +
      xy.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="${i === n - 1 ? 5 : 2.6}" fill="var(--issue)"/>`).join("") +
      `<text x="${Math.min(xy[n-1][0], W - mr - 4)}" y="${xy[n-1][1] - 11}" text-anchor="end" font-size="13" font-weight="700" fill="var(--ink)" font-family="Inter,system-ui,sans-serif">${esc(pts[n-1].value)} ${esc(f.unit || "")}</text>`;
  } else {
    marks = pts.map((p, i) => { const v = +p.value, bx = ml + bw * i + bw * .19, bwid = bw * .62, over = refV !== null && v > refV;
      return `<rect class="bar" rx="6" style="transition-delay:${i * 70}ms" x="${bx.toFixed(1)}" y="${y(v).toFixed(1)}" width="${bwid.toFixed(1)}" height="${(y(0) - y(v)).toFixed(1)}" fill="${over ? "var(--bad)" : "var(--issue)"}"><title>${esc(p.label)}: ${esc(p.value)} ${esc(f.unit || "")}</title></rect>` +
        (n <= 12 ? `<text x="${(bx + bwid / 2).toFixed(1)}" y="${(y(v) - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)" font-family="Inter,system-ui,sans-serif">${esc(p.value)}</text>` : ""); }).join("");
  }
  const ref = refV !== null ? `<line x1="${ml}" x2="${W - mr}" y1="${y(refV)}" y2="${y(refV)}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${W - mr}" y="${y(refV) - 6}" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--bad)" font-family="Inter,system-ui,sans-serif">${esc(f.reference.label || "")}</text>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(f.title)}">${g}${marks}${ref}<line x1="${ml}" x2="${W - mr}" y1="${y(0)}" y2="${y(0)}" stroke="var(--ink)" stroke-width="1.2"/>${xl}</svg>`;
}
function buildQuote(text, phrases){
  const spans = [];
  (phrases || []).forEach(ph => { const i = text.toLowerCase().indexOf(String(ph.text || "").toLowerCase()); if (i >= 0 && ph.text) spans.push({s: i, e: i + ph.text.length, claimId: ph.claimId}); });
  spans.sort((a, b) => a.s - b.s);
  let out = "", pos = 0; const used = [];
  spans.forEach(sp => { if (sp.s < pos) return; out += esc(text.slice(pos, sp.s)); out += `<mark tabindex="0" data-claim="${esc(sp.claimId)}">${esc(text.slice(sp.s, sp.e))}<sup>${esc(sp.claimId)}</sup></mark>`; pos = sp.e; used.push(sp); });
  return out + esc(text.slice(pos));
}

function renderIssue(key, d){
  issueStops.forEach(f => f()); issueStops = [];
  const v = $("#vIssue");
  if (!d) {
    v.innerHTML = `<section class="band"><div class="wrap"><div class="empty"><h3>${d === null ? "This dossier isn't public" : "Loading the dossier…"}</h3><p>${d === null ? "It may still be in research, or it was withdrawn. Published dossiers are listed on the front page." : ""}</p><a class="btn sm ghost" href="/#issues">All verified issues</a></div></div></section>`;
    return;
  }
  const draft = d.stage !== "published", pub = draft ? null : d;
  v.style.setProperty("--ih", issueHue(key));
  const src = new Map((d.sources || []).map(s => [s.id, s]));
  const cites = {}; (d.claims || []).forEach(c => (c.sourceIds || []).forEach(id => cites[id] = (cites[id] || 0) + 1));
  (d.figures || []).forEach(f => f.sourceId && (cites[f.sourceId] = (cites[f.sourceId] || 0) + 1));
  const sref = ids => (ids || []).filter(id => src.has(id)).map(id => `<a class="sref" href="#src-${esc(id)}" data-src="${esc(id)}">${esc(id)}</a>`).join("");
  v.innerHTML = `
  ${draft ? `<div class="draft"><div class="wrap"><span>Draft · held for review${d.reason ? " (" + esc(d.reason) + ")" : ""} · visible only to the editor</span><span style="display:flex;gap:8px"><button class="btn sm ghost" style="border-color:var(--bg);color:var(--bg)" data-act="reject" data-key="${esc(key)}">Reject</button><button class="btn sm" style="background:var(--bg);color:var(--ink);border-color:var(--bg)" data-act="publish" data-key="${esc(key)}">Publish</button></span></div></div>` : ""}
  <section class="hero"><canvas class="terrain" id="dzTerrain" aria-hidden="true"></canvas><div class="wrap">
    <div>
      <div class="crumb"><a class="label" href="/#issues">← All issues</a><span class="chip" style="color:var(--issue)">${esc(whereOf(d))}</span><span class="chip" style="color:var(--muted)">${esc(d.category)}</span>${d.subdomain && !PIN_KEY ? `<a class="chip" style="color:var(--sea);text-decoration:none" href="https://${esc(d.subdomain)}.${esc(ROOT)}">${esc(d.subdomain)}.${esc(ROOT)} ↗</a>` : ""}</div>
      <h1>${esc(d.headline || d.title)}</h1>
      <p class="sum">${esc(d.summary)}</p>
      <p class="label" style="margin-top:18px">Reported ${fmtDate(d.submittedAt)} · researched ${fmtDate((d.method || {}).researchedAt || d.researchedAt)}${pub ? " · published " + fmtDate(pub.publishedAt) : ""}</p>
    </div>
    <div class="facts">${[[(d.sources||[]).length, "sources"], [(d.figures||[]).length, "data series"], [(d.timeline||[]).length, "dated events"]].filter(f => f[0]).map(f => `<div><b data-count="0" data-to="${f[0]}">0</b><span class="label">${f[1]}</span></div>`).join("")}</div>
  </div></section>

  <div id="ownSlot"></div>
  <section class="band"><div class="wrap">
    <div class="shead"><h2>Your words, and the record</h2><p>Highlighted phrases are what the reporter said. Hover or tap one to see what the sources show about it.</p></div>
    <div class="xwrap" id="xwrap"><svg class="links" id="links" aria-hidden="true"></svg>
      <div class="words"><span class="label">The report, as submitted${d.language && !/^english$/i.test(d.language) ? " in " + esc(d.language) : ""}</span><blockquote class="quote" id="quote">${buildQuote(d.citizenText || "", d.phrases)}</blockquote>
        ${d.citizenTextEn ? `<p class="label" style="margin-top:16px">English translation</p><p style="margin-top:6px;color:var(--muted);font-size:16px;max-width:60ch">${esc(d.citizenTextEn)}</p>` : ""}</div>
      <div class="claims">${(d.claims || []).map(c => `<article class="claim" id="cl-${esc(c.id)}" data-claim="${esc(c.id)}">
        <div class="ch"><span class="q"><span class="mono" style="color:var(--muted);font-weight:500">${esc(c.id)} </span>${esc(c.claim)}</span></div>
        <p class="ex">${esc(c.explanation)}</p>
        <div class="foot"><div class="srcs">${sref(c.sourceIds)}</div></div>
      </article>`).join("")}</div>
    </div>
  </div></section>

  ${(d.figures || []).length ? `<section class="band dark"><div class="wrap">
    <div class="shead"><h2>The numbers</h2><p>Data series taken from the cited sources. Values above an official limit are marked in red.</p></div>
    <div class="figs">${d.figures.map(f => `<div class="fig"><span class="label">${esc(f.unit)}</span><h3>${esc(f.title)}</h3><div class="svgbox">${chartSVG(f)}</div><p class="note">${esc(f.note)} ${f.sourceId && src.has(f.sourceId) ? sref([f.sourceId]) : ""}</p></div>`).join("")}</div>
  </div></section>` : ""}

  ${(d.timeline || []).length ? `<section class="band"><div class="wrap"><div class="shead"><h2>How it got here</h2></div>
    <div class="tl">${d.timeline.map(e => `<div class="ev"><span class="d">${esc(e.date)}</span><div>${esc(e.event)} ${sref([e.sourceId])}</div></div>`).join("")}</div></div></section>` : ""}

  ${(d.responsible || []).length ? `<section class="band" style="padding-top:0"><div class="wrap"><div class="shead"><h2>Who can fix it</h2><p>Institutions with legal responsibility for this issue, as named in the sources.</p></div>
    <div class="resp">${d.responsible.map(r => `<div><b>${esc(r.name)}</b><span>${esc(r.role)}</span></div>`).join("")}</div></div></section>` : ""}

  <section class="band" style="background:var(--surface)"><div class="wrap">
    <div class="shead"><h2>Where this comes from</h2><p>Every source the dossier cites. Larger points are cited by more claims.</p></div>
    <div class="constel"><div><canvas id="constel" aria-label="Sources grouped by type"></canvas>
      <div class="legend">${TYPES.map(([t, l]) => `<span style="color:var(--c-${t})"><i></i><b style="color:var(--muted);font-weight:500">${l}</b></span>`).join("")}</div></div>
      <div class="slist" id="slist">${(d.sources || []).map(s => `<a id="src-${esc(s.id)}" data-src="${esc(s.id)}" href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer"><span class="id">${esc(s.id)}</span><span style="min-width:0"><span class="tt">${esc(s.title)}</span><br><span class="ot">${esc(s.outlet)} · ${esc(TYPES.find(t => t[0] === s.type)?.[1] || s.type)}${s.date ? " · " + esc(s.date) : ""}</span></span></a>`).join("")}</div>
    </div>
  </div></section>

  <section class="band"><div class="wrap method"><span class="label">Method</span>
    <p>${esc((d.method || {}).notes || "")}${(d.method || {}).attachments ? ` The reporter attached ${d.method.attachments} file${d.method.attachments > 1 ? "s" : ""}; they guided the research and are not published.` : ""}</p>
    <p>Every source on this page was found by the research and re-read by three independent verifiers before publication. Follow the links and judge for yourself.</p>
  </div></section>`;

  const tr = terrain($("#dzTerrain"), {seed: hashStr(key), accent: "issue", levels: 13, speed: .8}); issueStops.push(tr.stop);
  requestAnimationFrame(() => setTimeout(() => {
    v.querySelectorAll(".facts b[data-to]").forEach(b => countUp(b, +b.dataset.to));
  }, 120));
  wireLinks();
  issueStops.push(constellation($("#constel"), d, cites));
  renderOwnAddress(key, d);
  reveal(v);
}

/* ---------- own address (name.plainproof.me), paid through Paddle ---------- */
let paddleCfg = null;
const suggestName = key => key.replace(/-[0-9a-f]{6}$/, "").slice(0, 40).replace(/-+$/, "");
async function renderOwnAddress(key, d){
  const slot = $("#ownSlot"); if (!slot) return;
  const mine = S.mine.some(m => m.key === key), editor = !!S.token;
  if (PIN_KEY || d.stage !== "published" || d.subdomain || !(mine || editor)) return;
  try { paddleCfg = paddleCfg || await api("/api/paddle"); } catch { paddleCfg = { enabled: false }; }
  if (!paddleCfg.enabled && !editor) return;
  const paid = paddleCfg.enabled && !editor;
  slot.innerHTML = `<section class="band" style="padding-block:0 24px"><div class="wrap"><div class="ownbox">
    <div><span class="label">${editor ? "Editor" : "Your dossier"}</span><h3>Give it its own address</h3>
      <p>A short address of its own that you can share, with the same page and the same sources.${paid ? " One-time payment; the price is shown at checkout." : ""}</p></div>
    <form id="ownForm" novalidate><div class="ownrow"><input id="ownName" maxlength="40" value="${esc(suggestName(key))}" aria-label="Address name" autocomplete="off"><span class="mono">.${esc(ROOT)}</span></div>
      <div class="hint" id="ownMsg" style="margin:8px 0 12px">Lowercase letters, digits and hyphens.</div>
      <button class="btn sea" type="submit">${paid ? "Continue to payment" : "Assign this address"}</button></form>
  </div></div></section>`;
  const msg = (t, err) => { const m = $("#ownMsg"); m.textContent = t; m.style.color = err ? "var(--bad)" : ""; };
  $("#ownForm").addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("#ownName").value.trim().toLowerCase(), btn = e.target.querySelector("button");
    btn.disabled = true; msg("Checking the address…");
    try {
      const chk = await api("/api/subdomains?name=" + encodeURIComponent(name));
      if (!chk.available) { msg(chk.problem, true); btn.disabled = false; return; }
      if (!paid) { await api("/api/admin", { method: "POST", body: JSON.stringify({ act: "subdomain", key, name }) }); return reloadDossier(key); }
      await openCheckout(key, name);
      msg("Complete the payment in the window that opened.");
    } catch (err) { msg(err.message || "Something went wrong. Try again.", true); }
    btn.disabled = false;
  });
}
function loadPaddle(){
  if (window.Paddle) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script"); s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    s.onload = () => { if (paddleCfg.sandbox) Paddle.Environment.set("sandbox"); Paddle.Initialize({ token: paddleCfg.token, eventCallback: onPaddleEvent }); resolve(); };
    s.onerror = () => reject(new Error("The payment window could not load. Check your connection and try again."));
    document.head.appendChild(s);
  });
}
let checkoutKey = "";
async function openCheckout(key, name){
  await loadPaddle(); checkoutKey = key;
  Paddle.Checkout.open({ items: [{ priceId: paddleCfg.priceId, quantity: 1 }], customData: { key, subdomain: name }, settings: { displayMode: "overlay" } });
}
function onPaddleEvent(ev){
  if (ev.name !== "checkout.completed" || !checkoutKey) return;
  const m = $("#ownMsg"); if (m) m.textContent = "Payment received. The address goes live in a minute…";
  reloadDossier(checkoutKey, 30);
}
/** Re-reads the dossier until its address appears (the payment webhook can take a few seconds). */
async function reloadDossier(key, tries = 1){
  for (let i = 0; i < tries; i++) {
    try { const d = await api("/api/dossiers/" + encodeURIComponent(key)); if (d.subdomain || i === tries - 1) { S.full.set(key, d); if (location.pathname === "/i/" + key) renderIssue(key, d); return; } } catch {}
    await new Promise(r => setTimeout(r, 4000));
  }
}

function wireLinks(){
  const wrap = $("#xwrap"), svg = $("#links"); if (!wrap) return;
  let active = null;
  const clear = () => { wrap.querySelectorAll(".hot").forEach(e => e.classList.remove("hot")); svg.innerHTML = ""; active = null; };
  const show = id => {
    clear(); active = id;
    const marks = [...wrap.querySelectorAll(`mark[data-claim="${CSS.escape(id)}"]`)], card = wrap.querySelector(`.claim[data-claim="${CSS.escape(id)}"]`);
    marks.forEach(m => m.classList.add("hot")); if (card) card.classList.add("hot");
    if (!card || !marks.length || getComputedStyle(svg).display === "none") return;
    const W = wrap.getBoundingClientRect(), c = card.getBoundingClientRect();
    svg.innerHTML = marks.map(m => { const r = m.getBoundingClientRect(); const x1 = r.right - W.left + 4, y1 = r.top + r.height / 2 - W.top, x2 = c.left - W.left - 4, y2 = c.top + 28 - W.top, mx = (x1 + x2) / 2;
      const len = Math.hypot(x2 - x1, y2 - y1) * 1.3;
      return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="var(--amber)" stroke-width="2" class="lineDraw" style="--len:${len};animation-duration:.5s"/><circle cx="${x1}" cy="${y1}" r="4" fill="var(--amber)"/><circle cx="${x2}" cy="${y2}" r="4" fill="var(--issue)"/>`; }).join("");
  };
  wrap.addEventListener("pointerover", e => { const t = e.target.closest("[data-claim]"); if (t) show(t.dataset.claim); });
  wrap.addEventListener("focusin", e => { const t = e.target.closest("[data-claim]"); if (t) show(t.dataset.claim); });
  wrap.addEventListener("click", e => { const m = e.target.closest("mark[data-claim]"); if (m && getComputedStyle(svg).display === "none") { const c = document.getElementById("cl-" + m.dataset.claim); c && c.scrollIntoView({behavior: reduced ? "auto" : "smooth", block: "center"}); show(m.dataset.claim); } });
  const re = () => { if (active) show(active); };
  addEventListener("scroll", re, {passive: true}); addEventListener("resize", re);
  issueStops.push(() => { removeEventListener("scroll", re); removeEventListener("resize", re); });
}

function constellation(cv, d, cites){
  const ctx = cv.getContext("2d"), srcs = d.sources || []; let w, h, dpr, raf, hover = null, t = 0, nodes = [];
  const groups = TYPES.map(([t]) => srcs.filter(s => (s.type === "intl" ? "ngo" : s.type) === t));
  function layout(){ nodes = []; groups.forEach((g, gi) => { const ring = 0.2 + gi * 0.155; g.forEach((s, i) => nodes.push({s, ring, a0: (i / g.length) * Math.PI * 2 + gi * .7, sp: (gi % 2 ? -1 : 1) * (0.05 + gi * .012), r: 4 + Math.sqrt(cites[s.id] || 1) * 3.2, col: "c-" + TYPES[gi][0]})); }); }
  function size(){ dpr = Math.min(2, devicePixelRatio || 1); const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; }
  function draw(){
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 * .96;
    groups.forEach((g, gi) => { if (!g.length) return; ctx.strokeStyle = TOK.line; ctx.lineWidth = 1; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.arc(cx, cy, R * (0.2 + gi * .155), 0, 7); ctx.stroke(); }); ctx.setLineDash([]);
    nodes.forEach(n => { const a = n.a0 + t * n.sp; n.x = cx + Math.cos(a) * R * n.ring; n.y = cy + Math.sin(a) * R * n.ring;
      ctx.strokeStyle = TOK[n.col]; ctx.globalAlpha = hover === n ? .9 : .22; ctx.lineWidth = hover === n ? 1.6 : 1; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(n.x, n.y); ctx.stroke(); });
    ctx.globalAlpha = 1;
    nodes.forEach(n => { ctx.fillStyle = TOK[n.col]; ctx.beginPath(); ctx.arc(n.x, n.y, hover === n ? n.r + 3 : n.r, 0, 7); ctx.fill(); ctx.strokeStyle = TOK.bg; ctx.lineWidth = 2; ctx.stroke(); });
    ctx.fillStyle = TOK.issue; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, 7); ctx.fill();
    ctx.fillStyle = TOK.bg; ctx.font = "600 12px Inter,system-ui,sans-serif"; ctx.textAlign = "center"; ctx.fillText((d.claims || []).length, cx, cy + 4);
    if (hover) { const lbl = `${hover.s.id} · ${hover.s.outlet}`; ctx.font = "600 13px Inter,system-ui,sans-serif"; const tw = ctx.measureText(lbl).width + 16, x = Math.min(Math.max(hover.x, tw / 2 + 2), w - tw / 2 - 2), y = hover.y - hover.r - 18;
      ctx.fillStyle = TOK.ink; ctx.fillRect(x - tw / 2, y - 14, tw, 22); ctx.fillStyle = TOK.bg; ctx.fillText(lbl, x, y + 1); }
  }
  function loop(){ raf = requestAnimationFrame(loop); if (document.hidden) return; t += 0.012; draw(); }
  layout(); size(); draw();
  const ro = new ResizeObserver(() => { size(); draw(); }); ro.observe(cv);
  const list = $("#slist");
  const setHover = id => { hover = nodes.find(n => n.s.id === id) || null; list.querySelectorAll("a").forEach(a => a.classList.toggle("hot", a.dataset.src === id)); if (reduced) draw(); };
  cv.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top; const n = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 6); setHover(n ? n.s.id : null); cv.style.cursor = n ? "pointer" : "default"; });
  cv.addEventListener("click", () => { if (hover) document.getElementById("src-" + hover.s.id)?.scrollIntoView({behavior: reduced ? "auto" : "smooth", block: "center"}); });
  list.addEventListener("pointerover", e => { const a = e.target.closest("a[data-src]"); setHover(a ? a.dataset.src : null); });
  if (!reduced) raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

/* ---------- review desk ---------- */
const pendingConfirm = new Set();
function actBtn(act, key, label, cls){ return `<button class="btn sm ${cls}" data-act="${act}" data-key="${esc(key)}">${pendingConfirm.has(act + key) ? "Confirm " + label.toLowerCase() : label}</button>`; }
const qrow = (r, sub, acts) => `<div class="qrow"><div><div class="t">${esc(r.headline || r.title)}</div><div class="s">${sub}</div></div><div class="acts">${acts}</div></div>`;
const none = t => `<p class="label">${t}</p>`;
function renderReview(){
  const signedIn = !!S.token;
  $("#admLogin").hidden = signedIn; $("#admBody").hidden = !signedIn; $("#navReview").hidden = !signedIn;
  if (!signedIn) return;
  const rows = S.admin, by = st => rows.filter(r => st.includes(r.stage));
  const meta = r => `${esc(whereOf(r))} · ${esc(r.category)} · ${fmtDate(r.created_at)}`;
  const held = by(["review"]);
  $("#admReview").innerHTML = held.length ? held.map(r => qrow(r, `${meta(r)} · ${r.claimCount} points · ${r.sourceCount} sources${r.reason ? " · " + esc(r.reason) : ""}`,
    `${r.headline ? `<a class="btn sm ghost" href="/i/${esc(r.key)}">Read the draft</a>` : ""}${actBtn("reject", r.key, "Reject", "bad")}${r.headline ? actBtn("publish", r.key, "Publish", "sea") : ""}`)).join("") : none("No dossiers waiting.");
  const queue = by(["received", "researching", "verifying"]);
  $("#admQueue").innerHTML = queue.length ? queue.map(r => qrow(r, `${meta(r)} · ${esc(STAGE_TXT[r.stage])}`, "")).join("") : none("The queue is empty.");
  const stopped = by(["failed", "rejected"]);
  $("#admStopped").innerHTML = stopped.length ? stopped.map(r => qrow(r, `${meta(r)} · ${esc(r.stage)}${r.reason ? " · " + esc(r.reason) : ""}${r.error ? " · " + esc(r.error) : ""}`, actBtn("retry", r.key, "Retry", "ghost"))).join("") : none("Nothing here.");
  const pubs = by(["published"]);
  $("#admPub").innerHTML = pubs.length ? pubs.map(r => qrow(r, `${esc(whereOf(r))} · published ${fmtDate(r.published_at)}${r.subdomain ? " · " + esc(r.subdomain) + "." + esc(ROOT) : ""}`, `<a class="btn sm ghost" href="/i/${esc(r.key)}">Open</a>${actBtn("unpublish", r.key, "Unpublish", "bad")}`)).join("") : none("Nothing published yet.");
}
async function loadAdmin(){
  if (!S.token) return renderReview();
  try { S.admin = await api("/api/admin"); }
  catch (e) { if (e.status === 401) { S.token = ""; store.del("pp-editor"); const m = $("#admMsg"); m.hidden = false; m.textContent = "That key was not accepted."; } }
  renderReview();
}
$("#admLogin").addEventListener("submit", e => { e.preventDefault(); S.token = $("#admToken").value.trim(); store.set("pp-editor", S.token); $("#admMsg").hidden = true; loadAdmin(); });
$("#admOut").addEventListener("click", () => { S.token = ""; store.del("pp-editor"); S.admin = []; renderReview(); });
document.addEventListener("click", async e => {
  const b = e.target.closest("button[data-act]"); if (!b || !S.token) return;
  const act = b.dataset.act, key = b.dataset.key, id = act + key;
  if (!pendingConfirm.has(id)) { pendingConfirm.add(id); b.textContent = "Confirm " + b.textContent.toLowerCase(); setTimeout(() => { if (pendingConfirm.delete(id)) b.textContent = b.textContent.replace(/^Confirm /, "").replace(/^./, c => c.toUpperCase()); }, 4000); return; }
  pendingConfirm.delete(id); b.disabled = true;
  try { await api("/api/admin", { method: "POST", body: JSON.stringify({ act, key }) }); S.full.delete(key); await Promise.all([loadAdmin(), loadPublished()]); route(); }
  catch { b.disabled = false; b.textContent = "Failed — try again"; }
});

/* ---------- router: /, /i/<key>, /review ---------- */
function go(path){ history.pushState(null, "", path); route(); }
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  if (u.pathname === location.pathname && u.hash) return; // same page: let the browser scroll
  if (PIN_KEY) { e.preventDefault(); location.href = HOME + u.pathname + u.hash; return; }
  e.preventDefault(); go(u.pathname + u.hash);
});
addEventListener("popstate", route);

let viewSeq = 0;
async function route(){
  const path = PIN_KEY && location.pathname === "/" ? "/i/" + PIN_KEY : location.pathname;
  const isIssue = path.startsWith("/i/"), isReview = path === "/review", seq = ++viewSeq;
  $("#vHome").hidden = isIssue || isReview; $("#vIssue").hidden = !isIssue; $("#vReview").hidden = !isReview;
  const navKey = isReview ? "review" : (location.hash.slice(1) || "");
  document.querySelectorAll(".nav a").forEach(a => a.setAttribute("aria-current", String(a.dataset.nav === navKey)));
  if (isIssue) {
    const key = decodeURIComponent(path.slice(3));
    scrollTo(0, 0);
    if (!S.full.has(key)) { renderIssue(key, undefined); try { S.full.set(key, await api("/api/dossiers/" + encodeURIComponent(key))); } catch { S.full.set(key, null); } }
    if (seq !== viewSeq) return;
    const d = S.full.get(key);
    if (d) document.title = (d.headline || d.title) + " — Plainproof";
    renderIssue(key, d);
    return;
  }
  issueStops.forEach(f => f()); issueStops = [];
  document.title = isReview ? "Review desk — Plainproof" : "Plainproof — citizen claims, checked against the record";
  if (isReview) { scrollTo(0, 0); loadAdmin(); return; }
  const t = location.hash && document.getElementById(location.hash.slice(1));
  if (t) t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); else scrollTo(0, 0);
}

/* ---------- scroll reveal: content fades up as it enters the view ---------- */
const revealIO = !reduced && "IntersectionObserver" in window && new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
}), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
function reveal(root){
  if (!revealIO) return;
  root.querySelectorAll(".shead, .card, .fig, .claim, .tl .ev, .resp > div, .track, .ownbox, .constel, .quote, .facts, .empty").forEach((el, i) => {
    if (el.classList.contains("rv")) return;
    el.classList.add("rv");
    el.style.transitionDelay = (el.matches(".card, .resp > div, .fig") ? (i % 3) * 90 : 0) + "ms";
    revealIO.observe(el);
  });
}

/* ---------- how it works: the number follows the step being read ---------- */
(() => {
  const steps = [...document.querySelectorAll(".story-steps li")], num = $("#storyNum"), name = $("#storyName"), bar = $("#storyBar");
  if (!steps.length || !("IntersectionObserver" in window)) { steps.forEach(li => li.classList.add("active")); return; }
  let cur = 0;
  const show = i => {
    if (i === cur) return; cur = i;
    steps.forEach((li, k) => li.classList.toggle("active", k === i - 1));
    bar.style.width = (i * 25) + "%";
    if (reduced) { num.textContent = i; name.textContent = steps[i - 1].querySelector("h3").textContent; return; }
    num.classList.add("swap");
    setTimeout(() => { num.textContent = i; name.textContent = steps[i - 1].querySelector("h3").textContent; num.classList.remove("swap"); }, 220);
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) show(+e.target.dataset.step); }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(li => io.observe(li));
  show(1);
})();

/* ---------- boot ---------- */
async function loadPublished(){
  try {
    const list = await api("/api/dossiers");
    S.published = new Map(list.map(d => [d.key, d])); S.loaded = true;
    $("#footStatus").textContent = "live";
  } catch { $("#footStatus").textContent = "offline · retrying"; }
  renderHome();
}
let mineTimer = 0;
function pollMine(){
  clearTimeout(mineTimer);
  const waiting = S.mine.some(m => !["published", "rejected", "failed"].includes(stageOf(m.key)));
  if (waiting) mineTimer = setTimeout(async () => { const before = S.mine.filter(m => stageOf(m.key) === "published").length;
    await refreshMine(); if (S.mine.filter(m => stageOf(m.key) === "published").length > before) loadPublished(); pollMine(); }, 20000);
}

terrain($("#heroTerrain"), {seed: 2006, accent: "amber"});
$("#navReview").hidden = !S.token;
renderHome(); renderMine(); route(); reveal(document);
loadPublished();
refreshMine().then(pollMine);
setInterval(() => { if (!document.hidden) loadPublished(); }, 120000);
