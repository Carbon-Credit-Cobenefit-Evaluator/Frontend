const ITEMS = [
  { title: 'SDG-Aligned', desc: 'Mapped to UN Sustainable Development Goals' },
  { title: 'Explainable', desc: 'Transparent scoring logic and weights' },
  { title: 'Registry-Agnostic', desc: 'Comparable across standards' },
  { title: 'Risk-Aware', desc: 'Identifies integrity and delivery risks' },
];

export function TrustSection() {
  return (
    <section className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 md:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title}>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
