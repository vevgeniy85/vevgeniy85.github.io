const config=window.MALECHA_CONFIG||{};
const phones=document.querySelector('.phones');
const toggle=document.querySelector('.menu-toggle');
const menu=document.getElementById('mobile-menu');
const menuBackground=[document.querySelector('main'),document.querySelector('footer'),document.querySelector('.social-widget'),document.querySelector('.brand')].filter(Boolean);
function closeMenu(){
 toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Відкрити меню');
 toggle.querySelector('i').className='fa-solid fa-bars';menu.hidden=true;
 document.body.classList.remove('menu-open');menuBackground.forEach(el=>el.inert=false);
}
toggle.addEventListener('click',()=>{
 if(!menu.hidden){closeMenu();return;}
 phones.open=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Закрити меню');
 toggle.querySelector('i').className='fa-solid fa-xmark';menu.hidden=false;
 document.body.classList.add('menu-open');menuBackground.forEach(el=>el.inert=true);
 menu.querySelector('a').focus({preventScroll:true});
});
phones.querySelector('summary').addEventListener('click',()=>{if(!menu.hidden)closeMenu()});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!phones.contains(e.target))phones.open=false;});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(phones.open){phones.open=false;phones.querySelector('summary').focus()}if(!menu.hidden){closeMenu();toggle.focus()}}
 if(e.key==='Tab'&&!menu.hidden){const links=[phones.querySelector('summary'),toggle,...menu.querySelectorAll('a')];const first=links[0],last=links.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});
