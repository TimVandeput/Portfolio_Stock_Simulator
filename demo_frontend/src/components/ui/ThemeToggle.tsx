"use client";

import { useState, useEffect } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      applyDarkTheme();
    }
  }, []);

  // ==============================
  // TRANSITION CONTROL
  // ==============================

  const disableTransitions = () => {
    const loginCards = document.querySelectorAll(".login-card");
    loginCards.forEach((card) => {
      (card as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const neumorphicButtons = document.querySelectorAll(".neumorphic-button");
    neumorphicButtons.forEach((button) => {
      (button as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const roleSelectorButtons = document.querySelectorAll(
      ".role-selector-button"
    );
    roleSelectorButtons.forEach((button) => {
      (button as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const neumorphicInputs = document.querySelectorAll(".neumorphic-input");
    neumorphicInputs.forEach((input) => {
      (input as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const passwordInputs = document.querySelectorAll(".password-input");
    passwordInputs.forEach((input) => {
      (input as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const passwordToggleButtons = document.querySelectorAll(
      ".password-toggle-button"
    );
    passwordToggleButtons.forEach((button) => {
      (button as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const desktopNavButtons = document.querySelectorAll(".desktop-nav-button");
    desktopNavButtons.forEach((button) => {
      (button as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const hamburgerButtons = document.querySelectorAll(".hamburger-button");
    hamburgerButtons.forEach((button) => {
      (button as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });

    const mobileDrawerNavButtons = document.querySelectorAll(
      ".mobile-drawer-nav-button"
    );
    mobileDrawerNavButtons.forEach((button) => {
      (button as HTMLElement).style.setProperty(
        "transition",
        "none",
        "important"
      );
    });
  };

  const enableTransitions = () => {
    const loginCards = document.querySelectorAll(".login-card");
    loginCards.forEach((card) => {
      (card as HTMLElement).style.removeProperty("transition");
    });

    const neumorphicButtons = document.querySelectorAll(".neumorphic-button");
    neumorphicButtons.forEach((button) => {
      (button as HTMLElement).style.removeProperty("transition");
    });

    const roleSelectorButtons = document.querySelectorAll(
      ".role-selector-button"
    );
    roleSelectorButtons.forEach((button) => {
      (button as HTMLElement).style.removeProperty("transition");
    });

    const neumorphicInputs = document.querySelectorAll(".neumorphic-input");
    neumorphicInputs.forEach((input) => {
      (input as HTMLElement).style.removeProperty("transition");
    });

    const passwordInputs = document.querySelectorAll(".password-input");
    passwordInputs.forEach((input) => {
      (input as HTMLElement).style.removeProperty("transition");
    });

    const passwordToggleButtons = document.querySelectorAll(
      ".password-toggle-button"
    );
    passwordToggleButtons.forEach((button) => {
      (button as HTMLElement).style.removeProperty("transition");
    });

    const desktopNavButtons = document.querySelectorAll(".desktop-nav-button");
    desktopNavButtons.forEach((button) => {
      (button as HTMLElement).style.removeProperty("transition");
    });

    const hamburgerButtons = document.querySelectorAll(".hamburger-button");
    hamburgerButtons.forEach((button) => {
      (button as HTMLElement).style.removeProperty("transition");
    });

    const mobileDrawerNavButtons = document.querySelectorAll(
      ".mobile-drawer-nav-button"
    );
    mobileDrawerNavButtons.forEach((button) => {
      (button as HTMLElement).style.removeProperty("transition");
    });
  };

  // ============
  // DARK THEME
  // ============

  const applyDarkTheme = () => {
    disableTransitions();

    document.body.style.background = "#2a2d3a";
    document.documentElement.style.background = "#2a2d3a";

    const main = document.querySelector("main");
    if (main) {
      main.style.background = "#2a2d3a";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.background = "linear-gradient(to bottom, #7c3aed, #2a2d3a)";
    }

    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.background = "linear-gradient(to top, #7c3aed, #2a2d3a)";
    }

    const footerText = document.querySelector("footer span") as HTMLElement;
    if (footerText) {
      footerText.style.color = "#c4b5fd";
    }

    const aboutContainer = document.querySelector(
      ".about-container"
    ) as HTMLElement;
    if (aboutContainer) {
      aboutContainer.style.background = "#2a2d3a";
    }

    const aboutCard = document.querySelector(".about-card") as HTMLElement;
    if (aboutCard) {
      aboutCard.style.background = "#2a2d3a";
      aboutCard.style.boxShadow =
        "10px 10px 15px #1e2028, -5px -5px 10px #363a4c";
    }

    const aboutTitle = document.querySelector(".about-title") as HTMLElement;
    if (aboutTitle) {
      aboutTitle.style.color = "#c4b5fd";
    }

    const aboutText = document.querySelectorAll(".about-text");
    aboutText.forEach((text) => {
      (text as HTMLElement).style.color = "#a78bfa";
    });

    const loginContainer = document.querySelector(
      ".login-container"
    ) as HTMLElement;
    if (loginContainer) {
      loginContainer.style.background = "#2a2d3a";
    }

    const loginCards = document.querySelectorAll(".login-card");
    loginCards.forEach((card) => {
      (card as HTMLElement).style.background = "#2a2d3a";
      (card as HTMLElement).style.boxShadow =
        "10px 10px 15px #1e2028, -5px -5px 10px #363a4c";
    });

    const loginTitles = document.querySelectorAll(".login-title");
    loginTitles.forEach((title) => {
      (title as HTMLElement).style.color = "#c4b5fd";
    });

    const loginLinks = document.querySelectorAll(".login-link");
    loginLinks.forEach((link) => {
      (link as HTMLElement).style.color = "#c4b5fd";
    });

    const neumorphicButtons = document.querySelectorAll(".neumorphic-button");
    neumorphicButtons.forEach((button) => {
      (button as HTMLElement).style.background = "#2a2d3a";
      (button as HTMLElement).style.color = "#c4b5fd";
      (button as HTMLElement).style.boxShadow =
        "6px 6px 12px #1e2028, -6px -6px 12px #363a4c";
    });

    const roleSelectorLightStyleElement = document.getElementById(
      "role-selector-light-theme"
    );
    if (roleSelectorLightStyleElement) {
      roleSelectorLightStyleElement.remove();
    }

    let roleSelectorDarkStyleElement = document.getElementById(
      "role-selector-dark-theme"
    );
    if (!roleSelectorDarkStyleElement) {
      roleSelectorDarkStyleElement = document.createElement("style");
      roleSelectorDarkStyleElement.id = "role-selector-dark-theme";
      document.head.appendChild(roleSelectorDarkStyleElement);
    }
    roleSelectorDarkStyleElement.textContent = `
      .role-selector-button {
        background: #2a2d3a !important;
        color: #c4b5fd !important;
        box-shadow: 3px 3px 8px #1e2028, -3px -3px 8px #363a4c !important;
      }
      .role-selector-button.bg-\\[\\#d9e6f9\\] {
        background: #3a2d4a !important;
        color: #e4d5ff !important;
        box-shadow: inset 2px 2px 5px #1e2028, inset -2px -2px 5px #363a4c !important;
      }
      .role-selector-title {
        color: #c4b5fd !important;
      }
    `;

    let neumorphicButtonStyleElement = document.getElementById(
      "neumorphic-button-active"
    );
    if (!neumorphicButtonStyleElement) {
      neumorphicButtonStyleElement = document.createElement("style");
      neumorphicButtonStyleElement.id = "neumorphic-button-active";
      document.head.appendChild(neumorphicButtonStyleElement);
    }
    neumorphicButtonStyleElement.textContent =
      ".neumorphic-button:active { box-shadow: inset 2px 2px 5px #1e2028, inset -2px -2px 5px #363a4c !important; } .neumorphic-button:hover { background: #252831 !important; }";

    const cursorTrailDots = document.querySelectorAll(".cursor-trail-dot");
    cursorTrailDots.forEach((dot) => {
      (dot as HTMLElement).style.background = "#c4b5fd";
      (dot as HTMLElement).style.boxShadow = "0 0 6px rgba(196, 181, 253, 0.5)";
    });

    const neumorphicInputs = document.querySelectorAll(".neumorphic-input");
    neumorphicInputs.forEach((input) => {
      (input as HTMLElement).style.background = "#363a4c";
      (input as HTMLElement).style.color = "#c4b5fd";
      (input as HTMLElement).style.boxShadow =
        "inset 1px 1px 3px #1e2028, inset -1px -1px 3px #4a4f65";
    });

    let neumorphicInputStyleElement = document.getElementById(
      "neumorphic-input-focus"
    );
    if (!neumorphicInputStyleElement) {
      neumorphicInputStyleElement = document.createElement("style");
      neumorphicInputStyleElement.id = "neumorphic-input-focus";
      document.head.appendChild(neumorphicInputStyleElement);
    }
    neumorphicInputStyleElement.textContent =
      ".neumorphic-input:focus { background: #2e3142 !important; }";

    let styleElement = document.getElementById("neumorphic-input-placeholder");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "neumorphic-input-placeholder";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent =
      ".neumorphic-input::placeholder { color: #a78bfa !important; }";

    const passwordInputs = document.querySelectorAll(".password-input");
    passwordInputs.forEach((input) => {
      (input as HTMLElement).style.background = "#363a4c";
      (input as HTMLElement).style.color = "#c4b5fd";
      (input as HTMLElement).style.boxShadow =
        "inset 1px 1px 3px #1e2028, inset -1px -1px 3px #4a4f65";
    });

    let passwordInputStyleElement = document.getElementById(
      "password-input-focus"
    );
    if (!passwordInputStyleElement) {
      passwordInputStyleElement = document.createElement("style");
      passwordInputStyleElement.id = "password-input-focus";
      document.head.appendChild(passwordInputStyleElement);
    }
    passwordInputStyleElement.textContent =
      ".password-input:focus { background: #2e3142 !important; }";

    const passwordToggleButtons = document.querySelectorAll(
      ".password-toggle-button"
    );
    passwordToggleButtons.forEach((button) => {
      (button as HTMLElement).style.color = "#c4b5fd";
    });

    let passwordStyleElement = document.getElementById(
      "password-input-placeholder"
    );
    if (!passwordStyleElement) {
      passwordStyleElement = document.createElement("style");
      passwordStyleElement.id = "password-input-placeholder";
      document.head.appendChild(passwordStyleElement);
    }
    passwordStyleElement.textContent =
      ".password-input::placeholder { color: #a78bfa !important; }";

    let loginLinkStyleElement = document.getElementById("login-link-hover");
    if (!loginLinkStyleElement) {
      loginLinkStyleElement = document.createElement("style");
      loginLinkStyleElement.id = "login-link-hover";
      document.head.appendChild(loginLinkStyleElement);
    }
    loginLinkStyleElement.textContent =
      ".login-link:hover { color: #a78bfa !important; border-color: #c4b5fd !important; }";

    const desktopNavButtons = document.querySelectorAll(".desktop-nav-button");
    desktopNavButtons.forEach((button) => {
      (button as HTMLElement).style.background = "#2a2d3a";
      (button as HTMLElement).style.color = "#c4b5fd";
      (button as HTMLElement).style.boxShadow =
        "6px 6px 10px #1e2028, -5px -5px 10px #363a4c";
    });

    let desktopNavStyleElement = document.getElementById("desktop-nav-hover");
    if (!desktopNavStyleElement) {
      desktopNavStyleElement = document.createElement("style");
      desktopNavStyleElement.id = "desktop-nav-hover";
      document.head.appendChild(desktopNavStyleElement);
    }
    desktopNavStyleElement.textContent =
      ".desktop-nav-button:hover { background: #252831 !important; } .desktop-nav-button:active { box-shadow: inset 2px 2px 5px #1e2028, inset -2px -2px 5px #363a4c !important; }";

    const hamburgerButtons = document.querySelectorAll(".hamburger-button");
    hamburgerButtons.forEach((button) => {
      (button as HTMLElement).style.color = "#c4b5fd";
    });

    const mobileDrawers = document.querySelectorAll(".mobile-drawer");
    mobileDrawers.forEach((drawer) => {
      (drawer as HTMLElement).style.background = "#2a2d3a";
      (drawer as HTMLElement).style.boxShadow = "10px 0 15px #1e2028";
    });

    const mobileDrawerTitles = document.querySelectorAll(
      ".mobile-drawer-title"
    );
    mobileDrawerTitles.forEach((title) => {
      (title as HTMLElement).style.color = "#c4b5fd";
    });

    const mobileDrawerCloseButtons = document.querySelectorAll(
      ".mobile-drawer-close-button"
    );
    mobileDrawerCloseButtons.forEach((button) => {
      (button as HTMLElement).style.color = "#c4b5fd";
    });

    const mobileDrawerNavButtons = document.querySelectorAll(
      ".mobile-drawer-nav-button"
    );
    mobileDrawerNavButtons.forEach((button) => {
      (button as HTMLElement).style.background = "#2a2d3a";
      (button as HTMLElement).style.color = "#c4b5fd";
      (button as HTMLElement).style.boxShadow =
        "6px 6px 10px #1e2028, -5px -5px 10px #363a4c";
    });

    let mobileDrawerStyleElement = document.getElementById(
      "mobile-drawer-nav-hover"
    );
    if (!mobileDrawerStyleElement) {
      mobileDrawerStyleElement = document.createElement("style");
      mobileDrawerStyleElement.id = "mobile-drawer-nav-hover";
      document.head.appendChild(mobileDrawerStyleElement);
    }
    mobileDrawerStyleElement.textContent =
      ".mobile-drawer { background: #2a2d3a !important; box-shadow: 10px 0 15px #1e2028 !important; } .mobile-drawer-title { color: #c4b5fd !important; } .mobile-drawer-close-button { color: #c4b5fd !important; } .mobile-drawer-nav-button { background: #2a2d3a !important; color: #c4b5fd !important; box-shadow: 6px 6px 10px #1e2028, -5px -5px 10px #363a4c !important; } .mobile-drawer-nav-button:hover { background: #252831 !important; } .mobile-drawer-nav-button:active { box-shadow: inset 2px 2px 5px #1e2028, inset -2px -2px 5px #363a4c !important; }";

    let themeToggleStyleElement = document.getElementById(
      "theme-toggle-active"
    );
    if (!themeToggleStyleElement) {
      themeToggleStyleElement = document.createElement("style");
      themeToggleStyleElement.id = "theme-toggle-active";
      document.head.appendChild(themeToggleStyleElement);
    }
    themeToggleStyleElement.textContent =
      "button:has(.text-purple-300):active { box-shadow: inset 2px 2px 5px #1e2028, inset -2px -2px 5px #363a4c !important; }";

    setTimeout(enableTransitions, 50);
  };

  // =============
  // LIGHT THEME
  // =============

  const applyLightTheme = () => {
    disableTransitions();

    document.body.style.background = "#e0e5ec";
    document.documentElement.style.background = "#e0e5ec";

    const main = document.querySelector("main");
    if (main) {
      main.style.background = "#e0e5ec";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.background =
        "linear-gradient(to bottom, #93c5fd, #e0e5ec)";
    }

    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.background =
        "linear-gradient(to top, #93c5fd, #e0e5ec)";
    }

    const footerText = document.querySelector("footer span") as HTMLElement;
    if (footerText) {
      footerText.style.color = "#60a5fa";
    }

    const aboutContainer = document.querySelector(
      ".about-container"
    ) as HTMLElement;
    if (aboutContainer) {
      aboutContainer.style.background = "#e0e5ec";
    }

    const aboutCard = document.querySelector(".about-card") as HTMLElement;
    if (aboutCard) {
      aboutCard.style.background = "#e0e5ec";
      aboutCard.style.boxShadow =
        "10px 10px 15px #c2c8d0, -5px -5px 10px #e6f0fa";
    }

    const aboutTitle = document.querySelector(".about-title") as HTMLElement;
    if (aboutTitle) {
      aboutTitle.style.color = "#93c5fd";
    }

    const aboutText = document.querySelectorAll(".about-text");
    aboutText.forEach((text) => {
      (text as HTMLElement).style.color = "#60a5fa";
    });

    const loginContainer = document.querySelector(
      ".login-container"
    ) as HTMLElement;
    if (loginContainer) {
      loginContainer.style.background = "#e0e5ec";
    }

    const loginCards = document.querySelectorAll(".login-card");
    loginCards.forEach((card) => {
      (card as HTMLElement).style.background = "#e0e5ec";
      (card as HTMLElement).style.boxShadow =
        "10px 10px 15px #c2c8d0, -5px -5px 10px #e6f0fa";
    });

    const loginTitles = document.querySelectorAll(".login-title");
    loginTitles.forEach((title) => {
      (title as HTMLElement).style.color = "#93c5fd";
    });

    const loginLinks = document.querySelectorAll(".login-link");
    loginLinks.forEach((link) => {
      (link as HTMLElement).style.color = "#93c5fd";
    });

    const neumorphicButtons = document.querySelectorAll(".neumorphic-button");
    neumorphicButtons.forEach((button) => {
      (button as HTMLElement).style.background = "#e0e5ec";
      (button as HTMLElement).style.color = "#60a5fa";
      (button as HTMLElement).style.boxShadow =
        "6px 6px 12px rgba(0,0,0,0.25), -6px -6px 12px rgba(255,255,255,0.7)";
    });

    const roleSelectorDarkStyleElement = document.getElementById(
      "role-selector-dark-theme"
    );
    if (roleSelectorDarkStyleElement) {
      roleSelectorDarkStyleElement.remove();
    }

    let roleSelectorLightStyleElement = document.getElementById(
      "role-selector-light-theme"
    );
    if (!roleSelectorLightStyleElement) {
      roleSelectorLightStyleElement = document.createElement("style");
      roleSelectorLightStyleElement.id = "role-selector-light-theme";
      document.head.appendChild(roleSelectorLightStyleElement);
    }
    roleSelectorLightStyleElement.textContent = `
      .role-selector-button {
        background: #e0e5ec !important;
        color: #93c5fd !important;
        box-shadow: 3px 3px 8px rgba(0,0,0,0.15), -3px -3px 8px rgba(255,255,255,0.7) !important;
      }
      .role-selector-button.bg-\\[\\#d9e6f9\\] {
        background: #d9e6f9 !important;
        color: #60a5fa !important;
        box-shadow: inset 2px 2px 5px rgba(0,0,0,0.15), inset -2px -2px 5px rgba(255,255,255,0.7) !important;
      }
      .role-selector-title {
        color: #93c5fd !important;
      }
    `;

    let neumorphicButtonStyleElement = document.getElementById(
      "neumorphic-button-active"
    );
    if (!neumorphicButtonStyleElement) {
      neumorphicButtonStyleElement = document.createElement("style");
      neumorphicButtonStyleElement.id = "neumorphic-button-active";
      document.head.appendChild(neumorphicButtonStyleElement);
    }
    neumorphicButtonStyleElement.textContent =
      ".neumorphic-button:active { box-shadow: inset 2px 2px 5px rgba(0,0,0,0.25), inset -2px -2px 5px rgba(255,255,255,0.7) !important; } .neumorphic-button:hover { background: #d9e6f9 !important; }";

    const cursorTrailDots = document.querySelectorAll(".cursor-trail-dot");
    cursorTrailDots.forEach((dot) => {
      (dot as HTMLElement).style.background = "#c4dcfcff";
      (dot as HTMLElement).style.boxShadow = "0 0 6px rgba(219, 234, 254, 0.5)";
    });

    const neumorphicInputs = document.querySelectorAll(".neumorphic-input");
    neumorphicInputs.forEach((input) => {
      (input as HTMLElement).style.background = "#e4e8f0";
      (input as HTMLElement).style.color = "#60a5fa";
      (input as HTMLElement).style.boxShadow =
        "inset 1px 1px 3px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(255,255,255,0.6)";
    });

    let neumorphicInputStyleElement = document.getElementById(
      "neumorphic-input-focus"
    );
    if (!neumorphicInputStyleElement) {
      neumorphicInputStyleElement = document.createElement("style");
      neumorphicInputStyleElement.id = "neumorphic-input-focus";
      document.head.appendChild(neumorphicInputStyleElement);
    }
    neumorphicInputStyleElement.textContent =
      ".neumorphic-input:focus { background: #e0e4ec !important; }";

    let styleElement = document.getElementById("neumorphic-input-placeholder");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "neumorphic-input-placeholder";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent =
      ".neumorphic-input::placeholder { color: #93c5fd !important; }";

    const passwordInputs = document.querySelectorAll(".password-input");
    passwordInputs.forEach((input) => {
      (input as HTMLElement).style.background = "#e4e8f0";
      (input as HTMLElement).style.color = "#60a5fa";
      (input as HTMLElement).style.boxShadow =
        "inset 1px 1px 3px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(255,255,255,0.6)";
    });

    let passwordInputStyleElement = document.getElementById(
      "password-input-focus"
    );
    if (!passwordInputStyleElement) {
      passwordInputStyleElement = document.createElement("style");
      passwordInputStyleElement.id = "password-input-focus";
      document.head.appendChild(passwordInputStyleElement);
    }
    passwordInputStyleElement.textContent =
      ".password-input:focus { background: #e0e4ec !important; }";

    const passwordToggleButtons = document.querySelectorAll(
      ".password-toggle-button"
    );
    passwordToggleButtons.forEach((button) => {
      (button as HTMLElement).style.color = "#93c5fd";
    });

    let passwordStyleElement = document.getElementById(
      "password-input-placeholder"
    );
    if (!passwordStyleElement) {
      passwordStyleElement = document.createElement("style");
      passwordStyleElement.id = "password-input-placeholder";
      document.head.appendChild(passwordStyleElement);
    }
    passwordStyleElement.textContent =
      ".password-input::placeholder { color: #93c5fd !important; }";

    let loginLinkStyleElement = document.getElementById("login-link-hover");
    if (!loginLinkStyleElement) {
      loginLinkStyleElement = document.createElement("style");
      loginLinkStyleElement.id = "login-link-hover";
      document.head.appendChild(loginLinkStyleElement);
    }
    loginLinkStyleElement.textContent =
      ".login-link:hover { color: #60a5fa !important; border-color: #93c5fd !important; }";

    const desktopNavButtons = document.querySelectorAll(".desktop-nav-button");
    desktopNavButtons.forEach((button) => {
      (button as HTMLElement).style.background = "#e0e5ec";
      (button as HTMLElement).style.color = "#93c5fd";
      (button as HTMLElement).style.boxShadow =
        "6px 6px 10px #c2c8d0, -5px -5px 10px #e6f0fa";
    });

    let desktopNavStyleElement = document.getElementById("desktop-nav-hover");
    if (!desktopNavStyleElement) {
      desktopNavStyleElement = document.createElement("style");
      desktopNavStyleElement.id = "desktop-nav-hover";
      document.head.appendChild(desktopNavStyleElement);
    }
    desktopNavStyleElement.textContent =
      ".desktop-nav-button:hover { background: rgb(191 219 254) !important; } .desktop-nav-button:active { box-shadow: inset 2px 2px 5px rgba(0,0,0,0.25), inset -2px -2px 5px rgba(255,255,255,0.7) !important; }";

    const hamburgerButtons = document.querySelectorAll(".hamburger-button");
    hamburgerButtons.forEach((button) => {
      (button as HTMLElement).style.color = "#60a5fa";
    });

    const mobileDrawers = document.querySelectorAll(".mobile-drawer");
    mobileDrawers.forEach((drawer) => {
      (drawer as HTMLElement).style.background = "#e0e5ec";
      (drawer as HTMLElement).style.boxShadow = "10px 0 15px #c2c8d0";
    });

    const mobileDrawerTitles = document.querySelectorAll(
      ".mobile-drawer-title"
    );
    mobileDrawerTitles.forEach((title) => {
      (title as HTMLElement).style.color = "#60a5fa";
    });

    const mobileDrawerCloseButtons = document.querySelectorAll(
      ".mobile-drawer-close-button"
    );
    mobileDrawerCloseButtons.forEach((button) => {
      (button as HTMLElement).style.color = "#60a5fa";
    });

    const mobileDrawerNavButtons = document.querySelectorAll(
      ".mobile-drawer-nav-button"
    );
    mobileDrawerNavButtons.forEach((button) => {
      (button as HTMLElement).style.background = "#e0e5ec";
      (button as HTMLElement).style.color = "#93c5fd";
      (button as HTMLElement).style.boxShadow =
        "6px 6px 10px #c2c8d0, -5px -5px 10px #e6f0fa";
    });

    let mobileDrawerStyleElement = document.getElementById(
      "mobile-drawer-nav-hover"
    );
    if (!mobileDrawerStyleElement) {
      mobileDrawerStyleElement = document.createElement("style");
      mobileDrawerStyleElement.id = "mobile-drawer-nav-hover";
      document.head.appendChild(mobileDrawerStyleElement);
    }
    mobileDrawerStyleElement.textContent =
      ".mobile-drawer { background: #e0e5ec !important; box-shadow: 10px 0 15px #c2c8d0 !important; } .mobile-drawer-title { color: #60a5fa !important; } .mobile-drawer-close-button { color: #60a5fa !important; } .mobile-drawer-nav-button { background: #e0e5ec !important; color: #93c5fd !important; box-shadow: 6px 6px 10px #c2c8d0, -5px -5px 10px #e6f0fa !important; } .mobile-drawer-nav-button:hover { background: rgb(191 219 254) !important; } .mobile-drawer-nav-button:active { box-shadow: inset 2px 2px 5px rgba(0,0,0,0.25), inset -2px -2px 5px rgba(255,255,255,0.7) !important; }";

    let themeToggleStyleElement = document.getElementById(
      "theme-toggle-active"
    );
    if (!themeToggleStyleElement) {
      themeToggleStyleElement = document.createElement("style");
      themeToggleStyleElement.id = "theme-toggle-active";
      document.head.appendChild(themeToggleStyleElement);
    }
    themeToggleStyleElement.textContent =
      "button:has(.text-blue-300):active { box-shadow: inset 2px 2px 5px rgba(0,0,0,0.25), inset -2px -2px 5px rgba(255,255,255,0.7) !important; }";

    setTimeout(enableTransitions, 50);
  };

  // ==============================
  // THEME TOGGLE HANDLER
  // ==============================

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      applyDarkTheme();
      localStorage.setItem("theme", "dark");
    } else {
      applyLightTheme();
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-xl font-bold transition-all duration-150 
        active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]
        active:brightness-95
        active:translate-y-0.5
        active:duration-75 ${
          isDark
            ? "bg-[#2a2d3a] shadow-[6px_6px_10px_#1e2028,-5px_-5px_10px_#363a4c] hover:bg-[#252831]"
            : "bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa] hover:bg-blue-100"
        }`}
    >
      {isDark ? (
        <Lightbulb size={20} className="text-purple-300" />
      ) : (
        <LightbulbOff size={20} className="text-blue-300" />
      )}
    </button>
  );
}
