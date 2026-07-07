import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { Logo } from '@/components/Logo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported — the Canvasm map glyph + wordmark (mirrors canvasm.app).
      title: <Logo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
