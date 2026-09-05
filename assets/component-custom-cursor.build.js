const CustomCursor = () => {
  const { on, off, cssClasses } = window.themeCore.utils;
  const selectors = {
    customCursor: ".js-custom-cursor"
  };
  const attributes = {
    hideCursorOnHover: "data-hide-cursor-on-hover"
  };
  const ignoredSelectors = {
    iframe: "iframe",
    modelViewer: "model-viewer",
    video: "video",
    audio: "audio",
    track: "track",
    canvas: "canvas"
  };
  const hoveredSelectors = {
    buttonPrimary: ".button.button--primary",
    buttonCircle: ".button-circle",
    buttonIcon: ".button-icon",
    buttonIconCircle: ".button-icon-circle",
    buttonSocial: ".button-social",
    compareProductButton: ".compare-products-popup-button",
    productCardQuickButton: ".product-card__quick-button"
  };
  const ignoredSelectorsList = Object.values(ignoredSelectors).join(", ");
  const hoveredSelectorsList = Object.values(hoveredSelectors).join(", ");
  const cursorState = {
    size: 20,
    mouseX: 0,
    mouseY: 0,
    previousX: null,
    previousY: null,
    x: 0,
    y: 0,
    t: 0.1,
    isHidden: false,
    isActive: false,
    isInitialized: false,
    requestAnimationFrameId: null,
    timeoutId: null
  };
  let customCursor;
  let selectedHoveredElement;
  let selectedIgnoredElement;
  let hideCursorOnHover;
  function init() {
    customCursor = document.querySelector(selectors.customCursor);
    if (!customCursor) {
      return;
    }
    if (customCursor.hasAttribute(attributes.hideCursorOnHover)) {
      hideCursorOnHover = true;
    }
    initTouchDeviceListener();
  }
  function initTouchDeviceListener() {
    const touchMediaQuery = "(-moz-touch-enabled: 1), (hover: none), (pointer: coarse)";
    const touchMatchMedia = window.matchMedia(touchMediaQuery);
    const isTouch = touchMatchMedia.matches;
    isTouch ? destroyCursor() : initCursor();
    touchMatchMedia.addEventListener("change", (event) => {
      const isTouch2 = event.matches;
      isTouch2 ? destroyCursor() : initCursor();
    });
  }
  function initCursor() {
    if (cursorState.isInitialized) {
      return;
    }
    on("pointermove", document, updateMousePosition);
    on("pointerenter", document, onPointerEnter);
    on("pointerleave", document, onPointerLeave);
    toggleDefaultCursor(true);
    cursorState.isInitialized = true;
  }
  function destroyCursor() {
    if (!cursorState.isInitialized) {
      return;
    }
    off("pointermove", document, updateMousePosition);
    off("pointerenter", document, onPointerEnter);
    off("pointerleave", document, onPointerLeave);
    toggleDefaultCursor(false);
    disableCursor();
    cursorState.isInitialized = false;
  }
  function onPointerEnter() {
    enableCursor();
  }
  function onPointerLeave() {
    disableCursor();
  }
  function toggleDefaultCursor(force) {
    document.body.classList.toggle(cssClasses.cursorHidden, force);
  }
  function enableCursor() {
    cursorState.isActive = true;
    animateCursor();
  }
  function disableCursor() {
    cursorState.isActive = false;
    disableAnimateCursor();
  }
  function disableAnimateCursor() {
    if (cursorState.requestAnimationFrameId) {
      cancelAnimationFrame(cursorState.requestAnimationFrameId);
      cursorState.requestAnimationFrameId = null;
    }
    customCursor.classList.toggle(cssClasses.active, cursorState.isActive);
  }
  function animateCursor() {
    cursorState.x = Math.round(smoothApproach(cursorState.mouseX, cursorState.x, cursorState.t));
    cursorState.y = Math.round(smoothApproach(cursorState.mouseY, cursorState.y, cursorState.t));
    customCursor.style.transform = `translate(${cursorState.x - cursorState.size / 2}px, ${cursorState.y - cursorState.size / 2}px)`;
    customCursor.classList.toggle(cssClasses.active, cursorState.isActive);
    if (cursorState.x === cursorState.previousX && cursorState.y === cursorState.previousY) {
      disableAnimateCursor();
    } else {
      cursorState.previousX = cursorState.x;
      cursorState.previousY = cursorState.y;
      cursorState.requestAnimationFrameId = requestAnimationFrame(animateCursor);
    }
  }
  function updateMousePosition(event) {
    clearTimeout(cursorState.timeoutId);
    cursorState.mouseX = Math.round(event.clientX);
    cursorState.mouseY = Math.round(event.clientY);
    if (!cursorState.isHidden) {
      enableCursor();
    }
    if (ignoredSelectorsList) {
      updateIgnoredElement(event);
    }
    if (hideCursorOnHover) {
      updateHoveredCursor(event);
    }
    cursorState.timeoutId = setTimeout(() => {
      disableCursor();
    }, 1e3);
  }
  function updateIgnoredElement(event) {
    const ignoredElement = event.target.closest(ignoredSelectorsList);
    if (ignoredElement) {
      selectedIgnoredElement = ignoredElement;
      cursorState.isHidden = true;
      disableCursor();
      toggleDefaultCursor(false);
    } else if (!ignoredElement && selectedIgnoredElement) {
      selectedIgnoredElement = null;
      cursorState.isHidden = false;
      enableCursor();
      toggleDefaultCursor(true);
    }
  }
  function updateHoveredCursor(event) {
    const hoveredElement = event.target.closest(hoveredSelectorsList);
    if (hoveredElement && hoveredElement !== selectedHoveredElement) {
      selectedHoveredElement = hoveredElement;
      customCursor.classList.add(cssClasses.hidden);
      cursorState.isHidden = true;
      disableCursor();
    } else if (!hoveredElement && selectedHoveredElement) {
      selectedHoveredElement = null;
      customCursor.classList.remove(cssClasses.hidden);
      cursorState.isHidden = false;
      enableCursor();
    }
  }
  function smoothApproach(start, end, t) {
    return start + (end - start) * t;
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CustomCursor = window.themeCore.CustomCursor || CustomCursor();
  window.themeCore.utils.register(window.themeCore.CustomCursor, "custom-cursor");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
