const selectors = {
  section: ".js-support",
  item: ".js-support-item",
  flashlight: ".js-support-item-flashlight-effect"
};
const Support = () => {
  const isDesktop = matchMedia("(min-width: 992px)");
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      isDesktop.addEventListener("change", () => {
        handlerDesktopMouseMove(section, isDesktop);
      });
      handlerDesktopMouseMove(section, isDesktop);
    });
  }
  function handlerDesktopMouseMove(section, media) {
    const items = [...section.querySelectorAll(selectors.item)];
    if (items.length < 1) {
      return;
    }
    if (media.matches) {
      section.addEventListener("mousemove", handlerFlashlightEffect);
    } else {
      section.removeEventListener("mousemove", handlerFlashlightEffect);
      items.forEach((item) => {
        const flashlight = item.querySelector(selectors.flashlight);
        flashlight.removeAttribute("style");
      });
    }
  }
  function handlerFlashlightEffect(event) {
    if (!event.target.closest(selectors.item)) {
      return;
    }
    const item = event.target.closest(selectors.item);
    const flashlight = item.querySelector(selectors.flashlight);
    const { top, left } = item.getBoundingClientRect();
    const y = event.clientY - top;
    const x = event.clientX - left;
    flashlight.style.cssText = `top: ${y}px; left: ${x}px;`;
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.support = window.themeCore.support || Support();
  window.themeCore.utils.register(window.themeCore.support, "support");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
