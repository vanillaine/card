"use client";

import { ProfileHeader, CurrentlyPlayingCard } from "./DiscordStatus";
import { useDiscordStatus } from "./useDiscordStatus";

export default function HomeHeader({ age }: { age: number }) {
  const data = useDiscordStatus();

  return (
    <>
      <ProfileHeader data={data} />

      <div className="flex flex-wrap gap-[15px] mb-[30px] text-base items-center max-md:text-[15px] max-md:leading-[1.6]">
        <div>
          <span className="badge">age</span> {age}
        </div>
        <div>
          <span className="badge">pronouns</span> any
        </div>
        <div>
          <span className="badge">MBTI</span> INFP-T
        </div>
        <div>
          <span className="badge">language</span> ENG/ID
        </div>
      </div>

      <CurrentlyPlayingCard data={data} />
    </>
  );
}
