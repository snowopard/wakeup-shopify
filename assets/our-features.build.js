const selectors = {
  section: ".js-our-features",
  bubble: ".js-our-features-image-inner",
  item: ".js-our-features-item"
};
const OurFeatures = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          handlerAnimationBubbles(section);
          window.addEventListener("scroll", () => {
            handlerScrollContext(section);
          });
          handlerScrollContext(section);
          observer.unobserve(section);
        }
      });
    });
    sections.forEach((section) => intersectionObserver.observe(section));
  }
  function handlerAnimationBubbles(section) {
    const bubbles = [...section.querySelectorAll(selectors.bubble)];
    if (bubbles.length > 0) {
      let loop2 = function() {
        const sectionRect = section.getBoundingClientRect();
        sectionVisible = sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
        if (sectionVisible) {
          curY = window.scrollY - section.offsetTop;
          dy = curY - prevY;
          y = Math.abs(dy) < 1 ? curY : y + dy * smootCof;
          prevY = y;
          bubbles.forEach((bubble, index) => {
            const bubbleRect = bubble.getBoundingClientRect();
            const sectionRect2 = section.getBoundingClientRect();
            const speed = index === 0 ? -0.19 : 0.19;
            const bubbleTop = bubbleRect.top + 60 >= sectionRect2.top;
            const bubbleBottom = bubbleRect.top - 60 + bubbleRect.height <= sectionRect2.top + sectionRect2.height;
            if (bubbleTop && bubbleBottom) {
              bubble.style.transform = `translate3d(0, ${y * speed}px, 0)`;
            }
          });
        }
        requestAnimationFrame(loop2);
      };
      var loop = loop2;
      const smootCof = 0.06;
      let prevY = 0;
      let curY = 0;
      let y = 0;
      let dy = 0;
      let sectionVisible = false;
      requestAnimationFrame(loop2);
    }
  }
  function handlerScrollContext(section) {
    const items = [...section.querySelectorAll(selectors.item)];
    if (items.length < 1) {
      return;
    }
    items.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight / 2) {
        item.classList.add(cssClasses.active);
      } else {
        item.classList.remove(cssClasses.active);
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.OurFeatures = window.themeCore.OurFeatures || OurFeatures();
  window.themeCore.utils.register(window.themeCore.OurFeatures, "our-features");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
