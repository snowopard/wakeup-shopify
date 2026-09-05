import { T as Ticker } from "./ticker-2aaf4347.js";
const Footer = () => {
  const selectors = {
    section: ".js-footer",
    tickerContainer: ".js-ticker-container-footer"
  };
  let section = null;
  let tickerContainer = null;
  function init() {
    section = document.querySelector(selectors.section);
    if (!section) {
      return;
    }
    initTicker();
  }
  function initTicker() {
    tickerContainer = section.querySelector(selectors.tickerContainer);
    if (!tickerContainer) {
      return;
    }
    Ticker(tickerContainer).init();
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Footer = window.themeCore.Footer || Footer();
  window.themeCore.utils.register(window.themeCore.Footer, "footer");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
