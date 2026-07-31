const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.primary-navigation');
const navLinks = [...document.querySelectorAll('.nav-link')];
const menuLinks = [...document.querySelectorAll('.nav-link, .brand--nav')];
const sections = [...document.querySelectorAll('main > section[id]')];

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) header.classList.remove('is-hidden');
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setMenu(false);
  menuButton.blur();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 864) setMenu(false);
});

let previousScrollY = window.scrollY;
let headerScrollTicking = false;

function updateHeader() {
  const currentScrollY = Math.max(window.scrollY, 0);
  const scrollDelta = currentScrollY - previousScrollY;
  const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';

  header.classList.toggle('is-scrolled', currentScrollY > 24);

  if (currentScrollY < 80 || menuIsOpen) {
    header.classList.remove('is-hidden');
  } else if (scrollDelta > 7) {
    header.classList.add('is-hidden');
  } else if (scrollDelta < -7) {
    header.classList.remove('is-hidden');
  }

  previousScrollY = currentScrollY;
  headerScrollTicking = false;
}

function handleHeaderScroll() {
  if (headerScrollTicking) return;
  headerScrollTicking = true;
  window.requestAnimationFrame(updateHeader);
}

updateHeader();
window.addEventListener('scroll', handleHeaderScroll, { passive: true });

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${visible.target.id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, {
  rootMargin: '-30% 0px -55% 0px',
  threshold: [0, 0.2, 0.5]
});

sections.forEach((section) => activeSectionObserver.observe(section));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactViewport = window.matchMedia('(max-width: 54rem)').matches;

function cleanSectionUrl() {
  const cleanUrl = window.location.protocol === 'file:' ? window.location.pathname : '/';

  try {
    window.history.replaceState(window.history.state, '', cleanUrl);
  } catch {
    // Keep navigation working if the page is opened in a restricted preview.
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
    cleanSectionUrl();
  });
});

const initialSectionId = decodeURIComponent(window.location.hash.slice(1));
const initialSection = initialSectionId ? document.getElementById(initialSectionId) : null;

if (initialSection || /\/index\.html$/i.test(window.location.pathname)) {
  window.requestAnimationFrame(() => {
    if (initialSection) initialSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    cleanSectionUrl();
  });
}

if (!reducedMotion && !compactViewport && 'IntersectionObserver' in window) {
  const revealSets = [
    { selector: '.about__intro', motion: 'reveal-jump-soft' },
    { selector: '.about__copy', motion: 'reveal-jump-soft' },
    { selector: '.inspiration-carousel__viewport', motion: 'reveal-jump-soft' },
    { selector: '.services .section-heading', motion: 'reveal-jump-soft' },
    { selector: '.service-category__heading', motion: 'reveal-jump-soft', stagger: true },
    { selector: '.graduation-collection__heading', motion: 'reveal-jump-soft' },
    { selector: '.graduation-card', motion: 'reveal-jump-high', stagger: true },
    { selector: '.floral-collection__heading', motion: 'reveal-jump-soft' },
    { selector: '.floral-card', motion: 'reveal-jump-high', stagger: true },
    { selector: '.gallery .section-heading', motion: 'reveal-jump-soft' },
    { selector: '.gallery-item', motion: 'reveal-jump-high', stagger: true },
    { selector: '.gallery-feature', motion: 'reveal-jump-high', stagger: true },
    { selector: '.contact__heading', motion: 'reveal-jump-soft' },
    { selector: '.social-link', motion: 'reveal-jump-high', stagger: true }
  ];

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  });

  revealSets.forEach(({ selector, motion, stagger }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal-item');
      if (motion) element.classList.add(motion);
      element.style.setProperty('--reveal-index', stagger ? Math.min(index, 6) : 0);
      revealObserver.observe(element);
    });
  });
}

const aboutVideo = document.querySelector('[data-about-video]');

