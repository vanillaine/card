import { createPointer, updatePointer, deletePointer, movePointer } from "./actions";
import { RowActions } from "./RowActions";
import { SubmitButton } from "../SubmitButton";
import type { PointerItem } from "@/lib/content";
import type { PointerType } from "@/generated/prisma/client";

export function PointersEditor({
  type,
  heading,
  items,
}: {
  type: PointerType;
  heading: string;
  items: PointerItem[];
}) {
  return (
    <section className="admin-card">
      <h2>{heading}</h2>
      <p className="admin-hint">Minimal harus ada satu poin.</p>

      {items.map((item, i) => (
        <div key={item.id} className="admin-row items-start">
          <form action={updatePointer} className="admin-row flex-1 items-start">
            <input type="hidden" name="id" value={item.id} />
            <textarea name="body" defaultValue={item.body} rows={2} className="admin-textarea flex-1" />
            <SubmitButton className="admin-btn-primary self-start">Save</SubmitButton>
          </form>
          <RowActions
            id={item.id}
            hidden={{ type }}
            moveAction={movePointer}
            deleteAction={deletePointer}
            deleteConfirmMessage={`Hapus poin ${type} ini?`}
            canMoveUp={i > 0}
            canMoveDown={i < items.length - 1}
            canDelete={items.length > 1}
          />
        </div>
      ))}

      <form action={createPointer} className="admin-row border-t border-line pt-3">
        <input type="hidden" name="type" value={type} />
        <textarea name="body" placeholder={`poin ${type} baru`} rows={2} className="admin-textarea flex-1" />
        <SubmitButton className="admin-btn self-start" pendingLabel="Adding…">
          + Add
        </SubmitButton>
      </form>
    </section>
  );
}
