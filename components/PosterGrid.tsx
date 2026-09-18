"use client";

import { useTouchCards } from "./useTouchCards";

export type PosterEntry = {
  title: string;
  topLabel: string;
  image: string;
};

export default function PosterGrid({ items }: { items: readonly PosterEntry[] }) {
  const { gridRef, touchMode, active, onCardPointerDown } = useTouchCards<HTMLDivElement>();

  return (
    <div ref={gridRef} className="poster-gallery" data-touch-mode={touchMode ? "true" : undefined}>
      {items.map((item, i) => (
        <div
          key={item.title}
          className="poster-item"
          data-touch={active === i ? "true" : undefined}
          onPointerDown={(e) => onCardPointerDown(i, e)}
        >
          {item.image ? (
            <img src={item.image} alt={item.title} loading="lazy" />
          ) : (
            <div className="w-full h-full bg-line" />
          )}
          <div className="poster-overlay">
            <span className="poster-top">{item.topLabel}</span>
            <span className="poster-bottom">{item.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
