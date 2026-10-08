import { sendMessage } from './contact-adapter.js';
const toggle = document.querySelector('#menu-toggle');
const menu = document.querySelector('#mobile-menu');
let closingTimer;
function closeMenu() {
  if (!menu?.open) return;
  toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open');
  clearTimeout(closingTimer);
  const finish = () => { menu.close(); document.body.style.overflow = ''; toggle.focus(); };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
  else closingTimer = setTimeout(finish, 300);
}
toggle?.addEventListener('click', () => {
  if (menu.open) { closeMenu(); return; }
  clearTimeout(closingTimer); menu.showModal(); document.body.style.overflow = 'hidden';
  toggle.setAttribute('aria-expanded', 'true');
  menu.getBoundingClientRect(); menu.classList.add('is-open');
});
menu?.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
document.querySelector('#menu-close')?.addEventListener('click', closeMenu);
menu?.addEventListener('click', event => {
  const rect = menu.getBoundingClientRect();
  if (event.target === menu && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeMenu();
  if (event.target.closest('a')) closeMenu();
});
window.matchMedia('(min-width: 1280px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-project]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && !project.dataset.categories.split(' ').includes(button.dataset.filter); });
  document.querySelector('#filter-status').textContent = `${projects.filter(p => !p.hidden).length} ${document.querySelector('#project-grid').dataset.resultsLabel}`;
}));
const form = document.querySelector('#contact-form');
if (form) {
  const strings = JSON.parse(form.dataset.strings); const status = document.querySelector('#form-status'); const submit = form.querySelector('[type="submit"]');
  function validate(field) {
    const error = document.querySelector(`#${field.id}-error`);
    let message = !field.value.trim() ? strings.required : '';
    if (!message && field.type === 'email' && field.validity.typeMismatch) message = strings.emailError;
    field.setAttribute('aria-invalid', String(Boolean(message))); error.textContent = message; error.hidden = !message;
    return !message;
  }
  const required = [...form.querySelectorAll('[required]')];
  required.forEach(field => field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); status.textContent = ''; }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const invalid = required.filter(field => !validate(field));
    if (invalid.length) { status.textContent = ''; invalid[0].focus(); return; }
    submit.disabled = true; form.setAttribute('aria-busy', 'true');
    status.textContent = form.dataset.endpoint ? strings.sending : strings.unavailable;
    try {
      const payload = Object.fromEntries(new FormData(form));
      payload.language = document.documentElement.lang;
      const result = await sendMessage(form.dataset.endpoint, payload);
      status.textContent = result.status === 'sent' ? strings.success : strings.unavailable;
      if (result.status === 'sent') form.reset();
    } catch { status.textContent = strings.failure; }
    finally { submit.disabled = false; form.removeAttribute('aria-busy'); status.focus(); }
  });
}
