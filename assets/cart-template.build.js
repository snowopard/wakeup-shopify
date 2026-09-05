import { C as Cart } from "./cart-790768c4.js";
const action = () => {
  window.themeCore.Cart = window.themeCore.Cart || Cart();
  window.themeCore.utils.register(window.themeCore.Cart, "cart-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
