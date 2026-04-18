"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [projectId, setProjectId] = useState("");
  const [source, setSource] = useState<"verra" | "gs">("verra");

  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const [score, setScore] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // =========================================================
  // 🔥 Dynamic project ID
  // =========================================================
  const fullProjectId = projectId
    ? source === "verra"
      ? `VCS_${projectId}`
      : `GS_${projectId}`
    : "";

  // =========================================================
  // 🔥 Dynamic registry link (FIXED GS LINK)
  // =========================================================
  const projectLink =
    source === "verra"
      ? `https://registry.verra.org/app/projectDetail/VCS/${projectId}`
      : `https://registry.goldstandard.org/projects/${projectId}`;

  // =========================================================
  // 🔥 FETCH SCORE ONLY
  // =========================================================
  const fetchResults = async () => {
    try {
      const scoreRes = await fetch(
        `http://localhost:8000/project/${fullProjectId}/score`,
      );
      const scoreData = await scoreRes.json();
      setScore(scoreData);
    } catch (e) {
      console.error("Fetch results failed", e);
    }
  };

  // =========================================================
  // 🚀 START INGESTION (FIXED WS TIMING)
  // =========================================================
  const startIngestion = async () => {
    if (!fullProjectId) return;

    setStatus("running");
    setStep("Initializing...");
    setHistory(["Initializing..."]);
    setScore(null);

    const ws = new WebSocket(`ws://localhost:8000/ws/${fullProjectId}`);
    wsRef.current = ws;

    // 🔥 IMPORTANT: wait until WS connects BEFORE starting backend
    ws.onopen = async () => {
      await fetch(`http://localhost:8000/project/${fullProjectId}/start`, {
        method: "POST",
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg = data.step;
        const msgStatus = data.status;

        setStep(msg);

        setHistory((prev) => {
          if (prev[prev.length - 1] !== msg) {
            return [...prev, msg];
          }
          return prev;
        });

        if (msgStatus === "done") {
          setStatus("done");
          ws.close();
          fetchResults();
        }

        if (msgStatus === "failed") {
          setStatus("failed");
          ws.close();
        }
      } catch (err) {
        console.error("❌ WS parse error:", err);
      }
    };

    ws.onerror = () => {
      setStatus("failed");
      ws.close();
    };
  };

  // =========================================================
  // 🔥 PROGRESS BAR
  // =========================================================
  const progressPercent =
    status === "running"
      ? Math.min((history.length / 30) * 100, 95)
      : status === "done"
        ? 100
        : 0;

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-10 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🌱 Carbon Project Evaluator
        </h1>

        {/* INPUT + DROPDOWN */}
        <div className="flex gap-3 mb-6">
          {/* 🔥 SOURCE SELECT */}
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value as "verra" | "gs");

              // 🔥 reset state on switch
              setProjectId("");
              setHistory([]);
              setStep("");
              setScore(null);
              setStatus("idle");
            }}
            className="px-3 py-3 rounded-lg border border-gray-300 bg-white text-sm font-semibold"
          >
            <option value="verra">VERRA</option>
            <option value="gs">GOLD STANDARD</option>
          </select>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Enter project ID (e.g. 1071)"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* BUTTON */}
          <button
            onClick={startIngestion}
            className="px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Evaluate
          </button>
        </div>

        {/* STATUS */}
        <div className="mb-4 text-sm">
          <strong>Status:</strong>{" "}
          <span
            className={`font-medium ${
              status === "running"
                ? "text-yellow-600"
                : status === "done"
                  ? "text-green-600"
                  : status === "failed"
                    ? "text-red-600"
                    : "text-gray-500"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="mb-5 text-sm text-gray-700">
          <strong>Current:</strong> {step}
        </div>

        {/* PROGRESS */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* TIMELINE */}
        <div className="mb-6">
          <h4 className="mb-2 font-semibold text-gray-700">Progress</h4>

          <div className="flex flex-col gap-2 max-h-64 overflow-auto pr-1">
            {history.map((h, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
                  index === history.length - 1
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {index === history.length - 1 ? "⏳" : "✔"} {h}
              </div>
            ))}
          </div>
        </div>

        {/* FINAL STATUS */}
        {status === "done" && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-800 font-semibold text-sm">
            ✅ Analysis completed successfully
          </div>
        )}

        {status === "failed" && (
          <div className="mt-4 p-4 bg-red-100 rounded-lg text-red-800 font-semibold text-sm">
            ❌ Failed. Check backend logs.
          </div>
        )}

        {/* SCORE */}
        {score && (
          <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-2">
              📊 Project Score
            </h3>

            <div className="text-3xl font-bold text-blue-700 mb-3">
              {Math.round(score.final_score * 100)}%
            </div>

            {/* 🔗 DYNAMIC LINK */}
            <a
              href={projectLink}
              target="_blank"
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              🔗 View on {source === "verra" ? "Verra" : "Gold Standard"} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
