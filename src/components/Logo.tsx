import { appName } from '@/lib/shared';

/**
 * Canvasm nav logo — the connected-node "map" glyph + wordmark, mirrored from the
 * marketing site (canvasm.app). Inline SVG using `currentColor`, so it's crisp and
 * theme-aware (works in light and dark) with no image asset to load.
 */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M6 6.5 L12 12 L18 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M12 12 L12 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="6" cy="6.5" r="2.4" fill="currentColor" opacity="0.85" />
        <circle cx="18" cy="7.5" r="2.4" fill="currentColor" opacity="0.85" />
        <circle cx="12" cy="12" r="2.8" fill="currentColor" />
        <circle cx="12" cy="18.5" r="2.4" fill="currentColor" opacity="0.85" />
      </svg>
      <span className="text-[15px]">{appName}</span>
    </span>
  );
}
