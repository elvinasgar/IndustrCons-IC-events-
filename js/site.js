// ---------- Mobile menu ----------
function toggleMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

// ---------- Helpers ----------
function tierBadgeClass(tier) {
  var t = (tier || '').toLowerCase();
  if (t === 'gold' || t === 'diamond') return 'badge badge-signal';
  if (t === 'silver' || t === 'bronze' || t === 'verified') return 'badge badge-blueprint';
  return 'badge badge-outline';
}

function statusBadgeClass(status) {
  return status === 'Active' ? 'badge badge-blueprint' : 'badge badge-outline';
}

// ---------- Renderers (each expects a global array from data/*.js) ----------
function renderStats(targetId) {
  var el = document.getElementById(targetId);
  if (!el || typeof STATS === 'undefined') return;
  el.innerHTML = STATS.map(function (s) {
    return '<div class="card text-center">' +
      '<p class="font-mono text-3xl font-medium tracking-tight">' + s.value + s.suffix + '</p>' +
      '<p class="mt-2 text-sm font-medium">' + s.label + '</p>' +
      '<p class="mt-1 text-xs text-steel-500">' + s.detail + '</p>' +
      '</div>';
  }).join('');
}

function renderChapters(targetId, limit) {
  var el = document.getElementById(targetId);
  if (!el || typeof CHAPTERS === 'undefined') return;
  var list = limit ? CHAPTERS.slice(0, limit) : CHAPTERS;
  el.innerHTML = list.map(function (c) {
    return '<div class="card">' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div>' +
          '<p class="font-display font-medium">' + c.city + ', ' + c.country + '</p>' +
          '<p class="text-xs text-steel-500 mt-0.5">' + c.region + ' · Since ' + c.founded + '</p>' +
        '</div>' +
        '<span class="' + statusBadgeClass(c.status) + '">' + c.status + '</span>' +
      '</div>' +
      '<p class="text-sm text-steel-600 mt-3">' + c.members.toLocaleString() + ' members · ' + c.events + ' events</p>' +
      '<p class="text-xs text-steel-500 mt-1">Lead: ' + c.lead + '</p>' +
      '<div class="flex flex-wrap gap-1.5 mt-3">' +
        c.focus.map(function (f) { return '<span class="badge badge-outline">' + f + '</span>'; }).join('') +
      '</div>' +
    '</div>';
  }).join('');
}

function renderEvents(targetId, limit) {
  var el = document.getElementById(targetId);
  if (!el || typeof EVENTS === 'undefined') return;
  var list = limit ? EVENTS.slice(0, limit) : EVENTS;
  el.innerHTML = list.map(function (e) {
    var date = new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    return '<div class="card">' +
      '<div class="flex items-start justify-between gap-3">' +
        '<p class="text-xs text-steel-500 font-mono uppercase">' + date + ' · ' + e.location + '</p>' +
        '<span class="' + tierBadgeClass(e.tier) + '">' + e.tier + '</span>' +
      '</div>' +
      '<p class="font-display font-medium mt-2">' + e.title + '</p>' +
      '<p class="text-sm text-steel-600 mt-2 leading-relaxed">' + e.summary + '</p>' +
      '<p class="text-xs text-steel-500 mt-3">' + e.organizer + ' · ' + e.format + ' · ' + e.attendees.toLocaleString() + ' attendees</p>' +
    '</div>';
  }).join('');
}

function renderAccreditationLevels(targetId) {
  var el = document.getElementById(targetId);
  if (!el || typeof ACCREDITATION_LEVELS === 'undefined') return;
  el.innerHTML = ACCREDITATION_LEVELS.map(function (lvl) {
    return '<div class="card">' +
      '<div class="flex items-center justify-between">' +
        '<span class="' + tierBadgeClass(lvl.tier) + '">' + lvl.tier + '</span>' +
        '<span class="text-xs text-steel-400 font-mono">STEP ' + lvl.order + '</span>' +
      '</div>' +
      '<p class="text-sm text-steel-600 mt-3 leading-relaxed">' + lvl.summary + '</p>' +
      '<p class="label-mono mt-4 mb-2">Requirements</p>' +
      '<ul class="text-sm text-steel-600 list-disc list-inside space-y-1">' +
        lvl.requirements.map(function (r) { return '<li>' + r + '</li>'; }).join('') +
      '</ul>' +
      '<p class="label-mono mt-4 mb-2">Benefits</p>' +
      '<ul class="text-sm text-steel-600 list-disc list-inside space-y-1">' +
        lvl.benefits.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
      '</ul>' +
    '</div>';
  }).join('');
}

