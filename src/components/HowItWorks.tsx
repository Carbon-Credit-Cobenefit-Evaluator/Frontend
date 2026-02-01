const STEPS = [
  {
    title: 'Project Data Ingestion',
    desc: 'Registry data, disclosures, and documentation',
  },
  {
    title: 'Signal Extraction',
    desc: 'ESG, SDG impact, and risk indicators',
  },
  {
    title: 'Composite Rating',
    desc: 'Weighted score with confidence signals',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-2xl font-bold">How the Rating Works</h2>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="rounded-2xl border bg-white p-6">
            <div className="text-sm font-bold text-indigo-600">
              Step {i + 1}
            </div>
            <h3 className="mt-2 font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
