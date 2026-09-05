const selectors = {
  showPasswordButton: ".js-show-password"
};
const CustomersRegisterTemplate = () => {
  function init() {
    document.addEventListener("click", (event) => {
      const showPasswordButton = event.target.closest(selectors.showPasswordButton);
      if (!showPasswordButton)
        return;
      showPasswordButton.classList.toggle("active");
      const passwordInput = showPasswordButton.parentElement.querySelector("input");
      if (!passwordInput)
        return;
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CustomersRegisterTemplate = window.themeCore.CustomersRegisterTemplate || CustomersRegisterTemplate();
  window.themeCore.utils.register(window.themeCore.CustomersRegisterTemplate, "register-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
