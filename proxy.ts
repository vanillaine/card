import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ADMIN_HOST, isAdminHost } from "@/lib/admin/admin-host";
import { isOwner } from "@/lib/admin/require-admin";

const ADMIN_PATH_SEGMENTS = new Set(["dashboard", "pages", "login"]);

function bounceToAdminHost(req: NextRequest): NextResponse | undefined {
  if (!ADMIN_HOST) return undefined;

  const { pathname, search } = req.nextUrl;
  if (!ADMIN_PATH_SEGMENTS.has(pathname.split("/")[1] ?? "")) return undefined;

  return NextResponse.redirect(new URL(`https://${ADMIN_HOST}${pathname}${search}`), 301);
}

async function handleAdminHost(req: NextRequest, origin: string): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const session = await auth.api.getSession({ headers: req.headers });

  if (!isOwner(session)) {
    if (pathname === "/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", origin));
  }

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/dashboard", origin));
  }

  return NextResponse.next();
}

export default async function proxy(req: NextRequest) {
  const rawHost = req.headers.get("host");

  if (isAdminHost(rawHost)) {
    const origin = `${req.nextUrl.protocol}//${rawHost}`;
    return handleAdminHost(req, origin);
  }

  return bounceToAdminHost(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon\\.ico).*)"],
};
