/* Accessible two-slide carousel. No dependencies, eval, or dynamic HTML. */
(() => {
  "use strict";

  const INTERVAL_MS = 22000;
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const status = document.getElementById("slide-status");
  const progress = document.getElementById("progress");
  const landing = document.querySelector(".landing");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (slides.length !== 2 || dots.length !== slides.length ||
      !previousButton || !nextButton || !status || !progress || !landing) {
    return; // Fail safely if the expected markup is incomplete.
  }

  let activeIndex = 0;
  let intervalId = null;
  let animationFrame = null;
  let startedAt = 0;
  let elapsedBeforePause = 0;
  let isPaused = false;
  let touchStartX = null;

  const setProgress = (fraction) => {
    progress.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
  };

  function render(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      // Keep inactive slide links out of keyboard navigation.
      slide.querySelectorAll("a").forEach((link) => {
        if (active) {
          link.removeAttribute("tabindex");
        } else {
          link.setAttribute("tabindex", "-1");
        }
      });
    });

    dots.forEach((dot, i) => {
      const active = i === activeIndex;
      dot.classList.toggle("is-current", active);
      dot.setAttribute("aria-pressed", String(active));
    });

    status.textContent = `0${activeIndex + 1} / 0${slides.length}`;
    setProgress(0);
  }

  function clearClock() {
    if (intervalId !== null) window.clearTimeout(intervalId);
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    intervalId = null;
    animationFrame = null;
  }

  function updateProgress() {
    if (isPaused) return;
    const elapsed = elapsedBeforePause + (performance.now() - startedAt);
    setProgress(elapsed / INTERVAL_MS);
    animationFrame = window.requestAnimationFrame(updateProgress);
  }

  function schedule(remaining = INTERVAL_MS) {
    clearClock();
    if (isPaused || document.hidden || reducedMotion.matches) {
      setProgress(0);
      return;
    }
    startedAt = performance.now();
    intervalId = window.setTimeout(() => {
      render(activeIndex + 1);
      elapsedBeforePause = 0;
      schedule(INTERVAL_MS);
    }, Math.max(0, remaining));
    animationFrame = window.requestAnimationFrame(updateProgress);
  }

  function goTo(index) {
    render(index);
    elapsedBeforePause = 0;
    if (!isPaused) schedule(INTERVAL_MS);
  }

  function pause() {
    if (isPaused) return;
    isPaused = true;
    elapsedBeforePause += performance.now() - startedAt;
    clearClock();
  }

  function resume() {
    if (!isPaused) return;
    isPaused = false;
    if (!document.hidden && !reducedMotion.matches) {
      schedule(Math.max(0, INTERVAL_MS - elapsedBeforePause));
    }
  }

  previousButton.addEventListener("click", () => goTo(activeIndex - 1));
  nextButton.addEventListener("click", () => goTo(activeIndex + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const requested = Number(dot.dataset.slide);
      if (Number.isInteger(requested)) goTo(requested);
    });
  });

  landing.addEventListener("mouseenter", pause);
  landing.addEventListener("mouseleave", resume);
  landing.addEventListener("focusin", pause);
  landing.addEventListener("focusout", (event) => {
    if (!landing.contains(event.relatedTarget)) resume();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (!isPaused) {
        elapsedBeforePause += performance.now() - startedAt;
        clearClock();
      }
    } else if (!isPaused && !reducedMotion.matches) {
      schedule(Math.max(0, INTERVAL_MS - elapsedBeforePause));
    }
  });

  reducedMotion.addEventListener?.("change", () => {
    clearClock();
    if (reducedMotion.matches) {
      setProgress(0);
    } else if (!isPaused && !document.hidden) {
      schedule(INTERVAL_MS);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight") goTo(activeIndex + 1);
    if (event.key === "ArrowLeft") goTo(activeIndex - 1);
  });

  landing.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches?.[0]?.clientX ?? null;
  }, { passive: true });

  landing.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const endX = event.changedTouches?.[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    if (Math.abs(delta) > 55) goTo(delta < 0 ? activeIndex + 1 : activeIndex - 1);
    touchStartX = null;
  }, { passive: true });

  render(0);
  if (!reducedMotion.matches) schedule(INTERVAL_MS);
})();
