const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('#mobile-menu');
const panel = menu?.querySelector('.mobile-drawer-panel');
let closeTimer;
let openFrame;
let oldOverflow = '';
const rootPage = menu?.querySelector('[data-menu-root]');
const productsPage = menu?.querySelector('[data-menu-products]');
const submenuButton = menu?.querySelector('[data-submenu-open]');
function setSubmenu(open, focus = true) {
  if (!rootPage || !productsPage) return;
  menu.classList.toggle('submenu-open', open);
  submenuButton.setAttribute('aria-expanded', String(open));
  rootPage.inert = open;
  productsPage.inert = !open;
  if (focus) (open ? productsPage.querySelector('[data-submenu-back]') : submenuButton).focus({preventScroll:true});
}
submenuButton?.addEventListener('click', () => setSubmenu(true));
menu?.querySelector('[data-submenu-back]')?.addEventListener('click', () => setSubmenu(false));
function finishClose() {
  clearTimeout(closeTimer);
  if (!menu?.open) return;
  menu.close();
  setSubmenu(false, false);
  document.body.style.overflow = oldOverflow;
  if (matchMedia('(max-width: 767px)').matches) toggle?.focus();
}
function closeMenu(immediate = false) {
  if (!toggle || !menu?.open) return;
  cancelAnimationFrame(openFrame);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  menu.classList.remove('is-open');
  clearTimeout(closeTimer);
  if (immediate || matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
  else closeTimer = setTimeout(finishClose, 350);
}
toggle?.addEventListener('click', () => {
  if (!menu) return;
  if (menu.open) { closeMenu(); return; }
  clearTimeout(closeTimer);
  oldOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  menu.classList.remove('is-open');
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close navigation');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    menu.classList.add('is-open');
  } else {
    // Opening a dialog changes display:none. Give the offscreen state a painted
    // frame before changing its transform, including on mobile Safari.
    openFrame = requestAnimationFrame(() => {
      openFrame = requestAnimationFrame(() => {
        if (menu.open && toggle.getAttribute('aria-expanded') === 'true') {
          menu.classList.add('is-open');
        }
      });
    });
  }
});
menu?.querySelector('[data-menu-close]')?.addEventListener('click', () => closeMenu());
menu?.addEventListener('click', event => { if (event.target === menu) closeMenu(); });
menu?.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
panel?.addEventListener('transitionend', event => {
  if (event.target === panel && event.propertyName === 'transform' && !menu.classList.contains('is-open')) finishClose();
});
matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(true); });
const search = document.querySelector('input[data-search]');
const productDropdowns = [...document.querySelectorAll('[data-product-dropdown]')];
productDropdowns.forEach(dropdown => {
  dropdown.addEventListener('click', event => {
    if (event.target.closest('a')) dropdown.open = false;
  });
});
document.addEventListener('click', event => {
  productDropdowns.forEach(dropdown => { if (!dropdown.contains(event.target)) dropdown.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  productDropdowns.forEach(dropdown => {
    if (dropdown.open) { dropdown.open = false; if (!menu?.open) dropdown.querySelector('summary').focus(); }
  });
});
// Fallback for browsers without native exclusive <details name> support.
document.querySelectorAll('[data-faq]').forEach(group => {
  group.addEventListener('toggle', event => {
    const opened = event.target;
    if (opened.tagName !== 'DETAILS' || !opened.open) return;
    group.querySelectorAll('details[open]').forEach(item => {
      if (item !== opened) item.open = false;
    });
  }, true);
});
const filters = [...document.querySelectorAll('[data-filter]')];
let category = 'all';
function applyFilters() {
  const query = search?.value.toLowerCase().trim() || '';
  let visible = 0;
  document.querySelectorAll('[data-card]').forEach(card => {
    const match = (category === 'all' || card.dataset.category === category) && card.dataset.search.includes(query);
    card.hidden = !match;
    const listItem = card.closest('li');
    if (listItem) listItem.hidden = !match;
    if (match) visible++;
  });
  const status = document.querySelector('[data-results]');
  if (status) status.textContent = `${visible} ${visible === 1 ? 'item' : 'items'} found`;
  const empty = document.querySelector('[data-empty]');
  if (empty) empty.hidden = visible > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  applyFilters();
}));
search?.addEventListener('input', applyFilters);
document.querySelector('[data-reset]')?.addEventListener('click', () => {
  category = 'all'; if (search) search.value = '';
  filters.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === 'all')));
  applyFilters(); search?.focus();
});
