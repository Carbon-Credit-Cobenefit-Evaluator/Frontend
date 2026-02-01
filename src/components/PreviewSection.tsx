export function PreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-2xl font-bold">Preview Insights</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="h-40 rounded-xl bg-slate-100 blur-sm" />
        <div className="h-40 rounded-xl bg-slate-100 blur-sm" />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Sign in to access full project analytics and ratings.
      </p>
    </section>
  );
}
