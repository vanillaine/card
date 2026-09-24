import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type AppSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

const OWNER_EMAIL = (process.env.OWNER_EMAIL ?? "").toLowerCase();

export function isOwner(session: AppSession | null): session is AppSession {
  return session !== null && !!OWNER_EMAIL && session.user.email === OWNER_EMAIL;
}

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function getAdminSession(): Promise<AppSession | null> {
  const session = await getSession();
  return isOwner(session) ? session : null;
}

export async function requireAdmin(): Promise<AppSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Not logged in");
  return session;
}
