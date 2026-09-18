"use client";

import { useEffect, useState } from "react";
import { lanyardUrl, type LanyardData } from "@/lib/lanyard";

const discordId = process.env.NEXT_PUBLIC_DISCORD_ID ?? "";
const POLL_MS = 15_000;

export function useDiscordStatus() {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    if (!discordId) return;
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(lanyardUrl(discordId));
        const json = await res.json();
        if (!cancelled && json.success) setData(json.data);
      } catch (error) {
        console.error("Fetch Lanyard failed:", error);
      }
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      fetchStatus();
      timer = setInterval(fetchStatus, POLL_MS);
    };
    const stop = () => clearInterval(timer);
    const onVisibility = () => {
      stop();
      if (document.visibilityState === "visible") start();
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return data;
}
