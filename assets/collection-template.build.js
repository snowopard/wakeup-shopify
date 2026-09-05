const CollectionTemplate = () => {
  const selectors = {
    section: ".js-collection",
    gridViewButton: ".js-grid-view-btn",
    gridViewButtons: ".js-grid-view-buttons",
    grid: ".js-grid-wrapper",
    getActiveButton: (customerGridView) => `.js-grid-view-btn[data-grid-cols="${customerGridView}"]`,
    defaultButton: ".js-grid-view-btn[data-grid-cols='4']"
  };
  const localStorageKeys = {
    collectionGridCols: "collection-grid-cols"
  };
  const attributes = {
    gridCol: "data-grid-col",
    gridColButton: "data-grid-cols"
  };
  const cssClasses = {
    hiddenCollectionOnLoad: "collection__grid-wrapper-hide-on-load",
    animating: "is-animating",
    ...window.themeCore.utils.cssClasses
  };
  async function init() {
    const ProductFilters = await window.themeCore.utils.getExternalUtil("ProductFilters");
    const section = document.querySelector(selectors.section);
    const gridViewButtons = document.querySelectorAll(selectors.gridViewButton);
    ProductFilters(section).init();
    if (gridViewButtons.length > 0) {
      initGridViewButtons(gridViewButtons);
    }
  }
  function initGridViewButtons(gridButtons) {
    const productsGrid = document.querySelector(selectors.grid);
    const gridViewButtonsWrapper = document.querySelector(selectors.gridViewButtons);
    gridViewButtonsWrapper.classList.add("animated");
    gridButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        const gridView = button.getAttribute(attributes.gridColButton);
        if (button.classList.contains(cssClasses.active)) {
          return;
        }
        const currentActive = [...gridButtons].find((el) => el.classList.contains(cssClasses.active));
        const newActive = button;
        const gridViewButtonsWrapperLeft = gridViewButtonsWrapper.getBoundingClientRect().left;
        const currentActiveLeft = currentActive.getBoundingClientRect().left;
        const newActiveLeft = newActive.getBoundingClientRect().left;
        const translate = gridViewButtonsWrapperLeft - currentActiveLeft - (gridViewButtonsWrapperLeft - newActiveLeft);
        currentActive.classList.remove(cssClasses.active);
        currentActive.classList.add(cssClasses.animating);
        currentActive.style.setProperty("--translateDecor", `${translate - 8}px`);
        window.setTimeout(() => {
          currentActive.classList.remove(cssClasses.animating);
          currentActive.removeAttribute("style");
          newActive.classList.add(cssClasses.active);
        }, 200);
        productsGrid.setAttribute(attributes.gridCol, gridView);
        if (gridView === "3" || gridView === "2") {
          localStorage.setItem(localStorageKeys.collectionGridCols, gridView);
        } else {
          localStorage.removeItem(localStorageKeys.collectionGridCols);
        }
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CollectionTemplate = window.themeCore.CollectionTemplate || CollectionTemplate();
  window.themeCore.utils.register(window.themeCore.CollectionTemplate, "collection-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
