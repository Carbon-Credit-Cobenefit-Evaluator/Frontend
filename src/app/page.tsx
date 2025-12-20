"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Registry = "verra" | "gs";
type JobStatus = "queued" | "running" | "completed" | "failed";
type ModeUsed = "full" | "inference_only";

type RunResponse = {
  job_id: string;
  project_id: string;
};

type JobResponse = {
  job_id: string;
  project_id: string;
  status: JobStatus;
  mode_used?: ModeUsed;
  step?: string | null;
  message?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  error?: string | null;
};

const API_BASE = "http://127.0.0.1:8000";

/** ✅ Final step list (NO "done") */
const STEP_ORDER = [
  "queued",
  "decide_mode",
  "ingest",
  "load_pdfs",
  "extract_text_sentences",
  "extract_table_sentences",
  "factor_matching",
  "refine_evidence",
  "write_refined",
  "use_refined",
  "sdg_inference",
  "sdg_assessment",
] as const;

type StepKey = (typeof STEP_ORDER)[number];

const STEP_LABEL: Record<StepKey, string> = {
  queued: "Queued",
  decide_mode: "Decide mode",
  ingest: "Ingest PDFs",
  load_pdfs: "Load PDFs",
  extract_text_sentences: "Extract text sentences",
  extract_table_sentences: "Extract table sentences",
  factor_matching: "Semantic filtering",
  refine_evidence: "Refine evidence",
  write_refined: "Write refined evidence",
  use_refined: "Use existing refined evidence",
  sdg_inference: "SDG model inference",
  sdg_assessment: "SDG scoring / assessment",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatusPill({
  status,
}: {
  status: "completed" | "running" | "pending" | "failed";
}) {
  const map = {
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    running: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    pending: "bg-slate-50 text-slate-600 ring-slate-100",
    failed: "bg-rose-50 text-rose-700 ring-rose-100",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ring-1",
        map[status]
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "completed" && "bg-emerald-500",
          status === "running" && "bg-indigo-500",
          status === "pending" && "bg-slate-400",
          status === "failed" && "bg-rose-500"
        )}
      />
      {status}
    </span>
  );
}

