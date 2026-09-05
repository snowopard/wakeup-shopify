const selectors = {
  section: ".js-benefits",
  item: ".js-benefits-item"
};
const Benefits = () => {
  let sections = [];
  const init = (sectionId) => {
    const options = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0
    };
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          handlerAnimationScroll(section);
          observer.unobserve(section);
        }
      });
    }, options);
    sections.forEach((section) => intersectionObserver.observe(section));
  };
  function handlerAnimationScroll(section) {
    const items = [...section.querySelectorAll(selectors.item)];
    if (items.length > 0) {
      let loop2 = function() {
        const sectionTop = section.getBoundingClientRect().top + (window.scrollY - 200);
        curY = window.scrollY - sectionTop;
        dy = curY - prevY;
        y = Math.abs(dy) < 1 ? curY : y + dy * smoothCoef;
        prevY = y;
        items.forEach((item) => {
          item.style.transform = `translate3d(0,${-y * 0.1}px,0)`;
        });
        requestAnimationFrame(loop2);
      };
      var loop = loop2;
      const smoothCoef = 0.06;
      let prevY = 0;
      let curY = 0;
      let y = 0;
      let dy;
      requestAnimationFrame(loop2);
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Benefits = window.themeCore.Benefits || Benefits();
  window.themeCore.utils.register(window.themeCore.Benefits, "benefits");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
