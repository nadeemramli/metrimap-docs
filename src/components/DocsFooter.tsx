import { gitConfig } from '@/lib/shared';

const repo = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

function issueUrl(title: string, body: string) {
  const params = new URLSearchParams({ title, body });
  return `${repo}/issues/new?${params.toString()}`;
}

export interface DocsFooterProps {
  /** Page path within content/docs, e.g. "concepts/canvases.mdx". */
  path: string;
  /** Page title, used to prefill feedback/issue text. */
  title: string;
}

/**
 * Per-page footer: a lightweight "was this helpful?" and issue/edit links.
 * There is no analytics backend, so "helpful?" votes open a prefilled GitHub
 * issue rather than silently recording a vote we can't see.
 */
export function DocsFooter({ path, title }: DocsFooterProps) {
  const editUrl = `${repo}/blob/${gitConfig.branch}/content/docs/${path}`;
  const helpfulYes = issueUrl(
    `Feedback: "${title}" was helpful`,
    `Page: /docs (${path})\n\nWhat worked well:\n`,
  );
  const helpfulNo = issueUrl(
    `Feedback: "${title}" needs work`,
    `Page: /docs (${path})\n\nWhat was confusing or missing:\n`,
  );
  const report = issueUrl(
    `Docs issue: ${title}`,
    `Page: /docs (${path})\n\nDescribe the problem:\n`,
  );

  return (
    <footer className="mt-10 border-t pt-6 text-sm text-fd-muted-foreground">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>Was this page helpful?</span>
        <a href={helpfulYes} className="underline" target="_blank" rel="noreferrer">
          Yes
        </a>
        <a href={helpfulNo} className="underline" target="_blank" rel="noreferrer">
          No
        </a>
        <span aria-hidden className="opacity-40">
          ·
        </span>
        <a href={report} className="underline" target="_blank" rel="noreferrer">
          Report an issue
        </a>
        <a href={editUrl} className="underline" target="_blank" rel="noreferrer">
          Edit this page
        </a>
      </div>
    </footer>
  );
}
