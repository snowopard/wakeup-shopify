const selectors = {
  section: ".js-featured-products",
  slider: ".js-featured-products-slider",
  paginationWrapper: ".js-featured-products-pagination-wrapper"
};
const FeaturedProducts = () => {
  let Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      let slider = section.querySelector(selectors.slider);
      let slidesPerViewDesktop = +slider.getAttribute("data-slides-in-row") || 4;
      let paginationWrapper = slider.querySelector(selectors.paginationWrapper);
      let sliderOptions = {
        grabCursor: true,
        slidesPerView: 1,
        speed: 1200,
        pagination: {
          type: "progressbar",
          el: ".js-featured-products-pagination"
        },
        navigation: {
          nextEl: `.js-swiper-button-next-${section.id}`,
          prevEl: `.js-swiper-button-prev-${section.id}`
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
      let productsSlider = new Swiper(slider, sliderOptions);
      if (paginationWrapper) {
        productsSlider.on("lock", function(e) {
          paginationWrapper.classList.add("is-hidden");
        });
        productsSlider.on("unlock", function(e) {
          paginationWrapper.classList.remove("is-hidden");
        });
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.FeaturedProducts = window.themeCore.FeaturedProducts || FeaturedProducts();
  window.themeCore.utils.register(window.themeCore.FeaturedProducts, "featured-products");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
