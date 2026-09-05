const selectors = {
  showPasswordButton: ".js-show-password"
};
const CustomersActivateTemplate = () => {
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
  window.themeCore.CustomersActivateTemplate = window.themeCore.CustomersActivateTemplate || CustomersActivateTemplate();
  window.themeCore.utils.register(window.themeCore.CustomersActivateTemplate, "activate-account");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
