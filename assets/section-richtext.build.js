const selectors = {
  buttons: ".js-rich-text-read-more",
  buttonCircle: ".button-circle",
  buttonTextEl: "[data-text]"
};
const RichText = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  function init() {
    let buttons = document.querySelectorAll(selectors.buttons);
    if (!buttons.length) {
      return;
    }
    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        const buttonText = {
          readMore: button.getAttribute("data-read-more-text"),
          showLess: button.getAttribute("data-show-less-text")
        };
        const isExpanded = button.getAttribute("aria-expanded");
        const textContent = document.getElementById(button.getAttribute("aria-controls"));
        const buttonTextEl = button.querySelector(selectors.buttonTextEl);
        const buttonCircle = button.querySelector(selectors.buttonCircle);
        if (!textContent || !buttonCircle) {
          return;
        }
        if (isExpanded === "false") {
          button.setAttribute("aria-expanded", "true");
          buttonCircle.classList.add(cssClasses.active);
          buttonTextEl.textContent = buttonText.showLess;
          textContent.classList.remove("text-section__content--cut-off");
        } else {
          button.setAttribute("aria-expanded", "false");
          buttonCircle.classList.remove(cssClasses.active);
          buttonTextEl.textContent = buttonText.readMore;
          textContent.classList.add("text-section__content--cut-off");
          if (window.innerWidth < 992) {
            textContent.scrollIntoView();
          }
        }
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.RichText = window.themeCore.RichText || RichText();
  window.themeCore.utils.register(window.themeCore.RichText, "richtext");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
