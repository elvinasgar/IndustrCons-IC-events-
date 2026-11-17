// ---------- Mobile menu ----------
function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

// ---------- Language toggle (AZ default, EN optional) ----------
function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  // keep <html lang> in sync: CSS uppercase uses it (az would turn i into İ in English text)
  document.documentElement.setAttribute('lang', lang);
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

// ---------- License Registry (data/registry.js) ----------
function icLang() {
  return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'az';
}

function icPad(n) { return (n < 10 ? '0' : '') + n; }

function icFormatDate(d) {
  return icPad(d.getDate()) + '.' + icPad(d.getMonth() + 1) + '.' + d.getFullYear();
}

// issued is "YYYY-MM-DD"; expiry = same day, one year later
function icLicenseDates(rec) {
  var p = rec.issued.split('-');
  var issued = new Date(+p[0], +p[1] - 1, +p[2]);
  var expires = new Date(+p[0] + 1, +p[1] - 1, +p[2]);
  return { issued: issued, expires: expires };
}

function icLicenseStatus(rec) {
  var d = icLicenseDates(rec);
  var now = new Date();
  if (now < d.issued) return 'pending';
  if (now >= d.expires) return 'expired';
  return 'active';
}

function icInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
}

function icEsc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function icBadge(status) {
  if (status === 'active') {
    return '<span class="badge badge-green"><span class="pulse-dot"></span><span class="lang-az">AKTİV</span><span class="lang-en">ACTIVE</span></span>';
  }
  if (status === 'pending') {
    return '<span class="badge badge-signal"><span class="lang-az">GÖZLƏNİLİR</span><span class="lang-en">PENDING</span></span>';
  }
  return '<span class="badge badge-outline"><span class="lang-az">MÜDDƏTİ BİTİB</span><span class="lang-en">EXPIRED</span></span>';
}

function icRegistryCard(rec) {
  var d = icLicenseDates(rec);
  var status = icLicenseStatus(rec);
  var partner = rec.partner
    ? '<span class="lang-az">Tərəfdaş: </span><span class="lang-en">Partner: </span>' + icEsc(rec.partner) + ' · '
    : '';
  return '<div class="card" data-license="' + icEsc(rec.code) + '">' +
    '<div class="flex items-start justify-between gap-3">' + icBadge(status) +
      '<span class="text-xs text-steel-500 font-mono uppercase">' +
        '<span class="lang-az">' + icEsc(rec.cityAz) + ', ' + icEsc(rec.countryAz) + '</span>' +
        '<span class="lang-en">' + icEsc(rec.cityEn) + ', ' + icEsc(rec.countryEn) + '</span>' +
      '</span></div>' +
    '<p class="font-display font-medium mt-3 text-lg"><span class="lang-az">' + icEsc(rec.eventAz) + '</span><span class="lang-en">' + icEsc(rec.eventEn) + '</span></p>' +
    '<div class="flex items-center gap-3 mt-3">' +
      '<div class="h-11 w-11 rounded-full bg-blueprint-500/10 border border-blueprint-500/30 flex items-center justify-center text-blueprint-600 font-display font-medium">' + icEsc(icInitials(rec.organizer)) + '</div>' +
      '<div><p class="text-sm font-medium">' + icEsc(rec.organizer) + '</p>' +
      '<p class="text-xs text-steel-500"><span class="lang-az">Təşkilatçı</span><span class="lang-en">Organizer</span></p></div>' +
    '</div>' +
    '<div class="grid grid-cols-2 gap-3 mt-4">' +
      '<div class="rounded-lg border border-ink/10 p-3 text-center"><p class="font-mono text-sm font-medium">' + icFormatDate(d.issued) + '</p><p class="text-[11px] text-steel-500 mt-0.5"><span class="lang-az">Lisenziya tarixi</span><span class="lang-en">Licensed since</span></p></div>' +
      '<div class="rounded-lg border border-ink/10 p-3 text-center"><p class="font-mono text-sm font-medium">' + icFormatDate(d.expires) + '</p><p class="text-[11px] text-steel-500 mt-0.5"><span class="lang-az">' + (status === 'expired' ? 'Bitib' : 'Etibarlıdır') + '</span><span class="lang-en">' + (status === 'expired' ? 'Expired' : 'Valid until') + '</span></p></div>' +
    '</div>' +
    '<p class="text-xs text-steel-400 mt-3">' + partner +
      '<span class="lang-az">' + icEsc(rec.typeAz) + '</span><span class="lang-en">' + icEsc(rec.typeEn) + '</span> · <span class="font-mono">' + icEsc(rec.code) + '</span></p>' +
  '</div>';
}

function renderRegistry(targetId, limit) {
  var el = document.getElementById(targetId);
  if (!el || typeof IC_REGISTRY === 'undefined') return;
  var list = limit ? IC_REGISTRY.slice(0, limit) : IC_REGISTRY;
  el.innerHTML = list.map(icRegistryCard).join('');
}

// ---------- License checker ----------
function icNormalize(str) {
  // lower-case, then strip combining marks (handles İ, ö, ü, ş, ç, ğ),
  // then map the two letters that do not decompose (ə, ı)
  return String(str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ə/g, 'e').replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function icFindLicense(query) {
  var q = icNormalize(query);
  if (!q || typeof IC_REGISTRY === 'undefined') return [];
  return IC_REGISTRY.filter(function (rec) {
    var hay = icNormalize([rec.code, rec.organizer, rec.eventAz, rec.eventEn].join(' '));
    return hay.indexOf(q) !== -1;
  });
}

function initLicenseChecker() {
  var form = document.getElementById('license-check-form');
  var input = document.getElementById('license-check-input');
  var out = document.getElementById('license-check-result');
  if (!form || !input || !out) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var results = icFindLicense(input.value);
    if (!input.value.trim()) { out.innerHTML = ''; return; }
    if (!results.length) {
      out.innerHTML = '<div class="card border-signal/40"><p class="font-display font-medium">' +
        '<span class="lang-az">Reyestrdə tapılmadı</span><span class="lang-en">Not found in the registry</span></p>' +
        '<p class="text-sm text-steel-600 mt-1"><span class="lang-az">Bu ad və ya kod ilə rəsmi lisenziya yoxdur. Əgər kimsə IC Event adı ilə tədbir keçirirsə, bizimlə əlaqə saxlayın.</span>' +
        '<span class="lang-en">No official license matches this name or code. If someone is running an event under the IC Event name, please contact us.</span></p></div>';
    } else {
      out.innerHTML = results.map(icRegistryCard).join('');
    }
  });
}
document.addEventListener('DOMContentLoaded', initLicenseChecker);

// ---------- Scroll reveal ----------
// Content stays visible if JS or IntersectionObserver is unavailable.
function initReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
}
document.addEventListener('DOMContentLoaded', initReveal);
