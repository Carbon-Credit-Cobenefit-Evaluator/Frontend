'use client';

import { cn } from '@/components/cn';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProjectCard from '@/components/ProjectCard';
import ProjectsTable from '@/components/ProjectsTable';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { carbonProjects } from '../../../db';

/**
 * TEMP: replace with real API call later
 */
// async function getProjects(): Promise<Project[]> {
//   return [
//     {
//       registry: 'verra',
//       project_id: 'VCS_9921',
//       name: 'Mangrove Restoration Project',
//       country: 'Indonesia',
//       status: 'failed',
//       rating: 'AAA',
//       score: 80,
//       last_run_at: '2026-01-02',
//     },
//     {
//       registry: 'gs',
//       project_id: 'GS_884',
//       name: 'Clean Cookstoves Initiative',
//       country: 'India',
//       status: 'running',
//       rating: 'B',
//       score: 70,
//       last_run_at: '2026-01-05',
//     },
//     {
//       registry: 'gs',
//       project_id: 'GS_884',
//       name: 'Clean Cookstoves Initiative',
//       country: 'India',
//       status: 'running',
//       rating: 'C',
//       score: 40,
//       last_run_at: '2026-01-05',
//     },
//     {
//       registry: 'verra',
//       project_id: 'VCS_1566',
//       name: 'Community Reforestation Program',
//       country: 'Sri Lanka',
//       status: 'completed',
//       rating: 'D',
//       score: 10,
//       last_run_at: '2026-01-03',
//     },
//   ];
// }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    running: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    failed: 'bg-rose-50 text-rose-700 ring-rose-100',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold uppercase ring-1 ${map[status]}`}
    >
      {status}
    </span>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      // const data = await getProjects();
      const projectsData = carbonProjects;
      setProjects(projectsData);
      setLoading(false);
    }

    fetchProjects();
  }, []);

  function handleSelectProject(projectId: string) {}

  const headerSubtitle = 'Explore all carbon credit ratings world-wide.';

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
                Projects List
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {headerSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* <StatusPill
                      status={
                        job?.status === 'failed'
                          ? 'failed'
                          : job?.status === 'completed'
                          ? 'completed'
                          : loading
                          ? 'running'
                          : 'pending'
                      }
                    /> */}
              {/* <div className="rounded-2xl border bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <div className="font-bold text-slate-900">API</div>
                <div className="font-mono">{API_BASE}</div>
              </div> */}
            </div>
          </div>

          <section className="rounded-3xl border border-slate-300 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Country (single) */}
              <label className="rounded-2xl border border-slate-300 bg-white/70 p-3 shadow-sm">
                <div className="text-xs font-bold text-slate-700">Country</div>
                <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100">
                  <option value="">All countries</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                </select>
              </label>

              {/* Status (single) */}
              <label className="rounded-2xl border border-slate-300 bg-white/70 p-3 shadow-sm">
                <div className="text-xs font-bold text-slate-700">Status</div>
                <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100">
                  <option value="">All statuses</option>
                  <option value="completed">Completed</option>
                  <option value="running">Running</option>
                  <option value="failed">Failed</option>
                </select>
              </label>

              {/* Registry (multi) */}
              <div className="rounded-2xl border border-slate-300 bg-white/70 p-3 shadow-sm">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  Registry
                </div>
                <div className="flex flex-wrap gap-2">
                  {['verra', 'gs'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600 transition hover:bg-slate-100"
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Multi-select row */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* Project type (multi) */}
              <div className="rounded-2xl border border-slate-300 bg-white/70 p-3 shadow-sm">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  Project Type
                </div>
                <div className="flex flex-wrap gap-2 ">
                  {[
                    'Reforestation',
                    'Renewable Energy',
                    'Cookstoves',
                    'Waste',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold text-slate-600 transition hover:bg-slate-100"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project ID search */}
              <label className="rounded-2xl border border-slate-300 bg-white/70 p-3 shadow-sm">
                <div className="text-xs font-bold text-slate-700">
                  Project ID
                </div>
                <input
                  placeholder="VCS_1566 or GS_884"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </div>

            {/* Sort + actions */}
            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              {/* Sort */}
              {/* <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                Sort by
                <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100">
                  <option value="last_run_desc">Last run (newest)</option>
                  <option value="last_run_asc">Last run (oldest)</option>
                  <option value="name_asc">Project name (A–Z)</option>
                  <option value="name_desc">Project name (Z–A)</option>
                </select>
              </label> */}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="rounded-xl border px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100">
                  Reset
                </button>
                <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:brightness-110">
                  Apply filters
                </button>
              </div>
            </div>
          </section>
          {loading ? <LoadingSpinner /> : <ProjectsTable projects={projects} />}
        </div>
      </div>
    </main>
  );
}
