import { P as ProductCarousel, a as ProductStickyForm, b as ProductMediaScroller, c as ProductForm } from "./product-sticky-form-2d35c8df.js";
import "./disableTabulationOnNotActiveSlidesWithModel-38e80234.js";
const FeaturedProductSection = (section) => {
  const Toggle2 = window.themeCore.utils.Toggle;
  window.themeCore.utils.isElementInViewport;
  window.themeCore.utils.off;
  const on = window.themeCore.utils.on;
  const cssClasses2 = window.themeCore.utils.cssClasses;
  const selectors2 = {
    mediaContainer: ".js-product-media-container",
    slide: ".js-product-gallery-slide",
    descriptionReadMore: ".js-pdp-description-read-more",
    modelButton: ".js-product-media-model-button",
    modelPoster: ".js-product-media-model-poster",
    modelContent: ".js-product-media-model-content"
  };
  const sectionId = section && section.dataset.sectionId;
  const carouselSelectors = {
    slider: `.js-product-media-slider-${sectionId}`,
    sliderNavigationNext: `.js-product-media-slider-next-${sectionId}`,
    sliderNavigationPrev: `.js-product-media-slider-prev-${sectionId}`,
    sliderSlideVariantId: `.js-product-gallery-slide-variant-${sectionId}`,
    sliderPagination: `.js-product-media-pagination-${sectionId}`
  };
  const mediaContainerClasses = {
    stacked: "product-media--layout-stacked",
    stacked_2_col: "product-media--layout-stacked_2_col",
    slider: "product-media--layout-carousel"
  };
  const drawersSelectors = {
    sizeGuideDrawer: `productSizeGuideDrawer-${sectionId}`,
    descriptionDrawer: `descriptionDrawer-${sectionId}`,
    customDrawer1: `productDrawer1-${sectionId}`,
    customDrawer2: `productDrawer2-${sectionId}`,
    customDrawer3: `productDrawer3-${sectionId}`,
    customDrawer4: `productDrawer4-${sectionId}`
  };
  let Carousel = null;
  function init2() {
    Carousel = ProductCarousel({
      selectors: carouselSelectors,
      sectionId
    });
    const productStickyForms = ProductStickyForm(section);
    productStickyForms.init();
    initCarousel();
    setDrawers();
    initModelButtons();
    initDescriptionReadMore();
    const productHandle = section.dataset.productHandle;
    if (!productHandle) {
      return;
    }
    let recentlyViewed = localStorage.getItem("theme_recently_viewed");
    if (recentlyViewed) {
      try {
        recentlyViewed = JSON.parse(recentlyViewed);
        recentlyViewed = [.../* @__PURE__ */ new Set([...recentlyViewed, productHandle])];
        recentlyViewed = recentlyViewed.slice(-11);
        localStorage.setItem("theme_recently_viewed", JSON.stringify(recentlyViewed));
      } catch (e) {
        console.log(e);
      } finally {
        return;
      }
    }
    localStorage.setItem("theme_recently_viewed", `["${productHandle}"]`);
  }
  function initCarousel() {
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    if (!mediaContainer) {
      return;
    }
    const mediaLayout = mediaContainer.dataset.mediaLayout;
    if (!mediaLayout) {
      return;
    }
    if (mediaLayout === "carousel") {
      Carousel.init();
    }
    if (mediaLayout === "stacked" || mediaLayout === "stacked_2_col" || mediaLayout === "stacked_2_col_with_big_image") {
      updateMedia();
      on("resize", updateMedia);
      ProductMediaScroller(section).init();
    }
  }
  function updateMedia() {
    const mediaContainer = section.querySelector(selectors2.mediaContainer);
    if (!mediaContainer) {
      return;
    }
    const mediaLayout = mediaContainer.dataset.mediaLayout;
    let stackedClass = mediaContainerClasses.stacked;
    if (mediaLayout === "stacked_2_col") {
      stackedClass = mediaContainerClasses.stacked_2_col;
    }
    if (window.innerWidth > 1199) {
      Carousel.destroy();
      mediaContainer.classList.add(stackedClass);
      mediaContainer.classList.remove(mediaContainerClasses.slider);
    } else {
      Carousel.init();
      mediaContainer.classList.add(mediaContainerClasses.slider);
      mediaContainer.classList.remove(stackedClass);
    }
  }
  function setDrawers() {
    try {
      setToggleDrawer(drawersSelectors.sizeGuideDrawer, { hasFullWidth: true });
      setToggleDrawer(drawersSelectors.descriptionDrawer);
      setToggleDrawer(drawersSelectors.customDrawer1);
      setToggleDrawer(drawersSelectors.customDrawer2);
      setToggleDrawer(drawersSelectors.customDrawer3);
      setToggleDrawer(drawersSelectors.customDrawer4);
    } catch (e) {
    }
  }
  function setToggleDrawer(selector, options = {}) {
    const toggleButton = document.querySelector(`[data-js-toggle="${selector}"]`);
    if (!toggleButton) {
      return;
    }
    const ToggleDrawer = Toggle2({
      toggleSelector: selector,
      ...options
    });
    ToggleDrawer.init();
    if (selector === drawersSelectors.sizeGuideDrawer) {
      let sizeGuideDrawer = document.getElementById(drawersSelectors.sizeGuideDrawer);
      if (!sizeGuideDrawer) {
        return;
      }
      on("click", sizeGuideDrawer, function(e) {
        if (e.target == this) {
          ToggleDrawer.close(sizeGuideDrawer);
        }
      });
    }
  }
  function initModelButtons() {
    const modelButtons = [...section.querySelectorAll(selectors2.modelButton)];
    if (!modelButtons.length) {
      return;
    }
    section.addEventListener("click", (event) => {
      const button = event.target.closest(selectors2.modelButton);
      if (!button) {
        return;
      }
      const container = button.parentElement;
      const poster = container.querySelector(selectors2.modelPoster);
      const content = container.querySelector(selectors2.modelContent);
      if (!poster || !content) {
        return;
      }
      poster.remove();
      button.remove();
      content.classList.remove(cssClasses2.hidden);
      Carousel.disableSwipe();
    });
  }
  function initDescriptionReadMore() {
    const readMoreButton = section.querySelector(selectors2.descriptionReadMore);
    if (!readMoreButton) {
      return;
    }
    section.addEventListener("click", (event) => {
      const button = event.target.closest(selectors2.descriptionReadMore);
      if (!button) {
        return;
      }
      const elementToScrollID = button.getAttribute("data-scroll-to");
      const element = document.getElementById(elementToScrollID);
      if (!element) {
        return;
      }
      element.scrollIntoView({
        behavior: "smooth"
      });
    });
  }
  return Object.freeze({
    init: init2
  });
};
const selectors = {
  section: '[data-section-type="product"]',
  productAvailabilityToggleSelector: "[data-js-toggle-selector]",
  mediaContainer: ".js-product-media-container",
  video: ".js-video",
  slide: ".js-product-gallery-slide",
  paused: ".js-paused-video",
  placeholder: ".js-product-gallery-video-placeholder"
};
const videos = [];
let sections;
let ProductForms;
let Toggle;
let Video;
let cssClasses;
function init(sectionId) {
  Toggle = window.themeCore.utils.Toggle;
  Video = window.themeCore.utils.Video;
  cssClasses = {
    ...window.themeCore.utils.cssClasses,
    pausedVideo: "is-paused-video"
  };
  sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
  ProductForms = ProductForm();
  sections.forEach(initSection);
  ProductForms.init();
  initVideos();
  setEventBusListeners();
  window.themeCore.EventBus.emit("product:loaded");
}
function initSection(section) {
  const productSection = FeaturedProductSection(section);
  window.themeCore.EventBus.listen(
    `pickup-availability-drawer:productAvailability-pickup-availability__${section.dataset.sectionId}:loaded`,
    () => {
      const productAvailabilityToggles = [
        ...document.querySelectorAll(
          selectors.productAvailabilityToggleSelector
        )
      ];
      const productAvailabilityToggle = productAvailabilityToggles.find(
        (toggle) => {
          return toggle.dataset.jsToggle === `productAvailability-pickup-availability__${section.dataset.sectionId}`;
        }
      );
      const productAvailability = Toggle({
        toggleSelector: productAvailabilityToggle.dataset.target
      });
      productAvailability.init();
    }
  );
  window.setTimeout(() => {
    handlerPauseVideo(section);
  }, 0);
  productSection.init();
}
function onProductSliderSlideChange() {
  if (!videos.length) {
    window.themeCore.EventBus.remove("product-slider:slide-change", onProductSliderSlideChange);
  }
  pauseVideos();
}
function handlerPauseVideo(section) {
  const mediaContainer = section.querySelector(selectors.mediaContainer);
  if (!mediaContainer) {
    return;
  }
  mediaContainer.addEventListener("click", (event) => {
    const paused = event.target.closest(selectors.paused);
    if (!paused || !paused.classList.contains(cssClasses.pausedVideo)) {
      return;
    }
    const placeholder = paused.querySelector(selectors.placeholder);
    const videoEl = paused.querySelector(selectors.video);
    pauseVideos(videoEl);
    if (placeholder) {
      paused.classList.remove(cssClasses.pausedVideo);
      placeholder.classList.add(cssClasses.hidden);
      videos.forEach(({ player, videoWrapper, type }) => {
        if (videoWrapper === videoEl) {
          playVideo(player, type);
        }
      });
    }
  });
}
function playVideo(player, type) {
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
  switch (type) {
    case VIDEO_TYPES.html: {
      player.play();
      break;
    }
    case VIDEO_TYPES.vimeo: {
      player.play();
      break;
    }
    case VIDEO_TYPES.youtube: {
      player.mute();
      player.playVideo();
      break;
    }
    default:
      return;
  }
}
function pauseVideos(currentVideo) {
  videos.forEach(({ player, videoWrapper }) => {
    if (videoWrapper === currentVideo) {
      return;
    }
    try {
      player.pauseVideo();
    } catch (e) {
    }
    try {
      player.pause();
    } catch (e) {
    }
  });
}
function setEventBusListeners() {
  window.themeCore.EventBus.listen("product-slider:slide-change", onProductSliderSlideChange);
}
async function initVideos() {
  const slides = [...document.querySelectorAll(selectors.slide)];
  slides.forEach((slide) => {
    const [video] = Video({
      videoContainer: slide,
      options: {
        youtube: {
          controls: 1,
          showinfo: 1
        }
      }
    }).init();
    if (video) {
      videos.push(video);
    }
  });
}
const FeaturedProduct = () => {
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.FeaturedProduct = window.themeCore.FeaturedProduct || FeaturedProduct();
  window.themeCore.utils.register(window.themeCore.FeaturedProduct, "featured-product");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
