/* Automatic two-slide carousel: no manual navigation controls. */
(() => {
  "use strict";

  const INTERVAL_MS = 22000;
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.getElementById("progress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (slides.length !== 2 || !progress) return;

  let activeIndex = 0;
  let timeoutId = null;
  let animationFrameId = null;
  let startedAt = 0;

  function render(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));

      // Prevent links on the hidden slide from receiving keyboard focus.
      slide.querySelectorAll("a").forEach((link) => {
        if (active) link.removeAttribute("tabindex");
        else link.setAttribute("tabindex", "-1");
      });
    });

    progress.style.width = "0%";
  }

  function clearSchedule() {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
    if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    timeoutId = null;
    animationFrameId = null;
  }

  function updateProgress() {
    if (document.hidden || reducedMotion.matches) return;
    const fraction = Math.min(1, (performance.now() - startedAt) / INTERVAL_MS);
    progress.style.width = `${fraction * 100}%`;
    animationFrameId = window.requestAnimationFrame(updateProgress);
  }

  function scheduleNextSlide() {
    clearSchedule();
    progress.style.width = "0%";

    // Do not run the carousel in a background tab or against reduced-motion settings.
    if (document.hidden || reducedMotion.matches) return;

    startedAt = performance.now();
    timeoutId = window.setTimeout(() => {
      render(activeIndex + 1);
      scheduleNextSlide();
    }, INTERVAL_MS);
    animationFrameId = window.requestAnimationFrame(updateProgress);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearSchedule();
    else scheduleNextSlide();
  });

  reducedMotion.addEventListener?.("change", scheduleNextSlide);

  render(0);
  scheduleNextSlide();
})();
