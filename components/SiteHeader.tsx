"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import styles from "./SiteChrome.module.css";

const navigation = [
  ["What we build", "/#solutions"],
  ["How it works", "/#automation"],
  ["Calculator", "/#calculator"],
  ["Examples", "/demos"],
  ["Website pricing", "/#pricing"],
] as const;

function navigationId(label: string) {
  return label === "What we build" ? "solutions" : label === "How it works" ? "automation" : label.toLowerCase().replaceAll(" ", "-");
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isCurrentPage = (href: string) => href === "/demos" && pathname === "/demos";

  return (
    <header className={styles.header}>
      <a id="site-skip-link" className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.headerInner}>
        <Link id="motus-home-link" className={styles.wordmark} href="/" onClick={() => setOpen(false)}>
          Motus
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navigation.map(([label, href]) => (
            <Link
              id={`nav-${navigationId(label)}-link`}
              key={label}
              href={href}
              aria-current={isCurrentPage(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link id="header-enquiry-link" className={styles.headerCta} href="/#contact">
          Tell us what you need <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <button
          id="mobile-menu-button"
          className={styles.menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation">
          {navigation.map(([label, href]) => (
            <Link
              id={`mobile-nav-${navigationId(label)}-link`}
              key={label}
              href={href}
              aria-current={isCurrentPage(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link id="mobile-nav-enquiry-link" href="/#contact" onClick={() => setOpen(false)}>Tell us what you need</Link>
        </nav>
      )}
    </header>
  );
}
