"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/cn";

const NAV_ITEMS = [
  { label: "Platform", href: "/platform" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
  // {label: "Methodology", href: "/methodology"},
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top subtle gradient + glass */}
      <div className="relative border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500/40 via-emerald-500/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.10),transparent_55%)]" />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* LEFT: Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2 font-extrabold tracking-tight text-slate-900"
          >
            <div className="relative grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <span className="text-[10px] font-black tracking-widest">
                SDG
              </span>
              {/* tiny corner accent */}
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="leading-tight">
              <div className="text-sm sm:text-base">SDG Rating Engine</div>
              <div className="text-[11px] font-extrabold text-slate-500">
                Evidence-first carbon intelligence
              </div>
            </div>
          </Link>

          {/* CENTER: Nav pill */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/60 bg-white/60 p-1 shadow-sm backdrop-blur">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-extrabold transition",
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* status pill (optional but nice for your backend story) */}
            

            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-800"
            >
              Explore
              <span className="ml-2 text-white/70">→</span>
            </Link>

           
          </div>
        </div>

        {/* MOBILE NAV (simple & clean) */}
        <div className="md:hidden border-t border-white/60 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex-1 rounded-2xl px-3 py-2 text-center text-xs font-extrabold transition",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
