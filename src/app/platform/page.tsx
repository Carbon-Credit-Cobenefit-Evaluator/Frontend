"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  const fullProjectId = projectId ? `VCS_${projectId}` : "";

  // 🚀 Start ingestion
  const startIngestion = async () => {
    if (!projectId) return;

    setStatus("running");
    setStep("Initializing...");
    setHistory(["Initializing..."]);

    // 🔌 OPEN WEBSOCKET
    const ws = new WebSocket(`ws://localhost:8000/ws/${fullProjectId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const msg = data.step;
        const msgStatus = data.status;

        // update current step
        setStep(msg);

        // update history
        setHistory((prev) => {
          if (prev[prev.length - 1] !== msg) {
            return [...prev, msg];
          }
          return prev;
        });

        // handle completion
        if (msgStatus === "done") {
          setStatus("done");
          ws.close();
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
      console.error("❌ WebSocket error");
      setStatus("failed");
      ws.close();
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    // ▶️ START BACKEND JOB
    try {
      await fetch(`http://localhost:8000/project/${fullProjectId}/start`, {
        method: "POST",
      });
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  };

  // 🎯 progress %
  const progressPercent =
    status === "running"
      ? Math.min((history.length / 18) * 100, 100)
      : status === "done"
        ? 100
        : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4, #ecfeff)",
        padding: "40px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>🌱 Carbon Project Evaluator</h1>

        {/* INPUT */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter project ID (e.g. 1071)"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            style={{
              padding: "12px",
              flex: 1,
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "16px",
            }}
          />

          <button
            onClick={startIngestion}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "#16a34a",
              color: "white",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Evaluate
          </button>
        </div>

        {/* STATUS */}
        <div style={{ marginBottom: "10px" }}>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                status === "running"
                  ? "#f59e0b"
                  : status === "done"
                    ? "#16a34a"
                    : status === "failed"
                      ? "#dc2626"
                      : "#555",
            }}
          >
            {status}
          </span>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Current Step:</strong> {step}
        </div>

        {/* PROGRESS BAR */}
        <div
          style={{
            height: "12px",
            background: "#eee",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #16a34a, #22c55e)",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* TIMELINE */}
        <div>
          <h4 style={{ marginBottom: "10px" }}>📊 Progress Timeline</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.map((h, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background:
                    index === history.length - 1 ? "#dcfce7" : "#f1f5f9",
                  border:
                    index === history.length - 1
                      ? "1px solid #16a34a"
                      : "1px solid #e5e7eb",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {index === history.length - 1 ? "⏳" : "✔"} {h}
              </div>
            ))}
          </div>
        </div>

        {/* FINAL */}
        {status === "done" && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#dcfce7",
              borderRadius: "8px",
              color: "#166534",
              fontWeight: "bold",
            }}
          >
            ✅ Completed successfully!
          </div>
        )}

        {status === "failed" && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fee2e2",
              borderRadius: "8px",
              color: "#991b1b",
              fontWeight: "bold",
            }}
          >
            ❌ Failed. Check backend logs.
          </div>
        )}
      </div>
    </div>
  );
}