function renderFaq(targetId) {
  var el = document.getElementById(targetId);
  if (!el || typeof FAQ === 'undefined') return;
  el.innerHTML = FAQ.map(function (item, i) {
    return '<div class="card">' +
      '<button type="button" onclick="toggleFaq(' + i + ')" class="w-full flex items-center justify-between text-left gap-3">' +
        '<span class="font-display font-medium">' + item.question + '</span>' +
        '<span id="faq-icon-' + i + '" class="text-blueprint-500 shrink-0">+</span>' +
      '</button>' +
      '<div id="faq-answer-' + i + '" class="hidden mt-3 text-sm text-steel-600 leading-relaxed">' + item.answer + '</div>' +
    '</div>';
  }).join('');
}

function toggleFaq(i) {
  var answer = document.getElementById('faq-answer-' + i);
  var icon = document.getElementById('faq-icon-' + i);
  if (!answer) return;
  var isHidden = answer.classList.contains('hidden');
  answer.classList.toggle('hidden');
  icon.textContent = isHidden ? '−' : '+';
}

// ---------- Application form (license / event), submits via Formspree ----------
function initApplicationForm() {
  var form = document.getElementById('application-form');
  if (!form) return;

  var typeInput = document.getElementById('application_type');
  var buttons = document.querySelectorAll('.type-btn');
  var conditionalFields = document.querySelectorAll('.conditional-field');

  function setType(type) {
    typeInput.value = type;
    buttons.forEach(function (btn) {
      if (btn.dataset.type === type) {
        btn.classList.add('border-blueprint-500');
      } else {
        btn.classList.remove('border-blueprint-500');
      }
    });
    conditionalFields.forEach(function (field) {
      field.style.display = field.dataset.showFor === type ? 'flex' : 'none';
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () { setType(btn.dataset.type); });
  });

  var params = new URLSearchParams(window.location.search);
  setType(params.get('type') === 'event' ? 'event' : 'license');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var statusBox = document.getElementById('form-status');
    var submitBtn = document.getElementById('submit-btn');
    var actionUrl = form.getAttribute('action');

    if (!actionUrl || actionUrl.indexOf('YOUR_FORM_ID') !== -1) {
      statusBox.className = 'mt-4 text-sm rounded-lg border border-signal/40 bg-signal/10 p-3 text-[#C97F1B]';
      statusBox.textContent = 'Form not connected yet: open this file and replace YOUR_FORM_ID in the form\'s action= with your real Formspree code. See README.md.';
      statusBox.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(actionUrl, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(function (response) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit application';
        if (response.ok) {
          statusBox.className = 'mt-4 text-sm rounded-lg border border-blueprint-500/30 bg-blueprint-500/10 p-3 text-[#173CAA]';
          statusBox.textContent = 'Application sent — we\'ll reply by email.';
          statusBox.classList.remove('hidden');
          form.reset();
          setType(params.get('type') === 'event' ? 'event' : 'license');
        } else {
          statusBox.className = 'mt-4 text-sm rounded-lg border border-signal/40 bg-signal/10 p-3 text-[#C97F1B]';
          statusBox.textContent = 'Something went wrong sending this. Please try again in a moment.';
          statusBox.classList.remove('hidden');
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit application';
        statusBox.className = 'mt-4 text-sm rounded-lg border border-signal/40 bg-signal/10 p-3 text-[#C97F1B]';
        statusBox.textContent = 'Network error — check your connection and try again.';
        statusBox.classList.remove('hidden');
      });
  });
}

document.addEventListener('DOMContentLoaded', initApplicationForm);

// ---------- Simple contact form (no type toggle) ----------
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var statusBox = document.getElementById('contact-status');
    var submitBtn = document.getElementById('contact-submit-btn');
    var actionUrl = form.getAttribute('action');

    if (!actionUrl || actionUrl.indexOf('YOUR_FORM_ID') !== -1) {
      statusBox.className = 'mt-4 text-sm rounded-lg border border-signal/40 bg-signal/10 p-3 text-[#C97F1B]';
      statusBox.textContent = 'Form not connected yet: replace YOUR_FORM_ID in this file\'s form action= with your Formspree code. See README.md.';
      statusBox.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(actionUrl, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(function (response) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        if (response.ok) {
          statusBox.className = 'mt-4 text-sm rounded-lg border border-blueprint-500/30 bg-blueprint-500/10 p-3 text-[#173CAA]';
          statusBox.textContent = 'Message sent — we\'ll reply by email.';
          statusBox.classList.remove('hidden');
          form.reset();
        } else {
          statusBox.className = 'mt-4 text-sm rounded-lg border border-signal/40 bg-signal/10 p-3 text-[#C97F1B]';
          statusBox.textContent = 'Something went wrong sending this. Please try again.';
          statusBox.classList.remove('hidden');
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        statusBox.className = 'mt-4 text-sm rounded-lg border border-signal/40 bg-signal/10 p-3 text-[#C97F1B]';
        statusBox.textContent = 'Network error — check your connection and try again.';
        statusBox.classList.remove('hidden');
      });
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
