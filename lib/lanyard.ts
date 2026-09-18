type SpotifyActivity = {
  song: string;
  artist: string;
  album: string;
  album_art_url?: string;
};

type Activity = {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  assets?: { large_image?: string };
};

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type LanyardData = {
  discord_user: { id: string; username: string; display_name?: string; avatar?: string };
  discord_status: DiscordStatus;
  listening_to_spotify: boolean;
  spotify?: SpotifyActivity;
  activities: Activity[];
};

export const lanyardUrl = (discordId: string) => `https://api.lanyard.rest/v1/users/${discordId}`;

export const statusLabel: Record<DiscordStatus, string> = {
  online: "Currently Online",
  idle: "Currently Idle",
  dnd: "Do Not Disturb",
  offline: "Currently Offline",
};

export const statusDotColor: Record<DiscordStatus, string> = {
  online: "bg-[#23a559]",
  idle: "bg-[#f0b232]",
  dnd: "bg-[#f23f43]",
  offline: "bg-[#80848e]",
};

function resolveActivityArt(activity: Activity): string | undefined {
  const imgKey = activity.assets?.large_image;
  if (!imgKey || !activity.application_id) return undefined;

  if (imgKey.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${imgKey.replace("spotify:", "")}`;
  }
  if (imgKey.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${imgKey.replace("mp:external/", "")}`;
  }
  return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imgKey}.png`;
}

export type ResolvedActivity = {
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  art?: string;
};

export function resolveActivity(data: LanyardData | null): ResolvedActivity | null {
  if (!data) return null;

  if (data.listening_to_spotify && data.spotify) {
    const sp = data.spotify;
    return { label: "SPOTIFY", title: sp.song, subtitle: sp.artist, detail: sp.album, art: sp.album_art_url };
  }

  const act = data.activities.find((a) => a.type === 0 || a.type === 2);
  if (!act) return null;

  const isMusic = act.name.toLowerCase().includes("youtube music") || act.type === 2;
  return {
    label: isMusic ? "YOUTUBE MUSIC" : "PLAYING",
    title: act.details || act.name,
    subtitle: isMusic ? act.state || "" : act.name,
    detail: act.state && !isMusic ? act.state : "",
    art: resolveActivityArt(act),
  };
}
