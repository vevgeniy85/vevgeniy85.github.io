const config=window.MALECHA_CONFIG||{};const phones=document.querySelector('.phones');const toggle=document.querySelector('.menu-toggle');const menu=document.getElementById('mobile-menu');function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Відкрити меню');menu.hidden=true}toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрити меню':'Відкрити меню');menu.hidden=!open});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('click',e=>{if(!phones.contains(e.target))phones.open=false;if(!e.target.closest('.site-header'))closeMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(phones.open){phones.open=false;phones.querySelector('summary').focus()}if(!menu.hidden){closeMenu();toggle.focus()}}});matchMedia('(min-width:1024px)').addEventListener('change',e=>{if(e.matches)closeMenu()});document.querySelectorAll('.faq').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq').forEach(other=>{if(other!==item)other.open=false})}));for(const kind of ['telegram','viber']){if(config.channels?.[kind])document.querySelectorAll('[data-channel="'+kind+'"]').forEach(a=>a.href=config.channels[kind])}for(const [i,store] of (config.stores||[]).entries()){if(store.hours)document.querySelectorAll('[data-store-hours="'+i+'"]').forEach(el=>el.textContent=store.hours);if(store.address)document.querySelectorAll('[data-store-address="'+i+'"]').forEach(el=>el.textContent=store.address);if(store.phone){document.querySelectorAll('[data-store-phone="'+i+'"]').forEach(el=>{const a=document.createElement('a');a.dataset.storePhone=i;a.textContent=store.phone;a.href='tel:'+store.phone.replace(/[^+0-9]/g,'');el.replaceWith(a)});if(i===0){const el=document.querySelector('[data-primary-phone]');el.textContent=store.phone}}if(store.mapUrl)document.querySelectorAll('[data-store-map="'+i+'"]').forEach(a=>{a.href=store.mapUrl;a.setAttribute('aria-label','Маршрут до магазину '+(i+1));a.innerHTML='Маршрут <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'})}
const socialWidget = document.querySelector('.social-widget');
const socialToggle = socialWidget.querySelector('.social-widget-toggle');
const socialPanel = socialWidget.querySelector('.social-widget-panel');
function setSocialOpen(open, restoreFocus = false) {
  socialWidget.classList.toggle('is-open', open);
  socialToggle.setAttribute('aria-expanded', String(open));
  socialToggle.setAttribute('aria-label', open ? 'Закрити соціальні мережі' : 'Відкрити соціальні мережі');
  socialPanel.setAttribute('aria-hidden', String(!open));
  socialPanel.inert = !open;
  if (restoreFocus) socialToggle.focus();
}
socialToggle.addEventListener('click', event => {
  const open = socialToggle.getAttribute('aria-expanded') !== 'true';
  setSocialOpen(open);
  if (open && event.detail === 0) socialPanel.querySelector('a').focus();
});
socialPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setSocialOpen(false, true)));
document.addEventListener('click', event => {
  if (!socialWidget.contains(event.target)) setSocialOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && socialToggle.getAttribute('aria-expanded') === 'true') setSocialOpen(false, true);
});
const headerInner = document.querySelector('.header-inner');
function updateHeaderHeight() {
  document.documentElement.style.setProperty('--header-height', headerInner.getBoundingClientRect().height + 'px');
}
updateHeaderHeight();
new ResizeObserver(updateHeaderHeight).observe(headerInner);

const branchTabs = [...document.querySelectorAll('[role="tab"][data-branch]')];
const branchPanels = [...document.querySelectorAll('.branch-panel')];
function selectBranch(index, focus = false) {
  branchTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    tab.closest('.branch-tab-row').classList.toggle('is-selected', i === index);
    tab.closest('.branch-tab-row').querySelector('.branch-tab-meta').hidden = i !== index;
    branchPanels[i].hidden = i !== index;
  });
  if (focus) branchTabs[index].focus();
}
branchTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectBranch(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % branchTabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + branchTabs.length - 1) % branchTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = branchTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectBranch(next, true); }
  });
});

const stickyHeader = document.querySelector('.site-header');
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const id = link.hash.slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  closeMenu();
  phones.open = false;
  const compactHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--compact-header-height'));
  const destination = id === 'top' ? 0 : Math.max(0, target.getBoundingClientRect().top + scrollY - compactHeight);
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  window.scrollTo({ top: destination, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
function updateCompactHeader() { stickyHeader.classList.toggle('is-compact', scrollY > 64); }
window.addEventListener('scroll', updateCompactHeader, { passive: true });
updateCompactHeader();

const instagramReel = document.querySelector('.instagram-reel');
if (instagramReel) {
const instagramPrev = document.querySelector('.instagram-prev');
const instagramNext = document.querySelector('.instagram-next');
function updateInstagramControls() {
  instagramPrev.disabled = instagramReel.scrollLeft < 2;
  instagramNext.disabled = instagramReel.scrollLeft + instagramReel.clientWidth >= instagramReel.scrollWidth - 2;
}
function scrollInstagram(direction) {
  const item = instagramReel.querySelector('.instagram-post');
  const step = item.getBoundingClientRect().width + parseFloat(getComputedStyle(instagramReel).columnGap);
  instagramReel.scrollBy({ left: step * direction, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
instagramPrev.addEventListener('click', () => scrollInstagram(-1));
instagramNext.addEventListener('click', () => scrollInstagram(1));
instagramReel.addEventListener('scroll', updateInstagramControls, { passive: true });
new ResizeObserver(updateInstagramControls).observe(instagramReel);
updateInstagramControls();
}
const dreamScene = document.querySelector('.dream-scene');
if (dreamScene) {
const dreamLayers = [...document.querySelectorAll('.dream-object')];
const dreamMotion = matchMedia('(prefers-reduced-motion:no-preference)');
let dreamFrame = 0;
let dreamMouse = 0;
let dreamX = 0;
let dreamY = 0;
let dreamLastTime = 0;
function paintDream(time) {
  dreamFrame = 0;
  if (!dreamMotion.matches) {
    dreamLayers.forEach(layer => layer.style.removeProperty('translate'));
    dreamX = dreamY = dreamMouse = dreamLastTime = 0;
    return;
  }
  const rect = dreamScene.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight) return;
  const drift = Math.max(-32, Math.min(32, (innerHeight / 2 - rect.top - rect.height / 2) * .09));
  const elapsed = dreamLastTime ? Math.min(32, time - dreamLastTime) : 16;
  dreamLastTime = time;
  const easing = 1 - Math.exp(-elapsed / 180);
  dreamX += (dreamMouse - dreamX) * easing;
  dreamY += (drift - dreamY) * easing;
  dreamLayers.forEach(layer => {
    const depth = Number(layer.dataset.depth);
    layer.style.translate = (dreamX * depth).toFixed(2) + 'px ' + (dreamY * depth).toFixed(2) + 'px';
  });
  if (Math.abs(dreamMouse - dreamX) > .02 || Math.abs(drift - dreamY) > .02) queueDream();
  else dreamLastTime = 0;
}
function queueDream() { if (!dreamFrame) dreamFrame = requestAnimationFrame(paintDream); }
dreamScene.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse') return;
  const rect = dreamScene.getBoundingClientRect();
  dreamMouse = Math.max(-8, Math.min(8, ((event.clientX - rect.left) / rect.width - .5) * 16));
  queueDream();
});
dreamScene.addEventListener('pointerleave', () => { dreamMouse = 0; queueDream(); });
window.addEventListener('scroll', queueDream, { passive:true });
window.addEventListener('resize', queueDream);
dreamMotion.addEventListener('change', queueDream);
queueDream();
}
