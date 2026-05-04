"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

/* ✅ CENTRAL BASE URL */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/* ================= SAFE MAP ================= */
function Map({ lat, lon }: { lat: number; lon: number }) {
  if (!lat || !lon) return null;

  return (
    <iframe
      className="w-full h-full"
      loading="lazy"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 1},${lat - 1},${lon + 1},${lat + 1}&layer=mapnik&marker=${lat},${lon}`}
    />
  );
}

/* ================= NORMALIZER ================= */
function normalizeMeta(meta: any) {
  return {
    project_name: meta.project_name,
    description: meta.description,
    latitude: meta.latitude,
    longitude: meta.longitude,
    state_province: meta.state || meta.country,
    project_status: meta.project_status,
    annual_emission_reduction: meta.annual_credits,
    registration_date: meta.crediting_start_date,
    crediting_period: meta.crediting_end_date,
  };
}

/* ================= SCORE SECTION ================= */
function ScoreSection({ data }: { data: any }) {
  if (!data) return null;

  const finalScore = (data.final_score * 100).toFixed(1);

  const sdgArray = Object.entries(data.sdgs || {}).map(([sdg, value]: any) => ({
    sdg: `SDG ${sdg}`,
    score: Math.max(Number(((value.score || 0) * 100).toFixed(1)), 2),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow">
        Impact Score Overview
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg flex flex-col justify-center">
          <div className="text-sm opacity-80">Final Score</div>
          <div className="text-5xl font-extrabold mt-2">{finalScore}%</div>

          <div className="mt-6 text-xs opacity-80">Sector: {data.sector}</div>

          <div className="text-xs opacity-80">
            SDGs Covered: {Object.keys(data.sdgs || {}).length}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 h-[300px]">
          <div className="text-sm font-semibold text-slate-700 mb-2">
            SDG Distribution
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={sdgArray}>
              <PolarGrid />
              <PolarAngleAxis dataKey="sdg" />
              <Radar
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="text-sm font-semibold text-slate-700 mb-4">
          SDG Breakdown
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.sdgs || {}).map(([sdg, value]: any) => {
            const percent = (value.score * 100).toFixed(0);

            return (
              <div
                key={sdg}
                className="p-4 rounded-xl border bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    SDG {sdg}
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {percent}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= SDG SECTION ================= */
function SDGSection({ data }: { data: any }) {
  const [openEvidence, setOpenEvidence] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([sdg, entries]: any) => {
        if (!Array.isArray(entries)) return null;

        return (
          <div key={sdg} className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow">
              {sdg}
            </div>

            {entries.map((item: any, idx: number) => {
              const key = `${sdg}-${idx}`;
              const isOpen = openEvidence === key;

              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl border shadow-sm p-6 space-y-5 hover:shadow-md transition"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Target
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {item?.target}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Indicator
                    </div>
                    <div className="text-sm font-medium text-indigo-700">
                      {item?.indicator}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border p-5 rounded-xl">
                    <div className="text-xs font-semibold text-indigo-500 uppercase mb-2">
                      Insight Summary
                    </div>
                    <div className="text-sm text-slate-800">
                      💡 {item?.summary}
                    </div>
                  </div>

                  {item?.evidences && (
                    <button
                      onClick={() => setOpenEvidence(isOpen ? null : key)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      {isOpen ? "Hide Evidence" : "View Evidence"}
                    </button>
                  )}

                  {isOpen && item?.evidences && (
                    <div className="space-y-4 pt-2 border-t">
                      {Object.entries(item.evidences).map(([q, list]: any) => (
                        <div key={q} className="space-y-2">
                          <div className="text-xs font-semibold text-slate-500">
                            {q}
                          </div>

                          {list.map((ev: any, i: number) => (
                            <div
                              key={i}
                              className="bg-slate-50 border rounded-lg p-4 text-sm"
                            >
                              <div>{ev.content}</div>

                              <div className="flex justify-between text-xs text-slate-500 mt-3">
                                <span>📄 {ev.document}</span>
                                <span>📍 Page {ev.page_number}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ================= MAIN ================= */
export default function GSProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [meta, setMeta] = useState<any>(null);
  const [sdgData, setSdgData] = useState<any>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    async function load() {
      try {
        console.log("BASE_URL:", BASE_URL); // debug once

        const [metaRes, urlRes, scoreRes] = await Promise.all([
          fetch(`${BASE_URL}/project/${projectId}`),
          fetch(`${BASE_URL}/project/${projectId}/llm-url`),
          fetch(`${BASE_URL}/project/${projectId}/score`),
        ]);

        const rawMeta = await metaRes.json();
        setMeta(normalizeMeta(rawMeta));

        if (urlRes.ok) {
          const { url } = await urlRes.json();
          const s3Res = await fetch(url);
          const s3Json = await s3Res.json();
          setSdgData(s3Json);
        } else {
          setSdgData(null);
        }

        setScoreData(scoreRes.ok ? await scoreRes.json() : null);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!meta) return <div className="p-10">Project not found</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div className="flex justify-between">
            <div>
              <div className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                {projectId}
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 max-w-2xl">
                {meta.project_name}
              </h1>
            </div>

            <div className="flex gap-3">
              <div className="bg-indigo-50 px-4 py-2 rounded-xl text-center">
                <div className="text-xs text-slate-500">Credits</div>
                <div className="font-bold text-indigo-700">
                  {meta.annual_emission_reduction?.toLocaleString()}
                </div>
              </div>

              <div className="bg-emerald-50 px-4 py-2 rounded-xl text-center">
                <div className="text-xs text-slate-500">Status</div>
                <div className="font-bold text-emerald-700">
                  {meta.project_status}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-sm text-slate-600">{meta.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="font-semibold text-sm">
                    {meta.state_province}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs text-slate-500">Start</div>
                  <div className="font-semibold text-sm">
                    {meta.registration_date}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs text-slate-500">End</div>
                  <div className="font-semibold text-sm">
                    {meta.crediting_period}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[300px] rounded-xl overflow-hidden border shadow-sm">
              <Map lat={meta.latitude} lon={meta.longitude} />
            </div>
          </div>
        </div>

        <ScoreSection data={scoreData} />
        <SDGSection data={sdgData} />
      </div>
    </main>
  );
}
