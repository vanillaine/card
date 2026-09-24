import { IconSubmitButton } from "../SubmitButton";

export function RowActions({
  id,
  hidden,
  moveAction,
  deleteAction,
  deleteConfirmMessage,
  canMoveUp,
  canMoveDown,
  canDelete,
}: {
  id: string;
  hidden?: Record<string, string>;
  moveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  deleteConfirmMessage: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
}) {
  const hiddenFields = Object.entries(hidden ?? {});

  return (
    <div className="flex gap-1 shrink-0">
      <form action={moveAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        {hiddenFields.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <IconSubmitButton disabled={!canMoveUp} ariaLabel="Move up">
          <i className="fa-solid fa-arrow-up"></i>
        </IconSubmitButton>
      </form>
      <form action={moveAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        {hiddenFields.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <IconSubmitButton disabled={!canMoveDown} ariaLabel="Move down">
          <i className="fa-solid fa-arrow-down"></i>
        </IconSubmitButton>
      </form>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        {hiddenFields.map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <IconSubmitButton
          className="admin-btn-danger"
          disabled={!canDelete}
          ariaLabel="Delete"
          confirmMessage={deleteConfirmMessage}
        >
          <i className="fa-solid fa-trash"></i>
        </IconSubmitButton>
      </form>
    </div>
  );
}
