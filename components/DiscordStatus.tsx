import { resolveActivity, statusDotColor, statusLabel, type LanyardData } from "@/lib/lanyard";

const BARS = [
  { delay: "0s", height: "55%" },
  { delay: "0.15s", height: "100%" },
  { delay: "0.3s", height: "70%" },
  { delay: "0.45s", height: "85%" },
  { delay: "0.6s", height: "45%" },
];

export function ProfileHeader({ data }: { data: LanyardData | null }) {
  const status = data?.discord_status ?? "offline";
  const avatarUrl = data?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";
  const displayName = data?.discord_user.display_name || data?.discord_user.username || "Haseulbintaro";

  return (
    <div className="flex items-center gap-5 mb-[30px]">
      <div className="relative inline-block shrink-0">
        <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
        <div
          className={`absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full border-4 border-bg-main z-[2] ${statusDotColor[status]}`}
        />
      </div>

      <div>
        <div className="font-tingtong text-[55px] leading-[0.7] mb-[5px] max-md:text-[30px]">{displayName}</div>
        <div className="mt-[-2px] cursor-default h-6 overflow-hidden relative">
          <span
            className={`block h-6 leading-6 whitespace-nowrap overflow-hidden text-ellipsis text-[15px] font-jakarta ${
              status === "offline" ? "text-text-muted" : "font-semibold text-[#c4b8ff]"
            }`}
          >
            {statusLabel[status]}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CurrentlyPlayingCard({ data }: { data: LanyardData | null }) {
  const activity = resolveActivity(data);

  if (!activity) return null;

  return (
    <div>
      <p className="font-mono text-[0.72rem] tracking-[0.12em] text-text-muted mt-[18px] mb-2">
        // CURRENTLY PLAYING
      </p>
      <div className="flex gap-3.5 items-center bg-white/[0.04] border border-white/[0.07] rounded-[10px] p-3.5 mb-5 font-jakarta">
        {activity.art ? (
          <img
            src={activity.art}
            alt="cover"
            className="w-[76px] h-[76px] rounded-md object-cover shrink-0 bg-[#1a1630]"
          />
        ) : (
          <div className="w-[76px] h-[76px] rounded-md shrink-0 bg-[#1a1630]" />
        )}
        <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
          <span className="font-mono text-[0.62rem] tracking-[0.14em] text-[#9d84f5] mb-0.5">{activity.label}</span>
          <p className="text-[0.92rem] font-semibold text-[#e4e4e7] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
            {activity.title}
          </p>
          <p className="text-[0.78rem] text-text-muted m-0 whitespace-nowrap overflow-hidden text-ellipsis">
            {activity.subtitle}
          </p>
          <p className="text-[0.72rem] text-[#9d84f5] m-0 whitespace-nowrap overflow-hidden text-ellipsis">
            {activity.detail}
          </p>
          <div className="flex items-end gap-0.5 h-[14px] mt-[5px]">
            {BARS.map((bar) => (
              <span
                key={bar.delay}
                className="block w-[3px] bg-[#9d84f5] rounded-[2px] animate-bar-bounce"
                style={{ animationDelay: bar.delay, height: bar.height }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
