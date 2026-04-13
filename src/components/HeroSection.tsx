import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[700px]">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/HeroImage.png"
          alt="Carbon credit cycle"
          fill
          priority
          
          className="object-cover " // focus more to the right
        />

        {/* Soft overall wash (optional, helps text) */}
        <div className="absolute inset-0" />

        {/* Strong left gradient for readability */}
        <div className="absolute inset-0 " />

        {/* Extra boost behind text area only (helps on bright images) */}
        <div className="absolute left-0 top-0 h-full w-[58%] blur-2xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-3xl">
          <h1 className="mt-6 text-[44px] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            Transparent Carbon
            <br />
            Credit Ratings{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              you can
            </span>{" "}
            <span className="text-emerald-700">audit</span>.
          </h1>

          <p className="mt-5 max-w-2xl font-semibold leading-relaxed text-slate-900 md:text-xl">
            Independent, data-driven assessment of carbon credit projects using
            verifiable evidence extracted from registry documents, aligned to
            SDGs and ESG risk signals not black-box scores.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition hover:translate-y-[-1px] hover:bg-slate-800">
              Explore Projects
              <span className="text-white/70 transition group-hover:translate-x-0.5">
                →
              </span>
            </button>

            <button className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-6 py-3 text-sm font-extrabold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white">
              View Methodology
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
