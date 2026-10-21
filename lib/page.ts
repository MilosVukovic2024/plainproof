// The site is one HTML document; /app.js renders the home page, dossiers and the review
// desk into it. The server only fills in the <head> so shared links get a proper preview.

import { ROOT } from "./subdomain";

const SITE = `https://www.${ROOT}`;
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// On a dossier's own address (name.plainproof.me) the page carries the dossier key, and the
// canonical URL stays on the main site so search engines see one copy.
export type Meta = { title: string; description: string; path: string; noindex?: boolean; dossierKey?: string };

export const HOME_META: Meta = {
  title: "Plainproof — citizen claims, checked against the record",
  description: "Describe a local problem in your own words, in any language. Plainproof checks it against official data, audits, court records and the press, and publishes the verified dossier.",
  path: "/",
};

export function html(meta: Meta, status = 200) {
  const url = SITE + meta.path;
  const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${esc(url)}">
${meta.noindex ? '<meta name="robots" content="noindex">' : ""}
<meta name="pp-root" content="${ROOT}">
${meta.dossierKey ? `<meta name="pp-key" content="${esc(meta.dossierKey)}"><meta name="pp-home" content="${SITE}">` : ""}
<meta property="og:type" content="article">
<meta property="og:site_name" content="Plainproof">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='3' fill='%2316212A'/%3E%3Cpath d='M9 24V8h8a5 5 0 0 1 0 10h-8' fill='none' stroke='%23E88C28' stroke-width='3'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap">
<link rel="stylesheet" href="/app.css">
<script src="/app.js" defer></script>
</head>
<body>
${BODY}
</body>
</html>`;
  return new Response(doc, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

const BODY = `<header class="top"><div class="wrap">
  <a class="brand" href="/"><b>Plainproof</b><span>CITIZEN CLAIMS · CHECKED</span></a>
  <nav class="nav" aria-label="Main">
    <a href="/#issues" data-nav="issues">Issues</a>
    <a href="/#report" data-nav="report">Report an issue</a>
    <a href="/#how" data-nav="how">How it works</a>
    <a href="/review" data-nav="review" id="navReview" hidden>Review desk</a>
  </nav>
</div></header>

<main>
<div id="vHome">
  <section class="hero" aria-label="Introduction">
    <canvas class="terrain" id="heroTerrain" aria-hidden="true"></canvas>
    <div class="wrap hero-in">
      <p class="eyebrow">Citizen reports from anywhere, checked against the record</p>
      <h1>Tell us <em>what's wrong</em> where you live. We check it against <span class="rec">the record.</span></h1>
      <p class="lede">Describe a local problem in your own words, in any language. We gather official data, court and audit records, newspapers, TV and portals in your country's languages, then three independent verifiers test every claim and the dossier is published as its own page.</p>
      <div class="cta"><a class="btn" href="/#report">Report an issue</a><a class="btn ghost" href="/#issues">Read verified issues</a></div>
    </div>
    <div class="wrap mapstage">
      <div class="mapbox">
        <canvas id="map" aria-label="World map with verified issues marked"></canvas>
        <div class="tip" id="mapTip"></div>
      </div>
      <div class="label maptag" id="mapTag">0 verified issues</div>
      <div class="stats" id="stats">
        <div><b data-count="0" id="stIssues">0</b><span class="label">Published dossiers</span></div>
        <div><b data-count="0" id="stClaims">0</b><span class="label">Claims tested</span></div>
        <div><b data-count="0" id="stSources">0</b><span class="label">Sources cited</span></div>
        <div><b data-count="0" id="stMun">0</b><span class="label">Countries covered</span></div>
      </div>
    </div>
  </section>

  <section class="band" id="issues"><div class="wrap">
    <div class="shead"><h2>Verified issues.</h2><p>Each dossier is a small site of its own: the reporter's words, every claim with its verdict, the numbers, the timeline and the sources.</p></div>
    <div class="cards" id="cards"></div>
  </div></section>

  <section class="band" id="report" style="background:var(--surface);border-block:1px solid var(--line)"><div class="wrap">
    <div class="shead"><h2>Report an issue.</h2><p>Write what you see, where, and since when, in any language. Plain words are best. Do not name private individuals or include anyone's personal data.</p></div>
    <div class="report">
      <form class="rf" id="rf" novalidate style="background:var(--bg)">
        <div class="fld"><label for="fTitle">In one line, what is the problem?</label>
          <input id="fTitle" maxlength="90" placeholder="e.g. Sewage runs into the river below the bridge" autocomplete="off"></div>
        <div class="row2">
          <div class="fld"><label for="fCountry">Country</label><select id="fCountry"></select></div>
          <div class="fld"><label for="fPlace">Town, city or area</label><input id="fPlace" maxlength="80" placeholder="e.g. Pljevlja" autocomplete="off"></div>
        </div>
        <div class="fld"><label for="fCat">Topic</label><select id="fCat">
          <option>Environment</option><option>Water &amp; sewage</option><option>Roads &amp; transport</option><option>Health care</option><option>Education</option><option>Public spending</option><option>Construction &amp; planning</option><option>Public services</option><option>Other</option></select></div>
        <div class="fld"><label for="fText">What is happening? <span class="hint">Any language</span></label>
          <textarea id="fText" maxlength="1200" placeholder="What you see or experience, where exactly, how often, and who you think is responsible."></textarea>
          <div class="count" id="fCount">0 / 1200</div></div>
        <div class="fld"><label for="fSince">Since when? <span class="hint">(optional)</span></label>
          <input id="fSince" maxlength="60" placeholder="e.g. every winter since 2019"></div>
        <div class="fld"><label for="fFiles">Evidence files <span class="hint">(optional) PDF, photos, CSV or Excel · up to 3 files</span></label>
          <input id="fFiles" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.csv,.txt,.xlsx">
          <div class="hint" id="fFilesInfo">The research reads them to know what to look for. They are not published.</div></div>
        <div class="hp" aria-hidden="true"><label for="fWebsite">Website</label><input id="fWebsite" tabindex="-1" autocomplete="off"></div>
        <div id="fMsg" class="msg" hidden></div>
        <div><button class="btn" type="submit" id="fSubmit">Submit for research</button></div>
      </form>
      <div class="mine">
        <h3>Your reports</h3>
        <div id="mine"></div>
      </div>
    </div>
  </div></section>

  <section class="band" id="how"><div class="wrap">
    <div class="shead"><h2>How a report becomes a dossier.</h2><p>Each claim carries the verdicts of three verifiers who work separately and never see each other's notes. When they finish, the dossier builds and publishes itself.</p></div>
    <div class="story">
      <div class="story-visual" aria-hidden="true"><div class="story-num" id="storyNum">1</div><div class="story-name" id="storyName">You describe</div><div class="story-bar"><i id="storyBar"></i></div></div>
      <ol class="story-steps">
        <li data-step="1"><span class="k">Step 1</span><h3>You describe</h3><p>A few sentences in your own words and language. We keep your exact phrasing and translate it; your words are what gets tested.</p></li>
        <li data-step="2"><span class="k">Step 2</span><h3>Research</h3><p>Official statistics, budgets, audit and court records, agency monitoring data, newspapers, TV and portals, searched in the local languages and in English.</p></li>
        <li data-step="3"><span class="k">Step 3</span><h3>Three verifiers</h3><p>Independent agents re-check every claim against the sources and search for contrary evidence. Disagreement lowers the verdict.</p></li>
        <li data-step="4"><span class="k">Step 4</span><h3>Visualised</h3><p>The verified data becomes its own page automatically: your words linked to the verdicts, charts, a timeline and a map of the sources.</p></li>
      </ol>
    </div>
  </div></section>
</div>

<div id="vIssue" class="dz" hidden></div>

<div id="vReview" hidden><section class="band"><div class="wrap adm">
  <div class="shead"><h2>Review desk.</h2><p>Dossiers publish automatically when verification ends. Those that name someone in a wrongdoing claim wait here; you can also unpublish, reject or retry any report.</p></div>
  <form id="admLogin" class="rf" style="max-width:460px" hidden>
    <div class="fld"><label for="admToken">Editor key</label><input id="admToken" type="password" autocomplete="current-password"></div>
    <div id="admMsg" class="msg err" hidden></div>
    <div><button class="btn" type="submit">Open the desk</button></div>
  </form>
  <div id="admBody" class="adm" hidden>
    <div><div class="label" style="margin-bottom:10px">Held for a manual check</div><div id="admReview" style="display:grid;gap:10px"></div></div>
    <div><div class="label" style="margin-bottom:10px">In the research queue</div><div id="admQueue" style="display:grid;gap:10px"></div></div>
    <div><div class="label" style="margin-bottom:10px">Failed or rejected</div><div id="admStopped" style="display:grid;gap:10px"></div></div>
    <div><div class="label" style="margin-bottom:10px">Published</div><div id="admPub" style="display:grid;gap:10px"></div></div>
    <div><button class="btn sm ghost" type="button" id="admOut">Sign out</button></div>
  </div>
</div></section></div>
</main>

<footer class="foot"><div class="wrap">
  <span>Plainproof · Dossiers cite their sources; follow the links and judge for yourself.</span>
  <span class="mono" id="footStatus">connecting…</span>
</div></footer>`;
