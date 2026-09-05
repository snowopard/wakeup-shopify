const selectors = {
  section: ".js-story-telling",
  slider: ".js-story-telling-slider",
  slide: ".js-story-telling-slide",
  pagination: ".js-story-telling-pagination",
  navigationPrev: ".js-story-telling-button-prev",
  navigationNext: ".js-story-telling-button-next"
};
const StoryTelling = () => {
  const Swiper = window.themeCore.utils.Swiper;
  const mobileSize = window.matchMedia("(max-width: 767px)");
  let sections;
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const slider = section.querySelector(selectors.slider);
      const slides = section.querySelectorAll(selectors.slide);
      if (!slider) {
        return;
      }
      const storyTellingSlider = new Swiper(slider, {
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        speed: 1200,
        grabCursor: true,
        pagination: {
          el: selectors.pagination,
          type: "bullets",
          bulletElement: "button",
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 1,
          renderBullet: function(index, className) {
            var _a;
            const dataSlideHeading = ((_a = slides[index]) == null ? void 0 : _a.dataset.slideHeading) || "";
            return `<span class="${className}">
									<span class="bullet"></span>
									${dataSlideHeading !== "" ? `<span class="bullet-text">${dataSlideHeading}</span>` : ""}
								</span>`;
          }
        },
        navigation: {
          nextEl: selectors.navigationNext,
          prevEl: selectors.navigationPrev
        },
        breakpoints: {
          991: {
            spaceBetween: 30
          },
          1199: {
            spaceBetween: 90
          }
        },
        on: {
          init: function() {
            disableTabulationOnNotActiveSlides(this);
          },
          slideChange: function() {
            disableTabulationOnNotActiveSlides(this);
          }
        }
      });
      mobileSize.addEventListener("change", () => {
        storyTellingSlider.pagination.update();
      });
      function disableTabulationOnNotActiveSlides(slider2) {
        slider2.slides.forEach((slide) => {
          const focusable = [...slide.querySelectorAll("a")];
          focusable.forEach((focus) => {
            if (slider2.slides[slider2.activeIndex] === slide) {
              focus.setAttribute("tabindex", "0");
            } else {
              focus.setAttribute("tabindex", "-1");
            }
          });
        });
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.StoryTelling = window.themeCore.StoryTelling || StoryTelling();
  window.themeCore.utils.register(window.themeCore.StoryTelling, "story-telling");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
