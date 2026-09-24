import { createSection, updateSection, deleteSection, moveSection } from "./actions";
import { RowActions } from "./RowActions";
import { SubmitButton } from "../SubmitButton";
import type { SectionItem } from "@/lib/content";

export function SectionsEditor({ sections }: { sections: SectionItem[] }) {
  return (
    <section className="admin-card">
      <h2>Sections</h2>
      <p className="admin-hint">
        Muncul berurutan di bawah header homepage. &quot;introduction&quot; wajib ada, gak bisa dihapus, tapi isinya
        tetap bisa diedit. Isian mendukung <code>**bold**</code>, <code>_italic_</code>, <code>***bold italic***</code>,{" "}
        <code>[teks](url)</code>.
      </p>

      {sections.map((section, i) => (
        <div key={section.id} className="admin-row items-start">
          <form action={updateSection} className="admin-row flex-1 items-start">
            <div className="flex flex-col gap-2 flex-1">
              <div className="admin-row">
                <input name="label" defaultValue={section.label} placeholder="label" className="admin-input w-40" />
                {section.required && <span className="admin-hint mt-0">wajib</span>}
              </div>
              <textarea name="body" defaultValue={section.body} rows={3} className="admin-textarea" />
            </div>
            <input type="hidden" name="id" value={section.id} />
            <SubmitButton className="admin-btn-primary self-start">Save</SubmitButton>
          </form>
          <RowActions
            id={section.id}
            moveAction={moveSection}
            deleteAction={deleteSection}
            deleteConfirmMessage={`Hapus section "${section.label}"? Isinya ikut hilang.`}
            canMoveUp={i > 0}
            canMoveDown={i < sections.length - 1}
            canDelete={!section.required}
          />
        </div>
      ))}

      <form action={createSection} className="flex flex-col gap-2 border-t border-line pt-3">
        <div className="admin-row">
          <input name="label" placeholder="label baru" className="admin-input w-40" />
        </div>
        <textarea name="body" placeholder="isian section" rows={2} className="admin-textarea" />
        <SubmitButton className="admin-btn self-start" pendingLabel="Adding…">
          + Add section
        </SubmitButton>
      </form>
    </section>
  );
}
