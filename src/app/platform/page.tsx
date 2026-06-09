"use client";

import { useMemo, useRef, useState } from "react";

/* =========================================================
   ENV
========================================================= */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const WS_URL = BASE_URL.replace(/^http/, "ws");

/* =========================================================
   TYPES
========================================================= */
type Status = "idle" | "running" | "done" | "failed";

type PipelineStep = {
  stage: string;
  message: string;
  progress: number;
  status: string;
};

type DocumentItem = {
  name: string;
  url: string;
};

type IndicatorProgress = {
  current: number;
  total: number;
  indicator: string;
};

type PdfProgress = {
  current: number;
  total: number;
  document: string;
};

/* =========================================================
   MAIN
========================================================= */
export default function Home() {
  const [projectId, setProjectId] = useState("");
  const [source, setSource] = useState<"verra" | "gs">("verra");

  const [status, setStatus] = useState<Status>("idle");

  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [indicatorProgress, setIndicatorProgress] =
    useState<IndicatorProgress | null>(null);

  const [pdfProgress, setPdfProgress] = useState<PdfProgress | null>(null);

  const [score, setScore] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  /* =========================================================
     PROJECT ID
  ========================================================= */
  const fullProjectId = useMemo(() => {
    if (!projectId) return "";

    return source === "verra" ? `VCS_${projectId}` : `GS_${projectId}`;
  }, [projectId, source]);

  /* =========================================================
     PROJECT LINK
  ========================================================= */
  const projectLink =
    source === "verra" ? `/verra/${fullProjectId}` : `/gs/${fullProjectId}`;

  /* =========================================================
     CURRENT STEP
  ========================================================= */
  const currentStep = pipelineSteps[pipelineSteps.length - 1];

  /* =========================================================
     PROGRESS
  ========================================================= */
  const progressPercent =
    currentStep?.progress ?? (status === "done" ? 100 : 0);

  /* =========================================================
     RESET
  ========================================================= */
  const resetState = () => {
    setPipelineSteps([]);
    setDocuments([]);
    setIndicatorProgress(null);
    setPdfProgress(null);
    setScore(null);
  };

  /* =========================================================
     START INGESTION
  ========================================================= */
  const startIngestion = async () => {
    if (!fullProjectId) return;

    resetState();

    setStatus("running");

    const ws = new WebSocket(`${WS_URL}/ws/${fullProjectId}`);

    wsRef.current = ws;

    ws.onopen = async () => {
      await fetch(`${BASE_URL}/project/${fullProjectId}/start`, {
        method: "POST",
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          /* =========================================
             PIPELINE STEP
          ========================================= */
          case "pipeline_step":
            setPipelineSteps((prev) => {
              const exists = prev.find((p) => p.stage === data.stage);

              if (exists) {
                return prev.map((p) => (p.stage === data.stage ? data : p));
              }

              return [...prev, data];
            });

            break;

          /* =========================================
             DOCUMENTS
          ========================================= */
          case "documents_selected":
            setDocuments(data.documents || []);
            break;

          /* =========================================
             PDF PROGRESS
          ========================================= */
          case "pdf_progress":
            setPdfProgress({
              current: data.current,
              total: data.total,
              document: data.document,
            });

            break;

          /* =========================================
             INDICATOR PROGRESS
          ========================================= */
          case "indicator_progress":
            setIndicatorProgress({
              current: data.current,
              total: data.total,
              indicator: data.indicator,
            });

            break;

          /* =========================================
             FINAL SCORE
          ========================================= */
          case "final_score":
            setScore(data.score);
            setStatus("done");
            ws.close();
            break;

          /* =========================================
             ERROR
          ========================================= */
          case "pipeline_error":
            setStatus("failed");
            ws.close();
            break;

          default:
            break;
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => {
      setStatus("failed");
      ws.close();
    };
  };

  /* =========================================================
     STEP LABELS
  ========================================================= */
  const prettyStage = (stage: string) => {
    return stage.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f0fdf4] to-[#ecfeff] overflow-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* =====================================================
            HERO
        ===================================================== */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm mb-5 font-medium">
            ● AI Sustainability Intelligence Platform
          </div>

          <h1 className="text-5xl font-black leading-tight mb-4 text-gray-900">
            Carbon Project
            <br />
            Intelligence Engine
          </h1>

          <p className="text-gray-600 max-w-2xl text-lg">
            Evaluate carbon projects using AI-powered retrieval, semantic
            analysis, SDG reasoning, and sustainability intelligence scoring.
          </p>
        </div>

        {/* =====================================================
            INPUT PANEL
        ===================================================== */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value as "verra" | "gs");

                setProjectId("");
                resetState();
                setStatus("idle");
              }}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
            >
              <option value="verra">VERRA Registry</option>

              <option value="gs">Gold Standard Registry</option>
            </select>

            <input
              type="text"
              placeholder="Enter Project ID (e.g. 1071)"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500"
            />

            <button
              onClick={startIngestion}
              disabled={!projectId || status === "running"}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-white hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
            >
              {status === "running"
                ? "Running Analysis..."
                : "Start AI Analysis"}
            </button>
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="xl:col-span-2 space-y-8">
            {/* =============================================
                PIPELINE STATUS
            ============================================= */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI Pipeline Execution
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Live realtime sustainability analysis workflow
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    status === "running"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "done"
                        ? "bg-emerald-100 text-emerald-700"
                        : status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {status.toUpperCase()}
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm text-gray-500">
                  <span>Overall Progress</span>

                  <span>{Math.round(progressPercent)}%</span>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700"
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
              </div>

              {/* CURRENT STEP */}
              {currentStep && (
                <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-sm text-emerald-700 mb-2 font-semibold">
                    CURRENT EXECUTION STEP
                  </div>

                  <div className="text-lg font-semibold text-gray-900">
                    {currentStep.message}
                  </div>
                </div>
              )}

              {/* TIMELINE */}
              <div className="space-y-5">
                {pipelineSteps.map((step, index) => {
                  const isLatest = index === pipelineSteps.length - 1;

                  return (
                    <div key={step.stage} className="flex gap-4">
                      {/* CIRCLE */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-4 ${
                            isLatest
                              ? "border-emerald-400 bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                              : "border-cyan-400 bg-cyan-400"
                          }`}
                        />

                        {index !== pipelineSteps.length - 1 && (
                          <div className="w-[2px] h-16 bg-gray-200 mt-2" />
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {prettyStage(step.stage)}
                          </h3>

                          <span className="text-sm text-gray-500">
                            {step.progress}%
                          </span>
                        </div>

                        <p className="text-gray-500 mt-1">{step.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =============================================
                INDICATOR ANALYSIS
            ============================================= */}
            {indicatorProgress && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      SDG Intelligence Analysis
                    </h2>

                    <p className="text-gray-500 mt-1">
                      AI evaluating sustainability indicators
                    </p>
                  </div>

                  <div className="text-emerald-600 font-bold text-lg">
                    {indicatorProgress.current}/{indicatorProgress.total}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                      style={{
                        width: `${
                          (indicatorProgress.current /
                            indicatorProgress.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    CURRENT INDICATOR
                  </div>

                  <div className="text-gray-900 font-medium">
                    {indicatorProgress.indicator}
                  </div>
                </div>
              </div>
            )}

            {/* =============================================
                FINAL SCORE
            ============================================= */}
            {score !== null && (
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 rounded-3xl p-10">
                <div className="text-center">
                  <div className="text-sm uppercase tracking-[0.3em] text-emerald-700 mb-5 font-semibold">
                    Sustainability Intelligence Score
                  </div>

                  <div className="text-8xl font-black bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent mb-4">
                    {Math.round(score * 100)}%
                  </div>

                  <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                    AI-powered sustainability intelligence analysis completed
                    successfully.
                  </p>

                  <a
                    href={projectLink}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white font-semibold hover:scale-[1.02] transition-all"
                  >
                    View Full Project Dashboard →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}
          <div className="space-y-8">
            {/* =============================================
                DOCUMENT PANEL
            ============================================= */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Selected Documents
              </h2>

              <p className="text-gray-500 mb-6">
                AI-selected documents used for sustainability analysis
              </p>

              {/* PDF PROGRESS */}
              {pdfProgress && (
                <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-sm font-semibold text-emerald-700 mb-1">
                    Processing PDF {pdfProgress.current}/{pdfProgress.total}
                  </div>

                  <div className="text-sm text-gray-700 break-words">
                    {pdfProgress.document}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {documents.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No documents loaded yet.
                  </div>
                )}

                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📄</div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 break-words">
                          {doc.name}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          Selected for semantic analysis
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
