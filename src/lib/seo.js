import { languages, projects, translations } from './content.js';
const pageCopy = {
  en: {
    '': ['WordPress & Shopify Developer', 'Web development by Eugene: custom WordPress themes and plugins, Shopify Dawn redesigns, custom sections and Recharge customization. Explore my work.'],
    about: ['About Eugene — Web & E-commerce Developer', 'Meet Eugene, a WordPress and Shopify developer. Learn about my tools, approach to responsive interfaces, maintainable code and project communication.'],
    services: ['WordPress & Shopify Development Services', 'Custom WordPress websites, Shopify theme development, e-commerce improvements, performance optimization and ongoing support. Discuss your project.'],
    portfolio: ['Web Development Portfolio — WordPress & Shopify', 'Explore WordPress and Shopify projects, including Poikhaly z namy and NutraHarmony, alongside clearly marked demonstration website concepts.'],
    contacts: ['Contact Eugene — Discuss Your Website Project', 'Plan a WordPress website or Shopify improvement with Eugene. Share your goals, requirements and scope to discuss the right development solution.'],
    poehalisnami: ['Poikhaly z namy — WordPress Development Case', 'Travel agency website development: a custom WordPress theme and plugins for Poikhaly z namy in Mykolaiv. Explore the project and my contribution.'],
    nutraharmony: ['NutraHarmony — Shopify Dawn & Recharge Case', 'NutraHarmony Shopify project: Dawn theme redesign, custom section development and Recharge customization. Explore the store and my contribution.']
  },
  uk: {
    '': ['Розробник WordPress і Shopify', 'Веброзробка від Євгена: власні теми й плагіни WordPress, редизайн Shopify Dawn, кастомні секції та Recharge. Перегляньте проєкти й послуги.'],
    about: ['Про Євгена — веброзробника WordPress і Shopify', 'Познайомтеся з Євгеном, розробником WordPress і Shopify. Технології, підхід до адаптивних інтерфейсів, підтримуваного коду та комунікації.'],
    services: ['Розробка сайтів на WordPress і Shopify', 'Сайти WordPress, власні теми й плагіни, секції Shopify, покращення інтернет-магазинів, оптимізація та підтримка. Обговорімо ваш проєкт.'],
    portfolio: ['Портфоліо розробника WordPress і Shopify', 'Проєкти WordPress і Shopify: «Поїхали з нами» та NutraHarmony. Перегляньте внесок у розробку та окремо позначені демонстраційні концепції.'],
    contacts: ['Контакти — обговорити розробку сайту', 'Плануєте сайт WordPress або покращення Shopify-магазину? Розкажіть Євгену про цілі, вимоги й обсяг робіт, щоб обговорити рішення та наступні кроки.'],
    poehalisnami: ['«Поїхали з нами» — розробка сайту WordPress', 'Повна розробка сайту турагенції «Поїхали з нами» у Миколаєві: власна WordPress-тема та плагіни. Огляд проєкту й внеску розробника.'],
    nutraharmony: ['NutraHarmony — редизайн Shopify Dawn і Recharge', 'Проєкт NutraHarmony на Shopify: редизайн теми Dawn, розробка кастомних секцій і кастомізація Recharge. Огляд магазину й внеску розробника.']
  },
  ru: {
    '': ['Разработчик WordPress и Shopify', 'Веб-разработка от Евгения: собственные темы и плагины WordPress, редизайн Shopify Dawn, кастомные секции и Recharge. Посмотрите проекты и услуги.'],
    about: ['О Евгении — разработчике WordPress и Shopify', 'Познакомьтесь с Евгением, разработчиком WordPress и Shopify. Технологии, подход к адаптивным интерфейсам, поддерживаемому коду и общению.'],
    services: ['Разработка сайтов на WordPress и Shopify', 'Сайты WordPress, собственные темы и плагины, секции Shopify, улучшение интернет-магазинов, оптимизация и поддержка. Обсудим ваш проект.'],
    portfolio: ['Портфолио разработчика WordPress и Shopify', 'Проекты WordPress и Shopify: «Поехали с нами» и NutraHarmony. Посмотрите вклад в разработку и отдельно обозначенные демонстрационные концепции.'],
    contacts: ['Контакты — обсудить разработку сайта', 'Планируете сайт WordPress или улучшение Shopify-магазина? Расскажите Евгению о целях, требованиях и объёме работ, чтобы обсудить решение и следующие шаги.'],
    poehalisnami: ['«Поехали с нами» — разработка сайта WordPress', 'Полная разработка сайта турагентства «Поехали с нами» в Николаеве: собственная WordPress-тема и плагины. Обзор проекта и вклада разработчика.'],
    nutraharmony: ['NutraHarmony — редизайн Shopify Dawn и Recharge', 'Проект NutraHarmony на Shopify: редизайн темы Dawn, разработка кастомных секций и кастомизация Recharge. Обзор магазина и вклада разработчика.']
  }
};
export function seoHead({lang, route, site, title, description, noindex = false, href, escape}) {
  if (noindex) return `<title>${escape(title)} · ${escape(site.name)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="noindex, follow">`;
  const t = translations[lang];
  const project = projects.find(p=>route === 'portfolio/'+p.slug);
  const index = projects.indexOf(project);
  const copy = pageCopy[lang][project?.slug || route];
  const demoTitle = { en: 'demo concept', uk: 'демоконцепція', ru: 'демоконцепция' }[lang];
  const metaTitle = `${copy?.[0] || `${t.projectNames[index]} — ${project.tech[0]} ${demoTitle}`} | ${site.name}`;
  const metaDescription = copy?.[1] || `${t.projectDescriptions[index]} ${t.demo}.`;
  const absolute = (language, path='') => site.origin.replace(/\/$/,'') + href(language,path);
  const url = absolute(lang,route);
  const root = absolute('en');
  const personId = root+'#person';
  const websiteId = root+'#website';
  const pageId = url+'#webpage';
  const name = { en: site.author, uk: 'Євген', ru: 'Евгений' }[lang];
  const graph = [
    { '@type':'Person', '@id':personId, name, url:absolute(lang,'about'), jobTitle:'Web / E-commerce Developer', knowsAbout:['WordPress','Shopify','JavaScript'] },
    { '@type':'WebSite', '@id':websiteId, name:site.name, url:root, inLanguage:languages, publisher:{'@id':personId} },
    { '@type':route === 'about' ? 'ProfilePage' : route === 'contacts' ? 'ContactPage' : route === 'portfolio' || route === 'services' ? 'CollectionPage' : 'WebPage', '@id':pageId, url, name:metaTitle, description:metaDescription, inLanguage:lang, isPartOf:{'@id':websiteId} }
  ];
  const page = graph[2];
  if (route === 'about') page.mainEntity = {'@id':personId};
  if (project) {
    const workId = url+'#project';
    const work = { '@type':'CreativeWork', '@id':workId, name:project.real ? project.name[lang] : `${t.projectNames[index]} — ${t.demo}`, description:project.real ? project.overview[lang] : t.projectDescriptions[index], inLanguage:lang, url:project.url || url, mainEntityOfPage:{'@id':pageId} };
    if (project.contribution) { work.contributor={'@id':personId}; work.creditText=project.contribution[lang].text; }
    graph.push(work); page.mainEntity={'@id':workId};
  }
  if (route === 'portfolio') {
    const listId=url+'#projects';
    const ordered=[...projects.filter(p=>p.real),...projects.filter(p=>!p.real)];
    graph.push({'@type':'ItemList','@id':listId,itemListElement:ordered.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.real?p.name[lang]:`${t.projectNames[projects.indexOf(p)]} — ${t.demo}`,url:absolute(lang,'portfolio/'+p.slug)}))});
    page.mainEntity={'@id':listId};
  }
  if (route === 'services') {
    const listId=url+'#services';
    graph.push({'@type':'ItemList','@id':listId,itemListElement:t.serviceNames.map((n,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'Service',name:n,description:t.serviceText[i],provider:{'@id':personId},url}}))});
    page.mainEntity={'@id':listId};
  }
  if (route) {
    const trail=[{name:t.nav[0],url:absolute(lang)}];
    if (project) trail.push({name:t.nav[3],url:absolute(lang,'portfolio')});
    trail.push({name:project?(project.real?project.name[lang]:t.projectNames[index]):t.nav[['','about','services','portfolio','contacts'].indexOf(route)],url});
    const id=url+'#breadcrumbs';
    graph.push({'@type':'BreadcrumbList','@id':id,itemListElement:trail.map((v,i)=>({'@type':'ListItem',position:i+1,name:v.name,item:v.url}))});
    page.breadcrumb={'@id':id};
  }
  const json=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
  return `<title>${escape(metaTitle)}</title><meta name="description" content="${escape(metaDescription)}"><link rel="canonical" href="${escape(url)}">${languages.map(l=>`<link rel="alternate" hreflang="${l}" href="${escape(absolute(l,route))}">`).join('')}<link rel="alternate" hreflang="x-default" href="${escape(absolute('en',route))}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(metaTitle)}"><meta property="og:description" content="${escape(metaDescription)}"><meta property="og:url" content="${escape(url)}"><meta property="og:site_name" content="${escape(site.name)}"><script type="application/ld+json">${json}</script>`;
}