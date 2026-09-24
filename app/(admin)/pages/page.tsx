import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/require-admin";
import { fetchPageDescriptionRows } from "@/lib/content";
import { PAGE_DESCRIPTION_SLOTS } from "@/lib/content-schema";
import { updatePageDescription } from "./actions";
import { SubmitButton } from "../SubmitButton";

export const metadata: Metadata = {
  title: "Page descriptions — admin",
  robots: { index: false, follow: false },
};

const PAGE_LABELS: Record<string, string> = {
  anime: "Anime & Manga",
  films: "Films & Books",
  games: "Games",
  idols: "Idols",
};

export default async function PagesAdminPage() {
  if (!(await getAdminSession())) redirect("/login");

  const rows = await fetchPageDescriptionRows();
  const bodyOf = (slug: string) => rows.find((r) => r.slug === slug)?.body ?? "";

  const pages = [...new Set(PAGE_DESCRIPTION_SLOTS.map((s) => s.page))];

  return (
    <div className="admin-shell">
      <h1 className="section-name">Page descriptions</h1>
      <p className="admin-hint">
        Slot-slot ini wajib ada di halaman masing-masing, jadi cuma bisa diedit, gak bisa dihapus/ditambah. Mendukung{" "}
        <code>**bold**</code>, <code>_italic_</code>, <code>***bold italic***</code>, <code>[teks](url)</code>.
      </p>

      {pages.map((page) => (
        <section key={page} className="admin-card">
          <h2>{PAGE_LABELS[page] ?? page}</h2>
          {PAGE_DESCRIPTION_SLOTS.filter((s) => s.page === page).map((slot) => (
            <form key={slot.slug} action={updatePageDescription} className="flex flex-col gap-2">
              <input type="hidden" name="slug" value={slot.slug} />
              <label className="admin-hint mt-0">{slot.slug}</label>
              <textarea name="body" defaultValue={bodyOf(slot.slug)} rows={3} className="admin-textarea" />
              <SubmitButton className="admin-btn-primary self-start">Save</SubmitButton>
            </form>
          ))}
        </section>
      ))}
    </div>
  );
}
