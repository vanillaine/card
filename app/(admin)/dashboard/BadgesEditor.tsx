import { createBadge, updateBadge, deleteBadge, moveBadge } from "./actions";
import { RowActions } from "./RowActions";
import { SubmitButton } from "../SubmitButton";
import type { BadgeItem } from "@/lib/content";

export function BadgesEditor({ badges }: { badges: BadgeItem[] }) {
  return (
    <section className="admin-card">
      <h2>Badges</h2>
      <p className="admin-hint">
        Muncul di sebelah badge &quot;age&quot; di homepage (age otomatis dari tanggal lahir, gak ada di sini).
      </p>

      {badges.map((badge, i) => (
        <div key={badge.id} className="admin-row">
          <form action={updateBadge} className="admin-row flex-1">
            <input type="hidden" name="id" value={badge.id} />
            <input name="label" defaultValue={badge.label} placeholder="label" className="admin-input w-28" />
            <input name="value" defaultValue={badge.value} placeholder="value" className="admin-input flex-1 min-w-32" />
            <SubmitButton>Save</SubmitButton>
          </form>
          <RowActions
            id={badge.id}
            moveAction={moveBadge}
            deleteAction={deleteBadge}
            deleteConfirmMessage={`Hapus badge "${badge.label}"?`}
            canMoveUp={i > 0}
            canMoveDown={i < badges.length - 1}
            canDelete
          />
        </div>
      ))}

      <form action={createBadge} className="admin-row border-t border-line pt-3">
        <input name="label" placeholder="label (e.g. MBTI)" className="admin-input w-28" />
        <input name="value" placeholder="value" className="admin-input flex-1 min-w-32" />
        <SubmitButton className="admin-btn" pendingLabel="Adding…">
          + Add badge
        </SubmitButton>
      </form>
    </section>
  );
}
