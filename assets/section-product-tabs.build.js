const selectors = {
  section: ".js-product-tabs",
  slider: ".js-product-tabs-slider",
  paginationWrapper: ".js-product-tabs-pagination-wrapper",
  pagination: ".js-product-tabs-pagination",
  sliderButtonPrev: ".js-swiper-button-prev",
  sliderButtonNext: ".js-swiper-button-next",
  tabButton: ".js-tab-button"
};
const ProductTabs = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const Swiper = window.themeCore.utils.Swiper;
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const sliders = [...section.querySelectorAll(selectors.slider)];
      handlerSlider(section, sliders);
      handlerTabs(section, sliders);
    });
  }
  function handlerSlider(section, sliders) {
    let slidesPerViewDesktop = +section.getAttribute("data-slides-in-row") || 4;
    sliders.forEach((slider) => {
      let paginationWrapper = slider.querySelector(selectors.paginationWrapper);
      let pagination = slider.querySelector(selectors.pagination);
      let sliderButtonPrev = slider.querySelector(selectors.sliderButtonPrev);
      let sliderButtonNext = slider.querySelector(selectors.sliderButtonNext);
      let sliderOptions = {
        grabCursor: true,
        slidesPerView: 1,
        speed: 1200,
        pagination: {
          type: "progressbar",
          el: pagination
        },
        navigation: {
          nextEl: sliderButtonNext,
          prevEl: sliderButtonPrev
        },
        breakpoints: {
          481: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3
          },
          1200: {
            slidesPerView: slidesPerViewDesktop
          }
        },
        on: {
          init: function(swiper) {
            if (swiper.isLocked) {
              paginationWrapper.classList.add("is-hidden");
            }
          }
        }
      };
      new Swiper(slider, sliderOptions);
    });
  }
  function handlerTabs(section, sliders) {
    const tabs = [...section.querySelectorAll(selectors.tabButton)];
    if (tabs.length < 1)
      return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const body = document.getElementById(tab.dataset.id);
        if (!body || tab.classList.contains(cssClasses.active))
          return;
        sliders.forEach((slider) => {
          slider.classList.remove(cssClasses.active);
          tabs.forEach((tab2) => tab2.classList.remove(cssClasses.active));
          tab.classList.add(cssClasses.active);
          if (slider.id === tab.dataset.id) {
            slider.classList.add(cssClasses.active);
          }
        });
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductTabs = window.themeCore.ProductTabs || ProductTabs();
  window.themeCore.utils.register(window.themeCore.ProductTabs, "product-tabs");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
