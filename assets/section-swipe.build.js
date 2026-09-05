const Swipe$1 = () => {
  const selectors = {
    /** CSS selector for the wrapper containing all banners */
    bannersWrapper: ".js-swipe-banners-wrapper",
    /** CSS selector for individual banner cards */
    banner: ".js-swipe-banner"
  };
  let cardsWrapper;
  let cards = [];
  let numCards = 0;
  function init(section) {
    cardsWrapper = section.querySelector(selectors.bannersWrapper);
    if (!cardsWrapper) {
      return;
    }
    cards = [...section.querySelectorAll(selectors.banner)];
    numCards = cards.length;
    cardsWrapper.style.setProperty("--numcards", numCards);
    if (timelineIsAlready()) {
      initCards();
    } else {
      const interval = setInterval(() => {
        if (timelineIsAlready()) {
          initCards();
          clearInterval(interval);
        }
      }, 100);
    }
  }
  function timelineIsAlready() {
    return typeof ViewTimeline !== "undefined";
  }
  function setCardOffset(card) {
    if (card.clientHeight > window.innerHeight) {
      card.style.top = `-${card.clientHeight - window.innerHeight}px`;
    } else {
      card.style.top = `0`;
    }
  }
  function initCards() {
    if (!timelineIsAlready()) {
      return;
    }
    const viewTimeline = new ViewTimeline({
      subject: cardsWrapper,
      axis: "block"
    });
    cards.forEach((card, index0) => {
      const index = index0 + 1;
      const reverseIndex0 = numCards - index;
      window.addEventListener("resize", () => {
        setCardOffset(card);
      });
      setCardOffset(card);
      card.animate(
        {
          transform: [`scale(1)`, `scale(${1 - 0.1 * reverseIndex0}`]
        },
        {
          timeline: viewTimeline,
          fill: "forwards",
          rangeStart: `exit-crossing ${CSS.percent(index0 / numCards * 100)}`,
          rangeEnd: `exit-crossing ${CSS.percent(index / numCards * 100)}`
        }
      );
    });
  }
  return Object.freeze({
    init,
    initCards,
    timelineIsAlready,
    cardsWrapper,
    cards,
    numCards,
    selectors
  });
};
const Swipe = () => {
  const selectors = {
    section: ".js-swipe"
  };
  function init(sectionId) {
    const sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => Swipe$1().init(section));
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Swipe = window.themeCore.Swipe || Swipe();
  window.themeCore.utils.register(window.themeCore.Swipe, "swipe");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