if (aboutVideo) {
  let videoFadeFrame;
  let videoHasLoaded = false;

  function fadeVideoTo(targetOpacity, duration = 650) {
    window.cancelAnimationFrame(videoFadeFrame);
    const startOpacity = Number.parseFloat(aboutVideo.style.opacity || '0');

    if (reducedMotion) {
      aboutVideo.style.opacity = String(targetOpacity);
      return;
    }

    const startedAt = performance.now();

    function updateVideoOpacity(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      aboutVideo.style.opacity = String(startOpacity + ((targetOpacity - startOpacity) * easedProgress));
      if (progress < 1) videoFadeFrame = window.requestAnimationFrame(updateVideoOpacity);
    }

    videoFadeFrame = window.requestAnimationFrame(updateVideoOpacity);
  }

  function revealAboutVideo() {
    if (videoHasLoaded) return;
    videoHasLoaded = true;

    if (reducedMotion) {
      aboutVideo.pause();
      aboutVideo.currentTime = Math.min(0.1, aboutVideo.duration || 0.1);
      aboutVideo.style.opacity = '1';
      return;
    }

    aboutVideo.style.opacity = '0';
    aboutVideo.play().catch(() => {});
    fadeVideoTo(1, 700);
  }

  function handleVideoVisibility() {
    if (reducedMotion) return;
    if (document.hidden) aboutVideo.pause();
    else aboutVideo.play().catch(() => {});
  }

  aboutVideo.addEventListener('loadeddata', revealAboutVideo);
  document.addEventListener('visibilitychange', handleVideoVisibility);

  if (aboutVideo.readyState >= 2) revealAboutVideo();

  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(videoFadeFrame);
  });
}

const cardCarousel = document.querySelector('[data-card-carousel]');

if (cardCarousel) {
  const cardTrack = cardCarousel.querySelector('[data-card-track]');
  const cards = [...cardTrack.querySelectorAll('.inspiration-card')];
  const dotsContainer = cardCarousel.querySelector('[data-card-dots]');
  const previousCardButton = cardCarousel.querySelector('[data-card-previous]');
  const nextCardButton = cardCarousel.querySelector('[data-card-next]');
  let currentCardPage = 0;
  let cardsPerPage = 1;
  let cardPageCount = 1;
  let cardScrollFrame;

  function getCardsPerPage() {
    if (!cards.length) return 1;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const trackWidth = cardTrack.getBoundingClientRect().width;
    return Math.max(1, Math.round(trackWidth / cardWidth));
  }

  function updateCardCarouselControls() {
    previousCardButton.disabled = currentCardPage === 0;
    nextCardButton.disabled = currentCardPage === cardPageCount - 1;

    [...dotsContainer.children].forEach((dot, index) => {
      const isCurrent = index === currentCardPage;
      dot.classList.toggle('is-current', isCurrent);
      dot.setAttribute('aria-selected', String(isCurrent));
    });
  }

  function goToCardPage(page, behavior = 'smooth') {
    currentCardPage = Math.max(0, Math.min(page, cardPageCount - 1));
    const targetCard = cards[currentCardPage * cardsPerPage];
    if (targetCard) cardTrack.scrollTo({ left: targetCard.offsetLeft - cardTrack.offsetLeft, behavior });
    updateCardCarouselControls();
  }

  function buildCardCarouselDots() {
    cardsPerPage = getCardsPerPage();
    cardPageCount = Math.ceil(cards.length / cardsPerPage);
    currentCardPage = Math.min(currentCardPage, cardPageCount - 1);
    dotsContainer.replaceChildren();

    for (let index = 0; index < cardPageCount; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'inspiration-carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Mostrar grupo ${index + 1} de ${cardPageCount}`);
      dot.addEventListener('click', () => goToCardPage(index));
      dotsContainer.append(dot);
    }

    goToCardPage(currentCardPage, 'auto');
  }

  previousCardButton.addEventListener('click', () => goToCardPage(currentCardPage - 1));
  nextCardButton.addEventListener('click', () => goToCardPage(currentCardPage + 1));

  cardTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToCardPage(currentCardPage - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToCardPage(currentCardPage + 1);
    }
  });

  cardTrack.addEventListener('scroll', () => {
    window.cancelAnimationFrame(cardScrollFrame);
    cardScrollFrame = window.requestAnimationFrame(() => {
      const pageWidth = Math.max(1, cardTrack.scrollWidth / cardPageCount);
      currentCardPage = Math.max(0, Math.min(Math.round(cardTrack.scrollLeft / pageWidth), cardPageCount - 1));
      updateCardCarouselControls();
    });
  }, { passive: true });

  const cardCarouselResizeObserver = new ResizeObserver(buildCardCarouselDots);
  cardCarouselResizeObserver.observe(cardTrack);
  buildCardCarouselDots();
}

document.querySelector('#year').textContent = new Date().getFullYear();
