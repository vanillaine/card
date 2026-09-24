import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/require-admin";
import { fetchBadges, fetchSections, fetchPointers } from "@/lib/content";
import { BadgesEditor } from "./BadgesEditor";
import { SectionsEditor } from "./SectionsEditor";
import { PointersEditor } from "./PointersEditor";

export const metadata: Metadata = {
  title: "Dashboard — admin",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!(await getAdminSession())) redirect("/login");

  const [badges, sections, pointers] = await Promise.all([fetchBadges(), fetchSections(), fetchPointers()]);
  const byf = pointers.filter((p) => p.type === "byf");
  const dni = pointers.filter((p) => p.type === "dni");

  return (
    <div className="admin-shell">
      <h1 className="section-name">Homepage</h1>
      <BadgesEditor badges={badges} />
      <SectionsEditor sections={sections} />
      <PointersEditor type="byf" heading="byf" items={byf} />
      <PointersEditor type="dni" heading="dni" items={dni} />
    </div>
  );
}
