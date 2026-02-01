'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/cn';

const NAV_ITEMS = [
  { label: 'Platform', href: '/platform' },
  { label: 'Projects', href: '/projects' },
  { label: 'Insights', href: '/insights' },
  // { label: 'Docs', href: '/docs' },
];

export default function Navbar() {
  const pathname = usePathname();
  // const isHome = pathname === '/';
  //   const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass background */}
      <div className="border-b mx-22 border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto min-w-full flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Left: Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2 font-extrabold tracking-tight text-slate-900"
          >
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white">
              <span className="text-xs font-black">SDG</span>
            </div>
            <span className="text-sm sm:text-base">Rating Engine</span>
          </Link>

          {/* Center: Nav */}
          <nav className="hidden md:flex items-center gap-1 transition-all duration-100 rounded-full bg-slate-100/80 p-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-extrabold transition',
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Status / User (future-ready) */}
          <div className="flex items-center gap-3">
            {/* <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              API Connected
            </div> */}

            {/* Placeholder user / settings */}
            <button className="grid h-9 w-9 place-items-center rounded-full border bg-white shadow-sm transition hover:bg-slate-50">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
