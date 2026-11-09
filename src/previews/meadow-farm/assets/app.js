const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('#mobile-menu');
const panel = menu?.querySelector('.mobile-drawer-panel');
let menuAnimation;
let oldOverflow = '';
let closing = false;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function finishClose(destination) {
  menuAnimation?.cancel();
  menuAnimation = null;
  menu.close();
  closing = false;
  document.body.style.overflow = oldOverflow;
  if (destination) location.assign(destination);
  else if (matchMedia('(max-width: 767px)').matches) toggle?.focus();
}
function closeMenu(immediate = false, destination) {
  if (!toggle || !menu?.open || closing) return;
  closing = true;
  const start = getComputedStyle(panel).transform;
  menuAnimation?.cancel();
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  menu.classList.remove('is-open');
  if (immediate || reducedMotion()) { finishClose(destination); return; }
  menuAnimation = panel.animate([{transform:start}, {transform:'translateX(100%)'}], {
    duration:320, easing:'cubic-bezier(0.4, 0, 0.2, 1)', fill:'forwards'
  });
  menuAnimation.onfinish = () => finishClose(destination);
}
toggle?.addEventListener('click', () => {
  if (!menu || closing) return;
  if (menu.open) { closeMenu(); return; }
  oldOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  // Focus the close button before moving the panel offscreen, so the browser
  // cannot scroll the dialog horizontally to reveal the focused control.
  menu.classList.add('is-open');
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Close navigation');
  if (!reducedMotion()) {
    menuAnimation = panel.animate([{transform:'translateX(100%)'}, {transform:'translateX(0)'}], {
      duration:320, easing:'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }
});
menu?.querySelector('[data-menu-close]')?.addEventListener('click', () => closeMenu());
menu?.addEventListener('click', event => {
  if (event.target === menu) { closeMenu(); return; }
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
  if (!['http:', 'https:'].includes(new URL(link.href).protocol)) return;
  event.preventDefault();
  closeMenu(false, link.href);
});
menu?.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
matchMedia('(min-width: 768px)').addEventListener('change', event => {
  if (event.matches && menu?.open) {
    if (closing) finishClose();
    else closeMenu(true);
  }
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
// Match anchor positioning to the actual height of both sticky navigation bars.
const categoryNav = document.querySelector('[data-category-nav]');
if (categoryNav) {
  const header = document.querySelector('header');
  const updateCatalogOffset = () => {
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--catalog-offset', `${headerHeight + categoryNav.getBoundingClientRect().height}px`);
  };
  updateCatalogOffset();
  const observer = new ResizeObserver(updateCatalogOffset);
  observer.observe(header);
  observer.observe(categoryNav);
  // A fragment can be positioned before the local display font has loaded.
  // Align it again once fonts and the initial page layout are ready.
  Promise.all([
    document.fonts.ready,
    new Promise(resolve => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, {once:true});
    })
  ]).then(() => {
    updateCatalogOffset();
    requestAnimationFrame(() => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id.startsWith('list-')) document.getElementById(id)?.scrollIntoView({behavior:'instant', block:'start'});
    });
  });
}

// Keep the first screen immediate. Defer painting later sections while preserving
// their measured height so sticky photos and category anchors keep their positions.
document.fonts.ready.then(() => {
if ('IntersectionObserver' in window && CSS.supports('content-visibility', 'auto')) {
  const sections = [...document.querySelectorAll('main > section')];
  const measurements = sections.map(section => {
    const rect = section.getBoundingClientRect();
    const style = getComputedStyle(section);
    const contentHeight = rect.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
    return {section, rect, contentHeight};
  });
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const section = entry.target;
      section.classList.remove('section-pending');
      if (!reducedMotion()) section.animate([{opacity:0}, {opacity:1}], {duration:420, easing:'ease-out'});
      reveal.unobserve(section);
    }
  }, {threshold:0});
  for (const {section, rect, contentHeight} of measurements) {
    if (rect.top < innerHeight || rect.height === 0) continue;
    section.style.setProperty('--section-height', `${contentHeight}px`);
    section.classList.add('section-deferred');
    if (!reducedMotion()) {
      section.classList.add('section-pending');
      reveal.observe(section);
    }
  }
  // Reveal keyboard destinations immediately instead of keeping focused links hidden.
  document.querySelector('main')?.addEventListener('focusin', event => {
    const section = event.target.closest('.section-pending');
    if (section) {
      section.classList.remove('section-pending');
      reveal.unobserve(section);
    }
  });
}
});
// Promote every image actually visible on the first screen, including list photos.
for (const img of document.querySelectorAll('main img[loading="lazy"]')) {
  const rect = img.getBoundingClientRect();
  if (rect.top < innerHeight && rect.bottom > 0) img.loading = 'eager';
}
