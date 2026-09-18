"use client";

import { useEffect, useRef, useState } from "react";

export function useTouchCards<T extends HTMLElement>() {
  const gridRef = useRef<T>(null);
  const [touchMode, setTouchMode] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!touchMode) return;

    const leaveTouchMode = () => {
      setTouchMode(false);
      setActive(null);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return leaveTouchMode();

      const card = (e.target as Element).closest(".poster-item");
      if (!card || !gridRef.current?.contains(card)) setActive(null);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") leaveTouchMode();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointermove", onPointerMove);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [touchMode]);

  function onCardPointerDown(index: number, e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    setTouchMode(true);
    setActive(index);
  }

  return { gridRef, touchMode, active, onCardPointerDown };
}
