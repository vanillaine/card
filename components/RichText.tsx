import type { ReactNode } from "react";
import { Accent, ExternalLink } from "./Prose";

const TOKEN = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|_(.+?)_|\[([^\]]+)\]\(([^)]+)\)/g;

export function parseRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const [, accentItalic, accentBold, plainItalic, linkText, linkHref] = match;
    if (accentItalic !== undefined) {
      nodes.push(<Accent italic key={key++}>{accentItalic}</Accent>);
    } else if (accentBold !== undefined) {
      nodes.push(<Accent key={key++}>{accentBold}</Accent>);
    } else if (plainItalic !== undefined) {
      nodes.push(<em key={key++}>{plainItalic}</em>);
    } else if (linkText !== undefined && linkHref !== undefined) {
      nodes.push(
        <ExternalLink href={linkHref} key={key++}>
          {linkText}
        </ExternalLink>,
      );
    }

    lastIndex = TOKEN.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return nodes;
}

export function RichText({ text }: { text: string | null | undefined }) {
  return <>{parseRichText(text ?? "")}</>;
}
