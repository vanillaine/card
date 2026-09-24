"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  className = "admin-btn-primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const [justSaved, setJustSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      setJustSaved(true);
      const timer = setTimeout(() => setJustSaved(false), 1500);
      return () => clearTimeout(timer);
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <span className="inline-flex items-center gap-2">
      <button type="submit" className={className} disabled={pending}>
        {pending ? pendingLabel : children}
      </button>
      {justSaved && <span className="text-xs text-accent-blue">Saved</span>}
    </span>
  );
}

export function IconSubmitButton({
  children,
  className = "admin-btn",
  disabled,
  ariaLabel,
  confirmMessage,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  ariaLabel: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={disabled || pending}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
