"use client";

import { ProfileHeader, CurrentlyPlayingCard } from "./DiscordStatus";
import { useDiscordStatus } from "./useDiscordStatus";
import type { BadgeItem } from "@/lib/content";

export default function HomeHeader({ age, badges }: { age: number; badges: BadgeItem[] }) {
  const data = useDiscordStatus();

  return (
    <>
      <ProfileHeader data={data} />

      <div className="flex flex-wrap gap-[15px] mb-[30px] text-base items-center max-md:text-[15px] max-md:leading-[1.6]">
        <div>
          <span className="badge">age</span> {age}
        </div>
        {badges.map((badge) => (
          <div key={badge.id}>
            <span className="badge">{badge.label}</span> {badge.value}
          </div>
        ))}
      </div>

      <CurrentlyPlayingCard data={data} />
    </>
  );
}
