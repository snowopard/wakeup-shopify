const menuDecoration = (config) => {
  const extendDefaults = window.themeCore.utils.extendDefaults;
  const cssClasses = {
    disableTransition: "is-transition-disabled",
    ...window.themeCore.utils.cssClasses
  };
  const selectors2 = {
    decorationContainer: ".js-menu-decoration",
    decorationHoverContainer: ".js-menu-decoration-container",
    decorationBorderPart: ".js-menu-decoration-border-part",
    decorationItem: ".js-menu-decoration-item"
  };
  const defaults = {
    container: null,
    position: "horizontal",
    partWidth: 32
  };
  const settings = extendDefaults(defaults, config);
  const isRTL = document.body.classList.contains(cssClasses.rtl);
  const decorationState = {
    partWidth: settings.partWidth,
    width: 0,
    height: 0,
    perimeter: 0,
    radius: 0,
    arc: 0
  };
  let decorationContainer = null;
  let decorationHoverContainer = null;
  let decorationBorderParts = [];
  let resizeObserver = null;
  let mutationObserver = null;
  let decorationContainerWidth = 0;
  let decorationContainerHeight = 0;
  function init() {
    if (!settings.container) {
      return;
    }
    decorationContainer = settings.container.querySelector(selectors2.decorationContainer);
    if (!decorationContainer) {
      return;
    }
    decorationContainerWidth = decorationContainer.offsetWidth;
    decorationContainerHeight = decorationContainer.offsetHeight;
    decorationHoverContainer = decorationContainer.querySelector(selectors2.decorationHoverContainer);
    decorationBorderParts = decorationContainer.querySelectorAll(selectors2.decorationBorderPart);
    if (!decorationHoverContainer || !decorationBorderParts.length) {
      return;
    }
    initDecoration();
  }
  function initDecoration() {
    setDecorationState();
    setDecorationPosition();
    initListeners();
    initResizeObserver();
    initMutationObserver();
    decorationContainer.classList.add(cssClasses.active);
  }
  function initListeners() {
    decorationHoverContainer.addEventListener("mouseover", setActiveDecorationPosition);
    decorationHoverContainer.addEventListener("mouseleave", setActiveDecorationPosition);
    decorationHoverContainer.addEventListener("scroll", () => setActiveDecorationPosition(null, true, true));
  }
  function initResizeObserver() {
    resizeObserver = new ResizeObserver(() => {
      if (decorationContainerWidth === decorationContainer.offsetWidth && decorationContainerHeight === decorationContainer.offsetHeight) {
        return;
      }
      decorationContainerWidth = decorationContainer.offsetWidth;
      decorationContainerHeight = decorationContainer.offsetHeight;
      setDecorationState();
      setActiveDecorationPosition(null, true, true);
    });
    resizeObserver.observe(decorationContainer);
  }
  function initMutationObserver() {
    mutationObserver = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        const { oldValue, target } = mutation;
        if (!target.classList.contains(selectors2.decorationItem.replace(".", ""))) {
          return;
        }
        if (![...decorationContainer.querySelectorAll(selectors2.decorationItem)].some((element) => element.matches(":hover")) && !oldValue.includes(cssClasses.active) && target.classList.contains(cssClasses.active)) {
          setActiveDecorationPosition();
          return;
        }
        if (![...decorationContainer.querySelectorAll(selectors2.decorationItem)].some((element) => element.matches(":hover")) && oldValue.includes(cssClasses.active) && !target.classList.contains(cssClasses.active)) {
          setDecorationPosition();
        }
      });
    });
    mutationObserver.observe(decorationContainer, {
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["class"]
    });
  }
  function setDecorationState() {
    const decorationBorderPart = decorationBorderParts[0];
    decorationState.radius = parseInt(decorationBorderPart.getAttribute("rx"));
    decorationState.perimeter = decorationBorderPart.getBBox().width * 2 + decorationBorderPart.getBBox().height * 2 - (8 - 2 * Math.PI) * decorationState.radius;
    decorationState.arc = Math.PI * decorationState.radius * 90 / 180;
    decorationState.width = decorationBorderPart.getBBox().width - (decorationState.radius * 2 - decorationState.arc);
    decorationState.height = decorationBorderPart.getBBox().height - (decorationState.radius * 2 - decorationState.arc);
  }
  function setDecorationPosition() {
    decorationState.partWidth = settings.partWidth;
    const decorationBorderPartDasharray = `${decorationState.partWidth}, ${decorationState.perimeter - decorationState.partWidth}`;
    decorationBorderParts[0].style.strokeDasharray = decorationBorderPartDasharray;
    decorationBorderParts[1].style.strokeDasharray = decorationBorderPartDasharray;
    if (settings.position === "vertical") {
      decorationBorderParts[0].style.strokeDashoffset = `${(decorationState.partWidth + decorationState.arc) / 2}`;
      decorationBorderParts[1].style.strokeDashoffset = `${decorationState.width * -1 + (decorationState.partWidth + decorationState.arc) / 2}`;
    } else {
      decorationBorderParts[0].style.strokeDashoffset = `${(decorationState.partWidth + decorationState.arc) / 2}`;
      decorationBorderParts[1].style.strokeDashoffset = `${decorationState.height + (decorationState.partWidth + decorationState.arc) / 2}`;
    }
    const hoverItem = [...decorationContainer.querySelectorAll(selectors2.decorationItem)].find((decorationItem) => decorationItem.classList.contains(cssClasses.hover));
    hoverItem && hoverItem.classList.remove(cssClasses.hover);
  }
  function setActiveDecorationPosition(event, disableAnimation = false, selectHoverItem = false) {
    let decorationItem;
    if (event) {
      decorationItem = event.target.closest(selectors2.decorationItem);
    }
    const activeItem = [...decorationContainer.querySelectorAll(selectors2.decorationItem)].find((decorationItem2) => decorationItem2.classList.contains(cssClasses.active));
    decorationItem = decorationItem || activeItem;
    const hoverItem = [...decorationContainer.querySelectorAll(selectors2.decorationItem)].find((decorationItem2) => decorationItem2.classList.contains(cssClasses.hover));
    if (selectHoverItem) {
      decorationItem = hoverItem;
    }
    if (disableAnimation) {
      decorationContainer.classList.add(cssClasses.disableTransition);
    } else {
      decorationContainer.classList.remove(cssClasses.disableTransition);
    }
    hoverItem && hoverItem.classList.remove(cssClasses.hover);
    if (!decorationItem) {
      setDecorationPosition();
      return;
    }
    decorationItem.classList.add(cssClasses.hover);
    if (settings.position === "vertical") {
      const { top: decorationHoverContainerTop, bottom: decorationHoverContainerBottom } = decorationHoverContainer.getBoundingClientRect();
      const decorationItemBottom = decorationItem.getBoundingClientRect().bottom;
      const decorationItemHeight = Math.max(decorationItem.getBoundingClientRect().height - 2, 0);
      let decorationItemTop = decorationItem.getBoundingClientRect().top;
      if (decorationItemTop < decorationHoverContainerTop && decorationItemBottom > decorationHoverContainerBottom) {
        decorationState.partWidth = decorationHoverContainerBottom - decorationHoverContainerTop;
        decorationItemTop = decorationHoverContainerTop;
      } else if (decorationItemTop < decorationHoverContainerTop) {
        decorationState.partWidth = Math.max(0, decorationItemHeight - (decorationHoverContainerTop - decorationItemTop));
        decorationItemTop = decorationHoverContainerTop;
      } else if (decorationItemBottom > decorationHoverContainerBottom) {
        decorationState.partWidth = Math.max(0, decorationItemHeight - (decorationItemBottom - decorationHoverContainerBottom));
        if (decorationState.partWidth === 0) {
          decorationItemTop = decorationHoverContainerBottom;
        }
      } else {
        decorationState.partWidth = decorationItemHeight;
      }
      if (decorationState.partWidth === 0) {
        decorationBorderParts[0].classList.add(cssClasses.hidden);
        decorationBorderParts[1].classList.add(cssClasses.hidden);
      } else {
        decorationBorderParts[0].classList.remove(cssClasses.hidden);
        decorationBorderParts[1].classList.remove(cssClasses.hidden);
      }
      const decorationBorderPartDasharray = `${decorationState.partWidth}, ${decorationState.perimeter - decorationState.partWidth}`;
      decorationBorderParts[0].style.strokeDasharray = decorationBorderPartDasharray;
      decorationBorderParts[1].style.strokeDasharray = decorationBorderPartDasharray;
      const decorationPosition = decorationItemTop - decorationHoverContainerTop;
      decorationBorderParts[0].style.strokeDashoffset = `${decorationState.partWidth + decorationState.arc + decorationPosition}`;
      decorationBorderParts[1].style.strokeDashoffset = `${(decorationState.width + decorationPosition) * -1}`;
    } else {
      const decorationBorderPartDasharray = `${decorationState.partWidth}, ${decorationState.perimeter - decorationState.partWidth}`;
      decorationBorderParts[0].style.strokeDasharray = decorationBorderPartDasharray;
      decorationBorderParts[1].style.strokeDasharray = decorationBorderPartDasharray;
      let decorationPosition;
      if (isRTL) {
        const { right: containerRight } = decorationHoverContainer.getBoundingClientRect();
        const { right: itemRight, width: itemWidth } = decorationItem.getBoundingClientRect();
        decorationPosition = containerRight - itemRight + (itemWidth / 2 - decorationState.partWidth / 2);
      } else {
        const { left: containerLeft } = decorationHoverContainer.getBoundingClientRect();
        const { left: itemLeft, width: itemWidth } = decorationItem.getBoundingClientRect();
        decorationPosition = itemLeft - containerLeft + (itemWidth / 2 - decorationState.partWidth / 2);
      }
      decorationBorderParts[0].style.strokeDashoffset = `${decorationPosition * -1}`;
      decorationBorderParts[1].style.strokeDashoffset = `${decorationState.height + (decorationState.partWidth + decorationState.arc) + decorationPosition}`;
    }
  }
  return Object.freeze({
    init
  });
};
const burgerMenu = (config) => {
  const extendDefaults = window.themeCore.utils.extendDefaults;
  const on = window.themeCore.utils.on;
  const removeTrapFocus = window.themeCore.utils.removeTrapFocus;
  const trapFocus = window.themeCore.utils.trapFocus;
  const focusable = window.themeCore.utils.focusable;
  const isElement = window.themeCore.utils.isElement;
  const cssClasses = window.themeCore.utils.cssClasses;
  const defaults = {
    containerId: ""
  };
  const settings = extendDefaults(defaults, config);
  const selectors2 = {
    drawerContainer: ".js-multi-drawer-container",
    drawer: ".js-multi-drawer",
    drawerToggle: ".js-multi-drawer-toggle",
    drawerScrollContainer: ".js-multi-drawer-scroll-container",
    drawerContent: ".js-multi-drawer-content",
    drawerTogglePrimaryAttribute: "data-multi-drawer-toggle",
    drawerTogglePrimary: "[data-multi-drawer-toggle]"
  };
  const mediaQuery = "(min-width: 1200px)";
  const mediaQueryList = window.matchMedia(mediaQuery);
  let container;
  let drawers;
  let drawerToggles;
  let drawerTogglesPrimary;
  let drawerContents;
  let primarySelectedToggle;
  let timeoutId;
  let isProcessing = false;
  let isHeaderMenuOpen = false;
  async function init() {
    container = document.getElementById(settings.containerId);
    if (!container || !container.classList.contains(selectors2.drawerContainer.replace(".", ""))) {
      return null;
    }
    drawers = [...container.querySelectorAll(selectors2.drawer)];
    if (!drawers.length) {
      return null;
    }
    drawers = drawers.sort((a, b) => {
      const levelA = parseInt(a.getAttribute("data-drawer-level"));
      const levelB = parseInt(b.getAttribute("data-drawer-level"));
      return levelA - levelB;
    });
    drawerTogglesPrimary = [...document.querySelectorAll(`[${selectors2.drawerTogglePrimaryAttribute}="${settings.containerId}"]`)];
    drawerToggles = [...container.querySelectorAll(selectors2.drawerToggle), ...drawerTogglesPrimary];
    drawerContents = [...container.querySelectorAll(selectors2.drawerContent)];
    setEventListeners();
    setEventBusListeners();
    initMenuDecoration();
  }
  function initMenuDecoration() {
    menuDecoration({ container, position: "vertical" }).init();
  }
  function setEventListeners() {
    drawerToggles.forEach((drawerToggle) => {
      on("click", drawerToggle, async (event) => {
        event.preventDefault();
        let timeoutDuration = isHeaderMenuOpen ? 400 : 0;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => await processToggleDrawer(drawerToggle), timeoutDuration);
      });
    });
    on("keydown", (event) => onEscEvent(event));
    on("change", mediaQueryList, (event) => {
      if (!event.matches) {
        forceHideDrawers(1);
      }
    });
    on("click", document, (event) => {
      if (!event.target.closest(selectors2.drawer) && !event.target.closest(selectors2.drawerTogglePrimary) && getActiveDrawers().length && !isProcessing) {
        forceHideDrawers(1);
      }
    });
  }
  function onEscEvent(event) {
    if (!isKeyPressIsEsc(event)) {
      return;
    }
    window.themeCore.EventBus.emit(`EscEvent:on:${settings.containerId}`);
  }
  function isKeyPressIsEsc(event) {
    return event.keyCode === 27;
  }
  function setEventBusListeners() {
    window.themeCore.EventBus.listen(`Toggle:open`, () => {
      forceHideDrawers(1, false);
    });
    window.themeCore.EventBus.listen(`HeaderDesktopMenu:close`, () => {
      isHeaderMenuOpen = false;
    });
    window.themeCore.EventBus.listen(`HeaderDesktopMenu:open`, () => {
      clearTimeout(timeoutId);
      isHeaderMenuOpen = true;
    });
    window.themeCore.EventBus.listen(`EscEvent:on:${settings.containerId}`, async () => {
      let activeDrawers = getActiveDrawers();
      if (!activeDrawers.length) {
        return null;
      }
      let drawerLevel = parseInt(activeDrawers.reverse()[0].dataset.drawerLevel);
      await processHideDrawers(drawerLevel);
    });
  }
  async function processToggleDrawer(drawerToggle) {
    if (isProcessing) {
      return null;
    }
    isProcessing = true;
    await toggleDrawer(drawerToggle);
    isProcessing = false;
  }
  async function processHideDrawers(level) {
    if (isProcessing) {
      return null;
    }
    isProcessing = true;
    await hideDrawers(level);
    isProcessing = false;
  }
  function forceHideDrawers(level, enableBodyScroll = true) {
    isProcessing = true;
    let activeDrawers = getActiveDrawers();
    let drawersToClose = activeDrawers.filter((drawer) => {
      return parseInt(drawer.dataset.drawerLevel) >= level;
    }).reverse();
    if (!drawersToClose.length) {
      isProcessing = false;
      return null;
    }
    for (let i = 0; i <= drawersToClose.length - 1; i++) {
      forceHideDrawer(parseInt(drawersToClose[i].dataset.drawerLevel), enableBodyScroll);
    }
    isProcessing = false;
  }
  async function toggleDrawer(drawerToggle) {
    let drawerLevel = parseInt(drawerToggle.dataset.drawerLevel);
    if (isActive(drawerToggle)) {
      if (drawerLevel === 1) {
        forceHideDrawers(1);
      } else {
        await hideDrawers(drawerLevel);
        removeActiveToggles(drawerLevel);
      }
    } else {
      await showDrawer(drawerLevel, drawerToggle);
    }
  }
  function removeActiveToggles(level) {
    let activeToggles = getActiveToggleByLevel(level);
    activeToggles.forEach((activeToggle) => {
      activeToggle.classList.remove(cssClasses.active);
      activeToggle.setAttribute("aria-expanded", false);
    });
  }
  function setActiveToggle(drawerToggle) {
    let drawerLevel = parseInt(drawerToggle.dataset.drawerLevel);
    removeActiveToggles(drawerLevel);
    if (drawerLevel === 1) {
      primarySelectedToggle = drawerToggle;
      let toggles = getToggleByLevel(drawerLevel);
      toggles.forEach((toggle) => {
        toggle.classList.add(cssClasses.active);
        toggle.setAttribute("aria-expanded", true);
      });
    } else {
      drawerToggle.classList.add(cssClasses.active);
      drawerToggle.setAttribute("aria-expanded", true);
    }
  }
  function isActive(target) {
    return target.classList.contains(cssClasses.active);
  }
  async function hideDrawers(level) {
    let activeDrawers = getActiveDrawers();
    let drawersToClose = activeDrawers.filter((drawer) => {
      return parseInt(drawer.dataset.drawerLevel) >= level;
    }).reverse();
    if (!drawersToClose.length) {
      return null;
    }
    for (let i = 0; i <= drawersToClose.length - 1; i++) {
      await hideDrawer(parseInt(drawersToClose[i].dataset.drawerLevel));
    }
  }
  async function showDrawer(level, drawerToggle) {
    var _a;
    await hideDrawers(level + 1);
    let drawer = getDrawerByLevel(level);
    let drawerContent = (_a = drawerToggle.dataset) == null ? void 0 : _a.drawerContent;
    let drawerScrollContainer = drawer.querySelector(selectors2.drawerScrollContainer);
    setActiveToggle(drawerToggle);
    drawerContent && showList(level, drawerContent);
    let isDrawerActive = drawer.classList.contains(cssClasses.active);
    drawer.classList.add(cssClasses.active);
    drawerScrollContainer && (drawerScrollContainer.scrollTop = 0);
    if (level === 1) {
      container.classList.add(cssClasses.active);
      window.themeCore.EventBus.emit("HeaderBurgerMenu:open");
      document.body.style.overflow = "hidden";
    }
    focusTarget(drawer);
    if (!isDrawerActive) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 700);
      });
    }
  }
  async function hideDrawer(level) {
    const drawer = getDrawerByLevel(level);
    const toggle = getActiveToggleByLevel(level)[0];
    drawer.classList.remove(cssClasses.active);
    removeActiveToggles(level);
    if (level === 1) {
      removeFocusTarget();
    } else {
      const drawer2 = getDrawerByLevel(level - 1);
      focusTarget(drawer2, toggle);
    }
    await new Promise((resolve) => {
      setTimeout(() => {
        if (level === 1) {
          document.body.style.overflow = null;
          container.classList.remove(cssClasses.active);
          window.themeCore.EventBus.emit("HeaderBurgerMenu:close");
        }
        resolve();
      }, 700);
    });
  }
  function forceHideDrawer(level, enableBodyScroll = true) {
    const drawer = getDrawerByLevel(level);
    drawer.classList.remove(cssClasses.active);
    removeActiveToggles(level);
    setTimeout(() => {
      if (level === 1) {
        if (enableBodyScroll) {
          document.body.style.overflow = null;
        }
        removeFocusTarget();
        container.classList.remove(cssClasses.active);
        window.themeCore.EventBus.emit("HeaderBurgerMenu:close");
      }
    }, 700);
  }
  function showList(drawerLevel, listId) {
    let activeList = getActiveListByLevel(drawerLevel);
    if (activeList) {
      activeList.classList.remove(cssClasses.active);
      activeList.classList.add(cssClasses.hidden);
    }
    let drawerContent = drawerContents.find((drawerContent2) => drawerContent2.dataset.drawerContent === listId);
    drawerContent.classList.remove(cssClasses.hidden);
    setTimeout(() => drawerContent.classList.add(cssClasses.active), 0);
  }
  function getActiveDrawers() {
    return drawers.filter((drawer) => {
      return drawer.classList.contains(cssClasses.active);
    });
  }
  function getActiveToggleByLevel(level) {
    return drawerToggles.filter((drawerToggle) => {
      return parseInt(drawerToggle.dataset.drawerLevel) === level && drawerToggle.classList.contains(cssClasses.active);
    });
  }
  function getToggleByLevel(level) {
    return drawerToggles.filter((drawerToggle) => {
      return parseInt(drawerToggle.dataset.drawerLevel) === level;
    });
  }
  function getActiveListByLevel(level) {
    return drawerContents.find((drawerContent) => {
      return parseInt(drawerContent.dataset.drawerLevel) === level && drawerContent.classList.contains(cssClasses.active);
    });
  }
  function getDrawerByLevel(level) {
    return drawers.find((drawer) => {
      return parseInt(drawer.dataset.drawerLevel) === level;
    });
  }
  function focusTarget(target, elementToFocus) {
    if (!target) {
      return;
    }
    elementToFocus = elementToFocus || focusable(target, settings)[0];
    trapFocus(target, { elementToFocus });
  }
  function removeFocusTarget() {
    if (isElement(primarySelectedToggle)) {
      window.setTimeout(() => primarySelectedToggle.focus({ preventScroll: true }), 0);
    }
    removeTrapFocus();
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  announcementBar: ".js-announcement-bar",
  headerOverlay: ".js-header-overlay",
  header: ".header-section",
  headerInner: ".js-header",
  headerDrawerToggler: ".js-header-drawer-toggler",
  drawerMenu: "#headerDrawerMenu",
  headerMenu: ".js-mobile-header-menu",
  headerMainMenu: ".js-mobile-header-main-menu",
  headerMenuToggler: ".js-mobile-header-menu-toggler",
  headerMenuScrollContainer: ".js-mobile-header-menu-scroll-container",
  headerDesktopMenuMain: ".js-header-main-menu",
  headerDesktopMenu: ".js-header-menu",
  headerDesktopMenuToggler: ".js-header-menu-toggler",
  headerDesktopMenuItem: ".js-header-menu-item",
  headerDesktopMenuContainer: ".js-header-menu-container",
  headerDesktopMenuScrollContainer: ".js-header-menu-scroll-container",
  headerCartItemCount: ".js-header-cart-item-count",
  headerCartItemCountWrapper: ".js-header-cart-item-count-wrapper",
  predictiveSearchInput: ".js-predictive-search-input",
  headerContent: "[data-open-menu-type]",
  localizationForm: "localization-form",
  globalOverlay: "[data-js-overlay]"
};
const attributes = {
  drawerToggle: "data-js-toggle",
  itemCount: "data-cart-count",
  hideOnScrollDown: "data-hide-on-scroll-down",
  staticHeader: "data-static-header",
  ariaExpanded: "aria-expanded",
  hidden: "hidden",
  tabIndex: "tabindex"
};
const cssVariables = {
  headerHeight: "--header-height",
  headerHeightStatic: "--header-height-static",
  headerOffsetTop: "--header-offset-top",
  headerOffsetTopStatic: "--header-offset-top-static",
  pageHeight: "--page-height",
  announcementBarHeight: "--announcement-bar-height",
  headerMenuHeight: "--header-menu-height"
};
const ids = {
  headerCountryLocalizationForm: "CountryLocalizationForm-header",
  headerLanguageLocalizationForm: "LanguageLocalizationForm-header"
};
const Header = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const isElement = window.themeCore.utils.isElement;
  const on = window.themeCore.utils.on;
  const focusable = window.themeCore.utils.focusable;
  const removeTrapFocus = window.themeCore.utils.removeTrapFocus;
  const trapFocus = window.themeCore.utils.trapFocus;
  const bind = window.themeCore.utils.bind;
  const cssClasses = {
    ...window.themeCore.utils.cssClasses,
    forceTransition: "force-transition",
    forceChangeTransition: "force-change-transition"
  };
  const binder = bind(document.documentElement, {
    className: "esc-bind"
  });
  let cssRoot, announcementBar, header, headerInner, headerCartItemCount, headerContent, openMenuType, headerDesktopMenuMain, headerDesktopMenus, headerDesktopMenuTogglers, headerDesktopMenuItems, headerCartItemCountWrapper, headerDrawerTogglers, drawerMenu, headerMenuTogglers, previouslySelectedElement, headerOverlay, headerMenuList, headerBurgerMenu, headerHeight, headerHeightStatic, hideOnScrollDown, staticHeader, lastScrollPosition, isHeaderHidden, isBurgerMenuActive, openProcessing;
  const mediaQuery = "(min-width: 1200px)";
  const mediaQueryList = window.matchMedia(mediaQuery);
  let timeouts = /* @__PURE__ */ new Map();
  let activeMegaMenuHeight = 0;
  let forceToggleMegaMenu = false;
  let forceCloseDropdownMenu = false;
  let forceCloseDropdownMenuNested = false;
  let removeMegaMenuBodyScroll = false;
  let clientX, clientY;
  function init() {
    cssRoot = document.querySelector(":root");
    header = document.querySelector(selectors.header);
    headerInner = document.querySelector(selectors.headerInner);
    announcementBar = document.querySelector(selectors.announcementBar);
    if (!header) {
      return;
    }
    lastScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    headerCartItemCount = header.querySelector(selectors.headerCartItemCount);
    headerContent = header.querySelector(selectors.headerContent);
    hideOnScrollDown = headerContent.hasAttribute(attributes.hideOnScrollDown);
    staticHeader = headerContent.hasAttribute(attributes.staticHeader);
    openMenuType = headerContent.dataset.openMenuType;
    headerCartItemCountWrapper = header.querySelector(selectors.headerCartItemCountWrapper);
    headerDesktopMenuMain = header.querySelector(selectors.headerDesktopMenuMain);
    headerDesktopMenus = [...header.querySelectorAll(selectors.headerDesktopMenu)];
    headerDesktopMenuTogglers = [...header.querySelectorAll(selectors.headerDesktopMenuToggler)];
    headerDesktopMenuItems = [...header.querySelectorAll(selectors.headerDesktopMenuItem)];
    headerDrawerTogglers = [...header.querySelectorAll(selectors.headerDrawerToggler)];
    drawerMenu = header.querySelector(selectors.drawerMenu);
    header.querySelector(selectors.headerMainMenu);
    headerMenuTogglers = [...header.querySelectorAll(selectors.headerMenuToggler)];
    headerMenuList = [];
    if (drawerMenu) {
      headerMenuList = [...drawerMenu.querySelectorAll(selectors.headerMenu)];
    }
    previouslySelectedElement = {};
    headerHeight = getHeaderHeight();
    headerHeightStatic = headerHeight;
    headerOverlay = initHeaderOverlay();
    initDrawers();
    initBurgerMenu();
    setEventListeners();
    setEventBusListeners();
    if (headerInner.matches(":hover")) {
      toggleHeaderActiveClass(true);
    }
    initDesktopMainMenuDecoration();
  }
  function setEventListeners() {
    on("transitionend", header, updateHeaderVariables);
    on("scroll", updateHeaderVariables);
    on("resize", updateHeaderVariables);
    on("mouseenter", header, () => {
      toggleHeaderActiveClass(true);
    });
    on("mouseleave", header, () => {
      if (!hasActiveMenu()) {
        toggleHeaderActiveClass(false);
      }
    });
    on("focusin", header, (event) => {
      if (event.target.matches(":focus-visible")) {
        toggleHeaderActiveClass(true);
      }
      updateHeaderVariables();
    });
    on("focusout", header, (e) => {
      if (!headerInner.contains(e.relatedTarget)) {
        if (!hasActiveMenu()) {
          toggleHeaderActiveClass(false);
        }
        updateHeaderVariables();
      }
    });
    on("change", mediaQueryList, (event) => {
      if (event.matches) {
        if (isTargetActive(drawerMenu)) {
          closeLocalizationSelector();
          window.themeCore.EventBus.emit("Toggle:headerToggleMenuDrawer:close");
        }
      } else {
        closeLocalizationSelector();
        closeActiveDesktopMenus();
      }
    });
    if (headerMenuTogglers) {
      headerMenuTogglers.forEach((toggler) => {
        const target = document.getElementById(toggler.dataset.target);
        on("click", toggler, (event) => {
          if (openProcessing) {
            return;
          }
          let isNested = false;
          let targetMenu = document.getElementById(event.target.closest(selectors.headerMenuToggler).dataset.target);
          if (isTargetActive(targetMenu)) {
            isNested = true;
          }
          handleToggleEvent(event, target, true, 700, true, false);
          if (isNested) {
            let nextTarget;
            if (targetMenu.dataset.menuType === "deep-nested") {
              if (targetMenu.closest('[data-menu-type="deep-nested"]')) {
                drawerMenu.classList.remove(cssClasses.grandChildActive);
                nextTarget = targetMenu.closest('[data-menu-type="nested"]');
              }
            } else if (targetMenu.dataset.menuType === "nested") {
              if (targetMenu.closest('[data-menu-type="nested"]')) {
                drawerMenu.classList.remove(cssClasses.childActive);
                nextTarget = targetMenu.closest('[data-menu-type="main"]');
              }
            }
            if (nextTarget) {
              focusTarget(nextTarget);
            }
            if (!binder.isSet()) {
              binder.set();
            }
          } else {
            if (targetMenu.dataset.menuType === "deep-nested") {
              if (targetMenu.closest('[data-menu-type="deep-nested"]')) {
                drawerMenu.classList.add(cssClasses.grandChildActive);
              }
            } else if (targetMenu.dataset.menuType === "nested") {
              if (targetMenu.closest('[data-menu-type="nested"]')) {
                drawerMenu.classList.add(cssClasses.childActive);
              }
            }
            setTabIndexOnTarget(targetMenu);
          }
        });
      });
    }
    if (headerDesktopMenuTogglers) {
      if (openMenuType === "hover") {
        on("mousemove", document, (event) => {
          clientX = event.clientX;
          clientY = event.clientY;
        });
      }
      headerDesktopMenuTogglers.forEach((toggler) => {
        const menu = headerDesktopMenus.find((desktopMenu) => desktopMenu.id === toggler.dataset.target);
        if (!menu) {
          return;
        }
        switch (openMenuType) {
          case "click":
            toggler.addEventListener("click", () => desktopMenuClickHandler(toggler, menu));
            break;
          case "hover":
            toggler.addEventListener("mouseenter", (event) => desktopMenuMouseEnterHandler(toggler, menu));
            toggler.addEventListener("click", () => {
              if (toggler.matches(":not(:focus-visible)")) {
                navigateToLink(toggler.dataset.href);
                return;
              }
              desktopMenuClickHandler(toggler, menu);
            });
            toggler.addEventListener("mouseleave", (event) => desktopMenuMouseLeaveHandler(toggler, menu));
            menu.addEventListener("mouseleave", (event) => desktopMenuMouseLeaveHandler(toggler, menu));
            break;
        }
      });
      on("resize", updateDesktopMegaMenuHeight);
      on("resize", updateDesktopMenuDropdownPosition);
    }
    on("click", document, (event) => {
      if (!event.target.closest(selectors.headerDesktopMenu) && !event.target.closest(selectors.headerDesktopMenuToggler)) {
        closeActiveDesktopMenus();
      }
    });
    if (hideOnScrollDown || staticHeader) {
      document.addEventListener("scroll", scrollHandler);
    }
  }
  function setEventBusListeners() {
    window.themeCore.EventBus.listen(["EscEvent:on", "Overlay:headerToggleMenuDrawer:close", "Toggle:headerToggleMenuDrawer:close"], () => {
      if (getActiveElements(headerMenuList).length) {
        setTimeout(() => closeAllMenus(getActiveElements(headerMenuList)), 700);
      }
      drawerMenu.classList.remove(cssClasses.childActive);
      drawerMenu.classList.remove(cssClasses.grandChildActive);
    });
    window.themeCore.EventBus.listen("HeaderDesktopMenu:open", () => {
      closeLocalizationSelector();
    });
    window.themeCore.EventBus.listen(`Toggle:open`, () => {
      removeMegaMenuBodyScroll = false;
      closeLocalizationSelector();
      closeActiveDesktopMenus();
    });
    window.themeCore.EventBus.listen("EscEvent:on", () => {
      closeActiveDesktopMenu();
    });
    window.themeCore.EventBus.listen(["cart:updated", "header:update-item-count"], (e) => {
      updateItemCount(e);
    });
    window.themeCore.EventBus.listen("Localization-Form:close", ({ component: localizationForm }) => {
      if (localizationForm.id === ids.headerCountryLocalizationForm || localizationForm.id === ids.headerLanguageLocalizationForm) {
        toggleHeaderActiveClass(false);
      }
    });
    window.themeCore.EventBus.listen("HeaderBurgerMenu:open", () => {
      headerOverlay && headerOverlay.open();
      blockMainMenu(true);
      toggleHeaderActiveClass(true);
      toggleScrollbarOffset(true);
      isBurgerMenuActive = true;
    });
    window.themeCore.EventBus.listen("HeaderBurgerMenu:close", () => {
      headerOverlay && headerOverlay.close();
      blockMainMenu(false);
      toggleHeaderActiveClass(false);
      toggleScrollbarOffset(false);
      isBurgerMenuActive = false;
    });
  }
  function updateHeaderVariables() {
    if (isHeaderHidden) {
      changeCssVariable(cssVariables.headerHeight, `0px`);
      headerHeight = 0;
      changeCssVariable(cssVariables.headerOffsetTop, `0px`);
      changeCssVariable(cssVariables.pageHeight, ` ${window.innerHeight}px`);
      return;
    }
    if (getHeaderHeight() !== headerHeight) {
      changeCssVariable(cssVariables.headerHeight, ` ${getHeaderHeight()}px`);
      changeCssVariable(cssVariables.headerHeightStatic, ` ${getHeaderHeight()}px`);
      headerHeight = getHeaderHeight();
      headerHeightStatic = headerHeight;
    }
    if (getHeaderOffsetTop() > 0) {
      changeCssVariable(cssVariables.headerOffsetTop, ` ${getHeaderOffsetTop()}px`);
      if (getHeaderOffsetTop() > parseInt(getCssVariable(cssVariables.headerOffsetTopStatic))) {
        changeCssVariable(cssVariables.headerOffsetTopStatic, ` ${getHeaderOffsetTop()}px`);
      }
    } else if (getCssVariable(cssVariables.headerOffsetTop) !== " 0px") {
      changeCssVariable(cssVariables.headerOffsetTop, ` ${getHeaderOffsetTop()}px`);
    }
    changeCssVariable(cssVariables.pageHeight, ` ${window.innerHeight}px`);
    changeCssVariable(cssVariables.announcementBarHeight, ` ${getAnnouncementBarHeight()}px`);
  }
  function navigateToLink(href) {
    if (href) {
      window.location.href = href;
    }
  }
  function initHeaderOverlay() {
    const headerOverlayElement = header.querySelector(selectors.headerOverlay);
    if (!headerOverlayElement) {
      return;
    }
    const open = () => headerOverlayElement.classList.add(cssClasses.active);
    const close = () => headerOverlayElement.classList.remove(cssClasses.active);
    return Object.freeze({
      open,
      close
    });
  }
  function initDesktopMainMenuDecoration() {
    headerDesktopMenuMain && menuDecoration({ container: headerDesktopMenuMain }).init();
  }
  function blockMainMenu(force) {
    headerDesktopMenuItems.forEach((menuItem) => {
      menuItem.classList.toggle(cssClasses.disabled, force);
      force ? menuItem.setAttribute("tabindex", "-1") : menuItem.removeAttribute("tabindex");
    });
  }
  function updateItemCount(event) {
    if (!event.hasOwnProperty("item_count")) {
      return;
    }
    headerCartItemCountWrapper.setAttribute(attributes.itemCount, event.item_count);
    headerCartItemCount.innerHTML = event.item_count;
    if (event.item_count > 99) {
      headerCartItemCount.innerHTML = "99+";
    } else {
      headerCartItemCount.innerHTML = event.item_count;
    }
  }
  function changeCssVariable(variable, value) {
    requestAnimationFrame(() => {
      cssRoot.style.setProperty(variable, value);
    });
  }
  function getCssVariable(variable) {
    return cssRoot.style.getPropertyValue(variable);
  }
  function getHeaderHeight() {
    return header.getBoundingClientRect().height;
  }
  function getAnnouncementBarHeight() {
    if (window.Shopify.designMode) {
      announcementBar = document.querySelector(selectors.announcementBar);
    }
    if (!announcementBar) {
      return 0;
    }
    return announcementBar.getBoundingClientRect().height;
  }
  function getHeaderOffsetTop() {
    return Math.max(header.getBoundingClientRect().top, 0);
  }
  function initDrawers() {
    const initializedToggles = /* @__PURE__ */ new Set();
    headerDrawerTogglers.forEach((drawerToggler) => {
      const toggle = drawerToggler.getAttribute(attributes.drawerToggle);
      if (!toggle || initializedToggles.has(toggle))
        return;
      initializedToggles.add(toggle);
      if (toggle === "searchToggleDrawer") {
        const input = document.querySelector(selectors.predictiveSearchInput);
        Toggle({
          toggleSelector: toggle,
          toggleTabIndex: true,
          elementToFocus: input
        }).init();
        return;
      }
      Toggle({
        toggleSelector: toggle,
        toggleTabIndex: true,
        overlayPlacement: header
      }).init();
    });
  }
  function initBurgerMenu() {
    headerBurgerMenu = burgerMenu({
      containerId: "headerBurgerMenu"
    });
    headerBurgerMenu.init();
  }
  function isTargetActive(target) {
    return target.classList.contains(cssClasses.active);
  }
  function toggleScrollbarOffset(force) {
    if (force) {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      headerInner.style.paddingRight = scrollbarWidth + "px";
    } else {
      headerInner.style.paddingRight = "";
    }
  }
  function toggleHeaderActiveClass(force) {
    if (force) {
      headerInner.classList.add(cssClasses.hover);
      return;
    }
    const focusVisibleElement = headerInner.querySelector("*:focus-visible");
    if (!headerInner.matches(":hover") && !focusVisibleElement) {
      headerInner.classList.remove(cssClasses.hover);
    }
  }
  function handleToggleEvent(event, target, bodyScroll, timeout, isTrapFocus, isRemoveTrapFocus) {
    event.preventDefault();
    if (timeout === void 0) {
      timeout = 700;
    }
    openProcessing = true;
    if (isTrapFocus === void 0) {
      isTrapFocus = true;
    }
    if (isRemoveTrapFocus === void 0) {
      isRemoveTrapFocus = true;
    }
    toggleActive(target, bodyScroll, timeout, isTrapFocus, isRemoveTrapFocus);
    setTimeout(() => openProcessing = false, timeout);
  }
  function toggleActive(target, bodyScroll, timeout, isTrapFocus, isRemoveTrapFocus) {
    return isTargetActive(target) ? closeToggleTarget(target, !bodyScroll, timeout, isRemoveTrapFocus) : openToggleTarget(target, bodyScroll, isTrapFocus);
  }
  function openToggleTarget(target, bodyScroll, isTrapFocus) {
    if (!target || isTargetActive(target)) {
      return;
    }
    removeHiddenClass(target);
    let togglers = [...document.querySelectorAll(`[data-target="${target.id}"]`)];
    togglers.forEach((toggler) => {
      setAriaExpanded(toggler);
      addActiveClass(toggler);
    });
    const headerMenuScrollContainer = target.querySelector(selectors.headerMenuScrollContainer);
    headerMenuScrollContainer && (headerMenuScrollContainer.scrollTop = 0);
    setTimeout(() => addActiveClass(target), 0);
    if (bodyScroll) {
      document.body.style.overflow = "hidden";
    }
    if (isTrapFocus) {
      focusTarget(target);
    }
    if (!binder.isSet()) {
      binder.set();
    }
  }
  function closeToggleTarget(target, bodyScroll, timeout, isRemoveTrapFocus) {
    if (!target || !isTargetActive(target)) {
      return;
    }
    removeActiveClass(target);
    let togglers = [...document.querySelectorAll(`[data-target="${target.id}"]`)];
    togglers.forEach((toggler) => {
      removeAriaExpanded(toggler);
      removeActiveClass(toggler);
    });
    setTimeout(() => addHiddenClass(target), timeout);
    if (bodyScroll) {
      document.body.style.overflow = null;
    }
    if (isRemoveTrapFocus) {
      removeFocusTarget();
    }
    binder.remove();
  }
  function addActiveClass(target) {
    target.classList.add(cssClasses.active);
  }
  function removeActiveClass(target) {
    target.classList.remove(cssClasses.active);
  }
  function addHiddenClass(target) {
    target.classList.add(cssClasses.hidden);
  }
  function removeHiddenClass(target) {
    target.classList.remove(cssClasses.hidden);
  }
  function setAriaExpanded(toggler) {
    toggler.setAttribute(attributes.ariaExpanded, true);
  }
  function removeAriaExpanded(toggler) {
    toggler.setAttribute(attributes.ariaExpanded, false);
  }
  function setTabIndexOnTarget(target) {
    focusable(target).forEach((element) => {
      element.setAttribute(attributes.tabIndex, 0);
    });
  }
  function focusTarget(target, elementToFocus = null, preventScroll = false) {
    if (!target) {
      return;
    }
    previouslySelectedElement = document.activeElement;
    const focusableElements = focusable(target);
    if (focusableElements.length) {
      trapFocus(target, { elementToFocus: elementToFocus || focusableElements[0], preventScroll });
      return;
    }
    trapFocus(target);
  }
  function removeFocusTarget(element = null) {
    if (isElement(element)) {
      window.setTimeout(() => element.focus({ preventScroll: true }), 0);
    } else if (isElement(previouslySelectedElement)) {
      window.setTimeout(() => previouslySelectedElement.focus({ preventScroll: true }), 0);
    }
    removeTrapFocus();
  }
  function closeAllMenus(list, isRemoveTrapFocus) {
    if (isRemoveTrapFocus === void 0) {
      isRemoveTrapFocus = true;
    }
    list.forEach((menu) => {
      closeToggleTarget(menu, true, 0, isRemoveTrapFocus);
    });
  }
  function getActiveElements(list) {
    return list.filter((item) => isTargetActive(item));
  }
  function scrollHandler() {
    let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    let condition = staticHeader ? currentScrollPosition > 0 : currentScrollPosition > 0 && lastScrollPosition <= currentScrollPosition;
    if (condition && getComputedStyle(document.body).overflow !== "hidden" && Math.max(header.getBoundingClientRect().y, 0) + getAnnouncementBarHeight() < currentScrollPosition) {
      closeLocalizationSelector();
      closeActiveDesktopMenus(true);
      header.classList.add(cssClasses.collapsed);
      isHeaderHidden = true;
    } else {
      header.classList.remove(cssClasses.collapsed);
      isHeaderHidden = false;
    }
    lastScrollPosition = currentScrollPosition;
  }
  function closeLocalizationSelector() {
    if (hasActiveLocalizationPanel()) {
      window.themeCore.EventBus.emit("Localization-Form:close-form");
    }
  }
  function hasActiveLocalizationPanel() {
    const localizationForms = [...document.querySelectorAll(selectors.localizationForm)];
    if (!localizationForms.length) {
      return false;
    }
    const headerLocalizationForms = localizationForms.filter((localizationForm) => localizationForm.id === ids.headerCountryLocalizationForm || localizationForm.id === ids.headerLanguageLocalizationForm);
    return headerLocalizationForms.some((localizationForm) => localizationForm.isActive);
  }
  function hasActiveMenu() {
    return hasActiveDesktopMenu() || hasActiveLocalizationPanel() || isBurgerMenuActive;
  }
  function hasActiveDesktopMenu() {
    return headerDesktopMenus.find((desktopMenu) => desktopMenu.classList.contains("is-active"));
  }
  function desktopMenuClickHandler(toggler, menu) {
    toggleDesktopMenu(toggler, menu);
  }
  function desktopMenuMouseEnterHandler(toggler, menu) {
    if (timeouts.has(`${menu.id}-hover-timeout`)) {
      clearTimeout(timeouts.get(`${menu.id}-hover-timeout`));
      timeouts.delete(`${menu.id}-hover-timeout`);
    }
    const timeout = setTimeout(() => {
      toggleDesktopMenu(toggler, menu, true, false);
    }, 300);
    timeouts.set(`${menu.id}-hover-timeout`, timeout);
  }
  function desktopMenuMouseLeaveHandler(toggler, menu) {
    if (timeouts.has(`${menu.id}-hover-timeout`)) {
      clearTimeout(timeouts.get(`${menu.id}-hover-timeout`));
      timeouts.delete(`${menu.id}-hover-timeout`);
    }
    const timeout = setTimeout(() => {
      var _a;
      const element = document.elementFromPoint(clientX, clientY);
      const closeNestedDropdown = menu.dataset.menuType === "dropdown-menu-nested" && !element.closest(selectors.headerDesktopMenuToggler) && ((_a = element.closest(selectors.headerDesktopMenu)) == null ? void 0 : _a.dataset.menuType) === "dropdown-menu";
      if (closeNestedDropdown) {
        const activeMenu = headerDesktopMenus.find((desktopMenu) => desktopMenu.dataset.menuType === "dropdown-menu-nested" && (desktopMenu.classList.contains(cssClasses.active) || desktopMenu.classList.contains(cssClasses.loading)));
        if (!activeMenu) {
          return;
        }
        const activeToggler = headerDesktopMenuTogglers.find((toggler2) => activeMenu.id === toggler2.dataset.target);
        closeDesktopMenuElement(activeToggler, activeMenu, false, false);
      }
      if (element.closest(selectors.headerDesktopMenuToggler) || element.closest(selectors.headerDesktopMenu)) {
        return;
      }
      closeActiveDesktopMenus(false);
    }, 300);
    timeouts.set(`${menu.id}-hover-timeout`, timeout);
  }
  function closeActiveDesktopMenu() {
    if (timeouts.has("toggle-timeout")) {
      clearTimeout(timeouts.get("toggle-timeout"));
      timeouts.delete("toggle-timeout");
    }
    const activeMenu = headerDesktopMenus.find((desktopMenu) => desktopMenu.dataset.menuType === "dropdown-menu-nested" && (desktopMenu.classList.contains(cssClasses.active) || desktopMenu.classList.contains(cssClasses.loading))) || headerDesktopMenus.find((desktopMenu) => desktopMenu.classList.contains(cssClasses.active) || desktopMenu.classList.contains(cssClasses.loading));
    if (!activeMenu) {
      return;
    }
    const activeToggler = headerDesktopMenuTogglers.find((toggler) => activeMenu.id === toggler.dataset.target);
    closeDesktopMenuElement(activeToggler, activeMenu, false);
  }
  function closeActiveDesktopMenus(trapFocus2 = true) {
    if (timeouts.has("toggle-timeout")) {
      clearTimeout(timeouts.get("toggle-timeout"));
      timeouts.delete("toggle-timeout");
    }
    let activeMenus = headerDesktopMenus.filter((desktopMenu) => desktopMenu.classList.contains(cssClasses.active) || desktopMenu.classList.contains(cssClasses.loading));
    activeMenus.sort((a) => a.dataset.menuType === "dropdown-menu-nested" ? -1 : 1);
    activeMenus.forEach((activeMenu) => {
      const activeToggler = headerDesktopMenuTogglers.find((toggler) => activeMenu.id === toggler.dataset.target);
      closeDesktopMenuElement(activeToggler, activeMenu, false, trapFocus2);
    });
  }
  function updateDesktopMegaMenuHeight() {
    const headerMegaMenu = headerDesktopMenus.find((desktopMenu) => desktopMenu.classList.contains(cssClasses.active) && desktopMenu.dataset.menuType === "mega-menu");
    if (!headerMegaMenu) {
      return;
    }
    if (timeouts.has("resize-timeout")) {
      clearTimeout(timeouts.get("resize-timeout"));
      timeouts.delete("resize-timeout");
    }
    const menuContainer = headerMegaMenu.querySelector(selectors.headerDesktopMenuContainer);
    const menuMaxHeight = parseFloat(window.getComputedStyle(headerMegaMenu).maxHeight);
    const menuHeight = `${Math.min(menuMaxHeight, menuContainer.offsetHeight)}px`;
    headerInner.classList.add(cssClasses.forceTransition);
    header.style.setProperty("--menu-height", menuHeight);
    const timeout = setTimeout(() => {
      headerInner.classList.remove(cssClasses.forceTransition);
    }, 0);
    timeouts.set("resize-timeout", timeout);
  }
  function updateDesktopMenuDropdownPosition() {
    const headerDropdownMenu = headerDesktopMenus.find((desktopMenu) => desktopMenu.classList.contains(cssClasses.active) && desktopMenu.dataset.menuType === "dropdown-menu");
    const headerDropdownMenuNested = headerDesktopMenus.find((desktopMenu) => desktopMenu.classList.contains(cssClasses.active) && desktopMenu.dataset.menuType === "dropdown-menu-nested");
    if (!headerDropdownMenu) {
      return;
    }
    const isBodyClassRtl = document.body.classList.contains(cssClasses.rtl);
    const headerDropdownToggler = headerDesktopMenuTogglers.find((toggler) => headerDropdownMenu.id === toggler.dataset.target);
    if (!headerDropdownToggler) {
      return;
    }
    const togglerRect = headerDropdownToggler.getBoundingClientRect();
    const togglerPosition = isBodyClassRtl ? window.innerWidth - togglerRect.right : togglerRect.left;
    headerDropdownMenu.style.left = "";
    headerDropdownMenu.style.insetInlineStart = `${togglerPosition}px`;
    if (!headerDropdownMenuNested) {
      return;
    }
    const menuContainer = headerDropdownMenuNested.querySelector(
      selectors.headerDesktopMenuContainer
    );
    if (!menuContainer) {
      return;
    }
    const menuMaxWidth = parseFloat(window.getComputedStyle(menuContainer).maxWidth);
    const parentMenuRect = headerDropdownMenu.getBoundingClientRect();
    const parentMenuWidth = Math.min(menuMaxWidth, menuContainer.offsetWidth);
    const parentMenuPosition = isBodyClassRtl ? parentMenuRect.left - parentMenuWidth - 4 : parentMenuRect.right + 4;
    headerDropdownMenuNested.style.left = `${parentMenuPosition}px`;
    headerDropdownMenuNested.style.width = `${parentMenuWidth}px`;
  }
  function toggleDesktopMenu(toggler, menu, force = null, trapFocus2 = true) {
    if (timeouts.has("toggle-timeout")) {
      clearTimeout(timeouts.get("toggle-timeout"));
      timeouts.delete("toggle-timeout");
    }
    const openMenu = force !== null ? force : !toggler.classList.contains(cssClasses.active);
    const isNestedDropdown = menu.dataset.menuType === "dropdown-menu-nested";
    let activeMenus = headerDesktopMenus.filter((desktopMenu) => menu !== desktopMenu && (desktopMenu.classList.contains(cssClasses.active) || desktopMenu.classList.contains(cssClasses.loading)));
    activeMenus.sort((a) => a.dataset.menuType === "dropdown-menu-nested" ? -1 : 1);
    let timeoutDuration = 0;
    let forceMenu = false;
    if (isNestedDropdown) {
      activeMenus = activeMenus.filter((menu2) => menu2.dataset.menuType === "dropdown-menu-nested");
    }
    if (activeMenus.length) {
      forceToggleMegaMenu = activeMenus.some((menu2) => menu2.dataset.menuType === "mega-menu") && menu.dataset.menuType === "mega-menu";
      forceCloseDropdownMenuNested = activeMenus.some((menu2) => menu2.dataset.menuType === "dropdown-menu-nested");
      forceCloseDropdownMenu = menu.dataset.menuType === "dropdown-menu" && toggler.classList.contains(cssClasses.active);
      forceMenu = forceToggleMegaMenu || forceCloseDropdownMenuNested;
      if (!forceToggleMegaMenu && !(isNestedDropdown && forceCloseDropdownMenuNested) && !forceCloseDropdownMenu) {
        timeoutDuration = 400;
      } else if (isNestedDropdown && forceCloseDropdownMenuNested) {
        timeoutDuration = 200;
      }
      activeMenus.forEach((activeMenu) => {
        const activeToggler = headerDesktopMenuTogglers.find((toggler2) => activeMenu.id === toggler2.dataset.target);
        const elementType = menu.dataset.menuType;
        switch (elementType) {
          case "mega-menu":
            closeDesktopMenuElement(activeToggler, activeMenu, forceToggleMegaMenu, trapFocus2);
            break;
          case "dropdown-menu":
            closeDesktopMenuElement(activeToggler, activeMenu, false, trapFocus2);
            break;
          case "dropdown-menu-nested":
            closeDesktopMenuElement(activeToggler, activeMenu, forceCloseDropdownMenuNested, trapFocus2);
            break;
        }
      });
    }
    const timeout = setTimeout(() => {
      openMenu ? openDesktopMenuElement(toggler, menu, forceMenu, trapFocus2) : closeDesktopMenuElement(toggler, menu, false, trapFocus2);
    }, timeoutDuration);
    timeouts.set("toggle-timeout", timeout);
  }
  function openDesktopMenuElement(toggler, menu, force = false, trapFocus2 = true) {
    const elementType = menu.dataset.menuType;
    switch (elementType) {
      case "mega-menu":
        openMegaMenu(toggler, menu, force, trapFocus2);
        break;
      case "dropdown-menu":
        openDropdownMenu(toggler, menu, false, trapFocus2);
        break;
      case "dropdown-menu-nested":
        openDropdownMenu(toggler, menu, true, trapFocus2);
        break;
    }
  }
  function closeDesktopMenuElement(toggler, menu, force = false, trapFocus2 = true) {
    const elementType = menu.dataset.menuType;
    switch (elementType) {
      case "mega-menu":
        closeMegaMenu(toggler, menu, force, trapFocus2);
        break;
      case "dropdown-menu":
        closeDropdownMenu(toggler, menu, force, false, trapFocus2);
        break;
      case "dropdown-menu-nested":
        closeDropdownMenu(toggler, menu, force, true, trapFocus2);
        break;
    }
  }
  function openMegaMenu(toggler, menu, force = false, trapFocus2 = true) {
    if (toggler.classList.contains(cssClasses.active)) {
      return;
    }
    if (timeouts.has(menu.id)) {
      const timeoutsArray = timeouts.get(menu.id);
      timeoutsArray.forEach((timeout) => clearTimeout(timeout));
      timeouts.delete(menu.id);
    }
    menu.classList.remove(cssClasses.hidden);
    toggler.classList.add(cssClasses.loading);
    menu.classList.add(cssClasses.loading);
    menu.classList.remove(cssClasses.forceTransition);
    !force && toggleScrollbarOffset(true);
    document.body.style.overflow = "hidden";
    removeMegaMenuBodyScroll = true;
    headerOverlay && headerOverlay.open();
    const menuScrollContainer = menu.querySelector(selectors.headerDesktopMenuScrollContainer);
    menuScrollContainer && (menuScrollContainer.scrollTop = 0);
    const menuContainer = menu.querySelector(selectors.headerDesktopMenuContainer);
    const menuMaxHeight = parseFloat(window.getComputedStyle(menu).maxHeight);
    const menuHeight = `${Math.min(menuMaxHeight, menuContainer.offsetHeight)}px`;
    force && menu.classList.add(cssClasses.forceChangeTransition);
    force && menu.classList.add(cssClasses.forceTransition);
    menu.style.height = force ? activeMegaMenuHeight : menuHeight;
    header.style.setProperty("--menu-height", menuHeight);
    menu.offsetHeight;
    const timeoutStart = setTimeout(() => {
      force && menu.classList.remove(cssClasses.forceTransition);
      toggler.classList.add(cssClasses.active);
      menu.classList.add(cssClasses.active);
      setAriaExpanded(toggler);
      window.themeCore.EventBus.emit("HeaderDesktopMenu:open");
      toggleHeaderActiveClass(true);
      activeMegaMenuHeight = menuHeight;
      force && (menu.style.height = menuHeight);
      if (trapFocus2) {
        focusTarget(menu, null, true);
        if (!binder.isSet()) {
          binder.set();
        }
      }
    }, 0);
    timeouts.set(menu.id, [timeoutStart]);
    const timeoutEnd = setTimeout(() => {
      menu.style.height = ``;
      toggler.classList.remove(cssClasses.loading);
      menu.classList.remove(cssClasses.loading);
      menu.classList.remove(cssClasses.forceChangeTransition);
    }, 400);
    timeouts.set(menu.id, [...timeouts.get(menu.id), timeoutEnd]);
  }
  function closeMegaMenu(toggler, menu, force = false, trapFocus2 = true) {
    if (!toggler.classList.contains(cssClasses.active)) {
      return;
    }
    if (timeouts.has(menu.id)) {
      const timeoutsArray = timeouts.get(menu.id);
      timeoutsArray.forEach((timeout) => clearTimeout(timeout));
      timeouts.delete(menu.id);
    }
    const timeoutDuration = force ? 0 : 400;
    const menuContainer = menu.querySelector(selectors.headerDesktopMenuContainer);
    const menuMaxHeight = parseFloat(window.getComputedStyle(menu).maxHeight);
    const menuHeight = `${Math.min(menuMaxHeight, menuContainer.offsetHeight)}px`;
    menu.style.height = menuHeight;
    toggler.classList.add(cssClasses.loading);
    toggler.classList.remove(cssClasses.active);
    menu.classList.add(cssClasses.loading);
    menu.classList.remove(cssClasses.active);
    menu.classList.remove(cssClasses.forceChangeTransition);
    force && menu.classList.add(cssClasses.forceTransition);
    !force && removeMegaMenuBodyScroll && (document.body.style.overflow = null);
    !force && toggleScrollbarOffset(false);
    !force && headerOverlay && headerOverlay.close();
    removeAriaExpanded(toggler);
    window.themeCore.EventBus.emit("HeaderDesktopMenu:close");
    toggleHeaderActiveClass(false);
    !force && header.style.setProperty("--menu-height", `0px`);
    menuContainer.offsetHeight;
    const timeoutStart = setTimeout(() => {
      menu.style.height = `0px`;
      const isGlobalOverlayActive = document.querySelector(selectors.globalOverlay);
      if (trapFocus2) {
        if (!isGlobalOverlayActive) {
          removeFocusTarget(toggler);
          binder.remove();
        }
      } else {
        toggler.blur();
      }
    }, 0);
    timeouts.set(menu.id, [timeoutStart]);
    const timeoutEnd = setTimeout(() => {
      toggler.classList.remove(cssClasses.loading);
      menu.classList.remove(cssClasses.loading);
      menu.classList.add(cssClasses.hidden);
      menu.classList.remove(cssClasses.forceTransition);
    }, timeoutDuration);
    timeouts.set(menu.id, [...timeouts.get(menu.id), timeoutEnd]);
  }
  function openDropdownMenu(toggler, menu, nested = false, trapFocus2 = true) {
    if (toggler.classList.contains(cssClasses.active)) {
      return;
    }
    if (timeouts.has(menu.id)) {
      const timeoutsArray = timeouts.get(menu.id);
      timeoutsArray.forEach((timeout) => clearTimeout(timeout));
      timeouts.delete(menu.id);
    }
    menu.classList.remove(cssClasses.hidden);
    menu.classList.remove(cssClasses.forceTransition);
    toggler.classList.add(cssClasses.loading);
    menu.classList.add(cssClasses.loading);
    const menuScrollContainer = menu.querySelector(selectors.headerDesktopMenuScrollContainer);
    menuScrollContainer && (menuScrollContainer.scrollTop = 0);
    const menuContainer = menu.querySelector(selectors.headerDesktopMenuContainer);
    const isBodyClassRtl = document.body.classList.contains(cssClasses.rtl);
    if (nested) {
      const menuMaxWidth = parseFloat(window.getComputedStyle(menuContainer).maxWidth);
      const parentMenu = toggler.closest(selectors.headerDesktopMenu);
      const parentMenuRect = parentMenu.getBoundingClientRect();
      const parentMenuWidth = Math.min(menuMaxWidth, menuContainer.offsetWidth);
      const parentMenuPosition = isBodyClassRtl ? parentMenuRect.left - parentMenuWidth - 4 : parentMenuRect.right + 4;
      menu.style.left = `${parentMenuPosition}px`;
      menu.style.width = `${parentMenuWidth}px`;
    } else {
      const menuMaxHeight = parseFloat(window.getComputedStyle(menuContainer).maxHeight);
      const togglerRect = toggler.getBoundingClientRect();
      const togglerPosition = isBodyClassRtl ? window.innerWidth - togglerRect.right : togglerRect.left;
      menu.style.height = `${Math.min(menuMaxHeight, menuContainer.offsetHeight)}px`;
      menu.style.insetInlineStart = `${togglerPosition}px`;
    }
    menu.offsetHeight;
    const timeoutStart = setTimeout(() => {
      toggler.classList.add(cssClasses.active);
      menu.classList.add(cssClasses.active);
      setAriaExpanded(toggler);
      header.style.setProperty("--menu-height", `0px`);
      window.themeCore.EventBus.emit("HeaderDesktopMenu:open");
      toggleHeaderActiveClass(true);
      if (trapFocus2) {
        focusTarget(menu, null, true);
        if (!binder.isSet()) {
          binder.set();
        }
      }
    }, 0);
    timeouts.set(menu.id, [timeoutStart]);
    const timeoutEnd = setTimeout(() => {
      nested ? menu.style.width = `` : menu.style.height = ``;
      toggler.classList.remove(cssClasses.loading);
      menu.classList.remove(cssClasses.loading);
    }, 400);
    timeouts.set(menu.id, [...timeouts.get(menu.id), timeoutEnd]);
  }
  function closeDropdownMenu(toggler, menu, force = false, nested = false, trapFocus2 = true) {
    if (!toggler.classList.contains(cssClasses.active)) {
      return;
    }
    if (timeouts.has(menu.id)) {
      const timeoutsArray = timeouts.get(menu.id);
      timeoutsArray.forEach((timeout) => clearTimeout(timeout));
      timeouts.delete(menu.id);
    }
    const timeoutDuration = force ? 0 : 400;
    const menuContainer = menu.querySelector(selectors.headerDesktopMenuContainer);
    if (nested) {
      const menuMaxWidth = parseFloat(window.getComputedStyle(menuContainer).maxWidth);
      menu.style.width = `${Math.min(menuMaxWidth, menuContainer.offsetWidth)}px`;
    } else {
      const menuMaxHeight = parseFloat(window.getComputedStyle(menuContainer).maxHeight);
      menu.style.height = `${Math.min(menuMaxHeight, menuContainer.offsetHeight)}px`;
    }
    toggler.classList.add(cssClasses.loading);
    toggler.classList.remove(cssClasses.active);
    menu.classList.add(cssClasses.loading);
    menu.classList.remove(cssClasses.active);
    removeAriaExpanded(toggler);
    force && menu.classList.add(cssClasses.forceTransition);
    header.style.setProperty("--menu-height", `0px`);
    window.themeCore.EventBus.emit("HeaderDesktopMenu:close");
    toggleHeaderActiveClass(false);
    menuContainer.offsetHeight;
    const timeoutStart = setTimeout(() => {
      nested ? menu.style.width = `0px` : menu.style.height = `0px`;
      const isGlobalOverlayActive = document.querySelector(selectors.globalOverlay);
      if (trapFocus2) {
        if (isGlobalOverlayActive) {
          return;
        }
        if (nested) {
          const parentMenu = toggler.closest(selectors.headerDesktopMenu);
          focusTarget(parentMenu, toggler, true);
        } else {
          removeFocusTarget(toggler);
          binder.remove();
        }
      } else {
        toggler.blur();
      }
    }, 0);
    timeouts.set(menu.id, [timeoutStart]);
    const timeoutEnd = setTimeout(() => {
      toggler.classList.remove(cssClasses.loading);
      menu.classList.remove(cssClasses.loading);
      menu.classList.add(cssClasses.hidden);
      force && menu.classList.remove(cssClasses.forceTransition);
      if (nested && !binder.isSet()) {
        binder.set();
      }
    }, timeoutDuration);
    timeouts.set(menu.id, [...timeouts.get(menu.id), timeoutEnd]);
  }
  return Object.freeze({
    init,
    getHeaderHeight: () => headerHeight,
    getHeaderHeightStatic: () => headerHeightStatic
  });
};
const action = () => {
  window.themeCore.Header = window.themeCore.Header || Header();
  window.themeCore.utils.register(window.themeCore.Header, "header");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
