/* =====================================================================
   Coaching template – boekingsmodule
   Werkt in vier modi (zie booking.mode in config.js):
   - demo:    stappen doorlopen zonder dat er iets wordt vastgelegd
   - request: afspraakaanvraag versturen naar booking.requestEndpoint
   - link:    knoppen naar een extern boekingssysteem
   - embed:   een externe agenda ingesloten op de pagina
   ===================================================================== */
(function () {
  "use strict";

  const K = window.SiteKit, F = window.FormKit;
  const root = document.getElementById("booking-app");
  if (!K || !F || !root) return;
  const { C, esc, icon } = K;
  const B = C.booking || {};
  const types = (B.types || []).filter((t) => t.enabled !== false);
  const params = new URLSearchParams(location.search);
  const showPrices = K.on("prices");

  let mode = B.mode || "demo";
  if (mode === "link" && !B.externalUrl && !types.some((t) => t.url)) mode = "demo";
  if (mode === "embed" && !B.embedUrl) mode = "demo";
  if (mode === "request" && !B.requestEndpoint) mode = "demo";
  if (mode !== B.mode) console.warn(`Boekingsmodus "${B.mode}" is niet volledig ingesteld; de demomodus wordt gebruikt.`);

  const typeMeta = (t) => [
    `<span>${icon("clock")}${t.duration} minuten</span>`,
    t.location ? `<span>${icon(/online/i.test(t.location) && !/praktijk/i.test(t.location) ? "video" : "pin")}${esc(t.location)}</span>` : ""
  ].join("");

  /* ---------- Modus: link ---------- */
  if (mode === "link") {
    root.innerHTML = `
      <div class="booking__panel">
        <h2>Kies het soort gesprek</h2>
        <p class="muted">Je plant de afspraak in mijn online agenda. Die opent in een nieuw venster.</p>
        <div class="choice-list">
          ${types.map((t) => `
            <div class="choice__body" style="grid-template-columns:1fr auto">
              <span class="choice__title">${esc(t.label)}</span>
              ${showPrices && t.price ? `<span class="choice__price">${esc(t.price)}</span>` : "<span></span>"}
              <span class="choice__meta" style="grid-column:1/-1">${typeMeta(t)}</span>
              <p class="choice__desc" style="grid-column:1/-1">${esc(t.description)}</p>
              <div style="grid-column:1/-1;margin-top:10px">
                <a class="btn btn--primary btn--small" href="${esc(t.url || B.externalUrl)}" target="_blank" rel="noopener">Kies een moment${icon("external")}<span class="sr-only"> voor ${esc(t.label)} (opent in nieuw venster)</span></a>
              </div>
            </div>`).join("")}
        </div>
      </div>`;
    return;
  }

  /* ---------- Modus: embed ---------- */
  if (mode === "embed") {
    root.innerHTML = `
      <div class="booking__panel">
        <h2>Kies een moment in de agenda</h2>
        <p class="muted">Selecteer hieronder het soort gesprek en een tijd die je uitkomt.</p>
        <iframe class="embed-frame" src="${esc(B.embedUrl)}" title="Online agenda van ${esc(C.brand.name)}" style="height:${parseInt(B.embedHeight, 10) || 720}px" loading="lazy"></iframe>
        <p class="muted" style="font-size:.9375rem;margin-top:12px">Laadt de agenda niet? <a href="${esc(B.embedUrl)}" target="_blank" rel="noopener">Open de agenda in een nieuw venster<span class="sr-only"> (opent in nieuw venster)</span></a>.</p>
      </div>`;
    return;
  }

  /* ---------- Modus: demo of request ---------- */
  const isDemo = mode === "demo";
  const STEPS = ["Gesprek", "Datum en tijd", "Gegevens", "Controleren"];
  const preType = params.get("type");
  const state = {
    step: 1,
    type: (types.find((t) => t.id === preType) || types.find((t) => t.id === B.defaultType) || types[0] || {}).id,
    date: null, time: null, view: null, name: "", email: "", note: "", consent: false
  };
  const live = document.createElement("p");
  live.className = "sr-only"; live.setAttribute("aria-live", "polite");
  root.after(live);

  /* Datums */
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtLong = (s) => new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(fromIso(s));
  const fmtDayLong = (s) => new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long" }).format(fromIso(s));
  const fmtMonth = (d) => new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(d);
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

  const demoCfg = B.demo || {};
  function availableDates() {
    const out = [];
    const start = new Date(); start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + (demoCfg.minNoticeDays == null ? 1 : demoCfg.minNoticeDays));
    const weekdays = demoCfg.weekdays || [1, 2, 3, 4, 5];
    const blocked = demoCfg.blockedDates || [];
    for (let i = 0; i < (demoCfg.daysAhead || 28); i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      if (weekdays.includes(d.getDay()) && !blocked.includes(iso(d))) out.push(d);
    }
    return out;
  }
  // In de demo zijn sommige tijden "bezet" zodat de agenda realistisch oogt.
  function slotsFor(dateIso) {
    const times = demoCfg.times || ["09:00", "11:00", "14:00", "16:00"];
    const slots = times.map((t) => ({ time: t, free: hash(dateIso + t) % 3 !== 0 }));
    if (!slots.some((s) => s.free) && slots.length) slots[0].free = true;
    return slots;
  }

  const currentType = () => types.find((t) => t.id === state.type);

  /* ---------- Render ---------- */
  function render(focus) {
    const stepper = `<ol class="stepper" aria-label="Voortgang">
      ${STEPS.map((s, i) => {
        const n = i + 1;
        const cls = n < state.step ? "is-done" : "";
        const cur = n === state.step ? ' aria-current="step"' : "";
        return `<li class="${cls}"${cur}><span><span class="stepper__num">${n}.</span> <span class="stepper__label">${esc(s)}</span>${n < state.step ? '<span class="sr-only"> (afgerond)</span>' : ""}</span></li>`;
      }).join("")}</ol>
      <p class="stepper-mobile muted">Stap ${Math.min(state.step, 4)} van 4 · ${esc(STEPS[Math.min(state.step, 4) - 1])}</p>`;

    const banner = isDemo
      ? `<div class="alert alert--demo" role="note">${icon("info")}<p><strong>Demomodus:</strong> er is nog geen agenda gekoppeld. Er wordt niets vastgelegd of verstuurd.</p></div>`
      : "";

    let panel = "";
    if (state.step === 1) panel = stepType();
    else if (state.step === 2) panel = stepDate();
    else if (state.step === 3) panel = stepDetails();
    else if (state.step === 4) panel = stepSummary();
    else panel = stepDone();

    root.innerHTML = banner + (state.step <= 4 ? stepper : "") + `<div class="booking__panel">${panel}</div>`;
    bind();
    if (focus !== false) {
      const h = root.querySelector(".booking__panel h2");
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      const top = root.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    }
    live.textContent = state.step <= 4 ? `Stap ${state.step} van 4: ${STEPS[state.step - 1]}` : "";
  }

  function navButtons(nextLabel, opts) {
    opts = opts || {};
    return `<div class="booking__nav">
      ${state.step > 1 ? `<button type="button" class="btn btn--ghost" data-back>${icon("arrowLeft")}Vorige stap</button>` : "<span></span>"}
      <button type="${opts.submit ? "submit" : "button"}" class="btn btn--primary" ${opts.submit ? "" : "data-next"}>${esc(nextLabel)}${icon("arrow")}</button>
    </div>`;
  }

  function stepType() {
    return `
      <h2>Wat voor gesprek wil je plannen?</h2>
      <p class="muted">Twijfel je? Kies dan voor ${esc((types[0] || {}).label || "het eerste gesprekstype").toLowerCase()}.</p>
      <div class="alert alert--error" id="b-err" tabindex="-1" role="alert" hidden></div>
      <fieldset>
        <legend class="sr-only">Kies een gesprekstype</legend>
        <div class="choice-list">
          ${types.map((t) => `
            <label class="choice">
              <input type="radio" name="type" value="${esc(t.id)}"${t.id === state.type ? " checked" : ""}>
              <span class="choice__body">
                <span class="choice__radio" aria-hidden="true"></span>
                <span class="choice__title">${esc(t.label)}</span>
                ${showPrices && t.price ? `<span class="choice__price">${esc(t.price)}</span>` : "<span></span>"}
                <span class="choice__meta">${typeMeta(t)}</span>
                <span class="choice__desc">${esc(t.description)}</span>
              </span>
            </label>`).join("")}
        </div>
      </fieldset>
      ${navButtons("Kies datum en tijd")}`;
  }

  function stepDate() {
    const dates = availableDates();
    if (state.date && !dates.some((d) => iso(d) === state.date)) { state.date = null; state.time = null; }
    if (!state.view) {
      const base = state.date ? fromIso(state.date) : (dates[0] || new Date());
      state.view = new Date(base.getFullYear(), base.getMonth(), 1);
    }
    return `
      <h2>Kies een dag en tijd</h2>
      <p class="muted">${esc(currentType().label)} · ${currentType().duration} minuten</p>
      <div class="alert alert--error" id="b-err" tabindex="-1" role="alert" hidden></div>
      ${dates.length
        ? `<div class="cal-layout"><div class="cal" id="cal">${calendarHTML(dates)}</div><div class="cal-times" id="times">${timesHTML()}</div></div>`
        : `<p>Er zijn op dit moment geen beschikbare dagen. Neem gerust <a href="contact.html">contact</a> op.</p>`}
      ${navButtons("Volgende")}`;
  }

  // Maandkalender: week begint op maandag, alleen beschikbare dagen zijn klikbaar.
  function calendarHTML(dates) {
    const avail = new Set(dates.map(iso));
    const first = dates[0], last = dates[dates.length - 1];
    const y = state.view.getFullYear(), m = state.view.getMonth();
    const canPrev = y * 12 + m > first.getFullYear() * 12 + first.getMonth();
    const canNext = y * 12 + m < last.getFullYear() * 12 + last.getMonth();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const today = iso(new Date());
    const prefix = `${y}-${pad(m + 1)}`;
    const focusIso = state.date && state.date.startsWith(prefix) ? state.date : dates.map(iso).find((d) => d.startsWith(prefix));

    let cells = ["ma", "di", "wo", "do", "vr", "za", "zo"].map((d) => `<span class="cal__wd" aria-hidden="true">${d}</span>`).join("");
    for (let i = 0; i < offset; i++) cells += "<span></span>";
    for (let d = 1; d <= days; d++) {
      const di = `${prefix}-${pad(d)}`;
      const todayCls = di === today ? " is-today" : "";
      cells += avail.has(di)
        ? `<button type="button" class="cal__day is-available${todayCls}" data-date="${di}" aria-pressed="${di === state.date}" aria-label="${esc(fmtLong(di))}" tabindex="${di === focusIso ? 0 : -1}">${d}</button>`
        : `<span class="cal__day${todayCls}" aria-hidden="true">${d}</span>`;
    }
    return `
      <div class="cal__head">
        <button type="button" class="cal__nav" data-month="-1" aria-label="Vorige maand"${canPrev ? "" : " disabled"}>${icon("arrowLeft")}</button>
        <h3 class="cal__title" id="cal-title">${esc(fmtMonth(state.view))}</h3>
        <button type="button" class="cal__nav" data-month="1" aria-label="Volgende maand"${canNext ? "" : " disabled"}>${icon("arrow")}</button>
      </div>
      <div class="cal__grid" role="group" aria-labelledby="cal-title">${cells}</div>
      <p class="cal__legend"><span aria-hidden="true"></span>Beschikbaar</p>`;
  }

  function timesHTML() {
    if (!state.date) return `<div class="cal-empty"><div>${icon("calendar")}<p style="margin:0">Kies een dag in de kalender.</p></div></div>`;
    const slots = slotsFor(state.date);
    const title = fmtDayLong(state.date);
    return `
      <h3>${esc(title.charAt(0).toUpperCase() + title.slice(1))}</h3>
      <p class="muted">Kies een tijd</p>
      <fieldset>
        <legend class="sr-only">Beschikbare tijden op ${esc(fmtLong(state.date))}</legend>
        <div class="time-list">
          ${slots.map((s) => `<label class="slot"><input type="radio" name="time" value="${s.time}"${s.time === state.time ? " checked" : ""}${s.free ? "" : " disabled"}>
            <span><strong>${s.time}</strong>${s.free ? "" : '<small>bezet</small>'}</span></label>`).join("")}
        </div>
      </fieldset>`;
  }

  function bindCalendar(dates) {
    const cal = root.querySelector("#cal");
    if (!cal) return;
    const all = dates.map(iso);
    const redraw = () => { cal.innerHTML = calendarHTML(dates); bindCalendar(dates); };

    cal.querySelectorAll("[data-month]").forEach((b) => b.addEventListener("click", () => {
      const dir = b.dataset.month;
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() + Number(dir), 1);
      redraw();
      const same = cal.querySelector(`[data-month="${dir}"]`);
      (same && !same.disabled ? same : cal.querySelector('.cal__day[tabindex="0"]')).focus();
      live.textContent = fmtMonth(state.view);
    }));

    cal.querySelectorAll(".cal__day[data-date]").forEach((b) => {
      b.addEventListener("click", () => {
        state.date = b.dataset.date; state.time = null;
        clearError();
        redraw();
        cal.querySelector(`[data-date="${state.date}"]`).focus();
        const times = root.querySelector("#times");
        times.innerHTML = timesHTML();
        bindTimes();
        if (window.matchMedia("(max-width: 760px)").matches) times.scrollIntoView({ behavior: "smooth", block: "nearest" });
        live.textContent = `${fmtLong(state.date)} gekozen. Kies nu een tijd.`;
      });
      // Pijltjestoetsen: naar de vorige/volgende beschikbare dag of een week verder
      b.addEventListener("keydown", (e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (!step) return;
        e.preventDefault();
        const cur = b.dataset.date;
        let target;
        if (Math.abs(step) === 1) target = all[all.indexOf(cur) + step];
        else {
          const d = fromIso(cur); d.setDate(d.getDate() + step);
          const di = iso(d);
          target = all.includes(di) ? di : (step > 0 ? all.find((x) => x > di) : all.slice().reverse().find((x) => x < di));
        }
        if (!target) return;
        const td = fromIso(target);
        if (td.getMonth() !== state.view.getMonth() || td.getFullYear() !== state.view.getFullYear()) {
          state.view = new Date(td.getFullYear(), td.getMonth(), 1);
          redraw();
        }
        cal.querySelectorAll(".cal__day[data-date]").forEach((x) => { x.tabIndex = -1; });
        const tb = cal.querySelector(`[data-date="${target}"]`);
        tb.tabIndex = 0;
        tb.focus();
      });
    });
  }

  function stepDetails() {
    return `
      <h2>Je gegevens</h2>
      <p class="muted">Zo weet ik met wie ik het gesprek heb en waar ik de bevestiging naartoe kan sturen.</p>
      <form id="b-form" novalidate>
        <div class="alert alert--error" id="b-err" tabindex="-1" role="alert" hidden></div>
        ${F.field({ id: "b-name", name: "naam", label: "Naam", errorLabel: "naam", required: true, autocomplete: "name", value: state.name })}
        ${F.field({ id: "b-email", name: "email", label: "E-mailadres", errorLabel: "e-mailadres", type: "email", required: true, autocomplete: "email", inputmode: "email", value: state.email })}
        ${F.field({ id: "b-note", name: "toelichting", label: "Korte toelichting", type: "textarea", hint: "Waar wil je het over hebben? Een paar zinnen is genoeg.", value: state.note })}
        ${B.requireConsent ? F.field({ id: "b-consent", name: "akkoord", type: "checkbox", required: true, checked: state.consent, label: "Akkoord met de privacyverklaring", labelHTML: 'Ik ga akkoord met de verwerking van mijn gegevens volgens de <a href="privacy.html" target="_blank" rel="noopener">privacyverklaring<span class="sr-only"> (opent in nieuw venster)</span></a>.', requiredMsg: "Geef aan dat je akkoord gaat met de privacyverklaring." }) : ""}
        ${navButtons("Controleer je afspraak", { submit: true })}
      </form>`;
  }

  function summaryList(withEdit) {
    const t = currentType();
    const rows = [
      ["Gesprek", `${t.label}${showPrices && t.price ? ` · ${t.price}` : ""}`, 1],
      ["Duur", `${t.duration} minuten`, 1],
      ["Locatie", t.location || "", 1],
      ["Datum", fmtLong(state.date), 2],
      ["Tijd", state.time, 2],
      ["Naam", state.name, 3],
      ["E-mailadres", state.email, 3],
      state.note ? ["Toelichting", state.note, 3] : null
    ].filter(Boolean);
    return `<dl class="summary">${rows.map((r, i) => `<div class="summary__row"><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>${withEdit && (i === 0 || rows[i - 1][2] !== r[2]) ? `<button type="button" class="edit" data-goto="${r[2]}">Wijzig<span class="sr-only"> ${["", "gesprek", "datum en tijd", "gegevens"][r[2]]}</span></button>` : ""}</div>`).join("")}</dl>`;
  }

  function stepSummary() {
    return `
      <h2>Klopt alles?</h2>
      <p class="muted">Controleer je afspraak. Je kunt elk onderdeel nog aanpassen.</p>
      <div class="alert alert--error" id="b-err" tabindex="-1" role="alert" hidden></div>
      ${summaryList(true)}
      ${isDemo
        ? `<div class="alert alert--demo" role="note">${icon("info")}<p>Dit is een demonstratie. Na bevestigen wordt er <strong>geen</strong> afspraak vastgelegd en <strong>geen</strong> e-mail verstuurd.</p></div>`
        : `<div class="alert alert--info" role="note">${icon("info")}<p>Je verstuurt een aanvraag. De afspraak is definitief zodra je een bevestiging van ${esc(C.brand.coachFirstName || C.brand.name)} hebt ontvangen.</p></div>`}
      <div class="booking__nav">
        <button type="button" class="btn btn--ghost" data-back>${icon("arrowLeft")}Vorige stap</button>
        <button type="button" class="btn btn--primary" data-confirm>${isDemo ? "Bevestig demo-afspraak" : "Verstuur aanvraag"}${icon("arrow")}</button>
      </div>`;
  }

  function stepDone() {
    return `
      <div class="success-panel">
        <div class="success-panel__icon">${icon("check")}</div>
        ${isDemo
          ? `<h2>Demo afgerond: er is niets vastgelegd</h2>
             <p>Zo ziet de bevestiging eruit zodra er een agenda is gekoppeld. Deze afspraak is <strong>niet</strong> ingepland en er is <strong>geen</strong> bevestigingsmail verstuurd.</p>`
          : `<h2>Bedankt, je aanvraag is verstuurd</h2>
             <p>${esc(C.brand.coachFirstName || C.brand.name)} bekijkt je aanvraag en bevestigt de afspraak per e-mail naar <strong>${esc(state.email)}</strong>. ${esc(C.contact.responseTime || "")}</p>`}
      </div>
      ${summaryList(false)}
      <div class="btn-row" style="justify-content:center">
        <button type="button" class="btn btn--secondary" data-restart>Nieuwe afspraak plannen</button>
        <a class="btn btn--ghost" href="index.html">Terug naar de homepage</a>
      </div>`;
  }

  /* ---------- Gedrag ---------- */
  function showError(msg) {
    const box = root.querySelector("#b-err");
    if (!box) return;
    box.hidden = false;
    box.innerHTML = `${icon("alert")}<p>${msg}</p>`;
    box.focus();
  }

  function clearError() { const box = root.querySelector("#b-err"); if (box) { box.hidden = true; box.innerHTML = ""; } }

  function go(step) { state.step = step; render(); }

  function bind() {
    const back = root.querySelector("[data-back]");
    if (back) back.addEventListener("click", () => go(state.step - 1));
    root.querySelectorAll("[data-goto]").forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.goto))));
    const restart = root.querySelector("[data-restart]");
    if (restart) restart.addEventListener("click", () => { Object.assign(state, { step: 1, date: null, time: null, view: null, note: "", consent: false }); render(); });

    if (state.step === 1) {
      root.querySelectorAll('input[name="type"]').forEach((r) => r.addEventListener("change", () => { state.type = r.value; state.time = null; clearError(); }));
      root.querySelector("[data-next]").addEventListener("click", () => {
        if (!currentType()) return showError("Kies een gesprekstype om verder te gaan.");
        go(2);
      });
    }

    if (state.step === 2) {
      bindCalendar(availableDates());
      bindTimes();
      root.querySelector("[data-next]").addEventListener("click", () => {
        if (!state.date) return showError("Kies eerst een dag.");
        if (!state.time) return showError("Kies nog een tijd op " + esc(fmtLong(state.date)) + ".");
        go(3);
      });
    }

    if (state.step === 3) {
      const form = root.querySelector("#b-form");
      const sync = () => {
        state.name = form.naam.value.trim();
        state.email = form.email.value.trim();
        state.note = form.toelichting.value.trim();
        if (form.akkoord) state.consent = form.akkoord.checked;
      };
      F.attachLive(form);
      form.addEventListener("input", sync);
      form.addEventListener("change", sync);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sync();
        if (F.validateForm(form, root.querySelector("#b-err"))) go(4);
      });
    }

    if (state.step === 4) {
      const confirm = root.querySelector("[data-confirm]");
      confirm.addEventListener("click", async () => {
        if (isDemo) return go(5);
        confirm.disabled = true;
        confirm.textContent = "Bezig met versturen…";
        const t = currentType();
        const data = new FormData();
        data.append("_subject", `Afspraakaanvraag: ${t.label} op ${fmtLong(state.date)} om ${state.time}`);
        data.append("gesprek", t.label);
        data.append("duur", `${t.duration} minuten`);
        data.append("datum", fmtLong(state.date));
        data.append("tijd", state.time);
        data.append("naam", state.name);
        data.append("email", state.email);
        data.append("toelichting", state.note);
        try {
          await F.postForm(B.requestEndpoint, data);
          go(5);
        } catch (err) {
          confirm.disabled = false;
          confirm.innerHTML = `Opnieuw proberen${icon("arrow")}`;
          showError(`Het versturen is niet gelukt. Probeer het opnieuw of mail naar <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a>.`);
        }
      });
    }
  }

  function bindTimes() {
    root.querySelectorAll('input[name="time"]').forEach((r) => r.addEventListener("change", () => { state.time = r.value; clearError(); }));
  }

  if (!types.length) {
    root.innerHTML = `<p>Er zijn nog geen gesprekstypen ingesteld. Voeg ze toe onder <code>booking.types</code> in config.js.</p>`;
    return;
  }
  render(false);
})();
