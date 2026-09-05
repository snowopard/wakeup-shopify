import { P as ProductRecommendations } from "./product-recommendations-c9f8c5e7.js";
const action = () => {
  window.themeCore.FeaturedProducts = window.themeCore.FeaturedProducts || ProductRecommendations();
  window.themeCore.utils.register(window.themeCore.FeaturedProducts, "product-recommendations");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
