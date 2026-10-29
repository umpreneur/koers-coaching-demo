/* =====================================================================
   Coaching template – paginaopbouw
   Leest assets/js/config.js en bouwt header, footer en pagina-inhoud.
   Normaal gesproken hoef je dit bestand niet aan te passen.
   ===================================================================== */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  if (!C) { console.error("SITE_CONFIG ontbreekt: controleer of assets/js/config.js geladen wordt."); return; }

  document.documentElement.classList.add("js");
  const body = document.body;
  const pageKey = body.dataset.page || "";

  /* ---------- Hulpfuncties ---------- */
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), C);
  const on = (key) => !C.sections || C.sections[key] !== false;
  const showPrices = () => on("prices");

  const ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
    euro: '<path d="M17 6.5A6.5 6.5 0 0 0 7.5 12 6.5 6.5 0 0 0 17 17.5M5 10h8M5 14h8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 10v4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19l7-7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3 2.2 3.5 5"/>',
    loop: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };
  const icon = (name, cls) => `<svg class="icon icon--${name}${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

  const img = (im, opts) => {
    if (!im || !im.src) return "";
    opts = opts || {};
    const loading = opts.eager ? 'fetchpriority="high"' : 'loading="lazy"';
    return `<img src="${esc(im.src)}" alt="${esc(im.alt)}" width="${im.width || 800}" height="${im.height || 1000}" ${loading} decoding="async">`;
  };
  const btn = (href, label, variant, opts) => {
    opts = opts || {};
    const arrow = opts.arrow ? icon("arrow") : "";
    return `<a class="btn btn--${variant || "primary"}${opts.cls ? " " + opts.cls : ""}" href="${esc(href)}">${esc(label)}${arrow}</a>`;
  };
  const bookingHref = (type) => "afspraak.html" + (type ? "?type=" + encodeURIComponent(type) : "");
  const sampleBadge = (label) => `<span class="sample-badge">${icon("info")}${esc(label || "Voorbeeldinhoud")}</span>`;
  const isPlaceholder = (s) => /\[[^\]]+\]/.test(String(s || ""));
  const sectionHead = (eyebrow, title, intro, center, level) => `
    <div class="section-head${center ? " section-head--center" : ""} reveal">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
      <h${level || 2}>${esc(title)}</h${level || 2}>
      ${intro ? `<p class="lead">${esc(intro)}</p>` : ""}
    </div>`;
  const paragraphs = (arr) => (arr || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const checkList = (arr, cls) => `<ul class="check-list${cls ? " " + cls : ""}">${(arr || []).map((t) => `<li>${icon("check")}<span>${esc(t)}</span></li>`).join("")}</ul>`;

  // Delen beschikbaar maken voor booking.js en forms.js
  window.SiteKit = { C, esc, icon, img, btn, bookingHref, sampleBadge, on };

  /* ---------- Thema ---------- */
  function applyTheme() {
    const t = C.theme || {};
    const root = document.documentElement.style;
    const map = {
      background: "--c-bg", surface: "--c-surface", sand: "--c-sand", sandStrong: "--c-sand-strong",
      green: "--c-green", greenStrong: "--c-green-strong", greenInk: "--c-green-ink", text: "--c-text",
      muted: "--c-muted", accent: "--c-accent", accentHover: "--c-accent-hover", accentText: "--c-accent-text", border: "--c-border",
      script: "--c-script", cta: "--c-cta", ctaHover: "--c-cta-hover"
    };
    Object.keys(map).forEach((k) => { if (t.colors && t.colors[k]) root.setProperty(map[k], t.colors[k]); });
    if (t.fonts) {
      if (t.fonts.heading) root.setProperty("--font-heading", `"${t.fonts.heading}", Georgia, "Times New Roman", serif`);
      if (t.fonts.body) root.setProperty("--font-body", `"${t.fonts.body}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`);
      if (t.fonts.script) root.setProperty("--font-script", `"${t.fonts.script}", "Segoe Script", cursive`);
      else body.classList.add("no-script-font");
      if (t.fonts.googleFontsUrl && !document.getElementById("theme-fonts")) {
        const l = document.createElement("link");
        l.id = "theme-fonts"; l.rel = "stylesheet"; l.href = t.fonts.googleFontsUrl;
        document.head.appendChild(l);
      }
    }
    if (t.radius) root.setProperty("--radius", t.radius);
    if (t.radiusLarge) root.setProperty("--radius-lg", t.radiusLarge);
    if (t.archImages) body.classList.add("arch-images");
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme && t.colors && t.colors.background) theme.setAttribute("content", t.colors.background);
    if (C.brand.favicon) {
      const fav = document.querySelector('link[rel="icon"]');
      if (fav) fav.setAttribute("href", C.brand.favicon);
    }
  }

  /* ---------- Metadata ---------- */
  function setMeta(selector, attr, value) {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      const m = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (m) el.setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }
  function applyMeta() {
    let meta = (C.pages && C.pages[pageKey]) || null;
    const service = currentService();
    if (service) meta = { title: service.metaTitle || service.title, description: service.metaDescription || service.short };
    const topic = currentTopic();
    if (topic) meta = { title: topic.metaTitle || topic.title, description: topic.metaDescription || topic.short };
    const post = pageKey === "post" ? currentPost() : null;
    if (post) meta = { title: post.title, description: post.excerpt };
    if (!meta) return;
    const full = pageKey === "home" ? `${C.brand.name} | ${meta.title}` : `${meta.title} | ${C.brand.name}`;
    document.title = full;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", full);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:site_name"]', "content", C.brand.name);
  }

  function currentTopic() {
    const slug = body.dataset.topic;
    return slug ? (C.topics || []).find((t) => t.slug === slug) : null;
  }

  function currentService() {
    const slug = body.dataset.service;
    return slug ? (C.services || []).find((s) => s.slug === slug) : null;
  }

  const posts = () => ((C.blog && C.blog.posts) || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  function currentPost() {
    const slug = new URLSearchParams(location.search).get("post");
    return posts().find((p) => p.slug === slug) || null;
  }
  const fmtDate = (s) => {
    const [y, m, d] = String(s).split("-").map(Number);
    return y ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(y, m - 1, d)) : "";
  };
  const navItems = () => (C.nav || []).filter((n) => !n.section || on(n.section));

  /* ---------- Header ---------- */
  function logoHTML() {
    const b = C.brand;
    if (b.logoImage) {
      return `<a class="logo" href="index.html"><img src="${esc(b.logoImage)}" alt="${esc(b.name)}" width="${b.logoImageWidth || 160}" height="${b.logoImageHeight || 40}"></a>`;
    }
    return `<a class="logo" href="index.html" aria-label="${esc(b.name)}, naar de homepage">
      ${b.logoMark ? `<img class="logo__mark" src="${esc(b.logoMark)}" alt="" width="34" height="34">` : ""}
      <span class="logo__name">${esc(b.name)}</span></a>`;
  }

  function renderHeader() {
    const slot = document.getElementById("site-header");
    if (!slot) return;
    const active = body.dataset.nav;
    const links = navItems().map((n) =>
      `<li><a href="${esc(n.href)}"${n.key === active ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("");
    const an = C.announcement;
    slot.outerHTML = `
      ${an && an.text ? `<div class="announce"><a href="${esc(an.href || "afspraak.html")}">${esc(an.text)} <span aria-hidden="true">→</span></a></div>` : ""}
      <header class="site-header" id="top">
        <div class="container header-inner">
          ${logoHTML()}
          <nav class="site-nav" id="site-nav" aria-label="Hoofdmenu">
            <ul>
              ${links}
              <li class="nav-cta">${btn(bookingHref(C.booking.defaultType), C.booking.headerLabel || C.booking.ctaLabel, "secondary", { cls: "btn--small" })}</li>
            </ul>
          </nav>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            ${icon("menu")}${icon("close")}<span class="nav-toggle__label">Menu</span><span class="sr-only"> openen of sluiten</span>
          </button>
        </div>
      </header>`;
  }

  function initNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!header || !toggle || !nav) return;
    const mq = window.matchMedia("(max-width: 960px)");

    const setOpen = (open, returnFocus) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      body.classList.toggle("nav-open", open);
      if (open) { const first = nav.querySelector("a"); if (first) first.focus(); }
      else if (returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false, true);
      // Focus binnen het geopende menu houden
      if (e.key === "Tab" && nav.classList.contains("is-open")) {
        const items = [toggle, ...nav.querySelectorAll("a")];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    mq.addEventListener("change", () => { if (!mq.matches) setOpen(false); });

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const slot = document.getElementById("site-footer");
    if (!slot) return;
    const c = C.contact, a = c.address || {};
    const year = new Date().getFullYear();
    const nav = navItems().map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join("")
      + `<li><a href="afspraak.html">Afspraak maken</a></li>`;
    const topicLinks = (C.topics || []).map((t) => `<li><a href="${esc(t.page || "onderwerp.html")}">${esc(t.title)}</a></li>`).join("");
    const socials = (c.socials || []).map((s) =>
      `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}<span class="sr-only"> (opent in nieuw venster)</span></a></li>`).join("");
    slot.outerHTML = `
      ${newsletterBlock()}
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              ${logoHTML()}
              <p>${esc(C.brand.tagline)}</p>
            </div>
            <div><h2>Navigatie</h2><ul class="footer-links">${nav}</ul></div>
            <div><h2>Onderwerpen</h2><ul class="footer-links">${topicLinks}</ul></div>
            <div>
              <h2>Contact</h2>
              <ul class="footer-links">
                <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
                ${c.phone ? `<li><a href="tel:${esc(c.phoneHref || c.phone)}">${esc(c.phone)}</a></li>` : ""}
                ${a.show ? `<li>${esc(a.street)}, ${esc(a.postcode)} ${esc(a.city)}</li>` : ""}
                ${socials}
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p style="margin:0">© ${year} ${esc(C.brand.name)}${c.kvk ? ` · KvK ${esc(String(c.kvk).replace(/^KvK\s*/i, ""))}` : ""}</p>
            <ul>
              <li><a href="privacy.html">Privacyverklaring</a></li>
              <li><a href="voorwaarden.html">Algemene voorwaarden</a></li>
            </ul>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Nieuwsbrief ---------- */
  function newsletterBlock() {
    const n = C.newsletter;
    if (!n || !on("newsletter")) return "";
    const mode = n.mode === "link" && n.externalUrl ? "link" : n.mode === "form" && n.endpoint ? "form" : "demo";
    const form = mode === "link"
      ? `<p class="newsletter__actions">${btn(n.externalUrl, n.buttonLabel || "Aanmelden", "primary", { arrow: true })}</p>`
      : `<form class="newsletter__form" id="newsletter-form" novalidate>
          ${mode === "demo" ? `<div class="alert alert--demo" role="note">${icon("info")}<p><strong>Demo.</strong> Er is nog geen nieuwsbriefdienst gekoppeld; aanmeldingen worden niet verstuurd of opgeslagen.</p></div>` : ""}
          <div class="newsletter__fields">
            ${n.nameField ? `<div class="field"><label for="nl-name">Voornaam <span class="optional">(optioneel)</span></label><input class="input" id="nl-name" name="${esc(n.nameField)}" autocomplete="given-name"></div>` : ""}
            <div class="field"><label for="nl-email">E-mailadres</label><input class="input" id="nl-email" type="email" name="${esc(n.emailField || "email")}" autocomplete="email" inputmode="email" required aria-describedby="nl-error"></div>
            <button class="btn btn--primary" type="submit">${esc(n.buttonLabel || "Aanmelden")}${mode === "demo" ? " (demo)" : ""}</button>
          </div>
          <label class="checkbox newsletter__consent" for="nl-consent"><input type="checkbox" id="nl-consent" required><span>${esc(n.consent).replace("privacyverklaring", '<a href="privacy.html">privacyverklaring</a>')}</span></label>
          <div class="hp" aria-hidden="true"><label for="nl-gotcha">Laat dit veld leeg</label><input id="nl-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
          <p class="field-error" id="nl-error" role="alert" hidden></p>
        </form>`;
    return `
      <section class="newsletter" id="nieuwsbrief" aria-labelledby="newsletter-title" data-mode="${mode}">
        <div class="container newsletter__inner">
          <div class="newsletter__text">
            ${n.eyebrow ? `<p class="eyebrow">${esc(n.eyebrow)}</p>` : ""}
            <h2 id="newsletter-title">${esc(n.title)}</h2>
            ${n.script ? `<p class="script-line">${esc(n.script)}</p>` : ""}
            <p>${esc(n.text)}</p>
          </div>
          <div class="newsletter__box">${form}</div>
        </div>
      </section>`;
  }

  function initNewsletter() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    const box = form.parentElement;
    const mode = form.closest(".newsletter").dataset.mode;
    const err = document.getElementById("nl-error");
    const email = document.getElementById("nl-email");
    const consent = document.getElementById("nl-consent");
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const fail = (msg, el) => {
      err.innerHTML = `${icon("alert")}<span>${esc(msg)}</span>`; err.hidden = false;
      email.setAttribute("aria-invalid", el === email ? "true" : "false");
      el.focus();
    };
    const done = (demo) => {
      box.innerHTML = `<div class="newsletter__done" tabindex="-1">${icon("check")}<p><strong>${demo ? "Demo: je bent níet aangemeld" : "Bijna klaar!"}</strong>
        ${demo ? "Zo ziet de bevestiging eruit zodra er een nieuwsbriefdienst is gekoppeld." : "Check je inbox en bevestig je aanmelding via de link in de e-mail."}</p></div>`;
      box.firstElementChild.focus();
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.hidden = true;
      const v = email.value.trim();
      if (!v) return fail("Vul je e-mailadres in.", email);
      if (!EMAIL.test(v)) return fail("Dit e-mailadres lijkt niet te kloppen. Gebruik de vorm naam@voorbeeld.nl.", email);
      if (!consent.checked) return fail("Vink het vakje aan om je aan te melden.", consent);
      email.setAttribute("aria-invalid", "false");
      const data = new FormData(form);
      if (data.get("_gotcha")) return done(false);
      if (mode === "demo") return done(true);
      data.delete("_gotcha");
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true; button.textContent = "Bezig…";
      try {
        const res = await fetch(C.newsletter.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        done(false);
      } catch (x) {
        button.disabled = false; button.textContent = C.newsletter.buttonLabel || "Aanmelden";
        fail("Aanmelden is niet gelukt. Probeer het later opnieuw.", email);
      }
    });
  }

  /* ---------- Gedeelde blokken ---------- */
  function serviceCard(s, i) {
    const meta = [
      s.durationShort ? `<li>${icon("clock")}${esc(s.durationShort)}</li>` : "",
      s.locationShort ? `<li>${icon(s.locationShort.toLowerCase() === "online" ? "video" : "pin")}${esc(s.locationShort)}</li>` : "",
      showPrices() && s.price ? `<li>${icon("euro")}${esc(s.price)}</li>` : ""
    ].join("");
    return `
      <article class="card card--hover service-card reveal" data-delay="${i + 1}">
        <div class="service-card__media">${img(s.image)}</div>
        <div class="service-card__body">
          ${s.eyebrow ? `<span class="tag">${esc(s.eyebrow)}</span>` : ""}
          <h3><a href="${esc(s.page)}">${esc(s.title)}</a></h3>
          <p>${esc(s.short)}</p>
          <ul class="meta-list">${meta}</ul>
          <span class="link-arrow" aria-hidden="true">Meer informatie ${icon("arrow")}</span>
        </div>
      </article>`;
  }

  function postCard(p, i) {
    return `
      <article class="card card--hover service-card post-card reveal" data-delay="${(i % 3) + 1}">
        <div class="service-card__media">${img(p.image)}</div>
        <div class="service-card__body">
          <p class="post-meta">${p.category ? `<span class="tag">${esc(p.category)}</span>` : ""}<span>${esc(fmtDate(p.date))}</span></p>
          <h3><a href="blog-artikel.html?post=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
          <p>${esc(p.excerpt)}</p>
          <span class="link-arrow" aria-hidden="true">Lees verder ${icon("arrow")}</span>
        </div>
      </article>`;
  }

  /* Rustige afsluiter: één knop en een tekstlink. */
  function invite(title, text, secondaryLabel, secondaryHref) {
    return `
      <section class="section invite" aria-labelledby="invite-title">
        <div class="container container--narrow reveal">
          <h2 id="invite-title">${esc(title || "Kennismaken?")}</h2>
          ${text ? `<p class="lead">${esc(text)}</p>` : ""}
          <div class="invite__actions">
            ${btn(bookingHref(C.booking.defaultType), C.booking.headerLabel || C.booking.ctaLabel, "primary")}
            ${secondaryLabel ? `<a class="link-arrow" href="${esc(secondaryHref || "contact.html")}">${esc(secondaryLabel)} ${icon("arrow")}</a>` : ""}
          </div>
        </div>
      </section>`;
  }

  // Tekst met beeld, om en om links en rechts.
  function storyBlock(b, i) {
    const im = b.image && C.images[b.image];
    return `
          <article class="story${im ? "" : " story--text"}${i % 2 ? " story--flip" : ""}">
            ${im ? `<div class="story__media reveal"><div class="media-frame media-frame--landscape">${img(im)}</div></div>` : ""}
            <div class="story__text reveal" data-delay="1">
              <h3>${esc(b.title)}</h3>
              ${paragraphs(b.paragraphs)}
            </div>
          </article>`;
  }

  const podcastOn = () => !!(C.podcast && C.podcast.enabled && (C.podcast.episodes || []).length);
  const postHref = (p) => "blog-artikel.html?post=" + encodeURIComponent(p.slug);
  function episodeRow(e) {
    const label = `<span class="reading__type">Podcast${e.number ? " #" + esc(e.number) : ""}</span><span class="reading__name">${esc(e.title)}${e.duration ? ` <span class="muted">· ${esc(e.duration)}</span>` : ""}</span>`;
    return e.url
      ? `<li><a href="${esc(e.url)}" target="_blank" rel="noopener">${label}${icon("external")}<span class="sr-only"> (opent in nieuw venster)</span></a></li>`
      : `<li><span class="reading__row">${label}${e.sample ? sampleBadge() : ""}</span></li>`;
  }

  function finalCta(title, text, secondary) {
    const h = C.home.finalCta;
    return `
      <section class="section section--tight" aria-labelledby="cta-title">
        <div class="container">
          <div class="cta-band reveal">
            <div>
              <h2 id="cta-title">${esc(title || h.title)}</h2>
              <p>${esc(text || h.text)}</p>
            </div>
            <div class="btn-row">
              ${btn(bookingHref(C.booking.defaultType), C.booking.ctaLabel, "light", { arrow: true })}
              ${secondary !== false ? btn("contact.html", h.secondaryLabel, "ghost") : ""}
            </div>
          </div>
        </div>
      </section>`;
  }

  function faqBlock(items) {
    return `<div class="faq">${(items || []).map((f) => `
      <details class="reveal">
        <summary>${esc(f.q)}<span class="faq__plus" aria-hidden="true"></span></summary>
        <div class="faq__answer"><p>${esc(f.a)}</p></div>
      </details>`).join("")}</div>`;
  }

  function factsList(s) {
    const rows = [
      ["clock", "Duur", s.duration],
      ["pin", "Locatie", s.location],
      s.online ? ["video", "Online", "Ook online mogelijk"] : null,
      showPrices() && s.price ? ["euro", "Tarief", `${esc(s.price)}${s.priceNote ? `<span class="price-note">${esc(s.priceNote)}</span>` : ""}`, true] : null
    ].filter(Boolean);
    return `<dl class="facts">${rows.map((r) => `<div>${icon(r[0])}<dt>${r[1]}</dt><dd>${r[3] ? r[2] : esc(r[2])}</dd></div>`).join("")}</dl>`;
  }

  /* ---------- Pagina's ---------- */
  const pages = {};

  pages.home = function () {
    const h = C.home;
    const featured = (C.services || []).filter((s) => s.featured).slice(0, 3);
    const reviews = C.reviews || [];
    const topics = C.topics || [];
    const blocks = {
      hero() {
        return `
      <section class="hero">
        <div class="container hero__grid">
          <div class="hero__text">
            <p class="eyebrow reveal">${esc(h.hero.eyebrow)}</p>
            <h1 class="reveal" data-delay="1">${esc(h.hero.title)}</h1>
            ${h.hero.script ? `<p class="script-line reveal" data-delay="1">${esc(h.hero.script)}</p>` : ""}
            <p class="lead reveal" data-delay="2">${esc(h.hero.intro)}</p>
            <div class="btn-row reveal" data-delay="3">
              ${topics.length ? btn("#onderwerpen", h.hero.primaryLabel || "Waar kan ik je mee helpen?", "primary", { arrow: true }) : ""}
              ${btn(bookingHref(C.booking.defaultType), h.hero.secondaryLabel || C.booking.ctaLabel, topics.length ? "secondary" : "primary", { arrow: !topics.length })}
            </div>
            ${h.hero.note ? `<p class="hero__note reveal" data-delay="4">${icon("check")}${esc(h.hero.note)}</p>` : ""}
          </div>
          <div class="hero__media reveal" data-delay="2">
            <div class="media-frame media-frame--portrait">${img(C.images.hero, { eager: true })}</div>
            ${h.hero.badgeTitle ? `<div class="floating-badge"><span class="floating-badge__icon">${icon("leaf")}</span><span><strong>${esc(h.hero.badgeTitle)}</strong>${esc(h.hero.badgeText)}</span></div>` : ""}
          </div>
        </div>
      </section>`;
      },
      topics() {
        if (!topics.length) return "";
        const t = h.topics || {};
        return `
      <section class="section section--sand" id="onderwerpen" aria-labelledby="topics-title">
        <div class="container">
          ${sectionHead(t.eyebrow, t.title, t.intro, true).replace("<h2>", '<h2 id="topics-title">')}
          <div class="grid topic-grid">
            ${topics.map((it, i) => `
              <article class="card ${it.page ? "card--hover " : ""}topic reveal" data-delay="${(i % 4) + 1}">
                <div class="topic__icon">${icon(it.icon || "leaf")}</div>
                <h3>${it.page ? `<a href="${esc(it.page)}">${esc(it.title)}</a>` : esc(it.title)}</h3>
                <p>${esc(it.short)}</p>
                ${it.page ? `<span class="link-arrow" aria-hidden="true">${esc(t.linkLabel || "Lees meer")} ${icon("arrow")}</span>` : ""}
              </article>`).join("")}
          </div>
        </div>
      </section>`;
      },
      help() {
        const x = h.help;
        if (!x) return "";
        return `
      <section class="section" aria-labelledby="help-title">
        <div class="container help">
          <div class="help__head reveal">
            <p class="eyebrow">${esc(x.eyebrow)}</p>
            <h2 id="help-title">${esc(x.title)}</h2>
            ${x.script ? `<p class="script-line">${esc(x.script)}</p>` : ""}
            <p class="lead">${esc(x.intro)}</p>
            ${x.linkLabel ? `<a class="link-arrow" href="${esc(x.linkHref || "coaching.html")}">${esc(x.linkLabel)} ${icon("arrow")}</a>` : ""}
          </div>
          <ol class="help__list">
            ${(x.items || []).map((it, i) => `
              <li class="help__item reveal" data-delay="${i + 1}">
                <span class="help__icon">${icon(it.icon || "leaf")}</span>
                <div><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></div>
              </li>`).join("")}
          </ol>
        </div>
      </section>`;
      },
      blog() {
        const latest = posts().slice(0, (C.blog && C.blog.homeCount) || 3);
        if (!on("blog") || !latest.length) return "";
        const pod = h.blog.podcastUrl;
        return `
      <section class="section" aria-labelledby="blog-title">
        <div class="container">
          <div class="section-row reveal">
            <div><p class="eyebrow">${esc(h.blog.eyebrow)}</p><h2 id="blog-title">${esc(h.blog.title)}</h2></div>
            <div class="btn-row">
              ${pod ? `<a class="link-arrow" href="${esc(pod)}" target="_blank" rel="noopener">${esc(h.blog.podcastLabel || "Luister de podcast")} ${icon("external")}</a>` : ""}
              <a class="link-arrow" href="blog.html">Alle artikelen ${icon("arrow")}</a>
            </div>
          </div>
          <div class="grid grid--3">${latest.map(postCard).join("")}</div>
        </div>
      </section>`;
      },
      about() {
        if (!on("coachIntro")) return "";
        const a = h.intro;
        return `
      <section class="section section--green" aria-labelledby="intro-title">
        <div class="container split split--portrait">
          <div class="reveal"><div class="media-frame media-frame--portrait">${img(C.images.about)}</div></div>
          <div class="split__text reveal" data-delay="1">
            <p class="eyebrow">${esc(a.eyebrow)}</p>
            <h2 id="intro-title">${esc(a.title)}</h2>
            ${a.script ? `<p class="script-line">${esc(a.script)}</p>` : ""}
            ${paragraphs(a.paragraphs)}
            <p class="signature">${esc(C.brand.coachName)} <span class="muted" style="font-size:1rem;font-style:normal;font-family:var(--font-body)">· ${esc(C.brand.coachRole)}</span></p>
            <a class="link-arrow" href="over-mij.html">${esc(a.linkLabel)} ${icon("arrow")}</a>
          </div>
        </div>
      </section>`;
      },
      cta() { return finalCta(); },
      opening() {
        const o = h.opening;
        return `
      <section class="opening">
        <div class="container opening__grid">
          <div class="opening__text">
            ${o.eyebrow ? `<p class="eyebrow reveal">${esc(o.eyebrow)}</p>` : ""}
            <h1 class="reveal" data-delay="1">${esc(o.title)}</h1>
            <p class="lead reveal" data-delay="2">${esc(o.intro)}</p>
            ${o.linkLabel ? `<a class="link-arrow reveal" data-delay="3" href="${esc(o.linkHref || "#verhaal")}">${esc(o.linkLabel)} ${icon("arrow")}</a>` : ""}
          </div>
          <div class="opening__media reveal" data-delay="2"><div class="media-frame media-frame--tall">${img(C.images.subject || C.images.hero, { eager: true })}</div></div>
        </div>
      </section>`;
      },
      story() {
        const s = h.story;
        if (!s) return "";
        return `
      <section class="section prose-section" id="verhaal" aria-labelledby="story-title">
        <div class="container">
          <div class="prose-head reveal">
            ${s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ""}
            <h2 id="story-title">${esc(s.title)}</h2>
          </div>
          ${(s.blocks || []).map((b, i) => storyBlock(b, i)).join("")}
          ${s.linkLabel ? `<p class="prose-more reveal"><a class="link-arrow" href="${esc(s.linkHref || "onderwerp.html")}">${esc(s.linkLabel)} ${icon("arrow")}</a></p>` : ""}
        </div>
      </section>`;
      },
      insights() {
        const x = h.insights;
        if (!x) return "";
        const list = on("blog") ? posts().slice(0, x.postsCount == null ? 3 : x.postsCount) : [];
        const pod = podcastOn() ? (C.podcast.episodes || []).slice(0, x.episodesCount == null ? 2 : x.episodesCount) : [];
        return `
      <section class="section section--sand" aria-labelledby="insights-title">
        <div class="container">
          <div class="prose-head reveal">
            ${x.eyebrow ? `<p class="eyebrow">${esc(x.eyebrow)}</p>` : ""}
            <h2 id="insights-title">${esc(x.title)}</h2>
          </div>
          <ol class="insights">
            ${(x.items || []).map((it, i) => `
              <li class="insight reveal" data-delay="${i + 1}">
                <span class="insight__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
                <h3>${esc(it.title)}</h3>
                <p>${esc(it.text)}</p>
              </li>`).join("")}
          </ol>
          ${list.length || pod.length ? `
          <div class="reading reveal">
            <h3 class="reading__title">${esc(x.postsTitle || "Verder lezen")}</h3>
            <ul class="reading__list">
              ${list.map((p) => `<li><a href="${postHref(p)}"><span class="reading__type">Artikel</span><span class="reading__name">${esc(p.title)}</span>${icon("arrow")}</a></li>`).join("")}
              ${pod.map((e) => episodeRow(e)).join("")}
            </ul>
          </div>` : ""}
        </div>
      </section>`;
      },
      guidance() {
        const g = h.guidance;
        if (!g) return "";
        return `
      <section class="section" aria-labelledby="guidance-title">
        <div class="container container--narrow guidance reveal">
          ${g.eyebrow ? `<p class="eyebrow">${esc(g.eyebrow)}</p>` : ""}
          <h2 id="guidance-title">${esc(g.title)}</h2>
          ${paragraphs(g.paragraphs)}
          ${g.linkLabel ? `<a class="link-arrow" href="${esc(g.linkHref || "coaching.html")}">${esc(g.linkLabel)} ${icon("arrow")}</a>` : ""}
        </div>
      </section>`;
      },
      invite() {
        const v = h.invite || {};
        return invite(v.title, v.text, v.secondaryLabel, v.secondaryHref);
      },
    challenges() {
      let out = "";
      if (on("challenges")) {
        const ch = h.challenges;
        out += `
        <section class="section section--sand" aria-labelledby="challenges-title">
          <div class="container">
            ${sectionHead(ch.eyebrow, ch.title, ch.intro, true).replace("<h2>", '<h2 id="challenges-title">')}
            <div class="grid grid--${ch.items.length === 4 ? 4 : 3}">
              ${ch.items.map((it, i) => `
                <div class="card card--hover challenge reveal" data-delay="${(i % 4) + 1}">
                  <div class="challenge__icon">${icon(it.icon || "leaf")}</div>
                  <h3>${esc(it.title)}</h3>
                  <p>${esc(it.text)}</p>
                </div>`).join("")}
            </div>
            ${ch.outro ? `<p class="challenges-outro reveal">${esc(ch.outro)}</p>` : ""}
          </div>
        </section>`;
      }
  
  
      return out;
    },
    services() {
      let out = "";
      if (on("featuredServices") && featured.length) {
        out += `
        <section class="section" aria-labelledby="services-title">
          <div class="container">
            ${sectionHead(h.services.eyebrow, h.services.title, h.services.intro).replace("<h2>", '<h2 id="services-title">')}
            <div class="grid grid--3">${featured.map(serviceCard).join("")}</div>
          </div>
        </section>`;
      }
  
  
      return out;
    },
    steps() {
      let out = "";
      if (on("steps")) {
        out += `
        <section class="section" aria-labelledby="steps-title">
          <div class="container">
            ${sectionHead(h.steps.eyebrow, h.steps.title, h.steps.intro, true).replace("<h2>", '<h2 id="steps-title">')}
            <ol class="steps">
              ${h.steps.items.map((s, i) => `
                <li class="step reveal" data-delay="${i + 1}">
                  <span class="step__num" aria-hidden="true">${i + 1}</span>
                  <h3><span class="sr-only">Stap ${i + 1}: </span>${esc(s.title)}</h3>
                  <p>${esc(s.text)}</p>
                </li>`).join("")}
            </ol>
            <p class="reveal" style="text-align:center;margin-top:48px">${btn(bookingHref(C.booking.defaultType), C.booking.ctaLabel, "primary", { arrow: true })}</p>
          </div>
        </section>`;
      }
  
  
      return out;
    },
    reviews() {
      let out = "";
      if (on("reviews") && reviews.length) {
        const anySample = reviews.some((r) => r.sample);
        out += `
        <section class="section section--sand" aria-labelledby="reviews-title">
          <div class="container">
            ${sectionHead(h.reviews.eyebrow, h.reviews.title, anySample ? h.reviews.intro : "", true).replace("<h2>", '<h2 id="reviews-title">')}
            <div class="grid grid--3">
              ${reviews.map((r, i) => `
                <figure class="card review reveal" data-delay="${i + 1}" style="margin:0">
                  ${r.sample ? sampleBadge() : ""}
                  <span class="review__mark" aria-hidden="true">“</span>
                  <blockquote>${esc(r.quote)}</blockquote>
                  <figcaption><strong>${esc(r.name)}</strong>${esc(r.context)}</figcaption>
                </figure>`).join("")}
            </div>
          </div>
        </section>`;
      }
  
  
      return out;
    },
    faq() {
      let out = "";
      if (on("faq") && (C.faq || []).length) {
        out += `
        <section class="section" aria-labelledby="faq-title">
          <div class="container container--narrow">
            ${sectionHead(h.faq.eyebrow, h.faq.title, "", true).replace("<h2>", '<h2 id="faq-title">')}
            ${faqBlock(C.faq)}
          </div>
        </section>`;
      }
  
  
      return out;
    },
    };
    const order = h.order || ["opening", "story", "insights", "guidance", "about", "invite"];
    return order.map((k) => (blocks[k] ? blocks[k]() : "")).join("");
  };

  pages.topic = function () {
    const t = currentTopic();
    if (!t) return `<section class="section"><div class="container"><h1>Onderwerp niet gevonden</h1><p>Controleer of <code>data-topic</code> op deze pagina overeenkomt met een <code>slug</code> bij topics in config.js.</p></div></section>`;
    const others = (C.topics || []).filter((o) => o.slug !== t.slug && o.page);
    return `
      <section class="page-hero">
        <div class="container container--narrow">
          <nav class="breadcrumb" aria-label="Kruimelpad">
            <ol><li><a href="index.html">Home</a></li><li><a href="onderwerp.html">${esc((C.subject && C.subject.title) || "Het onderwerp")}</a></li><li aria-current="page">${esc(t.title)}</li></ol>
          </nav>
          <div class="topic-hero__icon reveal">${icon(t.icon || "leaf")}</div>
          <h1 class="reveal" data-delay="1">${esc(t.title)}</h1>
          <p class="lead reveal" data-delay="2">${esc(t.intro || t.short)}</p>
        </div>
      </section>
      <section class="section section--sand">
        <div class="container container--narrow topic-body">
          ${(t.recognise || []).length ? `<section class="reveal" aria-labelledby="recognise"><h2 id="recognise">Herken je dit?</h2>${checkList(t.recognise)}</section>` : ""}
          <div class="reveal">${paragraphs(t.content)}</div>
          ${(t.help || []).length ? `<section class="card topic-help reveal" aria-labelledby="topic-help"><h2 id="topic-help">Waar ik je mee help</h2>${checkList(t.help)}
            <div class="btn-row">${btn(bookingHref(C.booking.defaultType), C.booking.ctaLabel, "primary", { arrow: true })}<a class="link-arrow" href="coaching.html">Bekijk de mogelijkheden ${icon("arrow")}</a></div></section>` : ""}
        </div>
      </section>
      ${others.length ? `
      <section class="section section--tight" aria-labelledby="others-title">
        <div class="container">
          <h2 id="others-title" class="reveal" style="font-size:2rem">Andere onderwerpen</h2>
          <div class="grid grid--${others.length >= 3 ? 3 : 2}">
            ${others.map((o) => `<article class="card card--hover topic reveal"><div class="topic__icon">${icon(o.icon || "leaf")}</div><h3><a href="${esc(o.page)}">${esc(o.title)}</a></h3><p>${esc(o.short)}</p></article>`).join("")}
          </div>
        </div>
      </section>` : ""}
      ${finalCta()}`;
  };

  pages.about = function () {
    const a = C.about;
    let out = `
      <section class="page-hero page-hero--split">
        <div class="container page-hero__grid">
          <div>
            <p class="eyebrow reveal">${esc(a.eyebrow)}</p>
            <h1 class="reveal" data-delay="1">${esc(a.title)}</h1>
            <p class="lead reveal" data-delay="2">${esc(a.intro)}</p>
            <div class="btn-row reveal" data-delay="3">${btn(bookingHref(C.booking.defaultType), C.booking.ctaLabel, "primary", { arrow: true })}</div>
          </div>
          <div class="reveal" data-delay="2"><div class="media-frame media-frame--portrait">${img(C.images.about, { eager: true })}</div></div>
        </div>
      </section>

      <section class="section section--sand" aria-labelledby="story-title">
        <div class="container split">
          <div class="prose reveal">
            <h2 id="story-title">${esc(a.storyTitle)}</h2>
            ${paragraphs(a.story)}
          </div>
          <div class="reveal" data-delay="1"><div class="media-frame media-frame--landscape">${img(C.images.aboutWide)}</div></div>
        </div>
      </section>

      <section class="section" aria-labelledby="vision-title">
        <div class="container">
          <div class="section-head reveal">
            <p class="eyebrow">Visie</p>
            <h2 id="vision-title">${esc(a.visionTitle)}</h2>
          </div>
          <blockquote class="quote-block reveal">${esc(a.vision)}</blockquote>
          <div class="grid grid--3">
            ${(a.values || []).map((v, i) => `
              <div class="card card--hover value reveal" data-delay="${i + 1}">
                <div class="challenge__icon">${icon(["user", "target", "chat"][i % 3])}</div>
                <h3>${esc(v.title)}</h3><p>${esc(v.text)}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    const showExp = on("experience") && (a.experience || []).length;
    const showQual = on("qualifications") && (a.qualifications || []).length;
    if (showExp || showQual) {
      const qualSample = (a.qualifications || []).some((q) => isPlaceholder(q.title));
      const expSample = (a.experience || []).some(isPlaceholder);
      out += `
      <section class="section section--green" aria-label="Ervaring en opleidingen">
        <div class="container grid grid--2" style="gap:clamp(32px,5vw,72px)">
          ${showExp ? `
          <div class="reveal">
            <h2>${esc(a.experienceTitle)}</h2>
            ${expSample ? sampleBadge("Voorbeeldinhoud – vul je eigen gegevens in") : ""}
            ${checkList(a.experience)}
          </div>` : ""}
          ${showQual ? `
          <div class="reveal" data-delay="1">
            <h2>${esc(a.qualificationsTitle)}</h2>
            ${qualSample ? sampleBadge("Voorbeeldinhoud – vul je eigen gegevens in") : ""}
            <ul class="qual-list">
              ${a.qualifications.map((q) => `<li><div><strong>${esc(q.title)}</strong><span>${esc(q.org)}</span></div><span class="qual-year">${esc(q.year)}</span></li>`).join("")}
            </ul>
            ${qualSample && a.qualificationsNote ? `<p class="sample-note">${icon("info")}<span>${esc(a.qualificationsNote)}</span></p>` : ""}
          </div>` : ""}
        </div>
      </section>`;
    }
    out += finalCta(a.ctaTitle, a.ctaText);
    return out;
  };

  const pageHead = (eyebrow, title, intro) => `
      <section class="page-hero">
        <div class="container">
          <div class="section-head" style="margin-bottom:0">
            <p class="eyebrow reveal">${esc(eyebrow)}</p>
            <h1 class="reveal" data-delay="1">${esc(title)}</h1>
            ${intro ? `<p class="lead reveal" data-delay="2">${esc(intro)}</p>` : ""}
          </div>
        </div>
      </section>`;

  pages.coaching = function () {
    const c = C.coaching;
    return `
      ${pageHead(c.eyebrow, c.title, c.intro)}
      <section class="section" style="padding-top:0" aria-label="Overzicht van het aanbod">
        <div class="container">
          ${(C.services || []).map((s) => {
            const meta = [
              s.duration ? `<li>${icon("clock")}${esc(s.duration)}</li>` : "",
              s.location ? `<li>${icon(s.locationShort && s.locationShort.toLowerCase() === "online" ? "video" : "pin")}${esc(s.location)}</li>` : "",
              showPrices() && s.price ? `<li>${icon("euro")}<strong>${esc(s.price)}</strong>${s.priceNote ? `&nbsp;<span class="muted">${esc(s.priceNote)}</span>` : ""}</li>` : ""
            ].join("");
            return `
            <article class="offer" aria-labelledby="offer-${esc(s.slug)}">
              <div class="offer__media reveal"><div class="media-frame media-frame--landscape">${img(s.image)}</div></div>
              <div class="reveal" data-delay="1">
                ${s.eyebrow ? `<span class="tag">${esc(s.eyebrow)}</span>` : ""}
                <h2 id="offer-${esc(s.slug)}"><a href="${esc(s.page)}">${esc(s.title)}</a></h2>
                <p class="offer__lead">${esc(s.short)}</p>
                <ul class="meta-list meta-list--stack">${meta}</ul>
                <div class="btn-row">
                  ${btn(bookingHref(s.bookingType), s.bookingLabel || "Plan een afspraak", "primary")}
                  ${btn(s.page, "Meer info", "ghost", { arrow: true })}
                </div>
              </div>
            </article>`;
          }).join("")}
        </div>
      </section>
      ${finalCta(c.helpTitle, c.helpText)}`;
  };

  pages.service = function () {
    const s = currentService();
    if (!s) return `<section class="section"><div class="container"><h1>Dienst niet gevonden</h1><p>Controleer of <code>data-service</code> op deze pagina overeenkomt met een <code>slug</code> in config.js.</p></div></section>`;
    const others = (C.services || []).filter((o) => o.slug !== s.slug);
    return `
      <section class="page-hero page-hero--split">
        <div class="container">
          <nav class="breadcrumb" aria-label="Kruimelpad">
            <ol><li><a href="index.html">Home</a></li><li><a href="coaching.html">Coaching</a></li><li aria-current="page">${esc(s.title)}</li></ol>
          </nav>
          <div class="page-hero__grid">
            <div>
              ${s.eyebrow ? `<span class="tag reveal">${esc(s.eyebrow)}</span>` : ""}
              <h1 class="reveal" data-delay="1">${esc(s.title)}</h1>
              <p class="lead reveal" data-delay="2">${esc(s.intro || s.short)}</p>
              <div class="btn-row reveal" data-delay="3">
                ${btn(bookingHref(s.bookingType), s.bookingLabel || "Plan een afspraak", "primary", { arrow: true })}
              </div>
            </div>
            <div class="reveal" data-delay="2"><div class="media-frame media-frame--landscape">${img(s.image, { eager: true })}</div></div>
          </div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="container detail">
          <div class="detail__main">
            <div class="grid grid--2 reveal">
              <section aria-labelledby="forwho"><h2 id="forwho">Voor wie</h2>${checkList(s.forWho)}</section>
              ${(s.includes || []).length ? `<section aria-labelledby="includes"><h2 id="includes">Wat je krijgt</h2>${checkList(s.includes)}</section>` : ""}
            </div>
            ${paragraphs(s.content)}
            ${(s.process || []).length ? `
            <section class="reveal" aria-labelledby="process">
              <h2 id="process">Zo verloopt het</h2>
              <ol class="process">${s.process.map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("")}</ol>
            </section>` : ""}
          </div>
          <aside class="card facts-card reveal" aria-labelledby="facts-title">
            <h2 id="facts-title">Praktisch</h2>
            ${factsList(s)}
            ${btn(bookingHref(s.bookingType), s.bookingLabel || "Plan een afspraak", "primary", { cls: "btn--block" })}
            <p class="facts-card__sub muted">Vragen? <a href="contact.html">Neem contact op</a></p>
          </aside>
        </div>
      </section>

      ${others.length ? `
      <section class="section section--tight" aria-labelledby="others-title">
        <div class="container">
          <h2 id="others-title" class="reveal" style="font-size:1.6rem">Ander aanbod</h2>
          <div class="grid grid--${others.length >= 3 ? 3 : 2}">${others.map(serviceCard).join("")}</div>
        </div>
      </section>` : ""}`;
  };

  pages.blog = function () {
    const b = C.blog || {};
    const list = posts();
    const pc = C.podcast || {};
    return `
      ${pageHead(b.eyebrow || "Blog", b.title || "Blog", b.intro)}
      <section class="section" style="padding-top:0" aria-labelledby="articles-title">
        <div class="container">
          <h2 id="articles-title" class="sr-only">Artikelen</h2>
          ${list.length ? `<div class="grid grid--3">${list.map(postCard).join("")}</div>` : `<p class="muted">Er zijn nog geen artikelen.</p>`}
        </div>
      </section>
      ${podcastOn() ? `
      <section class="section section--sand" id="podcast" aria-labelledby="podcast-title">
        <div class="container container--narrow">
          <div class="prose-head reveal">
            <p class="eyebrow">${esc(pc.title || "Podcast")}</p>
            <h2 id="podcast-title">Luister mee</h2>
            ${pc.intro ? `<p class="lead">${esc(pc.intro)}</p>` : ""}
          </div>
          <ul class="reading__list reveal">${pc.episodes.map(episodeRow).join("")}</ul>
          ${pc.platformUrl ? `<p class="prose-more"><a class="link-arrow" href="${esc(pc.platformUrl)}" target="_blank" rel="noopener">${esc(pc.platformLabel || "Alle afleveringen")} ${icon("external")}</a></p>` : ""}
        </div>
      </section>` : ""}
      ${invite(C.home.invite && C.home.invite.title, C.home.invite && C.home.invite.text, C.home.invite && C.home.invite.secondaryLabel, C.home.invite && C.home.invite.secondaryHref)}`;
  };

  // Pagina "Het onderwerp": doorlopend verhaal met beelden en de deelonderwerpen.
  pages.subject = function () {
    const s = C.subject || {};
    const topics = C.topics || [];
    const v = C.home.invite || {};
    return `
      <section class="opening opening--page">
        <div class="container opening__grid">
          <div class="opening__text">
            <p class="eyebrow reveal">${esc(s.eyebrow || "Het onderwerp")}</p>
            <h1 class="reveal" data-delay="1">${esc(s.title)}</h1>
            <p class="lead reveal" data-delay="2">${esc(s.intro)}</p>
          </div>
          ${s.image && C.images[s.image] ? `<div class="opening__media reveal" data-delay="2"><div class="media-frame media-frame--tall">${img(C.images[s.image], { eager: true })}</div></div>` : ""}
        </div>
      </section>
      <section class="section prose-section" style="padding-top:0">
        <div class="container">
          ${(s.sections || []).map((b, i) => storyBlock(b, i)).join("")}
        </div>
      </section>
      ${topics.length ? `
      <section class="section section--sand" aria-labelledby="subtopics-title">
        <div class="container container--narrow">
          <h2 id="subtopics-title" class="reveal">${esc(s.topicsTitle || "Lees verder over")}</h2>
          <ul class="subtopics reveal">
            ${topics.map((t) => `<li>${t.page ? `<a href="${esc(t.page)}">` : "<div>"}<span class="subtopics__name">${esc(t.title)}</span><span class="subtopics__text">${esc(t.short)}</span>${t.page ? `${icon("arrow")}</a>` : "</div>"}</li>`).join("")}
          </ul>
        </div>
      </section>` : ""}
      ${invite(v.title, v.text, v.secondaryLabel, v.secondaryHref)}`;
  };

  function articleBody(blocks) {
    return (blocks || []).map((b) => {
      if (b.h2) return `<h2>${esc(b.h2)}</h2>`;
      if (b.list) return `<ul>${b.list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
      if (b.quote) return `<blockquote class="quote-block">${esc(b.quote)}</blockquote>`;
      return `<p>${esc(b.p || "")}</p>`;
    }).join("");
  }

  pages.post = function () {
    const p = currentPost();
    if (!p) return `
      <section class="section"><div class="container container--narrow" style="text-align:center">
        <h1>Artikel niet gevonden</h1>
        <p class="lead" style="margin:0 auto 2rem">Dit artikel bestaat niet (meer).</p>
        ${btn("blog.html", "Naar de blog", "primary")}
      </div></section>`;
    const more = posts().filter((o) => o.slug !== p.slug).slice(0, 3);
    return `
      <article>
        <header class="page-hero">
          <div class="container container--narrow">
            <nav class="breadcrumb" aria-label="Kruimelpad">
              <ol><li><a href="index.html">Home</a></li><li><a href="blog.html">Blog</a></li><li aria-current="page">${esc(p.title)}</li></ol>
            </nav>
            ${p.sample ? sampleBadge("Voorbeeldartikel – vervang door je eigen tekst") : ""}
            <h1>${esc(p.title)}</h1>
            <p class="post-meta">${p.category ? `<span class="tag">${esc(p.category)}</span>` : ""}<span>${esc(fmtDate(p.date))}</span>${p.readTime ? `<span>· ${esc(p.readTime)} lezen</span>` : ""}</p>
          </div>
        </header>
        <div class="container container--narrow">
          <div class="media-frame media-frame--wide">${img(p.image, { eager: true })}</div>
          <div class="article-body">${articleBody(p.body)}</div>
          <div class="card article-cta">
            <div><h2>${esc(C.home.finalCta.title)}</h2><p class="muted">${esc(C.home.finalCta.text)}</p></div>
            ${btn(bookingHref(C.booking.defaultType), C.booking.ctaLabel, "primary")}
          </div>
        </div>
      </article>
      ${more.length ? `
      <section class="section" aria-labelledby="more-title">
        <div class="container">
          <div class="section-row reveal"><h2 id="more-title" style="font-size:1.6rem;margin:0">Meer artikelen</h2><a class="link-arrow" href="blog.html">Alle artikelen ${icon("arrow")}</a></div>
          <div class="grid grid--3">${more.map(postCard).join("")}</div>
        </div>
      </section>` : ""}`;
  };

  pages.booking = function () {
    const c = C.contact;
    return `
      ${pageHead("Afspraak maken", "Plan je afspraak", "Kies een gesprek, een dag en een tijd.")}
      <section class="section" style="padding-top:0">
        <div class="container container--booking">
          <div class="card booking" id="booking-app">
            <noscript><p>Je hebt JavaScript nodig om online een afspraak te plannen. Mail gerust naar <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>.</p></noscript>
          </div>
          <p class="booking-help muted">Liever persoonlijk contact? Mail <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>${c.phone ? ` of bel <a href="tel:${esc(c.phoneHref || c.phone)}">${esc(c.phone)}</a>` : ""}.</p>
        </div>
      </section>`;
  };

  pages.contact = function () {
    const c = C.contact, a = c.address || {};
    return `
      ${pageHead("Contact", "Neem gerust contact op", c.responseTime)}
      <section class="section" style="padding-top:0">
        <div class="container contact-grid">
          <div class="card form-card reveal" id="contact-form-root"></div>
          <aside class="card info-block contact-info reveal" data-delay="1" aria-label="Contactgegevens">
            <div class="info-line">${icon("mail")}<a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
            ${c.phone ? `<div class="info-line">${icon("phone")}<a href="tel:${esc(c.phoneHref || c.phone)}">${esc(c.phone)}</a></div>` : ""}
            ${a.show ? `<address class="info-line" style="font-style:normal">${icon("pin")}<span>${esc(a.street)}<br>${esc(a.postcode)} ${esc(a.city)}</span></address>` : ""}
            ${(c.hours || []).length ? `<div class="info-line">${icon("clock")}<ul class="hours">${c.hours.map((h) => `<li><span>${esc(h.days)}</span><span>${esc(h.time)}</span></li>`).join("")}</ul></div>` : ""}
            ${c.onlineAvailability ? `<div class="info-line">${icon("video")}<span>${esc(c.onlineAvailability)}</span></div>` : ""}
            ${(c.socials || []).length ? `<ul class="socials">${c.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${icon("link")}${esc(s.label)}<span class="sr-only"> (opent in nieuw venster)</span></a></li>`).join("")}</ul>` : ""}
          </aside>
        </div>
      </section>`;
  };

  /* ---------- Vul [data-fill]-velden (gebruikt op o.a. juridische pagina's) ---------- */
  function fillData() {
    document.querySelectorAll("[data-fill]").forEach((el) => {
      const v = get(el.dataset.fill);
      if (v != null && v !== "") el.textContent = v;
    });
    document.querySelectorAll("[data-fill-href]").forEach((el) => {
      const v = get(el.dataset.fillHref);
      if (v) el.setAttribute("href", (el.dataset.prefix || "") + v);
    });
  }

  /* ---------- Scroll-animaties ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Start ---------- */
  applyTheme();
  applyMeta();
  renderHeader();
  const main = document.getElementById("main");
  const renderer = body.dataset.service ? pages.service : body.dataset.topic ? pages.topic : pages[pageKey];
  if (main && renderer && !main.hasAttribute("data-static")) main.innerHTML = renderer();
  renderFooter();
  fillData();
  initNav();
  initNewsletter();
  initReveal();
})();
