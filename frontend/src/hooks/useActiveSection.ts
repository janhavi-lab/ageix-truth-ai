import { useEffect, useState } from "react";
import { HOME_SECTIONS, isHomePath, type HomeSection } from "@/lib/navigation";

export function useActiveSection(pathname: string): HomeSection | null {
  const [active, setActive] = useState<HomeSection | null>(null);

  useEffect(() => {
    if (!isHomePath(pathname)) {
      setActive(null);
      return;
    }

    const observers: IntersectionObserver[] = [];

    const update = (entries: IntersectionObserverEntry[]) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) {
        const id = visible[0].target.id as HomeSection;
        if (HOME_SECTIONS.includes(id)) setActive(id);
      }
    };

    const observer = new IntersectionObserver(update, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    HOME_SECTIONS.forEach((section) => {
      const el = document.getElementById(section);
      if (el) {
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  return active;
}
