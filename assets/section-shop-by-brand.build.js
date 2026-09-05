const selectors = {
  section: ".js-shop-by-brand-section",
  slider: ".js-shop-by-brand-slider",
  sliderPagination: ".js-shop-by-brand-slider-pagination"
};
const ShopByBrand = () => {
  const Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => initSlider(section));
  }
  function initSlider(section) {
    const slider = section.querySelector(selectors.slider);
    if (!slider)
      return;
    const options = {
      slidesPerView: 2,
      spaceBetween: -1,
      grabCursor: true,
      grid: {
        fill: "row",
        rows: 2
      },
      pagination: {
        type: "progressbar",
        el: selectors.sliderPagination
      },
      navigation: {
        nextEl: `.js-swiper-button-next-${section.id}`,
        prevEl: `.js-swiper-button-prev-${section.id}`
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          grid: {
            fill: "row",
            rows: 2
          }
        }
      }
    };
    new Swiper(slider, options);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ShopByBrand = window.themeCore.ShopByBrand || ShopByBrand();
  window.themeCore.utils.register(window.themeCore.ShopByBrand, "shop-by-brand");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
