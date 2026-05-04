"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";
import dynamic from "next/dynamic";

const ProjectMap = dynamic(() => import("../../components/ProjectMap"), {
  ssr: false,
});

/* ================= ENV ================= */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

/* ================= TYPES ================= */
type DistributionItem = { range: string; count: number };
type SDGItem = { sdg: number; value: number };
type SDGAvg = { sdg: number; score: number };
type ScatterItem = { emission: number; score: number };
type Summary = { avg_score: number; total_projects: number };

/* ================= COLORS ================= */
const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const [mapData, setMapData] = useState<any[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [distribution, setDistribution] = useState<DistributionItem[]>([]);
  const [sdgPie, setSdgPie] = useState<SDGItem[]>([]);
  const [sdgBar, setSdgBar] = useState<SDGAvg[]>([]);
  const [scatter, setScatter] = useState<ScatterItem[]>([]);

  useEffect(() => {
    setMounted(true);

    const fetchAll = async () => {
      try {
        const [summaryRes, distRes, sdgPieRes, sdgBarRes, scatterRes, mapRes] =
          await Promise.all([
            fetch(`${BASE_URL}/insights/forestry/summary`),
            fetch(`${BASE_URL}/insights/forestry/score-distribution`),
            fetch(`${BASE_URL}/insights/forestry/sdg-distribution`),
            fetch(`${BASE_URL}/insights/forestry/sdg-average`),
            fetch(`${BASE_URL}/insights/forestry/emission-vs-score`),
            fetch(`${BASE_URL}/insights/forestry/map`),
          ]);

        setSummary(await summaryRes.json());
        setDistribution((await distRes.json()).distribution || []);
        setSdgPie((await sdgPieRes.json()).distribution || []);
        setSdgBar(await sdgBarRes.json());
        setScatter(await scatterRes.json());
        setMapData(await mapRes.json());
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAll();
  }, []);

  const sortedScatter = [...scatter]
    .filter((d) => d.emission <= 1500000)
    .sort((a, b) => a.emission - b.emission);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-14">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            🌳 Forestry Insights
          </h1>
          <p className="text-gray-500 text-lg">
            Clean, data-driven sustainability analytics
          </p>
        </div>

        {/* KPI */}
        <div className="grid md:grid-cols-3 gap-8">
          <KPI title="Average Score" value={`${summary?.avg_score ?? 0}%`} />
          <KPI title="Total Projects" value={summary?.total_projects ?? 0} />
          <KPI
            title="Top SDG"
            value={
              sdgPie.length
                ? `SDG ${[...sdgPie].sort((a, b) => b.value - a.value)[0].sdg}`
                : "-"
            }
          />
        </div>

        {/* STACKED CHARTS */}
        <div className="space-y-12">
          <ChartCard
            title="Score Distribution"
            description="Shows how projects are distributed across score ranges."
          >
            {mounted && (
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[10, 10, 0, 0]} />
              </BarChart>
            )}
          </ChartCard>

          <ChartCard
            title="SDG Contribution"
            description="Percentage contribution of each SDG."
          >
            {mounted && (
              <PieChart>
                <Pie
                  data={sdgPie}
                  dataKey="value"
                  nameKey="sdg"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  label={({ percent, payload }: any) => {
                    if (percent < 0.05) return "";
                    return `SDG ${payload.sdg}`;
                  }}
                >
                  {sdgPie.map((entry, i) => (
                    <Cell key={i} fill={SDG_COLORS[entry.sdg]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
                <Legend />
              </PieChart>
            )}
          </ChartCard>

          <ChartCard title="SDG Strength" description="Average score per SDG.">
            {mounted && (
              <BarChart data={sdgBar}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="sdg" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#22c55e" radius={[10, 10, 0, 0]} />
              </BarChart>
            )}
          </ChartCard>

          <ChartCard
            title="Emission vs Score"
            description="Relationship between emission reduction and sustainability score."
          >
            {mounted && (
              <ScatterChart>
                <CartesianGrid opacity={0.15} />
                <XAxis
                  type="number"
                  dataKey="emission"
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <YAxis dataKey="score" domain={[0, 100]} />
                <Tooltip />
                <Scatter data={sortedScatter} fill="#ef4444" />
              </ScatterChart>
            )}
          </ChartCard>

          {/* ✅ FIXED MAP */}
          <ChartCard
            title="Geographical Distribution"
            description="Location of forestry projects across the world."
            isMap
          >
            {mounted && <ProjectMap projects={mapData} />}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function KPI({ title, value }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-3xl font-semibold mt-2 text-gray-800">{value}</h2>
    </div>
  );
}

function ChartCard({ title, description, children, isMap = false }: any) {
  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg shadow-md">
          📊
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4" style={{ height: "360px" }}>
        {isMap ? (
          <div style={{ width: "100%", height: "100%" }}>{children}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* SDG COLORS */

const SDG_COLORS: Record<number, string> = {
  1: "#E5243B",
  2: "#DDA63A",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  7: "#FCC30B",
  8: "#A21942",
  9: "#FD6925",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  14: "#0A97D9",
  15: "#56C02B",
};
