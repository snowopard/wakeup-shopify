const Flashlight = () => {
  const selectors = {
    item: ".js-flashlight-item",
    flashlight: ".js-flashlight-effect"
  };
  function init() {
    const items = [...document.querySelectorAll(selectors.item)];
    if (items.length < 1) {
      return;
    }
    items.forEach((item) => {
      const flashlight = item.querySelector(selectors.flashlight);
      if (!flashlight) {
        return;
      }
      item.addEventListener("mousemove", (e) => {
        const { top, left } = item.getBoundingClientRect();
        const y = e.clientY - top;
        const x = e.clientX - left;
        flashlight.style.cssText = `
						top: ${y}px;
						left: ${x}px;
					`;
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.pricingTableFlashlight = window.themeCore.pricingTableFlashlight || Flashlight();
  window.themeCore.utils.register(window.themeCore.pricingTableFlashlight, "pricing-table");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
