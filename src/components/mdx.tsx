import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Stub } from '@/components/Stub';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Stub,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
