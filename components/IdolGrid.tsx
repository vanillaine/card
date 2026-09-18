"use client";

import { useTouchCards } from "./useTouchCards";

type IdolEntry = {
  name: string;
  group: string;
  photo?: string;
  video?: string;
  logo: string;
};

export default function IdolGrid({ items }: { items: readonly IdolEntry[] }) {
  const { gridRef, touchMode, active, onCardPointerDown } = useTouchCards<HTMLDivElement>();

  return (
    <div ref={gridRef} className="poster-gallery" data-touch-mode={touchMode ? "true" : undefined}>
      {items.map((idol, i) => (
        <div
          key={idol.name}
          className="poster-item idol-item"
          data-touch={active === i ? "true" : undefined}
          onPointerDown={(e) => onCardPointerDown(i, e)}
        >
          {idol.video ? (
            <video
              className="idol-photo"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload noplaybackrate noremoteplayback"
            >
              <source src={idol.video} type="video/mp4" />
            </video>
          ) : (
            <img className="idol-photo" src={idol.photo} alt={idol.name} />
          )}
          <div className="idol-logo-wrapper">
            <img className="idol-logo" src={idol.logo} alt={idol.group || idol.name} />
          </div>
          <div className="poster-overlay">
            <span className="poster-top">{idol.group}</span>
            <span className="poster-bottom">{idol.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
