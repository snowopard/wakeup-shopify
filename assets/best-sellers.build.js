const selectors = {
  section: ".js-best-sellers",
  background: ".js-best-sellers-bg",
  products: ".js-best-sellers-product",
  rowWrapper: ".js-best-sellers-row-wrapper",
  buttonWrapper: ".js-best-sellers-column",
  image: ".js-best-sellers-decor-image"
};
const BestSellers = () => {
  const classes = {
    reverseTranslate: "is-reverse-translate",
    animating: "is-animating",
    buttonTop: "is-button-top",
    buttonBottom: "is-button-bottom",
    imageMouseMove: "js-image-mouse-move",
    ...window.themeCore.utils.cssClasses
  };
  const isMobile = window.matchMedia("(max-width: 991px)");
  const animatedTime = 400;
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      handlerClick(section);
      isMobile.addEventListener("change", function() {
        removeAnimationOnMobile(section);
      });
      removeAnimationOnMobile(section);
    });
  }
  function handlerClick(sectionEl) {
    let isStopClick = false;
    sectionEl.addEventListener("click", (e) => {
      const buttonActive = e.target.closest(selectors.buttonWrapper);
      if (!buttonActive || isStopClick) {
        return;
      }
      const buttons = [...sectionEl.querySelectorAll(selectors.buttonWrapper)];
      const prevActiveButton = buttons.find((button) => button.classList.contains(classes.active));
      const rowWrapper = sectionEl.querySelector(selectors.rowWrapper);
      const buttonActiveIndex = buttons.indexOf(buttonActive);
      if (buttonActive.classList.contains(classes.active)) {
        return;
      }
      handlerAnimationBorders(rowWrapper, buttonActive, prevActiveButton);
      handlerProductActive(sectionEl, buttonActiveIndex);
      isStopClick = true;
      buttons.forEach((button, index) => {
        button.classList.remove(classes.active, classes.current, classes.buttonTop, classes.buttonBottom);
        buttonActive.classList.add(classes.current);
        prevActiveButton.classList.add(classes.animating);
        window.setTimeout(() => {
          if (buttonActive.id === button.id) {
            const buttonTopIndex = index - 1;
            const buttonBottomIndex = index + 1;
            const buttonTop = buttons[buttonTopIndex];
            const buttonBottom = buttons[buttonBottomIndex];
            if (buttonTop) {
              buttonTop.classList.add(classes.buttonTop);
            }
            if (buttonBottom) {
              buttonBottom.classList.add(classes.buttonBottom);
            }
            button.classList.add(classes.active);
            button.classList.remove(classes.current);
            prevActiveButton.classList.remove(classes.animating);
          }
          isStopClick = false;
        }, animatedTime);
      });
    });
  }
  function handlerAnimationBorders(wrapper, btnActive, prevActiveBtn) {
    const prevActiveButtonRect = prevActiveBtn.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const buttonActiveRect = btnActive.getBoundingClientRect();
    const buttonActiveTranslate = wrapperRect.top - buttonActiveRect.top - (wrapperRect.top - prevActiveButtonRect.top);
    wrapper.style.setProperty("--buttonActiveHeight", `${btnActive.clientHeight}px`);
    wrapper.style.setProperty("--buttonActiveTranslate", `${-buttonActiveTranslate}px`);
    window.setTimeout(() => {
      wrapper.removeAttribute("style");
    }, animatedTime);
  }
  function handlerProductActive(sectionEl, btnActiveIndex) {
    const products = [...sectionEl.querySelectorAll(selectors.products)];
    const backgrounds = [...sectionEl.querySelectorAll(selectors.background)];
    products.forEach((product) => {
      if (products[btnActiveIndex] === product) {
        product.classList.add(classes.active);
      } else {
        product.classList.remove(classes.active);
      }
    });
    backgrounds.forEach((background) => {
      if (backgrounds[btnActiveIndex] === background) {
        background.classList.add(classes.active);
      } else {
        background.classList.remove(classes.active);
      }
    });
  }
  function removeAnimationOnMobile(section) {
    const images = [...section.querySelectorAll(selectors.image)];
    if (images.length > 0) {
      images.forEach((image) => {
        if (isMobile.matches) {
          image.classList.remove(classes.imageMouseMove);
          image.removeAttribute("style");
        } else {
          image.classList.add(classes.imageMouseMove);
        }
      });
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.BestSellers = window.themeCore.BestSellers || BestSellers();
  window.themeCore.utils.register(window.themeCore.BestSellers, "best-sellers");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
