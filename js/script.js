"use strict";

// Load different functions in as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsapOpeningHomeAnimations();
  gsapScrollAnimations();
  resetHomeLoadedClass();
});

///////////////////////////////////////////////////////////* Swup page navigation *////////////////////////////////////////////////////////////////////////////////////////*

const swup = new Swup();

swup.hooks.on("page:view", () => {
  updateActiveNavLink();
  initGlide();
  initPerformanceObservers();
  initServicesHeadingObserver();
  setTimeout(() => ScrollTrigger.refresh(true), 300);

  setTimeout(() => {
    gsapScrollAnimations();
  }, 1000);
});

//////////////////////////////////////////////////////* Change opening hero animation classes *////////////////////////////////////////////////////////////////////////*

function gsapOpeningHomeAnimations() {
  return;
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.5,
  });

  tl.fromTo("#pg1-hero", { opacity: 0 }, { opacity: 1, duration: 0.3 })

    // Hero heading slides in from left
    .from("#hero-heading", { x: -230, opacity: 0, duration: 1.5 }, "+=0.3")

    // Hero text follows quickly
    .from(".hero-text", { x: 230, opacity: 0, duration: 1.5 }, "-=0.8")

    // Topper heading from the right
    .from(
      ".cmp-topper-heading--pg1-hero",
      { opacity: 0, duration: 2.5 },
      "-=0.4"
    )

    // Buttons fade in together
    .from(".cmp-main-btn--pg1-hero", { opacity: 0, duration: 3 }, "-=2")

    // Header slides in from the right at the end
    .from(".home-header", { x: 1600, opacity: 0, duration: 4 }, "-=5");
}

function resetHomeLoadedClass() {
  if (!document.body.classList.contains("home")) {
    document.body.classList.add("loaded");
    return;
  }

  setTimeout(() => {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }, 6000);
}
////////////////////////////////////////////////////////////* GSAP scrolling animations *////////////////////////////////////////////////////////////////////////////////*

function gsapScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  ScrollTrigger.defaults({ markers: true }); // Enable markers to show where the scroller starts and ends while planning

  const animatedElements = document.querySelectorAll("[data-animate]");

  animatedElements.forEach((el) => {
    const animationType = el.dataset.animate;
    const isReversible = el.hasAttribute("data-reversible");
    const noScrub = el.hasAttribute("data-no-scrub");
    let animProps = { opacity: 0, duration: 1, ease: "power3.out" };

    switch (animationType) {
      case "slide-up":
        animProps = { ...animProps, y: 150 };
        break;
      case "slide-down":
        animProps = { ...animProps, y: -150 };
        break;
      case "slide-left":
        animProps = { ...animProps, x: -150 };
        break;
      case "slide-right":
        animProps = { ...animProps, x: 150 };
        break;
      case "slide-up-fast":
        animProps = { ...animProps, y: 150, duration: 0.25 };
        break;
      case "slide-down-fast":
        animProps = { ...animProps, y: -150, duration: 0.25 };
        break;
      case "slide-left-fast":
        animProps = { ...animProps, x: -150, duration: 0.25 };
        break;
      case "slide-right-fast":
        animProps = { ...animProps, x: 150, duration: 0.25 };
        break;
      case "fade-in":
      default:
        animProps = { ...animProps, duration: 1 };
        break;
    }

    gsap.from(el, {
      ...animProps,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "top 40%",
        scrub: noScrub ? false : 0.5,
        once: isReversible ? false : true,
        toggleActions: isReversible
          ? "play none none reverse"
          : "play none none none",
      },
    });
  });

  ScrollTrigger.refresh(true);
}

////////////////////////////////////////////////////////* Performance section scroll animation *////////////////////////////////////////////////////////////////////////*

function initPerformanceObservers() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const blocks = document.querySelectorAll(
    ".performance-text-block__inner-flex"
  );

  if (prefersReducedMotion) {
    blocks.forEach((block) => block.classList.add("visible"));
    return;
  }

  const PerformanceObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.7,
    }
  );

  blocks.forEach((block) => PerformanceObserver.observe(block));
}

initPerformanceObservers();

//////////////////////////////////////////////////////////////////* Testimonial Carousel */////////////////////////////////////////////////////////////////////////////*

const glideElement = document?.querySelector(".glide");

function initGlide() {
  const glideElement = document?.querySelector(".glide");

  if (glideElement) {
    const glide = new Glide(".glide", {
      type: "carousel",
      autoplay: 10000,
      hoverpause: true,
    });

    glide.on(["mount.after", "run"], () => {
      const slides = document.querySelectorAll(".glide__slide");
      const bullets = document.querySelectorAll(".glide__bullet");
      const currentIndex = glide.index;

      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.setAttribute("aria-hidden", !isActive);
        slide.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      bullets.forEach((bullet, i) => {
        bullet.setAttribute(
          "aria-selected",
          i === currentIndex ? "true" : "false"
        );
      });
    });

    glide.mount();
  }
}

initGlide();

//////////////////////////////////////////////////////////* Our services page heading underline draw *//////////////////////////////////////////////////////////////////*

function initServicesHeadingObserver() {
  const headings = document?.querySelectorAll(".services-page-sub-heading");

  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.7, rootMargin: "0px 0px -100px 0px" }
  );

  headings.forEach((h) => observer.observe(h));
}

