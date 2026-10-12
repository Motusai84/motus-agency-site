export type SiteTheme = "dark" | "light";

/** Keep browser hints aligned with the palette, including after Next.js navigation. */
export function applySiteTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;

  const syncBrowserTheme = () => {
    if (document.documentElement.dataset.theme !== theme) return;
    // "only light" opts out of auto-darkening; "only dark" is not a valid HTML meta value.
    const scheme = theme === "light" ? "only light" : "dark";
    const color = theme === "light" ? "#ffffff" : "#0d1012";
    document.querySelectorAll<HTMLMetaElement>('meta[name="color-scheme"]').forEach((meta) => {
      if (meta.content !== scheme) meta.content = scheme;
    });
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      if (meta.content !== color) meta.content = color;
    });
  };

  syncBrowserTheme();
  // Route metadata can replace these tags after the page effect has already run.
  const observer = new MutationObserver(syncBrowserTheme);
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["content"],
  });
  return () => observer.disconnect();
}
