const CASES = [
  {
    title: 'Investors',
    desc: 'Compare project quality and integrity risk',
  },
  {
    title: 'Project Developers',
    desc: 'Understand drivers of project ratings',
  },
  {
    title: 'Auditors & Policymakers',
    desc: 'Benchmark and monitor carbon markets',
  },
];

export function UseCases() {
  return (
    <section className="bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-bold">Who Is This For?</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {CASES.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
