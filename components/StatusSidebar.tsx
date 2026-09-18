"use client";

import { useEffect, useRef, useState } from "react";
import { useMobileMenu } from "./MobileMenuProvider";

const SWIPE_UP_THRESHOLD = 40;
const SWIPE_DOWN_THRESHOLD = 50;

export default function StatusSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { open: menuOpen } = useMobileMenu();
  const sheetRef = useRef<HTMLElement>(null);
  const handleStartY = useRef(0);
  const sheetStartY = useRef(0);

  function closeSheet() {
    setOpen(false);
    sheetRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if (!menuOpen) return;
    setOpen(false);
    sheetRef.current?.scrollTo({ top: 0 });
  }, [menuOpen]);

  function onHandleTouchStart(e: React.TouchEvent) {
    handleStartY.current = e.touches[0].clientY;
  }

  function onHandleTouchEnd(e: React.TouchEvent) {
    const endY = e.changedTouches[0].clientY;
    if (handleStartY.current - endY > SWIPE_UP_THRESHOLD) setOpen(true);
    else if (endY - handleStartY.current > SWIPE_UP_THRESHOLD) closeSheet();
  }

  function onSheetTouchStart(e: React.TouchEvent) {
    if ((e.target as HTMLElement).closest(".bottom-sheet-handle")) return;
    sheetStartY.current = e.touches[0].clientY;
  }

  function onSheetTouchEnd(e: React.TouchEvent) {
    if ((e.target as HTMLElement).closest(".bottom-sheet-handle")) return;
    const endY = e.changedTouches[0].clientY;
    if (endY - sheetStartY.current > SWIPE_DOWN_THRESHOLD && (sheetRef.current?.scrollTop ?? 0) <= 0) {
      closeSheet();
    }
  }

  return (
    <>
      {open && !menuOpen && <div className="mobile:hidden fixed inset-0 z-[999]" onClick={closeSheet} aria-hidden />}

      <aside
        ref={sheetRef}
        onTouchStart={onSheetTouchStart}
        onTouchEnd={onSheetTouchEnd}
        className={`w-80 bg-[rgba(15,13,30,0.45)] backdrop-blur-md border-l border-white/[0.06] px-5 py-[30px] overflow-y-auto flex flex-col gap-5 scrollbar-hide max-mobile:fixed max-mobile:bottom-0 max-mobile:left-0 max-mobile:w-full max-mobile:h-[60dvh] max-mobile:bg-[rgba(15,13,30,0.75)] max-mobile:backdrop-blur-[20px] max-mobile:border-l-0 max-mobile:border-t max-mobile:border-line max-mobile:rounded-t-[20px] max-mobile:[transition:translate_0.4s_cubic-bezier(0.175,0.885,0.32,1)] max-mobile:z-[1000] max-mobile:pt-0 max-mobile:shadow-[0_-5px_20px_rgba(0,0,0,0.5)] ${
          menuOpen
            ? "max-mobile:translate-y-[calc(100%+30px)]"
            : open
              ? "max-mobile:translate-y-0"
              : "max-mobile:translate-y-[calc(100%-45px)]"
        }`}
      >
        <div
          className="bottom-sheet-handle hidden max-mobile:flex max-mobile:justify-center max-mobile:items-center max-mobile:sticky max-mobile:top-0 max-mobile:-mx-5 max-mobile:h-[45px] max-mobile:bg-[linear-gradient(to_bottom,var(--color-bg-sidebar)_0%,var(--color-bg-sidebar)_78%,transparent_100%)] max-mobile:z-10 max-mobile:cursor-pointer max-mobile:shrink-0 max-mobile:[touch-action:none]"
          onClick={() => (open ? closeSheet() : setOpen(true))}
          onTouchStart={onHandleTouchStart}
          onTouchEnd={onHandleTouchEnd}
        >
          <div className="w-[50px] h-[5px] bg-text-muted rounded-[10px]" />
        </div>
        {children}
      </aside>
    </>
  );
}
