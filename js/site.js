// ---------- Mobile menu ----------
function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

// ---------- Language toggle (AZ default, EN optional) ----------
function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  try { localStorage.setItem('ic_lang', lang); } catch (e) {}
  var azBtn = document.getElementById('lang-az-btn');
  var enBtn = document.getElementById('lang-en-btn');
  if (azBtn && enBtn) {
    azBtn.classList.toggle('font-medium', lang === 'az');
    enBtn.classList.toggle('font-medium', lang === 'en');
  }
  document.dispatchEvent(new CustomEvent('iclangchange', { detail: { lang: lang } }));
}

function initLang() {
  var saved = 'az';
  try { saved = localStorage.getItem('ic_lang') || 'az'; } catch (e) {}
  setLang(saved);
}
document.addEventListener('DOMContentLoaded', initLang);

// ---------- Accordion ----------
function toggleReveal(id, iconId) {
  var el = document.getElementById(id);
  var icon = document.getElementById(iconId);
  if (!el) return;
  var isHidden = el.classList.contains('hidden');
  el.classList.toggle('hidden');
  if (icon) icon.textContent = isHidden ? '−' : '+';
}

// ---------- Gmail compose helper ----------
function gmailComposeLink(to, subject, body) {
  var params = new URLSearchParams({ view: 'cm', fs: '1', to: to, su: subject, body: body });
  return 'https://mail.google.com/mail/?' + params.toString();
}

// ---------- Application templates (license / ambassador / membership / donation) ----------
function setupApplicationTemplate(opts) {
  var box = document.getElementById(opts.boxId);
  var gmailBtn = document.getElementById(opts.gmailBtnId);
  var copyBtn = document.getElementById(opts.copyBtnId);
  if (!box) return;

  function currentLang() {
    return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'az';
  }
  function render() {
    var lang = currentLang();
    var subject = lang === 'en' ? opts.subjectEn : opts.subjectAz;
    var body = lang === 'en' ? opts.bodyEn : opts.bodyAz;
    box.textContent = body;
    if (gmailBtn) {
      gmailBtn.setAttribute('href', gmailComposeLink(opts.to, subject, body));
      gmailBtn.setAttribute('target', '_blank');
      gmailBtn.setAttribute('rel', 'noopener noreferrer');
    }
  }
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(box.textContent).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = currentLang() === 'en' ? 'Copied ✓' : 'Kopyalandı ✓';
        setTimeout(function () { copyBtn.textContent = original; }, 1800);
      });
    });
  }
  document.addEventListener('iclangchange', render);
  render();
}

// ---------- License Registry (optional auto-feed from a published Google Sheet CSV) ----------
// If a sheet URL is configured below, licensed events are fetched and
// rendered automatically. Until then, the page shows the hardcoded
// entries already in the HTML — nothing breaks either way.
var IC_REGISTRY_CSV_URL = ''; // e.g. a Google Sheet published as CSV

function loadRegistryFromSheet(targetId) {
  var el = document.getElementById(targetId);
  if (!el || !IC_REGISTRY_CSV_URL) return;
  fetch(IC_REGISTRY_CSV_URL)
    .then(function (r) { return r.text(); })
    .then(function (csv) {
      var rows = csv.trim().split('\n').map(function (r) { return r.split(','); });
      var headers = rows.shift();
      var cards = rows.map(function (row) {
        var rec = {};
        headers.forEach(function (h, i) { rec[h.trim()] = (row[i] || '').trim(); });
        return rec;
      });
      el.innerHTML = cards.map(renderRegistryCard).join('');
    })
    .catch(function () { /* silently keep the hardcoded fallback */ });
}

function renderRegistryCard(rec) {
  return '<div class="card">' +
    '<p class="font-display font-medium">' + (rec.event_name || '') + '</p>' +
    '<p class="text-xs text-steel-500 mt-1">' + (rec.organizer || '') + ' · ' + (rec.city || '') + '</p>' +
    '<p class="text-xs text-steel-400 mt-2 font-mono">' + (rec.issued || '') + ' → ' + (rec.expires || '') + '</p>' +
  '</div>';
}
