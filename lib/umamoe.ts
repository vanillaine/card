export type UmaProfile = {
  name: string;
  parent?: { character?: string; grade?: string; score?: number };
};

type ProfileResponse = {
  trainer?: { name?: string };
  inheritance?: {
    main_parent_id?: number | null;
    parent_rank?: number | null;
    parent_rarity?: number | null;
  } | null;
};

const GRADES = ["G", "G+", "F", "F+", "E", "E+", "D", "D+", "C", "C+", "B", "B+", "A", "A+", "S", "S+", "SS", "SS+"];
const ULTRA_GRADES = ["UG", "UF", "UE", "UD", "UC", "UB", "UA", "US"];

function gradeName(id: number): string | undefined {
  if (id >= 1 && id <= GRADES.length) return GRADES[id - 1];

  const tier = id - GRADES.length - 1;
  if (tier >= 0 && tier < ULTRA_GRADES.length * 10) {
    const step = tier % 10;
    return `${ULTRA_GRADES[Math.floor(tier / 10)]}${step || ""}`;
  }
  return undefined;
}

async function fetchCharacterName(cardId: number): Promise<string | undefined> {
  try {
    const res = await fetch(`https://umapyoi.net/api/v1/character/${Math.floor(cardId / 100)}`, {
      next: { revalidate: 604800 },
    });
    if (!res.ok) return undefined;

    return (await res.json()).name_en || undefined;
  } catch {
    return undefined;
  }
}

function parseUmaProfile(json: ProfileResponse): Omit<UmaProfile, "parent"> & {
  parent?: { cardId?: number; grade?: string; score?: number };
} | null {
  const name = json.trainer?.name;
  if (!name) return null;

  const inh = json.inheritance;
  const grade = inh?.parent_rarity ? gradeName(inh.parent_rarity) : undefined;
  const score = inh?.parent_rank ?? undefined;
  const cardId = inh?.main_parent_id ?? undefined;

  return {
    name,
    parent: cardId || grade || score ? { cardId, grade, score } : undefined,
  };
}

export async function fetchUmaProfile(
  accountId: string,
  apiKey = process.env.UMAMOE_API_KEY,
): Promise<UmaProfile | null> {
  if (!apiKey) return null;

  try {
    const res = await fetch(`https://uma.moe/api/v4/user/profile/${accountId}`, {
      headers: { "X-API-Key": apiKey },
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;

    const parsed = parseUmaProfile(await res.json());
    if (!parsed) return null;

    const { cardId, ...rest } = parsed.parent ?? {};
    const character = cardId ? await fetchCharacterName(cardId) : undefined;
    const parent = { character, ...rest };

    return {
      name: parsed.name,
      parent: parent.character || parent.grade || parent.score ? parent : undefined,
    };
  } catch {
    return null;
  }
}

export function formatParent(parent: NonNullable<UmaProfile["parent"]>): string {
  const label = [parent.character, parent.grade].filter(Boolean).join(" - ");
  const score = parent.score !== undefined ? `(${parent.score.toLocaleString("en-US")})` : "";
  return [label, score].filter(Boolean).join(" ");
}
