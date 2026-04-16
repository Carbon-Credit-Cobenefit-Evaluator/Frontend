"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tab = "verra" | "gs";

type Row = {
  id: string;
  name: string;
  status: string;
  category?: string;
  credits: number | null;
};

/* ===================== STATUS STYLE ===================== */

function getStatusStyle(status: string) {
  const s = status?.toLowerCase() || "";

  if (s.includes("registered"))
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";

  if (s.includes("verify")) return "bg-amber-50 text-amber-700 ring-amber-200";

  if (s.includes("approval"))
    return "bg-indigo-50 text-indigo-700 ring-indigo-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

/* ===================== COMPONENT ===================== */

export default function ProjectsPage() {
  const [tab, setTab] = useState<Tab>("verra");
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FROM BACKEND ================= */
  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        if (tab === "verra") {
          const res = await fetch("http://localhost:8000/projects/verra");
          const json = await res.json();
          setData(json);
        } else {
          setData([]); // GS empty for now
        }
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tab]);

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Carbon Projects
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore verified projects and SDG impact
            </p>
          </div>

          {/* TAB SWITCH */}
          <div className="flex bg-white border rounded-xl p-1 shadow-sm">
            {["verra", "gs"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as Tab)}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${
                  tab === t
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* LIST CARD */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* HEADER ROW */}
          <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-slate-500 border-b bg-slate-50">
            <div>ID</div>
            <div>Name</div>
            <div>Status</div>
            <div>Category</div>
            <div className="text-right">Credits</div>
          </div>

          {/* BODY */}
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading projects...
            </div>
          ) : data.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No projects available
            </div>
          ) : (
            <div className="divide-y">
              {data.map((p) => (
                <Link key={p.id} href={`/verra/${p.id}`}>
                  <div className="grid grid-cols-5 px-6 py-4 items-center hover:bg-indigo-50 transition cursor-pointer">
                    {/* ID */}
                    <div className="font-mono text-xs text-indigo-600">
                      {p.id}
                    </div>

                    {/* NAME */}
                    <div className="font-semibold text-sm text-slate-800 truncate">
                      {p.name}
                    </div>

                    {/* STATUS */}
                    <div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ${getStatusStyle(
                          p.status,
                        )}`}
                      >
                        {p.status || "—"}
                      </span>
                    </div>

                    {/* CATEGORY */}
                    <div className="text-sm text-slate-600">
                      {p.category || "—"}
                    </div>

                    {/* CREDITS */}
                    <div className="text-right font-semibold text-slate-700">
                      {p.credits ? p.credits.toLocaleString() : "—"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
