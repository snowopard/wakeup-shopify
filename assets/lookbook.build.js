const selectors = {
  section: ".js-lookbook",
  slider: ".js-lookbook-slider",
  item: ".js-lookbook-item",
  card: ".js-lookbook-product-card"
};
const OFFSET = 16;
const DESKTOP_MQ = "(min-width: 992px)";
const Lookbook = () => {
  let Swiper = window.themeCore.utils.Swiper;
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      initLookbook(section);
      initLookbookSlider(section);
    });
  }
  function initLookbook(section) {
    const items = [...section.querySelectorAll(selectors.item)];
    const mq = window.matchMedia(DESKTOP_MQ);
    items.forEach((item) => {
      const card = item.querySelector(selectors.card);
      if (!card)
        return;
      const positionCard = (event) => {
        if (!mq.matches)
          return;
        const itemRect = item.getBoundingClientRect();
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        let x = event.clientX - itemRect.left + OFFSET;
        let y = event.clientY - itemRect.top + OFFSET;
        const maxX = Math.max(0, itemRect.width - cardWidth);
        const maxY = Math.max(0, itemRect.height - cardHeight);
        x = Math.min(Math.max(0, x), maxX);
        y = Math.min(Math.max(0, y), maxY);
        card.style.transform = `translate(${x}px, ${y}px)`;
      };
      const onEnter = (event) => {
        if (!mq.matches)
          return;
        positionCard(event);
        card.classList.add("is-visible");
      };
      const onLeave = () => {
        card.classList.remove("is-visible");
      };
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mousemove", positionCard);
      item.addEventListener("mouseleave", onLeave);
      const handleMqChange = (e) => {
        if (!e.matches) {
          card.style.transform = "";
          card.classList.remove("is-visible");
        }
      };
      if (mq.addEventListener) {
        mq.addEventListener("change", handleMqChange);
      } else {
        mq.addListener(handleMqChange);
      }
    });
  }
  function initLookbookSlider(section) {
    const slider = section.querySelector(selectors.slider);
    if (!slider) {
      return;
    }
    const mq = window.matchMedia(DESKTOP_MQ);
    let swiperInstance = null;
    const sliderOptions = {
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 1200,
      pagination: {
        type: "progressbar",
        el: ".js-lookbook-pagination"
      },
      breakpoints: {
        481: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3
        }
      },
      navigation: {
        nextEl: `.js-swiper-button-next-${section.id}`,
        prevEl: `.js-swiper-button-prev-${section.id}`
      }
    };
    function mountSwiper() {
      if (swiperInstance)
        return;
      swiperInstance = new Swiper(slider, sliderOptions);
    }
    function destroySwiper() {
      if (!swiperInstance)
        return;
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
    function toggleSlider() {
      if (mq.matches) {
        destroySwiper();
      } else {
        mountSwiper();
      }
    }
    mq.addEventListener("change", toggleSlider);
    toggleSlider();
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Lookbook = window.themeCore.Lookbook || Lookbook();
  window.themeCore.utils.register(window.themeCore.Lookbook, "lookbook");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
