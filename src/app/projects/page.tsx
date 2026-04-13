"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

type Tab = "verra" | "gs";

type Row = {
  id: string;
  name: string;
  status: string;
  credits: number | null;
};

/* ===================== DATA EXTRACTION ===================== */

function extractVerra(verraData: any): Row[] {
  return Object.entries(verraData).map(([key, p]: any) => {
    const attrs = p?.participationSummaries?.[0]?.attributes || [];

    const get = (code: string) =>
      attrs.find((a: any) => a.code === code)?.values?.[0]?.value;

    return {
      id: key,
      name: p.resourceName || "—",
      status: get("PROJECT_STATUS") || "—",
      credits: Number(get("EST_ANNUAL_EMISSION_REDCT")) || null,
    };
  });
}

function extractGS(gsData: any): Row[] {
  return Object.entries(gsData).map(([key, p]: any) => ({
    id: key,
    name: p.name || "—",
    status: p.status || "—",
    credits: p.estimated_annual_credits || null,
  }));
}

/* ===================== STATUS STYLES ===================== */

function getStatusStyle(status: string) {
  const s = status.toLowerCase();

  if (s.includes("registered"))
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";

  if (s.includes("verify")) return "bg-amber-50 text-amber-700 ring-amber-200";

  if (s.includes("approval"))
    return "bg-indigo-50 text-indigo-700 ring-indigo-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ring-1 ${getStatusStyle(
        status,
      )}`}
    >
      {status}
    </span>
  );
}

/* ===================== PAGE ===================== */

export default function ProjectsPage() {
  const [tab, setTab] = useState<Tab>("verra");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [verra, setVerra] = useState<Row[]>([]);
  const [gs, setGS] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    async function loadData() {
      try {
        const [verraRes, gsRes] = await Promise.all([
          fetch("/Forestry/verra_projects.json"),
          fetch("/Forestry/goldstandard_projects.json"),
        ]);

        const verraJson = await verraRes.json();
        const gsJson = await gsRes.json();

        setVerra(extractVerra(verraJson));
        setGS(extractGS(gsJson));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const data = tab === "verra" ? verra : gs;

  /* UNIQUE STATUSES */
  const statuses = useMemo(() => {
    const s = new Set<string>();
    data.forEach((p) => {
      if (p.status && p.status !== "—") s.add(p.status);
    });
    return Array.from(s);
  }, [data]);

  /* FILTER */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return data.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;

      if (!q) return true;

      return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    });
  }, [data, search, statusFilter]);

  /* ===================== UI ===================== */

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">Loading projects...</div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore carbon credit projects across registries
            </p>
          </div>

          {/* SWITCH */}
          <div className="flex bg-white/70 border rounded-xl p-1">
            {["verra", "gs"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t as Tab);
                  setSearch("");
                  setStatusFilter("");
                }}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg ${
                  tab === t ? "bg-indigo-600 text-white" : "text-slate-500"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="border rounded-xl overflow-hidden">
          <div className="divide-y">
            {filtered.map((p) => (
              <Link key={p.id} href={`/verra/${p.id}`}>
                <div className="grid grid-cols-4 p-4 hover:bg-indigo-50 cursor-pointer">
                  <div>{p.id}</div>
                  <div>{p.name}</div>
                  <div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="text-right">
                    {p.credits ? p.credits.toLocaleString() : "—"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10">No projects found</div>
        )}
      </div>
    </main>
  );
}
