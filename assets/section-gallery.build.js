const selectors = {
  section: ".js-gallery",
  image: ".js-gallery-image"
};
const Gallery = () => {
  const classes = {
    reverseTranslate: "is-reverse-translate"
  };
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          handlerAnimation(entry.target);
          observer.unobserve(section);
        }
      });
    });
    sections.forEach((section) => intersectionObserver.observe(section));
  }
  function handlerAnimation(sectionEl) {
    const images = [...sectionEl.querySelectorAll(selectors.image)];
    let scrollPrevY = 0;
    let scrollCurY = 0;
    let scrollY = 0;
    let scrollDY = 0;
    sectionEl.addEventListener("mousemove", (event) => {
      event.clientY;
      event.clientX;
    });
    function loop() {
      if (images.length > 0) {
        scrollCurY = window.scrollY - sectionEl.offsetTop;
        scrollDY = scrollCurY - scrollPrevY;
        scrollY = smoothMotion(scrollDY, scrollCurY, scrollY);
        scrollPrevY = scrollY;
        images.forEach((image, index) => {
          const translateY = image.classList.contains(classes.reverseTranslate) ? -scrollY : scrollY;
          image.style.transform = `translate3d(0, ${translateY * 0.15}px, 0)`;
        });
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
  function smoothMotion(delta, current, previous) {
    const smootCof = 0.06;
    return Math.abs(delta) < 1 ? current : previous + delta * smootCof;
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Gallery = window.themeCore.Gallery || Gallery();
  window.themeCore.utils.register(window.themeCore.Gallery, "gallery");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
