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
    azBtn.classList.toggle('text-ink', lang === 'az');
    azBtn.classList.toggle('text-steel-400', lang !== 'az');
    enBtn.classList.toggle('font-medium', lang === 'en');
    enBtn.classList.toggle('text-ink', lang === 'en');
    enBtn.classList.toggle('text-steel-400', lang !== 'en');
  }
  document.dispatchEvent(new CustomEvent('iclangchange', { detail: { lang: lang } }));
}

function initLang() {
  var saved = 'az';
  try { saved = localStorage.getItem('ic_lang') || 'az'; } catch (e) {}
  setLang(saved);
}

document.addEventListener('DOMContentLoaded', initLang);

// ---------- FAQ / generic accordion ----------
function toggleReveal(id, iconId) {
  var el = document.getElementById(id);
  var icon = document.getElementById(iconId);
  if (!el) return;
  var isHidden = el.classList.contains('hidden');
  el.classList.toggle('hidden');
  if (icon) icon.textContent = isHidden ? '−' : '+';
}

// ---------- Gmail compose helper ----------
// Opens Gmail's own web compose window pre-filled — not a generic mailto,
// so it lands directly in Gmail as requested.
function gmailComposeLink(to, subject, body) {
  var params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to,
    su: subject,
    body: body,
  });
  return 'https://mail.google.com/mail/?' + params.toString();
}

function mailtoLink(to, subject, body) {
  return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

// ---------- Application templates (license / ambassador / membership) ----------
// Call once per page with the AZ/EN subject+body text. Renders the template
// box, and wires the "copy" and "open in Gmail" buttons — all language-aware,
// so switching AZ/EN updates everything without a page reload.
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
    if (gmailBtn) gmailBtn.setAttribute('href', gmailComposeLink(opts.to, subject, body));
    if (gmailBtn) { gmailBtn.setAttribute('target', '_blank'); gmailBtn.setAttribute('rel', 'noopener noreferrer'); }
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
