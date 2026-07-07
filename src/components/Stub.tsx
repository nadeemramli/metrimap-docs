import { Callout } from 'fumadocs-ui/components/callout';
import type { ReactNode } from 'react';

export interface StubProps {
  /** Team or person responsible for writing this page. */
  owner?: string;
  /** Rough priority for filling this in: P1 (launch) … P3 (later). */
  priority?: string;
  /** Optional note on what the finished page should cover. */
  children?: ReactNode;
}

/**
 * A visible "this page is a stub" marker for the docs IA. Replace the whole
 * <Stub /> block with real content when the page is written. Kept as a component
 * (not raw prose) so stubs are consistent and easy to grep/remove.
 */
export function Stub({ owner = 'docs', priority = 'P2', children }: StubProps) {
  return (
    <Callout type="warn" title="This page is a stub">
      <p>
        This page is part of the launch information architecture but hasn&apos;t
        been written yet. It renders so navigation and links work end to end.
      </p>
      {children ? <div className="mt-2">{children}</div> : null}
      <p className="mt-2 text-sm text-fd-muted-foreground">
        Owner: <strong>{owner}</strong> · Priority: <strong>{priority}</strong>
      </p>
    </Callout>
  );
}