matchMedia('(min-width:1024px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
const faqItems=[...document.querySelectorAll('.faq')];
const faqMotion=matchMedia('(prefers-reduced-motion:reduce)');
const faqAnimations=new Map();
function setFaqOpen(item,open){
 const start=item.getBoundingClientRect().height;
 const previous=faqAnimations.get(item);
 if(previous){previous.onfinish=null;previous.cancel();faqAnimations.delete(item)}
 item.dataset.expanded=String(open);
 if(faqMotion.matches){item.open=open;return}
 item.open=true;
 const end=open?item.getBoundingClientRect().height:item.querySelector('summary').getBoundingClientRect().height+parseFloat(getComputedStyle(item).borderBottomWidth);
 const animation=item.animate([{height:start+'px'},{height:end+'px'}],{duration:280,easing:'cubic-bezier(.25,.1,.25,1)'});
 faqAnimations.set(item,animation);item.style.overflow='hidden';
 animation.onfinish=()=>{item.open=open;item.style.overflow='';faqAnimations.delete(item)};
}
faqItems.forEach(item=>item.querySelector('summary').addEventListener('click',event=>{
 event.preventDefault();const open=item.dataset.expanded?item.dataset.expanded!=='true':!item.open;
 if(open)faqItems.forEach(other=>{if(other!==item&&(other.open||other.dataset.expanded==='true'))setFaqOpen(other,false)});
 setFaqOpen(item,open);
}));
faqMotion.addEventListener('change',()=>{if(faqMotion.matches)faqItems.forEach(item=>{if(faqAnimations.has(item)){const open=item.dataset.expanded==='true';setFaqOpen(item,open);item.style.overflow=''}})});
for(const [i,store] of (config.stores||[]).entries()){if(store.hours)document.querySelectorAll('[data-store-hours="'+i+'"]').forEach(el=>el.textContent=store.hours);if(store.address)document.querySelectorAll('[data-store-address="'+i+'"]').forEach(el=>el.textContent=store.address);if(store.phone){document.querySelectorAll('[data-store-phone="'+i+'"]').forEach(el=>{const a=document.createElement('a');a.dataset.storePhone=i;a.textContent=store.phone;a.href='tel:'+store.phone.replace(/[^+0-9]/g,'');el.replaceWith(a)});if(i===0){const el=document.querySelector('[data-primary-phone]');el.textContent=store.phone}}if(store.mapUrl)document.querySelectorAll('[data-store-map="'+i+'"]').forEach(a=>{a.href=store.mapUrl;a.setAttribute('aria-label','Маршрут до магазину '+(i+1));a.innerHTML='Маршрут <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'})}
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
  instagramNext.disabled = instagramReel.scrollLeft + instagramReel.clientWidth >= instagramReel.scrollWidth - 4;
}
function scrollInstagram(direction) {
  const item = instagramReel.querySelector('.instagram-post');
  const step = item.getBoundingClientRect().width + parseFloat(getComputedStyle(instagramReel).columnGap);
  const limit = Math.max(0, instagramReel.scrollWidth - instagramReel.clientWidth);
  const destination = Math.max(0, Math.min(limit, instagramReel.scrollLeft + step * direction));
  instagramReel.scrollTo({ left: destination, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
// Native touch scrolling stays intact; mouse dragging uses pointer capture.
let instagramDrag=null;
let instagramSuppressClick=false;
instagramReel.addEventListener('dragstart',event=>event.preventDefault());
instagramReel.addEventListener('pointerdown',event=>{
 if(event.pointerType!=='mouse'||event.button!==0)return;
 instagramSuppressClick=false;
 instagramDrag={id:event.pointerId,x:event.clientX,y:event.clientY,left:instagramReel.scrollLeft,active:false};
});
instagramReel.addEventListener('pointermove',event=>{
 const drag=instagramDrag;if(!drag||drag.id!==event.pointerId)return;
 const dx=event.clientX-drag.x;
 if(!drag.active){
  if(Math.abs(dx)<6)return;
  if(Math.abs(event.clientY-drag.y)>Math.abs(dx)){instagramDrag=null;return}
  drag.active=true;instagramSuppressClick=true;
  instagramReel.classList.add('is-dragging');
  instagramReel.setPointerCapture(event.pointerId);
 }
 event.preventDefault();instagramReel.scrollLeft=drag.left-dx;
});
function endInstagramDrag(event){
 const drag=instagramDrag;if(!drag||drag.id!==event.pointerId)return;
 instagramDrag=null;
 if(drag.active){
  instagramReel.classList.remove('is-dragging');
  if(instagramReel.hasPointerCapture(event.pointerId))instagramReel.releasePointerCapture(event.pointerId);
  const item=instagramReel.querySelector('.instagram-post');
  const step=item.getBoundingClientRect().width+parseFloat(getComputedStyle(instagramReel).columnGap);
  const limit=instagramReel.scrollWidth-instagramReel.clientWidth;
  instagramReel.scrollTo({left:Math.max(0,Math.min(limit,Math.round(instagramReel.scrollLeft/step)*step)),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }
}
instagramReel.addEventListener('pointerup',endInstagramDrag);
instagramReel.addEventListener('pointercancel',endInstagramDrag);
instagramReel.addEventListener('lostpointercapture',endInstagramDrag);
instagramReel.addEventListener('pointerleave',event=>{if(instagramDrag&&!instagramDrag.active)instagramDrag=null});
instagramReel.addEventListener('click',event=>{if(instagramSuppressClick){event.preventDefault();event.stopImmediatePropagation();instagramSuppressClick=false}},true);
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

// Placeholder social links stay on the current page until client URLs are supplied.
document.querySelectorAll('a[href="#"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));


const reviewsReel=document.querySelector('.reviews-reel');
if(reviewsReel){
 const originals=[...reviewsReel.querySelectorAll('.review-card')];
 const dots=[...document.querySelectorAll('[data-review]')];
 const count=originals.length;
 const mobile=matchMedia('(max-width:1023px)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const clone=card=>{const copy=card.cloneNode(true);copy.classList.add('review-clone');copy.setAttribute('aria-hidden','true');copy.inert=true;return copy};
 reviewsReel.prepend(...originals.map(clone));reviewsReel.append(...originals.map(clone));
 let physical=count,settleTimer;
 const modulo=index=>(index%count+count)%count;
 const step=()=>originals[0].getBoundingClientRect().width+parseFloat(getComputedStyle(reviewsReel).columnGap);
 function indicate(index,announce=false){dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));if(announce)document.querySelector('.reviews-status').textContent='Відгук '+(index+1)+' із '+count}
 function settle(){
  if(!mobile.matches)return;
  const unit=step();physical=Math.round(reviewsReel.scrollLeft/unit);
  const logical=modulo(physical);
  if(physical<count||physical>=count*2){const offset=reviewsReel.scrollLeft-physical*unit;physical=count+logical;reviewsReel.scrollTo({left:physical*unit+offset,behavior:'instant'})}
  indicate(logical);
 }
 function moveTo(index){
  if(!mobile.matches)return;
  physical=index;indicate(modulo(index),true);
  reviewsReel.scrollTo({left:index*step(),behavior:reduced.matches?'instant':'smooth'});
 }
 function reset(){clearTimeout(settleTimer);physical=count;reviewsReel.scrollTo({left:mobile.matches?count*step():0,behavior:'instant'});indicate(0)}
 document.querySelector('.reviews-prev').addEventListener('click',()=>moveTo(physical-1));
 document.querySelector('.reviews-next').addEventListener('click',()=>moveTo(physical+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>{const current=modulo(physical);let delta=i-current;if(delta>count/2)delta-=count;if(delta<-count/2)delta+=count;moveTo(physical+delta)}));
 reviewsReel.addEventListener('keydown',event=>{if(!mobile.matches)return;let next;if(event.key==='ArrowRight')next=physical+1;if(event.key==='ArrowLeft')next=physical-1;if(event.key==='Home')next=count;if(event.key==='End')next=count*2-1;if(next!==undefined){event.preventDefault();moveTo(next)}});
 reviewsReel.addEventListener('scroll',()=>{if(!mobile.matches)return;clearTimeout(settleTimer);indicate(modulo(Math.round(reviewsReel.scrollLeft/step())));settleTimer=setTimeout(settle,180)},{passive:true});
 reviewsReel.addEventListener('scrollend',settle);
 new ResizeObserver(reset).observe(reviewsReel);
 reset();
}
