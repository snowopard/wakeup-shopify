const selectors = {
  section: ".js-article",
  submitButton: ".js-submit-comment",
  articleCommentsForm: ".js-article-form"
};
const CustomersArticleTemplate = () => {
  function init() {
    const sections = document.querySelectorAll(selectors.section);
    sections.forEach((section) => {
      const submitButton = section.querySelector(selectors.submitButton);
      submitButton.addEventListener("click", () => {
        const form = section.querySelector(selectors.articleCommentsForm);
        form.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      });
    });
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.CustomersArticleTemplate = window.themeCore.CustomersArticleTemplate || CustomersArticleTemplate();
  window.themeCore.utils.register(window.themeCore.CustomersArticleTemplate, "article-template");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