function StepIcon({
  state,
}: {
  state: "done" | "current" | "pending" | "failed";
}) {
  return (
    <div
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full ring-1",
        state === "done" && "bg-emerald-600 text-white ring-emerald-200",
        state === "current" && "bg-indigo-600 text-white ring-indigo-200",
        state === "pending" && "bg-white text-slate-500 ring-slate-200",
        state === "failed" && "bg-rose-600 text-white ring-rose-200"
      )}
    >
      {state === "done" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M20 6L9 17l-5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : state === "failed" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            state === "current" ? "bg-white" : "bg-slate-400"
          )}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  const [registry, setRegistry] = useState<Registry>("verra");
  const [id, setId] = useState("1566");

  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const pollTimer = useRef<number | null>(null);

  /** Current step index */
  const currentStepIndex = useMemo(() => {
    if (!job?.step) return -1;
    return STEP_ORDER.indexOf(job.step as StepKey);
  }, [job?.step]);

  /** Progress % */
  const progress = useMemo(() => {
    if (!job?.step || job.status === "failed") return 0;
    const idx = STEP_ORDER.indexOf(job.step as StepKey);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / STEP_ORDER.length) * 100);
  }, [job?.step, job?.status]);

  async function startJob() {
    setUiError(null);
    setLoading(true);
    setJob(null);
    setJobId(null);

    try {
      const res = await fetch(`${API_BASE}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registry, id }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as RunResponse;
      setJobId(data.job_id);
    } catch (e: any) {
      setUiError(e.message ?? "Failed to start job");
      setLoading(false);
    }
  }

  async function fetchJob(jid: string) {
    const res = await fetch(`${API_BASE}/jobs/${jid}`, { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as JobResponse;
  }

  /** Polling */
  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;

    const tick = async () => {
      try {
        const data = await fetchJob(jobId);
        if (cancelled) return;

        setJob(data);

        if (data.status === "completed" || data.status === "failed") {
          setLoading(false);
          if (pollTimer.current) clearInterval(pollTimer.current);
          pollTimer.current = null;
        } else {
          setLoading(true);
        }
      } catch (e: any) {
        if (cancelled) return;
        setUiError(e.message ?? "Polling failed");
        setLoading(false);
      }
    };

    tick();
    pollTimer.current = window.setInterval(tick, 4000);

    return () => {
      cancelled = true;
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [jobId]);

  const canRun = id.trim().length > 0 && !loading;

  const headerSubtitle =
    job?.status === "completed"
      ? "Completed — results are ready."
      : job?.status === "failed"
      ? "Failed — see error details below."
      : "Run SDG co-benefit evaluation and track pipeline progress.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header card */}
        <div className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SDG Runner
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
                Pipeline execution dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {headerSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusPill
                status={
                  job?.status === "failed"
                    ? "failed"
                    : job?.status === "completed"
                    ? "completed"
                    : loading
                    ? "running"
                    : "pending"
                }
              />
              <div className="rounded-2xl border bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <div className="font-bold text-slate-900">API</div>
                <div className="font-mono">{API_BASE}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <section className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_160px]">
            <label className="rounded-2xl border bg-white/70 p-3 shadow-sm">
              <div className="text-xs font-bold text-slate-700">Registry</div>
              <select
                value={registry}
                onChange={(e) => setRegistry(e.target.value as Registry)}
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
              >
                <option value="verra">verra</option>
                <option value="gs">gs</option>
              </select>
            </label>

            <label className="rounded-2xl border bg-white/70 p-3 shadow-sm">
              <div className="text-xs font-bold text-slate-700">Project ID</div>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={loading}
                placeholder="e.g. 1566"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
              />
              <div className="mt-2 text-xs text-slate-500">
                Tip: hit Run and keep this tab open — it auto-updates.
              </div>
            </label>

            <button
              onClick={startJob}
              disabled={!canRun}
              className={cn(
                "group relative overflow-hidden rounded-2xl px-4 py-4 font-extrabold text-white shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
                "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Running…
                  </>
                ) : (
                  <>
                    Run
                    <span className="opacity-90">→</span>
                  </>
                )}
              </span>
              <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <span className="absolute -inset-24 bg-[radial-gradient(circle,rgba(255,255,255,0.35),transparent_55%)]" />
              </span>
            </button>
          </section>
        </div>

        {/* Error */}
        {uiError && (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-rose-600 text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 9v4m0 4h.01" strokeLinecap="round" />
                  <path d="M10.3 3.9 2.6 17.3A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.7L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>
              <div>
                <div className="font-extrabold text-rose-900">
                  Something went wrong
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-rose-800">
                  {uiError}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Pipeline card */}
          <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Pipeline steps
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {job?.step ? (
                    <>
                      Current:{" "}
                      <span className="font-bold text-slate-900">
                        {job.step}
                      </span>
                    </>
                  ) : (
                    "Start a run to see live progress."
                  )}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-600">Progress</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight">
                  {progress}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-500 to-indigo-500 transition-all duration-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">{job?.message ?? "—"}</span>
                <span className="font-mono">
                  {jobId ? `job:${jobId.slice(0, 8)}…` : "no job"}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <ol className="mt-6 space-y-2">
              {STEP_ORDER.map((step, i) => {
                const idx = currentStepIndex;
                const isDone = idx >= 0 && i < idx;
                const isCurrent = i === idx && job?.status !== "failed";
                const isFailed = job?.status === "failed" && i === idx;

                const state: "done" | "current" | "pending" | "failed" =
                  isFailed
                    ? "failed"
                    : isDone
                    ? "done"
                    : isCurrent
                    ? "current"
                    : "pending";

                return (
                  <li key={step} className="relative">
                    <div
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border p-3 transition",
                        state === "done" &&
                          "border-emerald-200 bg-emerald-50/70",
                        state === "current" &&
                          "border-indigo-200 bg-indigo-50/70",
                        state === "failed" && "border-rose-200 bg-rose-50/70",
                        state === "pending" && "border-slate-200 bg-white/60"
                      )}
                    >
                      <StepIcon state={state} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate font-extrabold text-slate-900">
                            {STEP_LABEL[step]}
                          </div>
                          <StatusPill
                            status={
                              state === "done"
                                ? "completed"
                                : state === "current"
                                ? "running"
                                : state === "failed"
                                ? "failed"
                                : "pending"
                            }
                          />
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          <span className="font-mono">{step}</span>
                        </div>
                      </div>
                    </div>

                    {/* connector */}
                    {i !== STEP_ORDER.length - 1 && (
                      <div className="pointer-events-none absolute left-7 top-[56px] h-4 w-px bg-gradient-to-b from-slate-200 to-transparent" />
                    )}
                  </li>
                );
              })}
            </ol>

            {/* CTA */}
            {job?.status === "completed" && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  ✅ Finished. Open the project page to view outputs and
                  scoring.
                </div>
                <button
                  onClick={() => {{
                    const prefixed =
                      registry === "verra" ? `VCS_${id}` : `GS_${id}`;
                    router.push(`/${registry}/${prefixed}`);
                  }}}
                  className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]"
                >
                  Go to project →
                </button>
              </div>
            )}
          </section>

          {/* Side card */}
          <aside className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur">
            <h3 className="text-lg font-extrabold tracking-tight">
              Run details
            </h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-600">Registry</div>
                <div className="mt-1 text-sm font-extrabold">{registry}</div>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-600">
                  Project ID
                </div>
                <div className="mt-1 font-mono text-sm font-extrabold">
                  {id}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-600">Status</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {job?.status ?? "—"}
                  </span>
                  {job?.status && (
                    <StatusPill
                      status={
                        job.status === "failed"
                          ? "failed"
                          : job.status === "completed"
                          ? "completed"
                          : job.status === "running"
                          ? "running"
                          : "pending"
                      }
                    />
                  )}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-600">Message</div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                  {job?.message ?? "—"}
                </div>
              </div>

              {job?.error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                  <div className="text-xs font-extrabold text-rose-800">
                    Error
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-rose-800">
                    {job.error}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
