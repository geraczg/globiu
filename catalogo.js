const catalogCarousel = document.querySelector('[data-catalog-carousel]');

if (catalogCarousel) {
  const track = catalogCarousel.querySelector('[data-catalog-track]');
  const slides = [...track.querySelectorAll('.catalog-repeat-carousel__slide')];
  const previousButton = catalogCarousel.querySelector('[data-catalog-previous]');
  const nextButton = catalogCarousel.querySelector('[data-catalog-next]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let scrollFrame;

  function updateControls() {
    previousButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;
  }

  function showSlide(index, behavior = 'smooth') {
    currentSlide = Math.max(0, Math.min(index, slides.length - 1));
    const target = slides[currentSlide];

    if (target) {
      track.scrollTo({
        left: target.offsetLeft - track.offsetLeft,
        behavior: reducedMotion.matches ? 'auto' : behavior
      });
    }

    updateControls();
  }

  previousButton.addEventListener('click', () => showSlide(currentSlide - 1));
  nextButton.addEventListener('click', () => showSlide(currentSlide + 1));

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(currentSlide - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });

  track.addEventListener('scroll', () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      const trackCenter = track.scrollLeft + (track.clientWidth / 2);
      let closestSlide = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft - track.offsetLeft + (slide.offsetWidth / 2);
        const distance = Math.abs(slideCenter - trackCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSlide = index;
        }
      });

      currentSlide = closestSlide;
      updateControls();
    });
  }, { passive: true });

  const resizeObserver = new ResizeObserver(() => showSlide(currentSlide, 'auto'));
  resizeObserver.observe(track);
  updateControls();
}
