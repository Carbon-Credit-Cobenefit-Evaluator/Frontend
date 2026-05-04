"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ================= ENV ================= */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

type Tab = "verra" | "gs";

type Row = {
  id: string;
  name: string;
  status: string;
  sector?: string | null;
  score?: number | null;
};

/* ================= STATUS STYLE ================= */

function getStatusStyle(status: string) {
  const s = status?.toLowerCase() || "";

  if (s.includes("registered"))
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";

  if (s.includes("verify")) return "bg-amber-50 text-amber-700 ring-amber-200";

  if (s.includes("approval"))
    return "bg-indigo-50 text-indigo-700 ring-indigo-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

/* ================= SCORE STYLE ================= */

function getScoreStyle(score?: number | null) {
  if (score === null || score === undefined)
    return "bg-slate-100 text-slate-500";

  if (score >= 70) return "bg-emerald-100 text-emerald-700";
  if (score >= 40) return "bg-amber-100 text-amber-700";

  return "bg-rose-100 text-rose-700";
}

/* ================= COMPONENT ================= */

export default function ProjectsPage() {
  const [tab, setTab] = useState<Tab>("verra");
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Filters
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [sort, setSort] = useState<"none" | "asc" | "desc">("none");

  /* ================= FETCH ================= */
  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const endpoint =
          tab === "verra"
            ? `${BASE_URL}/projects/verra`
            : `${BASE_URL}/projects/gs`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tab]);

  /* ================= DERIVED DATA ================= */

  const sectors = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((p) => {
      if (p.sector) unique.add(p.sector);
    });
    return ["all", ...Array.from(unique)];
  }, [data]);

  const filtered = useMemo(() => {
    let result = [...data];

    // 🔍 Search by ID
    if (search) {
      result = result.filter((p) =>
        p.id.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 🎯 Sector filter
    if (sector !== "all") {
      result = result.filter((p) => p.sector === sector);
    }

    // 🔽 Sorting
    if (sort !== "none") {
      result.sort((a, b) => {
        const sa = a.score ?? -1;
        const sb = b.score ?? -1;
        return sort === "asc" ? sa - sb : sb - sa;
      });
    }

    return result;
  }, [data, search, sector, sort]);

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
              Explore projects with SDG scoring intelligence
            </p>
          </div>

          {/* TAB */}
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

        {/* 🔥 FILTER BAR */}
        <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
          {/* SEARCH */}
          <input
            placeholder="Search by Project ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* SECTOR DROPDOWN */}
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Sectors" : s}
              </option>
            ))}
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="none">Sort by Score</option>
            <option value="desc">High → Low</option>
            <option value="asc">Low → High</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* HEADER */}
          <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-slate-500 border-b bg-slate-50">
            <div>ID</div>
            <div>Name</div>
            <div>Status</div>
            <div>Sector</div>
            <div>Score</div>
          </div>

          {/* BODY */}
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading projects...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No matching projects
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((p) => (
                <Link key={p.id} href={`/${tab}/${p.id}`}>
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

                    {/* SECTOR */}
                    <div className="text-sm text-slate-600">
                      {p.sector || "—"}
                    </div>

                    {/* SCORE */}
                    <div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${getScoreStyle(
                          p.score,
                        )}`}
                      >
                        {p.score !== null && p.score !== undefined
                          ? `${(p.score * 100).toFixed(1)}%`
                          : "N/A"}
                      </span>
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
