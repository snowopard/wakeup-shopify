const selectors = {
  ageVerifierPopup: "age-verifier-popup",
  ageVerifierPopupToggle: "ageVerifierPopupToggle",
  confirmButton: ".js-age-verifier-popup-confirm"
};
const AgeVerifierPopup = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const on = window.themeCore.utils.on;
  const setCookie = window.themeCore.utils.setCookie;
  const getCookie = window.themeCore.utils.getCookie;
  let ageVerifierPopup;
  let redirectURL;
  let ageVerifierPopupToggle;
  let preventRedirect;
  function init() {
    ageVerifierPopup = document.getElementById(selectors.ageVerifierPopup);
    if (!ageVerifierPopup) {
      return;
    }
    redirectURL = ageVerifierPopup.getAttribute("data-redirect-url");
    showageVerifierPopup();
    setEventListeners();
  }
  function showageVerifierPopup() {
    if (getCookie("age_verifier_popup")) {
      return;
    }
    ageVerifierPopupToggle = Toggle({
      toggleSelector: selectors.ageVerifierPopupToggle
    });
    window.themeCore.ageVerifierPopupOpen = true;
    ageVerifierPopupToggle.init();
    document.body.classList.add("blur-content");
    ageVerifierPopupToggle.open(ageVerifierPopup);
    on("click", ageVerifierPopup, function(e) {
      if (e.target == this) {
        ageVerifierPopupToggle.close(ageVerifierPopup);
      }
    });
    window.themeCore.EventBus.listen(`Toggle:${selectors.ageVerifierPopupToggle}:close`, () => {
      if (!preventRedirect) {
        window.location.href = redirectURL;
      }
    });
    on("keydown", (event) => {
      if (event.keyCode === 27) {
        if (!preventRedirect) {
          window.location.href = redirectURL;
        }
      }
    });
    window.addEventListener("pageshow", (event) => {
      if (!event.persisted) {
        return;
      }
      if (getCookie("age_verifier_popup")) {
        document.body.classList.remove("blur-content");
        window.themeCore.ageVerifierPopupOpen = false;
        return;
      }
      window.location.reload();
    });
  }
  function setEventListeners() {
    const confirmButton = document.querySelector(selectors.confirmButton);
    if (!confirmButton) {
      return;
    }
    confirmButton.addEventListener("click", function() {
      setPopupCookie();
      document.body.classList.remove("blur-content");
      preventRedirect = true;
      ageVerifierPopupToggle.close(ageVerifierPopup);
      window.themeCore.ageVerifierPopupOpen = false;
      window.themeCore.EventBus.emit("create:newsletter:popup");
    });
  }
  function setPopupCookie() {
    if (!ageVerifierPopup.hasAttribute("data-cookie-time")) {
      return;
    }
    let cookieTimeDay = ageVerifierPopup.dataset.cookieTime;
    let cookieTime = cookieTimeDay * 24 * 60 * 60;
    setCookie("age_verifier_popup", "1", {
      "max-age": cookieTime
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.AgeVerifierPopup = window.themeCore.AgeVerifierPopup || AgeVerifierPopup();
  window.themeCore.utils.register(window.themeCore.AgeVerifierPopup, "age-verifier-popup");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
