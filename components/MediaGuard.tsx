"use client";

import { useEffect } from "react";

const MEDIA = "img, video, picture, canvas, .poster-item";

export default function MediaGuard() {
  useEffect(() => {
    const block = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(MEDIA)) e.preventDefault();
    };

    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return null;
}