initServicesHeadingObserver();

//////////////////////////////////////////////////////////////* Footer copyright-year update *////////////////////////////////////////////////////////////////////////*

const currentYear = new Date().getFullYear();
const copyrightSymbol = "\u00A9";

document.getElementById(
  "year"
).innerHTML = `<strong>${copyrightSymbol} Copyright ${currentYear}</strong>`;

/////////////////////////////////////////////////////////////* Navigation links and hamburger menu *////////////////////////////////////////////////////////////////////////*

const hamburgerBtn = document.querySelector(".hamburger-btn");
const navBar = document.querySelector(".nav-bar");
const navBarList = document.querySelector(".nav-bar ul");
const navBarLinks = document.querySelectorAll(".nav-bar a");
let isAnimating = false;

hamburgerBtn.addEventListener("click", () => {
  if (isAnimating) return;

  const isOpen = navBar.classList.contains("hamburger-btn__open");

  if (isOpen) {
    isAnimating = true;
    hamburgerBtn.classList.remove("active");
    navBar.classList.remove("hamburger-btn__open");
  } else {
    navBar.style.display = "block";
    requestAnimationFrame(() => {
      isAnimating = true;
      hamburgerBtn.classList.add("active");
      navBar.classList.add("hamburger-btn__open");
    });
  }

  setNavAttributes();

  setTimeout(() => {
    isAnimating = false;
  }, 800);
});

navBar.addEventListener("transitionend", (e) => {
  if (e.propertyName !== "transform") return;

  isAnimating = false;
});

document.addEventListener("click", (e) => {
  if (
    !navBar.classList.contains("hamburger-btn__open") ||
    e.target === navBar ||
    e.target === hamburgerBtn ||
    e.target === navBarList
  )
    return;

  isAnimating = true;
  navBar.classList.remove("hamburger-btn__open");
  hamburgerBtn.classList.remove("active");

  setNavAttributes();
});

function setNavAttributes() {
  const navBarHasActiveClass = navBar.classList.contains("hamburger-btn__open");

  if (!navBarHasActiveClass && navBar.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  navBar.setAttribute("aria-hidden", String(!navBarHasActiveClass));
  hamburgerBtn.setAttribute("aria-expanded", String(navBarHasActiveClass));

  navBarLinks.forEach((link) => {
    link.tabIndex = navBarHasActiveClass ? 0 : -1;
  });
}

//////////////////////////////////////////////////////////////////* Show the current page *////////////////////////////////////////////////////////////////////////*

function updateActiveNavLink() {
  const navBarLinks = document.querySelectorAll(".nav-bar a");
  const currentPath = window.location.pathname;

  navBarLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.classList.add("active-link");

      requestAnimationFrame(() => {
        link.classList.add("animate-underline");
      });
    } else {
      link.classList.remove("active-link", "animate-underline");
    }
  });
}

updateActiveNavLink();

////////////////////////////////////////////////////////* Prevent navigation transitions happening on resize *////////////////////////////////////////////////////////////////////////*

let resizeTimeout;

window.addEventListener("resize", () => {
  navBar.classList.add("no-transition");

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    navBar.classList.remove("no-transition");
  }, 1);
});

///////////////////////////////////////////////////////////////* Sticky navigation bar *//////////////////////////////////////////////////////////////////////////////*

/* const header = document.querySelector("#header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    header.classList.add("sticking");
  } else if (window.scrollY === 0) {
    header.classList.remove("sticking");
  }
}); */

window.addEventListener("scroll", () => {
  const header = document.querySelector("#header");
  const isScrolled = window.scrollY > 400;
  const headerWasSticking = header.classList.contains("sticking");

  if (isScrolled && !headerWasSticking) {
    header.classList.add("sticking");
    closeMenuSafely();
  } else if (window.scrollY === 0 && headerWasSticking) {
    header.classList.remove("sticking");
    closeMenuSafely();
  }
});

function closeMenuSafely() {
  navBar.classList.remove("hamburger-btn__open");
  hamburgerBtn.classList.remove("active");
  setNavAttributes();
  isAnimating = false;
}

/////////////////////////////////////////////////////////////////* Dark-mode change */////////////////////////////////////////////////////////////////////////////////*

const darkModeButton = document.getElementById("dark-mode-toggle");

function enableDarkMode() {
  document.documentElement.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
  document.documentElement.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
}

function detectColorScheme() {
  let theme = "light";

  if (localStorage.getItem("theme")) {
    theme = localStorage.getItem("theme");
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    theme = "dark";
  }

  theme === "dark" ? enableDarkMode() : disableDarkMode();
}

detectColorScheme();

function switchTheme(newTheme) {
  newTheme === "dark" ? enableDarkMode() : disableDarkMode();
}

darkModeButton.addEventListener("click", () => {
  const isPressed = darkModeButton.getAttribute("aria-pressed") === "true";
  darkModeButton.setAttribute("aria-pressed", String(!isPressed));

  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  if (!document.startViewTransition) {
    switchTheme(newTheme);
    return;
  }

  document.startViewTransition(() => {
    switchTheme(newTheme);
  });
});
