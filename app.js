const el = (id) => document.getElementById(id);

let signals = [];
let current = null;
let score = 0;

function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(arr, n, excludeValue) {
  const pool = arr.filter(v => v && v !== excludeValue);
  return shuffle([...new Set(pool)]).slice(0, Math.max(0, n));
}

function render() {
  const app = el("app");
  app.innerHTML = `
    <div style="max-width:720px;margin:24px auto;text-align:left;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <div style="opacity:.8;font-size:14px;">Punkte: <b id="score">${score}</b></div>
          <div style="opacity:.8;font-size:14px;">Gruppe: <b id="grp">–</b></div>
        </div>
        <button id="nextBtn">Nächste Frage</button>
      </div>

      <div style="margin-top:18px;padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:14px;">
        <h2 style="margin:0 0 6px 0;" id="sigName">–</h2>
        <div style="opacity:.85;margin-bottom:10px;" id="sigHint"></div>

        <div style="display:grid;gap:10px;">
          <div>
            <div style="opacity:.8;margin-bottom:6px;">Bedeutung auswählen</div>
            <div id="meaningOpts" style="display:grid;gap:8px;"></div>
          </div>

          <div>
            <div style="opacity:.8;margin-bottom:6px;">Kürzel auswählen</div>
            <div id="abbrOpts" style="display:grid;gap:8px;"></div>
          </div>

          <button id="checkBtn" style="margin-top:6px;">Prüfen</button>
          <div id="feedback" style="min-height:24px;opacity:.9;"></div>
        </div>
      </div>
    </div>
  `;

  el("nextBtn").addEventListener("click", newRound);
  el("checkBtn").addEventListener("click", check);
}

function optionHtml(name, value) {
  const safe = String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
  return `
    <label style="display:flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;cursor:pointer;">
      <input type="radio" name="${name}" value="${safe}">
      <span>${safe}</span>
    </label>
  `;
}

function newRound() {
  if (!signals.length) return;

  current = signals[Math.floor(Math.random() * signals.length)];
  el("sigName").textContent = current.name || current.kuerzel || "Signal";
  el("grp").textContent = current.gruppe || "–";
  el("sigHint").textContent = current.bild ? "" : "(Noch kein Bild hinterlegt – optional später)";

  const meanings = signals.map(s => s.bedeutung);
  const abbrs = signals.map(s => s.kuerzel);

  const meaningChoices = shuffle([
    current.bedeutung,
    ...pickN(meanings, 3, current.bedeutung)
  ]);

  const abbrChoices = shuffle([
    current.kuerzel,
    ...pickN(abbrs, 3, current.kuerzel)
  ]);

  el("meaningOpts").innerHTML = meaningChoices.map(v => optionHtml("meaning", v)).join("");
  el("abbrOpts").innerHTML = abbrChoices.map(v => optionHtml("abbr", v)).join("");

  el("feedback").textContent = "";
}

function selected(name) {
  const x = document.querySelector(`input[name="${name}"]:checked`);
  return x ? x.value : null;
}

function check() {
  const m = selected("meaning");
  const a = selected("abbr");

  if (!m || !a) {
    el("feedback").textContent = "Bitte Bedeutung UND Kürzel auswählen.";
    return;
  }

  const ok = (m === current.bedeutung) && (a === current.kuerzel);

  if (ok) {
    score += 1;
    el("score").textContent = score;
    el("feedback").textContent = "Richtig ✅";
  } else {
    el("feedback").textContent = `Falsch ❌ — richtig: ${current.bedeutung} / ${current.kuerzel}`;
  }
}

async function init() {
  render();
  const res = await fetch("./signals.json", { cache: "no-store" });
  signals = await res.json();
  newRound();
}

init().catch(err => {
  const app = el("app");
  app.innerHTML = `<p>Fehler beim Laden von signals.json: ${String(err)}</p>`;
});
