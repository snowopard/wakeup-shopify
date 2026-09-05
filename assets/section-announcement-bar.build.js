import { T as Ticker } from "./ticker-2aaf4347.js";
const AnnouncementBar = () => {
  let Timer;
  const selectors = {
    section: ".js-announcement-bar",
    announcementBarCloser: ".js-bar-closer",
    timer: ".js-timer",
    slider: ".js-announcement-bar-slider",
    slideContent: ".js-announcement-bar-slide-content",
    tickerContainer: ".js-announcement-bar-ticker-container"
  };
  const Swiper = window.themeCore.utils.Swiper;
  async function initSlider(sliderEl) {
    let swiperSlider = null;
    if (!sliderEl) {
      return;
    }
    const Autoplay = await window.themeCore.utils.getExternalUtil("swiperAutoplay");
    Swiper.use([Autoplay]);
    const autoplaySpeed = sliderEl.getAttribute("data-autoplay-speed");
    const isAutoPlay = sliderEl.getAttribute("data-autoplay") === "true";
    swiperSlider = new Swiper(sliderEl, {
      init: false,
      direction: "vertical",
      slidesPerView: 1,
      arrows: false,
      loop: true,
      navigation: {
        nextEl: ".js-announcement-swiper-button-next",
        prevEl: ".js-announcement-swiper-button-prev"
      },
      autoplay: isAutoPlay ? {
        delay: autoplaySpeed,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      } : false
    });
    swiperSlider.on("init", function() {
      initSwiperHeight(swiperSlider);
      window.addEventListener("resize", () => initSwiperHeight(swiperSlider));
    });
    swiperSlider.init();
  }
  function initSwiperHeight(swiperSlider) {
    if (!swiperSlider || !swiperSlider.initialized) {
      return;
    }
    let swiperContainer = swiperSlider.el;
    let swiperSlides = swiperSlider.slides;
    if (!swiperSlider || !swiperSlider || !swiperSlides.length) {
      return;
    }
    let maxHeight = 0;
    swiperContainer.style.height = 0;
    swiperSlides.forEach((swiperSlide) => {
      let swiperSlideContent = swiperSlide.querySelector(selectors.slideContent);
      if (swiperSlideContent) {
        swiperSlideContent.style.height = "auto";
        if (swiperSlideContent && swiperSlideContent.scrollHeight > maxHeight) {
          maxHeight = swiperSlideContent.scrollHeight;
        }
      }
    });
    swiperContainer.style.height = `${maxHeight}px`;
    swiperSlides.forEach(function(swiperSlide) {
      let swiperSlideContent = swiperSlide.querySelector(selectors.slideContent);
      swiperSlideContent.style.height = "";
    });
  }
  async function init() {
    Timer = window.themeCore.utils.Timer;
    const sections = [...document.querySelectorAll(selectors.section)];
    sections.forEach((section) => {
      let timers = null;
      let slider;
      let tickerContainer;
      timers = section.querySelectorAll(selectors.timer);
      slider = section.querySelector(selectors.slider);
      tickerContainer = section.querySelector(selectors.tickerContainer);
      window.themeCore.EventBus.emit("announcement-bar:changed", {});
      initSlider(slider);
      Ticker(tickerContainer).init();
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const bounds = entry.boundingClientRect;
          changeCssVariable("--announcement-bar-height", ` ${bounds.height}px`);
        }
        observer.disconnect();
      });
      observer.observe(section);
      function changeCssVariable(variable, value) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(variable, value);
        });
      }
      setTimeout(() => {
        timers = section.querySelectorAll(selectors.timer);
        timers.forEach(function(timerEl) {
          Timer(timerEl).init();
        });
      }, 0);
      setTimeout(() => {
        window.themeCore.EventBus.emit("announcement-bar:loaded", {});
      }, 0);
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.AnnouncementBar = window.themeCore.AnnouncementBar || AnnouncementBar();
  window.themeCore.utils.register(window.themeCore.AnnouncementBar, "announcement-bar");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
