import type { Metadata } from "next";
import { getAdminSession } from "@/lib/admin/require-admin";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: "Vanillaine admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen">
      <AdminNav email={session.user.email} />
      {children}
    </div>
  );
}
