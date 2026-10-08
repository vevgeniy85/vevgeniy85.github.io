(() => {
  const colors = ['blue', 'green', 'yellow', 'red', 'purple'];
  const cookieName = 'xt-ui-accent';
  const root = document.documentElement;
  try {
    const saved = document.cookie.split('; ').find(value => value.startsWith(cookieName + '='))?.split('=')[1];
    if (colors.includes(saved)) root.dataset.uiAccent = saved;
  } catch { /* The picker still works when cookies are unavailable. */ }
  document.addEventListener('DOMContentLoaded', () => {
    const buttons = [...document.querySelectorAll('[data-accent-choice]')];
    const defaults = { '#7dd3fc': 'blue', '#86efac': 'green', '#fde047': 'yellow', '#ff4545': 'red', '#a855f7': 'purple' };
    const update = () => {
      const selected = root.dataset.uiAccent || defaults[getComputedStyle(root).getPropertyValue('--color-accent').trim().toLowerCase()];
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.accentChoice === selected)));
    };
    update();
    buttons.forEach(button => button.addEventListener('click', () => {
      const choice = button.dataset.accentChoice;
      if (!colors.includes(choice)) return;
      root.dataset.uiAccent = choice;
      try {
        document.cookie = `${cookieName}=${choice}; Path=${document.body.dataset.cookiePath || '/'}; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      } catch { /* Keep the selected color for this page. */ }
      update();
    }));
  });
})();
