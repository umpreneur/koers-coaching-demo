/* =====================================================================
   NL / EN
   ---------------------------------------------------------------------
   De site is in het Nederlands geschreven. Kiest de bezoeker EN, dan
   vervangt dit script elke Nederlandse tekst door de vertaling uit
   i18n-en.js (ook teksten die later door JavaScript verschijnen).
   Staat een tekst niet in i18n-en.js, dan blijft hij Nederlands.

   Taalkeuze: ?lang=en of ?lang=nl in de link, anders de eerdere keuze
   van de bezoeker, anders de taal van de browser.
   ===================================================================== */
(function () {
  const SRC = window.I18N_EN || {};
  const DICT = SRC.dict || {};
  const PATTERNS = SRC.patterns || [];
  const MOUNT = SRC.mount || null; // { selector, before } waar de NL/EN-knop komt

  function pick() {
    const fromUrl = new URLSearchParams(location.search).get('lang') || (location.hash.match(/lang=(nl|en)/) || [])[1];
    if (fromUrl === 'nl' || fromUrl === 'en') { try { localStorage.setItem('lang', fromUrl); } catch (e) {} return fromUrl; }
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    if (saved === 'nl' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().startsWith('nl') ? 'nl' : 'en';
  }
  const lang = pick();
  document.documentElement.lang = lang;

  // Vertaal één tekst: eerst letterlijk, dan via patronen, dan per deel rond " · ".
  function core(k) {
    if (Object.prototype.hasOwnProperty.call(DICT, k)) return DICT[k];
    for (const [re, to] of PATTERNS) {
      const m = k.match(re);
      if (m) return typeof to === 'function' ? to(m, core) : k.replace(re, to);
    }
    if (k.includes(' · ')) return k.split(' · ').map(core).join(' · ');
    const p = k.match(/^(.*?)([.:!?…])$/);
    if (p && Object.prototype.hasOwnProperty.call(DICT, p[1])) return DICT[p[1]] + p[2];
    return k;
  }
  function t(s) {
    if (lang !== 'en' || s == null) return s;
    const m = String(s).match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2]) return s;
    const out = core(m[2].replace(/\s+/g, ' '));
    return out === m[2].replace(/\s+/g, ' ') ? s : m[1] + out + m[3];
  }

  const ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];
  const skip = (el) => !el || el.closest('script, style, [data-no-i18n]');
  function doText(n) {
    if (skip(n.parentElement)) return;
    const out = t(n.data);
    if (out !== n.data) n.data = out;
  }
  function doAttrs(el) {
    if (skip(el)) return;
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const v = el.getAttribute(a), out = t(v);
      if (out !== v) el.setAttribute(a, out);
    }
    if (el.tagName === 'META' && /description|og:title|og:description/.test(el.getAttribute('name') || el.getAttribute('property') || '')) {
      const out = t(el.content);
      if (out !== el.content) el.content = out;
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    doAttrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (w.nextNode()) { const n = w.currentNode; n.nodeType === 3 ? doText(n) : doAttrs(n); }
  }

  if (lang === 'en') {
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'childList') r.addedNodes.forEach(walk);
        else if (r.type === 'characterData') doText(r.target);
        else doAttrs(r.target);
      }
      const title = t(document.title);
      if (title !== document.title) document.title = title;
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat('content') });
    // Vangnet voor tekst die de browser tijdens het laden in stukken invoegt.
    document.addEventListener('DOMContentLoaded', () => { walk(document.head); walk(document.body); });
  }

  // NL/EN-knop: wisselen laadt de pagina opnieuw in de gekozen taal.
  function setLang(next) {
    try { localStorage.setItem('lang', next); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    url.hash = url.hash.replace(/&?lang=(nl|en)/, '').replace(/^#&?$/, '');
    location.replace(url);
  }
  function mountSwitch() {
    if (!MOUNT || document.querySelector('.i18n-switch')) return;
    const host = document.querySelector(MOUNT.selector);
    if (!host) return;
    const box = document.createElement('div');
    box.className = 'i18n-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', lang === 'en' ? 'Language' : 'Taal');
    box.setAttribute('data-no-i18n', '');
    ['nl', 'en'].forEach((l) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = l.toUpperCase();
      b.setAttribute('aria-pressed', String(l === lang));
      b.addEventListener('click', () => { if (l !== lang) setLang(l); });
      box.append(b);
    });
    const before = MOUNT.before ? host.querySelector(MOUNT.before) : null;
    before ? host.insertBefore(box, before) : host.append(box);
  }
  const style = document.createElement('style');
  style.textContent = '.i18n-switch{display:inline-flex;gap:2px;padding:3px;border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:999px;flex:none}' +
    '.i18n-switch button{min-width:36px;height:30px;padding:0 9px;border:0;border-radius:999px;background:none;color:inherit;font:600 12px/1 system-ui,sans-serif;letter-spacing:.04em;cursor:pointer;opacity:.7}' +
    '.i18n-switch button[aria-pressed="true"]{background:color-mix(in srgb,currentColor 14%,transparent);opacity:1}' +
    '.i18n-switch button:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '@media(max-width:480px){.i18n-switch button{min-width:28px;padding:0 6px}}';
  document.head.append(style);
  new MutationObserver(mountSwitch).observe(document.documentElement, { childList: true, subtree: true });

  window.I18N = { lang, t };
})();
