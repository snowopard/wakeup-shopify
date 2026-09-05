const Video = (videoContainer) => {
  const Video2 = window.themeCore.utils.Video;
  const VIDEO_TYPES = window.themeCore.utils.VIDEO_TYPES;
  const cssClasses = window.themeCore.utils.cssClasses;
  const mobileSize = window.matchMedia("(max-width: 767px)");
  const selectors2 = {
    iframe: "iframe",
    videoContainer: ".js-video-section",
    startButton: ".js-video-start-button",
    videoPlaceholder: ".js-video-placeholder",
    mobileVideoPlayer: "video__player--mobile",
    section: "[data-section-id]"
  };
  const attributes2 = {
    sectionId: "data-section-id",
    type: "data-type"
  };
  const config = {
    videoContainer,
    options: {
      youtube: {
        autoplay: 0,
        controls: 1,
        showinfo: 0,
        rel: 0,
        playsinline: 1,
        loop: 0
      },
      vimeo: {
        controls: true,
        loop: false,
        muted: true,
        portrait: false,
        title: false,
        keyboard: false,
        byline: false,
        autopause: false
      }
    }
  };
  let videos;
  const startButton = videoContainer.querySelector(selectors2.startButton);
  videoContainer.querySelector(
    selectors2.videoPlaceholder
  );
  function initVideos(config2) {
    return Video2(config2).init();
  }
  function playVideo(player, type) {
    switch (type) {
      case VIDEO_TYPES.html: {
        player.play();
        break;
      }
      case VIDEO_TYPES.vimeo: {
        player.play();
        break;
      }
      case VIDEO_TYPES.youtube: {
        player.mute();
        player.playVideo();
        break;
      }
      default:
        return;
    }
  }
  function pauseVideo(video) {
    if (video.type === "youtube") {
      video.player.pauseVideo();
      return;
    }
    video.player.pause();
  }
  function startVideo(video) {
    if (window.innerWidth >= 768 && video.device === "desktop") {
      playVideo(video.player, video.type);
    }
    if (window.innerWidth < 768 && video.device === "mobile") {
      playVideo(video.player, video.type);
    }
    startButton == null ? void 0 : startButton.classList.add("hide");
    video.videoWrapper.classList.add(cssClasses.active);
  }
  function setEventListeners(videoContainer2, video) {
    videoContainer2.addEventListener("click", (event) => {
      if (event.target.closest(selectors2.startButton) || event.target.closest(selectors2.videoPlaceholder)) {
        startVideo(video);
      }
    });
    mobileSize.addEventListener("change", () => {
      if (video.type === "html") {
        if (video.device === "mobile" && !mobileSize.matches) {
          video.player.pause();
        }
        if (video.device === "desktop" && mobileSize.matches) {
          video.player.pause();
        }
      }
      if (video.type === "vimeo") {
        if (video.device === "mobile" && !mobileSize.matches) {
          video.player.pause();
        }
        if (video.device === "desktop" && mobileSize.matches) {
          video.player.pause();
        }
      }
      if (video.type === "youtube") {
        if (video.device === "mobile" && !mobileSize.matches) {
          video.player.pauseVideo();
        }
        if (video.device === "desktop" && mobileSize.matches) {
          video.player.pauseVideo();
        }
      }
      const section = video.videoWrapper.closest(selectors2.section);
      if (!section) {
        return;
      }
      const type = section.getAttribute(attributes2.type);
      if (type !== "popup") {
        return;
      }
      startVideo(video);
    });
  }
  async function init() {
    videos = initVideos(config);
    if (videos && videos.length) {
      videos.forEach((video) => {
        setEventListeners(videoContainer, video);
        const section = video.videoWrapper.closest(selectors2.section);
        if (!section) {
          return;
        }
        const sectionId = section.getAttribute(attributes2.sectionId);
        const type = section.getAttribute(attributes2.type);
        if (type !== "popup") {
          return;
        }
        window.themeCore.EventBus.listen(`Toggle:video-${sectionId}:open`, (target) => {
          window.setTimeout(() => {
            if (!target.contains(video.videoWrapper) || getComputedStyle(video.videoWrapper).getPropertyValue("display") === "none") {
              return;
            }
            startVideo(video);
          }, 0);
        });
        window.themeCore.EventBus.listen(`Toggle:video-${sectionId}:close`, (target) => {
          if (!target.contains(video.videoWrapper)) {
            return;
          }
          pauseVideo(video);
        });
      });
    }
  }
  return Object.freeze({
    init
  });
};
const selectors = {
  section: ".js-video-section",
  videoItem: ".js-video-item",
  videoContainerPopup: ".js-video-container",
  videoContainerFirst: ".js-video-container-first",
  videoContainerSecond: ".js-video-container-second",
  mediaPopupContent: ".js-media-popup-content",
  videoPopup: ".js-video-popup",
  close: ".js-popup-close-icon-button",
  video: ".js-video",
  videoMediaContainer: ".js-video-media-container",
  decor: ".js-video-decor"
};
const attributes = {
  sectionId: "data-section-id",
  sectionVideoType: "data-type"
};
const VideoSectionPlayer = () => {
  const Toggle = window.themeCore.utils.Toggle;
  const cssClasses = window.themeCore.utils.cssClasses;
  let sections = [];
  let componentsList = {};
  function createComponents(Component, selector) {
    return sections.filter((section) => section.querySelector(selector)).map((section) => {
      const componentNode = section.querySelector(selector);
      const sectionId = section.getAttribute(attributes.sectionId);
      const videoPopups = [...section.querySelectorAll(selectors.videoPopup)];
      const videos = [...section.querySelectorAll(selectors.video)];
      if (videoPopups.length > 0) {
        const videoPopupToggle = Toggle({
          toggleSelector: `video-${sectionId}`
        });
        videoPopupToggle.init();
        videoPopups.forEach((videoPopup) => {
          videoPopup.addEventListener("click", (event) => {
            const targetPopup = event.target;
            if (targetPopup === videoPopup || targetPopup.closest(selectors.close)) {
              setTimeout(() => {
                const videoMediaContainer = [...videoPopup.querySelectorAll(selectors.videoMediaContainer)];
                videoMediaContainer.forEach((container) => {
                  if (!container.classList.contains(cssClasses.hidden)) {
                    container.classList.add(cssClasses.hidden);
                  }
                });
                videos.forEach((video) => {
                  if (!video.classList.contains(cssClasses.hidden)) {
                    video.classList.add(cssClasses.hidden);
                  }
                });
              }, 800);
              videoPopupToggle.close(videoPopup);
              section.classList.remove(cssClasses.imageMoveDisabled);
            }
          });
        });
      }
      return Component(componentNode);
    });
  }
  function handlerPopupVideo(section) {
    const videoItems = [...section.querySelectorAll(selectors.videoItem)];
    const videoMediaContainer = [...section.querySelectorAll(selectors.videoMediaContainer)];
    if (videoItems.length > 0) {
      videoItems.forEach((item, index) => {
        item.addEventListener("click", function() {
          const videos = videoMediaContainer[index].querySelectorAll(selectors.video);
          section.classList.add(cssClasses.imageMoveDisabled);
          videoMediaContainer[index].classList.remove(cssClasses.hidden);
          if (videos.length > 0) {
            videos.forEach((video) => {
              video.classList.remove(cssClasses.hidden);
            });
          }
        });
      });
    }
  }
  function removeDecor(section) {
    const videos = section.querySelectorAll(selectors.video);
    const sectionType = section.getAttribute(attributes.sectionVideoType);
    if (sectionType === "popup") {
      return;
    }
    const observer = new MutationObserver((mutationsList, observer2) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const video = mutation.target;
          let decorSelector = null;
          if (video.closest(selectors.videoContainerFirst)) {
            decorSelector = `${selectors.videoContainerFirst}${selectors.decor}`;
          } else if (video.closest(selectors.videoContainerSecond)) {
            decorSelector = `${selectors.videoContainerSecond}${selectors.decor}`;
          }
          if (decorSelector) {
            const decor = section.querySelector(decorSelector);
            if (decor) {
              decor.classList.add(cssClasses.hidden);
            }
          }
        }
      });
    });
    videos.forEach((video) => {
      observer.observe(video, { attributes: true, attributeFilter: ["class"] });
    });
  }
  function init(sectionId) {
    sections = [...document.querySelectorAll(selectors.section)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    sections.forEach((section) => {
      handlerPopupVideo(section);
      removeDecor(section);
    });
    componentsList = {
      VideoFirst: createComponents(Video, selectors.videoContainerFirst),
      VideoSecond: createComponents(Video, selectors.videoContainerSecond),
      VideoPopup: createComponents(Video, selectors.videoContainerPopup)
    };
    for (const list in componentsList) {
      componentsList[list].forEach((component) => component.init());
    }
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.VideoSectionPlayer = window.themeCore.VideoSectionPlayer || VideoSectionPlayer();
  window.themeCore.utils.register(window.themeCore.VideoSectionPlayer, "video");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
