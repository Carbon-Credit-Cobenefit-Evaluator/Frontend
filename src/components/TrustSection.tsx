import type { ReactNode } from "react";

const ITEMS = [
  {
    title: "Evidence-First",
    desc: "Scores are backed by extracted, reviewable evidence from registry PDFs.",
  },
  {
    title: "Explainable Scoring",
    desc: "Clear weighting across Outputs / Outcomes / Impacts with transparent gates.",
  },
  {
    title: "Registry-Agnostic",
    desc: "Unified project view across Verra and Gold Standard (same evaluation contract).",
  },
  {
    title: "Audit-Friendly",
    desc: "Every claim is traceable to sentences + confidence, not just a number.",
  },
];

const ICONS: Record<string, ReactNode> = {
  "Evidence-First": (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M9 11l2 2 4-4M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "Explainable Scoring": (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M4 19V5m0 14h16M8 15l3-3 3 2 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "Registry-Agnostic": (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M12 2l9 4-9 4-9-4 9-4zM3 10l9 4 9-4M3 14l9 4 9-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "Audit-Friendly": (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function TrustSection() {
  return (
    <section className="relative overflow-hidden border-t">
      {/* soft bg to match hero theme */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-emerald-50" />
      <div className="absolute inset-0 -z-10 opacity-80 bg-[linear-gradient(to_bottom_right,rgba(99,102,241,0.08),rgba(16,185,129,0.06),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-extrabold tracking-wide text-slate-500">
            WHY TRUST THESE RATINGS
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            Built for transparency, not hype
          </h2>

          <p className="max-w-2xl text-sm text-slate-600">
            Our backend extracts sentences from registry documents, refines them
            for auditability, runs SDG rule classifiers, then applies a
            documented scoring model. You can always inspect the evidence.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                  {ICONS[item.title]}
                </div>
              </div>

              <h3 className="mt-4 text-base font-extrabold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.desc}
              </p>

              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-70 transition group-hover:w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
