"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Theme = "dark" | "light";

export default function PrivacyHeader() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <header className="navbar">
      <Link id="privacy-home-link" className="logo" href="/" aria-label="Motus home">
        <span aria-hidden="true">✦</span> Motus
      </Link>
      <nav aria-label="Primary navigation">
        <Link id="privacy-nav-home" href="/">Home</Link>
        <Link id="privacy-nav-pricing" href="/#pricing">Pricing</Link>
        <Link id="privacy-nav-automation" href="/#automation">Automation</Link>
        <Link id="privacy-nav-contact" href="/#contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <button
          id="privacy-theme-toggle"
          className="theme-toggle"
          type="button"
          aria-pressed={theme === "dark"}
          onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Light view" : "Dark view"}
        </button>
        <Link id="privacy-header-enquiry-link" className="header-cta" href="/#contact">
          Tell us what you need
        </Link>
      </div>
    </header>
  );
}
