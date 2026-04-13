const CASES = [
  {
    title: "Investors & Buyers",
    desc: "Compare project integrity, co-benefits, and delivery risk with evidence-backed signals.",
    bullets: [
      "Portfolio comparison",
      "Risk flags + confidence",
      "Transparent evidence trails",
    ],
    tag: "Decision",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M12 2v20M4 7h16M6 11h12M8 15h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Project Developers",
    desc: "See what drives the rating and what evidence is missing to strengthen outcome/impact claims.",
    bullets: [
      "Gap analysis (O/R/I)",
      "Document checklist",
      "Evidence improvement guidance",
    ],
    tag: "Improve",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Auditors & Policymakers",
    desc: "Benchmark projects across registries and monitor market integrity using consistent, reproducible outputs.",
    bullets: [
      "Cross-registry comparability",
      "Audit-friendly outputs",
      "Track trends over time",
    ],
    tag: "Oversight",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M12 3l9 4-9 4-9-4 9-4zM3 10l9 4 9-4M4 14l8 4 8-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function UseCases() {
  return (
    <section className="relative overflow-hidden border-t">
      {/* soft bg consistent with hero/how-it-works */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-indigo-50" />
      <div className="absolute inset-0 -z-10 opacity-80 bg-[linear-gradient(to_bottom_right,rgba(99,102,241,0.06),rgba(16,185,129,0.05),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-extrabold tracking-wide text-slate-500">
            USE CASES
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Who is this platform for?
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            Whether you’re buying credits, developing projects, or monitoring
            markets, you get the same thing: evidence-backed, explainable
            ratings you can inspect.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.title}
              className="group rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                  {c.icon}
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-extrabold text-indigo-700 ring-1 ring-indigo-200">
                  {c.tag}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {c.desc}
              </p>

              <ul className="mt-5 space-y-2">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-70 transition group-hover:w-24" />
            </div>
          ))}
        </div>

        {/* optional bottom CTA strip */}

      </div>
    </section>
  );
}
