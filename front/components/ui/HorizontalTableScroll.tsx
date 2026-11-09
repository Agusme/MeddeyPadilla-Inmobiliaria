"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

import styles from "./HorizontalTableScroll.module.css";

export default function HorizontalTableScroll({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const viewportId = useId();
  const [scrollbar, setScrollbar] = useState({ max: 0, position: 0, thumb: 32 });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // Start at the property column when this table mounts, never in the middle.
    viewport.scrollLeft = 0;
    const updateScrollbar = () => {
      const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const position = Math.max(0, Math.min(max, viewport.scrollLeft));
      const thumb = Math.max(32, (viewport.clientWidth - 24) * viewport.clientWidth / viewport.scrollWidth);
      setScrollbar(current => current.max === max && current.position === position && current.thumb === thumb
        ? current : { max, position, thumb });
    };
    const frame = requestAnimationFrame(updateScrollbar);
    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    viewport.addEventListener("scroll", updateScrollbar, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("scroll", updateScrollbar);
    };
  }, []);

  return (
      <div className="relative min-w-0 max-w-full overflow-hidden rounded-md border border-black/10 bg-white shadow-sm">
        <div
          ref={viewportRef}
          id={viewportId}
          role="region"
          aria-label="Propiedades cargadas: tabla con desplazamiento horizontal"
          tabIndex={0}
          dir="ltr"
          className={(scrollbar.max > 1 ? styles.viewport : "") + " max-w-full overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#B71C1C]"}
        >
          {children}
        </div>
        {scrollbar.max > 1 && (
          <div className="px-3 lg:hidden">
            <input
              type="range"
              min={0}
              max={scrollbar.max}
              step="any"
              value={scrollbar.position}
              aria-label="Desplazar columnas de propiedades"
              aria-controls={viewportId}
              aria-valuetext={Math.round(scrollbar.position / scrollbar.max * 100) + " %"}
              className={styles.scrollbar}
              style={{ "--scrollbar-thumb-width": scrollbar.thumb + "px" } as CSSProperties}
              onChange={event => {
                if (viewportRef.current) viewportRef.current.scrollLeft = Number(event.target.value);
              }}
            />
          </div>
        )}
      </div>
  );
}
