const selectors = {
  section: ".js-limited-edition",
  button: ".js-tab-button",
  product: ".js-limited-edition-product",
  form: ".js-limited-edition-form",
  image: ".js-limited-edition-image-wrapper",
  price: ".js-limited-edition-price",
  productLink: ".js-limited-edition-link",
  status: ".js-limited-edition-status",
  fetchPrice: ".price",
  formError: ".js-limited-edition-error",
  formButton: ".js-limited-edition-submit-button",
  submitText: ".js-limited-edition-submit-text",
  variantElemJSON: "[data-selected-variant]",
  variantId: "[name='id']",
  productOptionsContainer: ".js-le-product-options"
};
const attributes = {
  status: "data-status",
  swatchPosition: "data-swatch-position"
};
const cachedOptions = /* @__PURE__ */ new Map();
let fetchController = new AbortController();
let prefetchController = new AbortController();
const LimitedEdition = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const buttonContent = {};
  let form = null;
  let currentVariant = null;
  let hiddenVariantInput = null;
  let formButtons = null;
  let formError = null;
  let productLink = null;
  let price = null;
  let productHandle = null;
  let convertFormData = null;
  function init() {
    const sections = [...document.querySelectorAll(selectors.section)];
    convertFormData = window.themeCore.utils.convertFormData;
    buttonContent.addToCard = buttonContent.addToCard || window.themeCore.translations.get("products.product.add_to_cart");
    buttonContent.preOrder = buttonContent.preOrder || window.themeCore.translations.get("products.product.pre_order");
    buttonContent.soldOut = buttonContent.soldOut || window.themeCore.translations.get("products.product.sold_out");
    buttonContent.unavailable = buttonContent.unavailable || window.themeCore.translations.get("products.product.unavailable");
    sections.forEach((section) => {
      const tabButtons = section.querySelectorAll(selectors.button);
      const products = section.querySelectorAll(selectors.product);
      const activeTabIndex = [...tabButtons].findIndex((btn) => btn.classList.contains(cssClasses.active));
      products.forEach((product, productIndex) => {
        if (activeTabIndex !== productIndex)
          return;
        setProductState(product);
        getCurrentVariantInfo(product);
      });
      tabButtons.forEach((tabButton, tabIndex) => {
        tabButton.addEventListener("click", () => {
          products.forEach((product, productIndex) => {
            product.classList.toggle(cssClasses.active, tabIndex === productIndex);
            if (tabIndex !== productIndex)
              return;
            setProductState(product);
            getCurrentVariantInfo(product);
          });
        });
      });
      section.addEventListener("submit", formSubmitHandler);
      section.addEventListener("change", (event) => {
        const product = event.target.closest(selectors.product);
        productHandle = product.getAttribute("data-product-handle");
        formChangeHandler(event);
      });
    });
  }
  function setProductState(product) {
    hiddenVariantInput = product.querySelector(selectors.variantId);
    formButtons = [...product.querySelectorAll(selectors.formButton)];
    formError = product.querySelector(selectors.formError);
    price = [...product.querySelectorAll(selectors.price)];
    productLink = product.querySelector(selectors.productLink);
  }
  async function getCurrentVariantInfo(currentProduct, target = currentProduct) {
    const currentForm = target.closest(selectors.form);
    if (!currentForm || !currentProduct) {
      return;
    }
    if (!target || !target.hasAttribute("data-option")) {
      return;
    }
    const productOptionsContainer = currentForm.querySelector(selectors.productOptionsContainer);
    if (!productOptionsContainer) {
      return;
    }
    const selectedOptionValues = Array.from(
      productOptionsContainer.querySelectorAll("select[data-option] option[selected], input[data-option]:checked")
    ).map(({ dataset }) => dataset.optionValueId);
    const sectionId = currentProduct.getAttribute("data-section-id");
    const productUrl = currentProduct.getAttribute("data-url");
    productHandle = currentProduct.getAttribute("data-product-handle");
    const params = selectedOptionValues.length > 0 ? `&option_values=${selectedOptionValues.join(",")}` : "";
    const url = `${productUrl}?section_id=${sectionId}${params}`;
    let responseText;
    const cachedResult = cachedOptions.get(url);
    if (cachedResult) {
      responseText = cachedResult;
    } else {
      try {
        fetchController.abort();
        fetchController = new AbortController();
        responseText = await (await fetch(url, {
          signal: fetchController.signal
        })).text();
        cachedOptions.set(url, responseText);
      } catch {
        return;
      }
    }
    prefetchOptions(currentForm);
    const fetchSectionDOM = new DOMParser().parseFromString(responseText, "text/html");
    const fetchCurrentProductDOM = fetchSectionDOM.querySelector(`.js-limited-edition-product[data-product-handle=${productHandle}]`);
    productOptionsContainer.innerHTML = fetchCurrentProductDOM.querySelector(selectors.productOptionsContainer).innerHTML;
    form = currentForm;
    currentVariant = findCurrentVariant(form);
    if (document.querySelector(`#${target.id}`)) {
      document.querySelector(`#${target.id}`).focus();
    }
    updateButtons();
    updateSwatchLabelName(currentVariant, form);
    updateStatus(currentVariant, currentProduct);
    if (!currentVariant) {
      hidePrice();
      return;
    }
    setCurrentVariant(currentVariant.id);
    updatePrice(fetchCurrentProductDOM);
    updateImage(currentProduct);
  }
  function formChangeHandler(event) {
    const product = event.target.closest(selectors.product);
    setProductState(product);
    getCurrentVariantInfo(product, event.target);
  }
  async function formSubmitHandler(event) {
    const form2 = event.target.closest(selectors.form);
    const formData = form2 && new FormData(form2);
    if (!formData) {
      return;
    }
    event.preventDefault();
    currentVariant = findCurrentVariant(form2);
    const errorMessage = await addToCart(event.target);
    changeErrorMessage(errorMessage);
  }
  async function addToCart(target) {
    const formData = new FormData(target);
    const serialized = convertFormData(formData);
    try {
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.ADD_TO_CART, serialized);
      await window.themeCore.CartApi.makeRequest(window.themeCore.CartApi.actions.GET_CART);
    } catch (error) {
      return error.message;
    }
  }
  function changeErrorMessage(message = "") {
    formError.innerText = message;
  }
  function updateSwatchLabelName(variant, container) {
    const swatchNameElements = container.querySelectorAll(".js-swatch-label-name");
    swatchNameElements.forEach((swatchNameEl) => {
      if (!swatchNameEl) {
        return;
      }
      if (!variant) {
        const swatchPosition = swatchNameEl.getAttribute(attributes.swatchPosition);
        const swatchOptionSelected = container.querySelector(`[data-option='option${swatchPosition}']:checked`);
        if (swatchOptionSelected) {
          swatchNameEl.textContent = swatchOptionSelected.value;
        }
        return;
      }
      const optionPosition = swatchNameEl.getAttribute(attributes.swatchPosition);
      const optionLabel = "option" + optionPosition;
      const optionName = variant[optionLabel];
      if (!optionName) {
        return;
      }
      swatchNameEl.textContent = optionName;
    });
  }
  function updateImage(section) {
    const images = section.querySelectorAll(selectors.image);
    if (!currentVariant || !currentVariant.featured_media || !images.length) {
      return;
    }
    images.forEach((image) => {
      const isActive = +image.getAttribute("data-img-id") === currentVariant.featured_media.id;
      image.classList.toggle(cssClasses.active, isActive);
    });
  }
  function updateStatus(variant, section) {
    let status = "in-stock";
    if (!variant) {
      status = "unavailable";
    } else if (!variant.available) {
      status = "sold-out";
    }
    const statusElement = section.querySelector(selectors.status);
    if (!statusElement) {
      return;
    }
    statusElement.setAttribute(attributes.status, status);
  }
  function findCurrentVariant(container) {
    if (!container) {
      return;
    }
    const variantJSONElement = container.querySelector(selectors.variantElemJSON);
    const currentVariant2 = !!variantJSONElement ? JSON.parse(variantJSONElement.innerHTML) : null;
    return currentVariant2;
  }
  function updateButtons() {
    if (!formButtons.length || !productLink) {
      return;
    }
    if (!currentVariant) {
      formButtons.forEach((button) => {
        const text = button.querySelector(selectors.submitText);
        if (text) {
          text.innerText = buttonContent.unavailable;
        }
        button.disabled = true;
      });
      return;
    }
    let isPreorder = formButtons[0].hasAttribute("data-preorder");
    let addToCartText = isPreorder ? buttonContent.preOrder : buttonContent.addToCard;
    formButtons.forEach((button) => {
      const text = button.querySelector(selectors.submitText);
      if (text) {
        text.innerText = currentVariant.available ? addToCartText : buttonContent.soldOut;
      }
      button.disabled = !currentVariant.available;
    });
    const url = new URL(productLink.href);
    url.searchParams.set("variant", currentVariant.id);
    productLink.href = url.pathname + url.search;
  }
  function hidePrice() {
    price.forEach((priceElement) => priceElement.innerHTML = "");
  }
  function setCurrentVariant(variantId) {
    if (!variantId || !hiddenVariantInput) {
      return;
    }
    hiddenVariantInput.value = variantId;
  }
  function updatePrice(sectionDOM) {
    if (!sectionDOM) {
      return;
    }
    let newPrice = sectionDOM.querySelector(selectors.price);
    if (!newPrice) {
      return;
    }
    let newPriceInner = newPrice.querySelector(".js-price");
    if (!newPriceInner) {
      return;
    }
    price.forEach((priceElement) => priceElement.innerHTML = newPriceInner.outerHTML);
  }
  function transformOptionsToVariants(options) {
    const groupedOptions = options.reduce((acc, option) => {
      if (!acc[option.name]) {
        acc[option.name] = [];
      }
      acc[option.name].push(option);
      return acc;
    }, {});
    const optionTypes = Object.values(groupedOptions);
    function cartesianProduct(arrays) {
      return arrays.reduce((acc, curr) => {
        const result = [];
        acc.forEach((a) => {
          curr.forEach((c) => {
            result.push([...a, c]);
          });
        });
        return result;
      }, [[]]);
    }
    const combinations = cartesianProduct(optionTypes);
    const variants = combinations.map((combination) => {
      return {
        option_values: combination.map((opt) => opt.value).join(","),
        selected: combination.every((opt) => opt.selected),
        options: combination
      };
    });
    return variants;
  }
  function sortVariantsByProximity(variants) {
    const selectedVariant = variants.find((v) => v.selected);
    if (!selectedVariant) {
      return variants;
    }
    const selectedValues = selectedVariant.options.map((opt) => opt.value);
    return variants.sort((a, b) => {
      const aMatches = a.options.filter((opt) => selectedValues.includes(opt.value)).length;
      const bMatches = b.options.filter((opt) => selectedValues.includes(opt.value)).length;
      const aDistance = selectedValues.length - aMatches;
      const bDistance = selectedValues.length - bMatches;
      if (aDistance !== bDistance) {
        return aDistance - bDistance;
      }
      return 0;
    });
  }
  async function fetchUrl(url) {
    const response = await fetch(url, {
      signal: prefetchController.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }
  async function prefetchOptions(form2) {
    const productOptionsContainer = form2.querySelector(selectors.productOptionsContainer);
    if (!productOptionsContainer) {
      return;
    }
    const productSection = form2.querySelector(selectors.product);
    if (!productSection) {
      return;
    }
    const sectionId = productSection.getAttribute("data-section-id");
    const productUrl = productSection.getAttribute("data-url");
    const allOptions = Array.from(
      productOptionsContainer.querySelectorAll("select[data-option] option, input[data-option]")
    ).map((item) => {
      var _a, _b;
      return {
        name: item.dataset.option || ((_b = (_a = item.closest("select")) == null ? void 0 : _a.dataset) == null ? void 0 : _b.option),
        value: item.dataset.optionValueId,
        selected: item.matches("[selected], :checked")
      };
    });
    const variants = transformOptionsToVariants(allOptions);
    const sortedVariants = sortVariantsByProximity(variants);
    const filteredVariants = sortedVariants.filter((variant) => !Array.from(cachedOptions.keys()).some((key) => key.includes(variant.option_values)));
    const variantsToFetch = filteredVariants.slice(0, 20);
    const urlsToFetch = variantsToFetch.map(({ option_values }) => `${productUrl}?section_id=${sectionId}&option_values=${option_values}`);
    prefetchController.abort();
    prefetchController = new AbortController();
    const fetchPromises = urlsToFetch.map((url) => fetchUrl(url));
    const results = await Promise.allSettled(fetchPromises);
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const url = urlsToFetch[index];
        cachedOptions.set(url, result.value);
      }
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.LimitedEdition = window.themeCore.LimitedEdition || LimitedEdition();
  window.themeCore.utils.register(window.themeCore.LimitedEdition, "limited-edition");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
