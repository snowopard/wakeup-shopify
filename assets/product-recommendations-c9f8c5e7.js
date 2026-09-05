const selectors = {
  section: ".js-product-recommendations",
  content: ".js-product-recommendations-content",
  slider: ".js-product-recommendations-slider",
  paginationWrapper: ".js-product-recommendations-pagination-wrapper",
  productCard: ".js-product-card",
  existingProduct: "[data-existing-product]",
  tabButtonsWrapper: ".js-product-recommendations-tabs-wrapper",
  viewedContent: ".js-product-recommendations-viewed-content",
  viewedLabel: ".js-product-recommendations-viewed-label"
};
const attributes = {
  url: "data-url"
};
const PARAMS = {
  section: "section_id",
  limit: "limit",
  product: "product_id",
  view: "view"
};
const ProductRecommendations = () => {
  let Swiper = window.themeCore.utils.Swiper;
  let sections = [];
  const init = async (sectionId) => {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    const sectionsWithoutMarkup = sections.filter((section) => section.hasAttribute(attributes.url));
    await Promise.allSettled(sectionsWithoutMarkup.map(updateMarkup));
    window.themeCore.LazyLoadImages.init();
    window.themeCore.EventBus.emit("compare-products:init");
    sections.forEach(initSlider);
    sections.forEach(await function(section) {
      let recommendations = section.querySelector(selectors.content);
      initRecentlyViewed(recommendations, section);
    });
  };
  const updateMarkup = async (section) => {
    const url = section.getAttribute(attributes.url);
    const currentSlider = section.querySelector(selectors.slider);
    if (!currentSlider) {
      return;
    }
    const html = await getHTML(url, selectors.slider);
    if (!html) {
      console.log(html, "html return");
      return;
    }
    currentSlider.replaceWith(html);
  };
  const getHTML = async (url, selector) => {
    try {
      const response = await fetch(url);
      const resText = await response.text();
      let result = new DOMParser().parseFromString(resText, "text/html");
      if (selector) {
        result = result.querySelector(selector);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  const initSlider = (section) => {
    let slider = section.querySelector(selectors.slider);
    let slidesPerViewDesktop = +slider.getAttribute("data-slides-in-row") || 4;
    let paginationWrapper = slider.querySelector(selectors.paginationWrapper);
    let sliderOptions = {
      grabCursor: true,
      slidesPerView: 1,
      speed: 1200,
      pagination: {
        type: "progressbar",
        el: ".js-product-recommendations-pagination"
      },
      navigation: {
        nextEl: `.js-swiper-button-next-${section.id}`,
        prevEl: `.js-swiper-button-prev-${section.id}`
      },
      breakpoints: {
        481: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3
        },
        1200: {
          slidesPerView: slidesPerViewDesktop
        }
      },
      on: {
        init: function(swiper) {
          if (swiper.isLocked && paginationWrapper) {
            paginationWrapper.classList.add("is-hidden");
          }
        }
      }
    };
    let productsSlider = new Swiper(slider, sliderOptions);
    if (paginationWrapper) {
      productsSlider.on("lock", function(e) {
        paginationWrapper.classList.add("is-hidden");
      });
      productsSlider.on("unlock", function(e) {
        paginationWrapper.classList.remove("is-hidden");
      });
    }
  };
  async function initRecentlyViewed(recommendations, section) {
    if (!recommendations) {
      return;
    }
    let handles = localStorage.getItem("theme_recently_viewed");
    const recommendationsExist = !!recommendations.querySelector(selectors.existingProduct);
    const tabsButtonWrapper = section.querySelector(selectors.tabButtonsWrapper);
    const tabContentRecommendations = section.querySelector("[data-tab-content='tab-panel-recommendations']");
    const tabContentRecentlyViewed = section.querySelector("[data-tab-content='tab-panel-recently-viewed']");
    if (!handles) {
      if (!recommendationsExist) {
        section.remove();
      }
      return recommendations;
    }
    if (!recommendationsExist && tabsButtonWrapper) {
      tabsButtonWrapper.classList.add("is-hidden");
    }
    try {
      handles = JSON.parse(handles);
      if (window.location.href.includes("/products/")) {
        const url = new URL(window.location.href);
        const pathname = url.pathname;
        const trimmedPathname = pathname.startsWith("/") ? pathname.substring(1) : pathname;
        const currentHandle = trimmedPathname.split("/").pop();
        handles = handles.filter((handle) => handle !== currentHandle);
      }
      handles = handles.slice(-1 * 20);
      if (!handles.length) {
        if (tabsButtonWrapper) {
          tabsButtonWrapper.classList.add("is-hidden");
        }
        if (!recommendationsExist) {
          section.remove();
        }
        return recommendations;
      }
      const productCards = (await getProductCards(handles)).map((promise) => promise.value).filter(Boolean).slice(-1 * 20);
      if (!productCards.length) {
        if (!recommendationsExist) {
          section.remove();
        }
        return recommendations;
      }
      const productCols = productCards.map((card) => getWrappedProductCard(card, section));
      const recommendationsViewedContent = recommendations.querySelector(selectors.viewedContent);
      if (!recommendationsViewedContent && !recommendationsExist) {
        section.remove();
      }
      if (recommendationsViewedContent) {
        recommendationsViewedContent.innerHTML = productCols.reduce((acc, col) => acc += col.outerHTML, "");
        window.themeCore.LazyLoadImages.init();
        let slider = section.querySelector(".js-recently-viewed-products-slider");
        let paginationWrapper = slider.querySelector(".js-product-recently-viewed-pagination-wrapper");
        let slidesPerViewDesktop = section.getAttribute("data-slides-in-row") || 4;
        let sliderOptions = {
          grabCursor: true,
          slidesPerView: 1,
          speed: 1200,
          pagination: {
            type: "progressbar",
            el: ".js-product-recently-viewed-pagination"
          },
          navigation: {
            nextEl: slider.querySelector(".js-swiper-button-next"),
            prevEl: slider.querySelector(".js-swiper-button-prev")
          },
          breakpoints: {
            481: {
              slidesPerView: 2
            },
            768: {
              slidesPerView: 3
            },
            1200: {
              slidesPerView: +slidesPerViewDesktop
            }
          },
          on: {
            init: function(swiper) {
              if (swiper.isLocked && paginationWrapper) {
                paginationWrapper.classList.add("is-hidden");
              }
            }
          }
        };
        let recentlyViewedProductsSlider = new Swiper(slider, sliderOptions);
        if (paginationWrapper) {
          recentlyViewedProductsSlider.on("lock", function(e) {
            paginationWrapper.classList.add("is-hidden");
          });
          recentlyViewedProductsSlider.on("unlock", function(e) {
            paginationWrapper.classList.remove("is-hidden");
          });
        }
        if (!recommendationsExist) {
          tabContentRecommendations.classList.remove("active");
          tabContentRecentlyViewed.classList.add("active");
        }
        return recommendations;
      }
    } catch (e) {
      console.log(e);
      return recommendations;
    }
    return recommendations;
  }
  async function getProductCards(handles) {
    return await Promise.allSettled(handles.map((handle) => getProductCard(handle)));
  }
  async function getProductCard(handle) {
    let url = new URL(`${window.location.origin}${window.themeCore.objects.routes.root_url}/products/${handle}`);
    url.searchParams.set(PARAMS.view, "card");
    return await fetch(url.toString()).then((response) => {
      if (!response.ok) {
        return false;
      }
      return response.text();
    }).then((response) => {
      if (!response) {
        return false;
      }
      const html = document.createElement("div");
      html.innerHTML = response;
      const productCard = html.querySelector(selectors.productCard);
      if (!productCard) {
        return false;
      }
      return html.querySelector(selectors.productCard);
    }).catch((e) => {
      console.error(e);
    });
  }
  function getWrappedProductCard(productCard, section) {
    const html = document.createElement("div");
    html.innerHTML = `
			<div class="featured-products__col swiper-slide featured-products__col--${section.getAttribute("data-slides-in-row")}">
				${productCard.outerHTML}
			</div>
		`;
    return html.querySelector(".featured-products__col");
  }
  return Object.freeze({
    init
  });
};
export {
  ProductRecommendations as P
};
