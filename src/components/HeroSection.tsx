export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Transparent Carbon Credit Ratings
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Independent, data-driven assessment of carbon credit projects using
            ESG and SDG-aligned signals.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold">
              Explore Projects
            </button>
            <button className="rounded-xl border px-6 py-3 font-semibold">
              View Methodology
            </button>
          </div>
        </div>

        {/* Right visual placeholder */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
