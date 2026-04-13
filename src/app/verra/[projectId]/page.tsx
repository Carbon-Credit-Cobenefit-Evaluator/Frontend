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

/* ================= SCORE SECTION (UPDATED ONLY) ================= */
function ScoreSection({ data }: { data: any }) {
  if (!data) return null;

  const finalScore = (data.final_score * 100).toFixed(1);

  const sdgArray = Object.entries(data.sdgs || {}).map(([sdg, value]: any) => ({
    sdg: `SDG ${sdg}`,
    score: Number((value.score * 100).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow">
        Impact Score Overview
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* BIG SCORE */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg flex flex-col justify-center">
          <div className="text-sm opacity-80">Final Score</div>
          <div className="text-5xl font-extrabold mt-2">{finalScore}%</div>

          <div className="mt-6 text-xs opacity-80">Sector: {data.sector}</div>

          <div className="text-xs opacity-80">
            SDGs Covered: {Object.keys(data.sdgs || {}).length}
          </div>
        </div>

        {/* RADAR */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 h-[300px]">
          <div className="text-sm font-semibold text-slate-700 mb-2">
            SDG Distribution
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={sdgArray}>
              <PolarGrid />
              <PolarAngleAxis dataKey="sdg" />
              <Radar dataKey="score" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MINIMAL SDG GRID */}
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
                      {item?.target || "No target"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                      Indicator
                    </div>
                    <div className="text-sm font-medium text-indigo-700">
                      {item?.indicator || "No indicator"}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border p-5 rounded-xl">
                    <div className="text-xs font-semibold text-indigo-500 uppercase mb-2">
                      Insight Summary
                    </div>
                    <div className="text-sm text-slate-800">
                      💡 {item?.summary || "No summary available"}
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
                      {Object.entries(item.evidences || {}).map(
                        ([question, list]: any) => {
                          if (!Array.isArray(list)) return null;

                          return (
                            <div key={question} className="space-y-2">
                              <div className="text-xs font-semibold text-slate-500">
                                {question}
                              </div>

                              {list.map((ev: any, i: number) => (
                                <div
                                  key={i}
                                  className="bg-slate-50 border rounded-lg p-4 text-sm"
                                >
                                  <div className="text-slate-700">
                                    {ev?.content || "No content"}
                                  </div>

                                  <div className="flex justify-between text-xs text-slate-500 mt-3">
                                    <span>📄 {ev?.document || "Unknown"}</span>
                                    <span>
                                      📍 Page {ev?.page_number || "-"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        },
                      )}
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

/* ================= MAIN PAGE ================= */

export default function VerraProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [meta, setMeta] = useState<any>(null);
  const [sdgData, setSdgData] = useState<any>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cleanId = projectId?.replace("VCS_", "");

  useEffect(() => {
    if (!projectId || !cleanId) return;

    async function load() {
      try {
        const [metaRes, sdgRes, scoreRes] = await Promise.all([
          fetch(`http://localhost:8000/project/${projectId}`),
          fetch(`http://localhost:8000/project/${projectId}/llm`),
          fetch(`http://localhost:8000/project/${projectId}/score`),
        ]);

        if (!metaRes.ok) throw new Error("Meta fetch failed");

        const metaJson = await metaRes.json();
        const sdgJson = sdgRes.ok ? await sdgRes.json() : null;
        const scoreJson = scoreRes.ok ? await scoreRes.json() : null;

        setMeta(metaJson || null);
        setSdgData(sdgJson || null);
        setScoreData(scoreJson || null);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId, cleanId]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!meta) return <div className="p-10">Project not found</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HERO */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                {projectId}
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 max-w-2xl">
                {meta?.project_name}
              </h1>
            </div>

            <div className="flex gap-3">
              <div className="bg-indigo-50 px-4 py-2 rounded-xl text-center">
                <div className="text-xs text-slate-500">Credits</div>
                <div className="font-bold text-indigo-700">
                  {meta?.annual_emission_reduction?.toLocaleString() || "-"}
                </div>
              </div>

              <div className="bg-emerald-50 px-4 py-2 rounded-xl text-center">
                <div className="text-xs text-slate-500">Status</div>
                <div className="font-bold text-emerald-700">
                  {meta?.project_status || "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-sm text-slate-600">{meta?.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="font-semibold text-sm">
                    {meta?.state_province || "-"}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs text-slate-500">Registered</div>
                  <div className="font-semibold text-sm">
                    {meta?.registration_date || "-"}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs text-slate-500">Crediting</div>
                  <div className="font-semibold text-sm">
                    {meta?.crediting_period || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[300px] rounded-xl overflow-hidden border shadow-sm">
              <Map lat={meta?.latitude} lon={meta?.longitude} />
            </div>
          </div>
        </div>

        {/* SCORE */}
        <ScoreSection data={scoreData} />

        {/* SDG DETAILS */}
        <SDGSection data={sdgData} />
      </div>
    </main>
  );
}
