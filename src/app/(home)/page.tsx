import Link from 'next/link';
import { appUrl } from '@/lib/shared';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-3 text-sm font-medium text-fd-muted-foreground">
        Canvasm · Metrimap
      </p>
      <h1 className="mb-4 max-w-2xl text-3xl font-bold sm:text-4xl">
        Turn business goals into living metric maps
      </h1>
      <p className="mb-8 max-w-xl text-fd-muted-foreground">
        Canvasm (Metrimap) helps teams map how their work drives their numbers —
        connect data, break strategy into measurable bets, and give every group
        the dashboard that matches their view. These docs teach the model and the
        mechanics.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground"
        >
          Read the docs
        </Link>
        <Link
          href="/docs/quickstart"
          className="rounded-full border px-5 py-2.5 text-sm font-medium"
        >
          Quickstart
        </Link>
        <a
          href={appUrl}
          className="rounded-full border px-5 py-2.5 text-sm font-medium"
        >
          Open the app ↗
        </a>
      </div>
    </main>
  );
}
