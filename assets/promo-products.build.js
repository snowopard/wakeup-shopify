const PromoProducts = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const selectors = {
    section: ".js-promo-products",
    sectionBackground: ".js-promo-products-background",
    accordionEl: ".js-promo-products-accordion",
    buttonCircle: ".js-promo-products-button-circle"
  };
  const classes = {
    backgroundHidden: "promo-products__background--hidden",
    ...cssClasses
  };
  function toggleBackground(section, activeAccordion) {
    section.querySelectorAll(selectors.sectionBackground).forEach((el) => {
      el.classList.toggle(classes.backgroundHidden, el.id !== activeAccordion.id);
    });
  }
  function toggleActiveState(accordionElems, activeAccordion) {
    accordionElems.forEach((accordion) => {
      const buttonCircle = accordion.querySelector(selectors.buttonCircle);
      buttonCircle.classList.toggle(cssClasses.active, accordion === activeAccordion);
    });
  }
  function init() {
    const sections = document.querySelectorAll(selectors.section);
    sections.forEach((section) => {
      const accordionElems = section.querySelectorAll(selectors.accordionEl);
      accordionElems.forEach((accordion) => {
        accordion.addEventListener("click", () => {
          toggleBackground(section, accordion);
          toggleActiveState(accordionElems, accordion);
        });
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.PromoProducts = window.themeCore.PromoProducts || PromoProducts();
  window.themeCore.utils.register(window.themeCore.PromoProducts, "promo-products");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
