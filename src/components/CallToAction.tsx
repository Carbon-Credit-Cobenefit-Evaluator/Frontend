import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Access the Carbon Credit Rating Dashboard
        </h2>

        <p className="mt-4 text-slate-600">
          Explore project ratings, risks, and ESG impact signals.
        </p>

        <Link href={'/platform'}>
          <button className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 text-white font-semibold">
            Access Dashboard
          </button>
        </Link>
      </div>
    </section>
  );
}
