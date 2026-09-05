const CardsGrid = () => {
  const selectors = {
    button: ".js-cards-grid-button",
    card: ".js-cards-grid-item"
  };
  const classes = {
    activeCard: "cards-grid__item--active",
    ...window.themeCore.utils.cssClasses
  };
  function init() {
    const cards = document.querySelectorAll(selectors.card);
    cards.forEach((card) => {
      const button = card.querySelector(selectors.button);
      if (button) {
        button.addEventListener("click", () => {
          card.classList.toggle(classes.activeCard);
          button.classList.toggle(classes.active);
        });
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CardsGrid = window.themeCore.CardsGrid || CardsGrid();
  window.themeCore.utils.register(window.themeCore.CardsGrid, "cards-grid");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
