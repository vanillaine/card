import type { ReactNode } from "react";

export function Accent({ italic = false, children }: { italic?: boolean; children: ReactNode }) {
  return <span className={`text-accent-blue font-bold${italic ? " italic" : ""}`}>{children}</span>;
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-accent-blue font-bold underline" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
