const selectors = {
  section: ".js-products-slideshow",
  ellipse: ".js-products-slideshow-product-ellipse",
  background: ".js-products-slideshow-background",
  decorImageContainer: ".js-products-slideshow-decor-image-container",
  productSlider: ".js-products-slideshow-product-slider",
  contentSlider: ".js-products-slideshow-content-slider",
  miniSlider: ".js-products-slideshow-mini-slider",
  productSlide: ".js-product-slide",
  contentSlide: ".js-content-slide",
  productImage: ".js-products-slideshow-product-image-wrapper",
  sliderButtonNext: ".js-products-slideshow-navigation-next",
  sliderButtonPrev: ".js-products-slideshow-navigation-prev",
  sliderPagination: ".js-products-slideshow-pagination"
};
const ProductsSlideshow = () => {
  const Swiper = window.themeCore.utils.Swiper;
  const cssClasses = {
    moveReverseNext: "is-move-reverse-next",
    moveReversePrev: "is-move-reverse-prev",
    moveReverse: "is-move-reverse",
    opacity: "is-opacity",
    ...window.themeCore.utils.cssClasses
  };
  const timeAnimation = 400;
  let sections;
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const ellipses = [...section.querySelectorAll(selectors.ellipse)];
      const decorImagesContainer = [...section.querySelectorAll(selectors.decorImageContainer)];
      const backgrounds = [...section.querySelectorAll(selectors.background)];
      const productSliderEl = section.querySelector(selectors.productSlider);
      const contentSliderEl = section.querySelector(selectors.contentSlider);
      const miniSliderEl = section.querySelector(selectors.miniSlider);
      const contentSlide = [...section.querySelectorAll(selectors.contentSlide)];
      const productSlide = [...section.querySelectorAll(selectors.productSlide)];
      const productImages = [...section.querySelectorAll(selectors.productImage)];
      const sliderButtonNext = section.querySelector(selectors.sliderButtonNext);
      const sliderButtonPrev = section.querySelector(selectors.sliderButtonPrev);
      const sliderPagination = section.querySelector(selectors.sliderPagination);
      const sliderButtons = [sliderButtonNext, sliderButtonPrev];
      const miniSlider = new Swiper(miniSliderEl, {
        slidesPerView: "auto"
      });
      const productSlider = new Swiper(productSliderEl, {
        slidesPerView: 1,
        speed: 600,
        allowTouchMove: false,
        navigation: {
          nextEl: sliderButtonNext,
          prevEl: sliderButtonPrev
        },
        pagination: {
          type: "progressbar",
          el: sliderPagination
        },
        allowSlideNext: false,
        allowSlidePrev: false
      });
      const contentSlider = new Swiper(contentSliderEl, {
        slidesPerView: 1,
        speed: 600,
        spaceBetween: 30,
        allowTouchMove: false
      });
      contentSlider.on("slideChange", function() {
        const activeSlide = contentSlider.slides[contentSlider.activeIndex];
        contentSlider.slides.forEach((slide) => {
          slide.setAttribute("inert", "");
        });
        activeSlide.removeAttribute("inert");
      });
      miniSlider.slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
          const direction = index > productSlider.activeIndex ? "next" : "prev";
          animateToIndex(index, direction);
        });
        slide.addEventListener("keydown", (e) => {
          if (e.key !== "Enter") {
            return;
          }
          const direction = index > productSlider.activeIndex ? "next" : "prev";
          animateToIndex(index, direction);
        });
      });
      sliderButtons.forEach((sliderButton) => {
        sliderButton.addEventListener("click", () => {
          let direction = "";
          let targetIndex;
          if (sliderButton.classList.contains("swiper-button--next")) {
            direction = "next";
            targetIndex = productSlider.activeIndex + 1;
            if (targetIndex >= productSlider.slides.length) {
              targetIndex = 0;
            }
          } else {
            direction = "prev";
            targetIndex = productSlider.activeIndex - 1;
            if (targetIndex < 0) {
              targetIndex = productSlider.slides.length - 1;
            }
          }
          sliderButton.disabled = true;
          animateToIndex(targetIndex, direction);
          setTimeout(() => {
            sliderButton.disabled = false;
          }, timeAnimation);
        });
      });
      function animateToIndex(targetIndex, scrollingDirection) {
        if (targetIndex === productSlider.activeIndex)
          return;
        const targetPosition = targetIndex + 1;
        let moveReverse = "";
        if (scrollingDirection === "next") {
          moveReverse = cssClasses.moveReverseNext;
        } else {
          moveReverse = cssClasses.moveReversePrev;
        }
        productSlider.allowSlideNext = true;
        productSlider.allowSlidePrev = true;
        removeClasses(miniSlider.slides, cssClasses.active);
        applyClasses(miniSlider.slides, targetPosition, cssClasses.active);
        miniSlider.slideTo(targetIndex);
        productSlider.slides.forEach((slide, i) => {
          const index = i + 1;
          if (slide.classList.contains("swiper-slide-active") && index !== targetPosition) {
            applyClasses(productSlide, index, moveReverse);
            applyClasses(contentSlide, index, moveReverse);
            applyClasses(productImages, index, cssClasses.moveReverse);
            applyClasses(decorImagesContainer, index, cssClasses.moveReverse);
          }
        });
        setTimeout(() => {
          decorImagesContainer.forEach((decorImage) => {
            if (targetPosition !== +decorImage.dataset.index) {
              decorImage.classList.add(cssClasses.opacity);
            }
          });
        }, timeAnimation + 600);
        setTimeout(() => {
          productSlider.slideTo(targetIndex);
          contentSlider.slideTo(targetIndex);
          decorImagesContainer.forEach((decorImage) => {
            if (targetPosition === +decorImage.dataset.index) {
              decorImage.classList.remove(cssClasses.opacity);
            }
          });
          removeClasses(ellipses, cssClasses.active);
          removeClasses(productSlide, moveReverse);
          removeClasses(contentSlide, moveReverse);
          removeClasses(decorImagesContainer, cssClasses.moveReverse);
          removeClasses(decorImagesContainer, cssClasses.active);
          removeClasses(backgrounds, cssClasses.active);
          removeClasses(productImages, cssClasses.moveReverse);
          removeClasses(productImages, cssClasses.active);
          applyClasses(ellipses, targetPosition, cssClasses.active);
          applyClasses(decorImagesContainer, targetPosition, cssClasses.active);
          applyClasses(backgrounds, targetPosition, cssClasses.active);
          applyClasses(productImages, targetPosition, cssClasses.active);
          productSlider.allowSlideNext = false;
          productSlider.allowSlidePrev = false;
        }, timeAnimation);
      }
      function applyClasses(elements, indexSlider, cls) {
        elements.forEach((image) => {
          const dataIndexImage = +image.dataset.index;
          const hasDataIndexImage = image.hasAttribute("data-index");
          if (indexSlider === dataIndexImage && hasDataIndexImage) {
            image.classList.add(cls);
          }
        });
      }
      function removeClasses(elements, cls) {
        elements.forEach((image) => image.classList.remove(cls));
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.ProductsSlideshow = window.themeCore.ProductsSlideshow || ProductsSlideshow();
  window.themeCore.utils.register(window.themeCore.ProductsSlideshow, "products-slideshow");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
