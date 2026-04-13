const STEPS = [
  {
    title: "Registry Ingestion",
    desc: "Fetch project metadata + prioritize documents (Verra / Gold Standard).",
    bullets: [
      "Project summary + location",
      "Document prioritization",
      "PDF download to standard folder",
    ],
    tag: "Input",
  },
  {
    title: "Evidence Extraction",
    desc: "Extract text + tables, split into clean evidence units, and filter SDG-relevant content.",
    bullets: [
      "PDF text + table parsing",
      "Sentence cleaning",
      "Embedding-based retrieval",
    ],
    tag: "Evidence",
  },
  {
    title: "Refine + Classify",
    desc: "Audit-friendly sentence refinement, SDG rule inference, and explainable scoring.",
    bullets: [
      "LLM cleanup (Groq)",
      "Rule probabilities",
      "Outputs/Outcomes/Impacts scoring",
    ],
    tag: "Scoring",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden">
      {/* soft background like hero/trust */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-emerald-50" />
      <div className="absolute inset-0 -z-10 opacity-80 bg-[linear-gradient(to_bottom_right,rgba(99,102,241,0.08),rgba(16,185,129,0.06),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-extrabold tracking-wide text-slate-500">
            PIPELINE OVERVIEW
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How the rating is produced
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            We don’t guess. We extract evidence from registry PDFs, refine it
            for auditability, run SDG rule models, then compute a transparent
            score.
          </p>
        </div>

        {/* timeline */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md"
            >
              {/* top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center gap-3">
                  <StepBadge n={i + 1} />
                  <div>
                    <div className="text-xs font-extrabold text-slate-500">
                      {step.tag}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                </div>

                
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {step.desc}
              </p>

              <ul className="mt-5 space-y-2">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>

              {/* bottom gradient bar */}
              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-70 transition group-hover:w-24" />

              {/* connector arrow (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                  <div className="flex items-center">
                    <div className="h-px w-10 bg-slate-300/70" />
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-white/70 text-slate-700 shadow-sm backdrop-blur">
                      →
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* footer strip (matches your backend reality) */}
   
      </div>
    </section>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
      <div className="text-xs font-extrabold opacity-80">STEP</div>
      <div className="-mt-1 text-lg font-extrabold">{n}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/60 bg-white/80 px-3 py-1">
      {children}
    </span>
  );
}
