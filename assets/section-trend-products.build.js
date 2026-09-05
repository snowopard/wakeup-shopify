const selectors = {
  section: ".js-trend-products-section",
  hotSpot: ".js-trend-products-spot",
  productPopup: ".js-trend-product-popup",
  closeBtn: ".js-trend-product-popup-close-button"
};
const TrendProducts = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  let isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const mediaQuery = window.matchMedia("(min-width: 768px)");
  let sections = [];
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      const hotSpots = [...section.querySelectorAll(selectors.hotSpot)];
      const productPopups = [...section.querySelectorAll(selectors.productPopup)];
      function toggleFirstItem(items) {
        const firstItem = items[0];
        if (isDesktop && items.length) {
          firstItem.classList.add(cssClasses.active);
          if (firstItem.matches(selectors.productPopup)) {
            firstItem.setAttribute("data-first-render", "");
          }
        }
        mediaQuery.addEventListener("change", (e) => {
          isDesktop = e.matches;
          if (!isDesktop) {
            firstItem.classList.remove(cssClasses.active);
          }
        });
      }
      toggleFirstItem(hotSpots);
      toggleFirstItem(productPopups);
      section.addEventListener("click", clickHandler);
    });
  }
  function clickHandler(event) {
    const spotButton = event.target.closest(selectors.hotSpot);
    const section = event.target.closest(selectors.section);
    const spotButtons = [...section.querySelectorAll(selectors.hotSpot)];
    const isAnySpotActive = spotButtons.some((button) => button.classList.contains(cssClasses.active));
    const activeSpotButtons = spotButtons.filter((button) => {
      return button.classList.contains(cssClasses.active);
    });
    let productPopups = section.querySelectorAll(selectors.productPopup);
    for (const popup of productPopups || []) {
      if (popup.hasAttribute("data-first-render")) {
        popup.removeAttribute("data-first-render");
        break;
      }
    }
    if (isAnySpotActive) {
      document.addEventListener("click", (event2) => {
        closeAllHotSpots(event2, section);
      });
    }
    if (spotButton) {
      const targetPopupID = spotButton.getAttribute("data-target");
      const targetPopup = document.getElementById(targetPopupID);
      if (!targetPopupID || !targetPopup) {
        return;
      }
      if (activeSpotButtons.length) {
        activeSpotButtons.forEach(function(button) {
          if (spotButton === button) {
            return;
          }
          const productPopupID = button.getAttribute("data-target");
          const productPopup = document.getElementById(productPopupID);
          productPopup.classList.remove(cssClasses.active);
          button.classList.remove(cssClasses.active);
          button.setAttribute("aria-expanded", "false");
        });
      }
      spotButton.classList.toggle(cssClasses.active);
      let isExpanded = spotButton.classList.contains(cssClasses.active);
      targetPopup.classList.toggle(cssClasses.active);
      if (isExpanded) {
        spotButton.setAttribute("aria-expanded", "true");
      } else {
        spotButton.setAttribute("aria-expanded", "false");
      }
    }
    function closeAllHotSpots(event2, section2) {
      const isTarget = event2.target.closest(selectors.hotSpot) || event2.target.closest(selectors.productPopup);
      const isCloseBtn = event2.target.closest(selectors.closeBtn);
      const isCurrentSection = event2.target.closest(selectors.section) === section2;
      if (isTarget && !isCloseBtn) {
        return;
      }
      let hotSpots = section2.querySelectorAll(selectors.hotSpot);
      if (!hotSpots || !productPopups || !isCurrentSection) {
        return;
      }
      hotSpots.forEach(function(hotSpot) {
        hotSpot.classList.remove(cssClasses.active);
        hotSpot.setAttribute("aria-expanded", "false");
      });
      productPopups.forEach(function(popup) {
        popup.classList.remove(cssClasses.active);
      });
      document.removeEventListener("click", closeAllHotSpots);
    }
    function closeOtherSectionPopups(currentSection) {
      if (isDesktop)
        return;
      sections.forEach((section2) => {
        if (section2 === currentSection)
          return;
        const spotButtons2 = [...section2.querySelectorAll(selectors.hotSpot)];
        const productPopups2 = [...section2.querySelectorAll(selectors.productPopup)];
        spotButtons2.forEach((button) => {
          button.classList.remove(cssClasses.active);
          button.setAttribute("aria-expanded", "false");
        });
        productPopups2.forEach((popup) => {
          popup.classList.remove(cssClasses.active);
        });
      });
    }
    closeOtherSectionPopups(section);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.TrendProducts = window.themeCore.TrendProducts || TrendProducts();
  window.themeCore.utils.register(window.themeCore.TrendProducts, "trends-products");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
