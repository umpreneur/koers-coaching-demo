/* =====================================================================
   Coaching template – formulieren
   Validatie (gedeeld met de boekingsmodule) en het contactformulier.
   Het contactformulier verstuurt naar contact.formEndpoint in config.js.
   Zonder endpoint draait het formulier in demomodus.
   ===================================================================== */
(function () {
  "use strict";

  const K = window.SiteKit;
  if (!K) return;
  const { C, esc, icon } = K;
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Veld-markup ---------- */
  function field(o) {
    const describedBy = [o.hint ? `${o.id}-hint` : "", `${o.id}-error`].filter(Boolean).join(" ");
    const common = `id="${o.id}" name="${o.name}" data-validate data-label="${esc(o.errorLabel || o.label.toLowerCase())}" aria-describedby="${describedBy}"${o.required ? " required" : ""}${o.minLength ? ` minlength="${o.minLength}"` : ""}${o.autocomplete ? ` autocomplete="${o.autocomplete}"` : ""}`;
    const value = esc(o.value || "");
    let control;
    if (o.type === "textarea") control = `<textarea class="textarea" ${common} rows="5">${value}</textarea>`;
    else if (o.type === "checkbox") {
      return `<div class="field">
        <label class="checkbox" for="${o.id}"><input type="checkbox" ${common}${o.checked ? " checked" : ""} data-msg-required="${esc(o.requiredMsg || "")}"><span>${o.labelHTML || esc(o.label)}</span></label>
        <p class="field-error" id="${o.id}-error" hidden></p></div>`;
    } else control = `<input class="input" type="${o.type || "text"}" ${common} value="${value}"${o.inputmode ? ` inputmode="${o.inputmode}"` : ""}>`;
    return `<div class="field">
      <label for="${o.id}">${esc(o.label)}${o.required ? "" : ' <span class="optional">(optioneel)</span>'}</label>
      ${o.hint ? `<span class="hint" id="${o.id}-hint">${esc(o.hint)}</span>` : ""}
      ${control}
      <p class="field-error" id="${o.id}-error" hidden></p>
    </div>`;
  }

  /* ---------- Validatie ---------- */
  function setError(el, msg) {
    const err = document.getElementById(el.id + "-error");
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) { err.innerHTML = msg ? `${icon("alert")}<span>${esc(msg)}</span>` : ""; err.hidden = !msg; }
    const wrap = el.closest(".field");
    if (wrap) wrap.classList.toggle("has-error", !!msg);
  }

  function validateField(el) {
    const v = (el.value || "").trim();
    const label = el.dataset.label || "dit veld";
    let msg = "";
    if (el.type === "checkbox") {
      if (el.required && !el.checked) msg = el.dataset.msgRequired || "Vink dit vakje aan om verder te gaan.";
    } else if (el.required && !v) {
      msg = `Vul je ${label} in.`;
    } else if (v && el.type === "email" && !EMAIL.test(v)) {
      msg = "Dit e-mailadres lijkt niet te kloppen. Gebruik de vorm naam@voorbeeld.nl.";
    } else if (v && el.minLength > 0 && v.length < el.minLength) {
      msg = `Je ${label} is wat kort. Gebruik minimaal ${el.minLength} tekens.`;
    }
    setError(el, msg);
    el.dataset.touched = "1";
    return msg;
  }

  // Valideert alle velden en toont bovenaan een overzicht met links naar de fouten.
  function validateForm(form, summary) {
    const errors = [];
    form.querySelectorAll("[data-validate]").forEach((el) => {
      const msg = validateField(el);
      if (msg) errors.push({ el, msg });
    });
    if (summary) {
      if (errors.length) {
        summary.hidden = false;
        summary.innerHTML = `${icon("alert")}<div><p><strong>${errors.length === 1 ? "Er is 1 veld dat nog aandacht nodig heeft:" : `Er zijn ${errors.length} velden die nog aandacht nodig hebben:`}</strong></p>
          <ul>${errors.map((e) => `<li><a href="#${e.el.id}">${esc(e.msg)}</a></li>`).join("")}</ul></div>`;
        summary.focus();
        summary.querySelectorAll("a").forEach((a) => a.addEventListener("click", (ev) => {
          ev.preventDefault();
          const t = document.getElementById(a.getAttribute("href").slice(1));
          if (t) t.focus();
        }));
      } else { summary.hidden = true; summary.innerHTML = ""; }
    } else if (errors.length) errors[0].el.focus();
    return errors.length === 0;
  }

  function attachLive(form) {
    form.addEventListener("focusout", (e) => {
      const el = e.target;
      if (el.matches && el.matches("[data-validate]") && (el.value || el.dataset.touched)) validateField(el);
    });
    form.addEventListener("input", (e) => {
      const el = e.target;
      if (el.matches && el.matches("[data-validate]") && el.getAttribute("aria-invalid") === "true") validateField(el);
    });
    form.addEventListener("change", (e) => {
      const el = e.target;
      if (el.type === "checkbox" && el.matches("[data-validate]") && el.dataset.touched) validateField(el);
    });
  }

  async function postForm(endpoint, data) {
    const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res;
  }

  window.FormKit = { field, validateField, validateForm, attachLive, setError, postForm, EMAIL };

  /* ---------- Contactformulier ---------- */
  const root = document.getElementById("contact-form-root");
  if (!root) return;
  const endpoint = (C.contact.formEndpoint || "").trim();
  const demo = !endpoint;

  function renderForm() {
    root.innerHTML = `
      <h2 style="font-size:1.6rem">Stuur een bericht</h2>
      ${demo ? `<div class="alert alert--demo" role="note">${icon("info")}<p><strong>Demoformulier.</strong> Dit formulier is nog niet aangesloten. Berichten worden niet verzonden of opgeslagen.</p></div>` : ""}
      <form id="contact-form" novalidate>
        <div class="alert alert--error" id="contact-errors" tabindex="-1" role="alert" hidden></div>
        ${field({ id: "c-name", name: "naam", label: "Naam", errorLabel: "naam", required: true, autocomplete: "name" })}
        ${field({ id: "c-email", name: "email", label: "E-mailadres", errorLabel: "e-mailadres", type: "email", required: true, autocomplete: "email", inputmode: "email", hint: "Hier stuur ik mijn antwoord naartoe." })}
        ${field({ id: "c-message", name: "bericht", label: "Bericht", errorLabel: "bericht", type: "textarea", required: true, minLength: 10 })}
        <div class="hp" aria-hidden="true"><label for="c-gotcha">Laat dit veld leeg</label><input id="c-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
        <input type="hidden" name="_subject" value="Nieuw bericht via de website van ${esc(C.brand.name)}">
        <p class="muted" style="font-size:.9375rem">Je gegevens gebruik ik alleen om je vraag te beantwoorden. Lees meer in de <a href="privacy.html">privacyverklaring</a>.</p>
        <button class="btn btn--primary" type="submit">${demo ? "Verstuur bericht (demo)" : "Verstuur bericht"}${icon("arrow")}</button>
      </form>`;
    const form = document.getElementById("contact-form");
    const summary = document.getElementById("contact-errors");
    FormKit.attachLive(form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!FormKit.validateForm(form, summary)) return;
      const data = new FormData(form);
      if (data.get("_gotcha")) { renderSuccess(); return; } // spam: stil negeren
      if (demo) { renderSuccess(); return; }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = "Bezig met versturen…";
      try {
        await FormKit.postForm(endpoint, data);
        renderSuccess();
      } catch (err) {
        button.disabled = false;
        button.innerHTML = `Opnieuw proberen${icon("arrow")}`;
        summary.hidden = false;
        summary.innerHTML = `${icon("alert")}<p><strong>Het versturen is niet gelukt.</strong> Controleer je internetverbinding en probeer het opnieuw, of mail direct naar <a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a>.</p>`;
        summary.focus();
      }
    });
  }

  function renderSuccess() {
    root.innerHTML = `
      <div class="success-panel">
        <div class="success-panel__icon">${icon("check")}</div>
        <h2 tabindex="-1" id="contact-done">${demo ? "Demo: je bericht is níet verzonden" : "Bedankt, je bericht is verzonden"}</h2>
        <p>${demo
          ? "Zo ziet de bevestiging eruit zodra het formulier is aangesloten. Op dit moment is er niets verstuurd of opgeslagen."
          : esc(`Ik heb je bericht ontvangen. ${C.contact.responseTime || ""}`)}</p>
        <div class="btn-row" style="justify-content:center;margin-top:24px">
          <button class="btn btn--secondary" type="button" id="contact-again">Nog een bericht sturen</button>
        </div>
      </div>`;
    document.getElementById("contact-done").focus();
    document.getElementById("contact-again").addEventListener("click", () => { renderForm(); document.getElementById("c-name").focus(); });
  }

  renderForm();
})();
