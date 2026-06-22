import type { NavigateFunction } from "react-router-dom";

export type HomeSection = "detector" | "features" | "pricing" | "faq";

export const SECTION_HASH: Record<HomeSection, string> = {
  detector: "#detector",
  features: "#features",
  pricing: "#pricing",
  faq: "#faq",
};

export const HOME_SECTIONS: HomeSection[] = ["detector", "features", "pricing", "faq"];

export function scrollToSection(hash: string, behavior: ScrollBehavior = "smooth") {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior, block: "start" });
    return true;
  }
  return false;
}

/** Navigate to home section from any route, then smooth-scroll. */
export function navigateToSection(
  section: HomeSection,
  navigate: NavigateFunction,
  pathname: string
) {
  const hash = SECTION_HASH[section];
  if (pathname === "/") {
    scrollToSection(hash);
    window.history.replaceState(null, "", hash);
    return;
  }
  navigate({ pathname: "/", hash: hash.slice(1) });
}

export function isHomePath(pathname: string) {
  return pathname === "/";
}
