"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

/* =========================================================
   CONFIG
========================================================= */

const API_BASE = "http://127.0.0.1:8000";

/* =========================================================
   SDG REGISTRY
========================================================= */

const SDGS = [
  { key: "SDG_1_No_Poverty", label: "SDG 1 – No Poverty" },
  { key: "SDG_2_Zero_Hunger", label: "SDG 2 – Zero Hunger" },
  { key: "SDG_3_Good_Health", label: "SDG 3 – Good Health" },
  { key: "SDG_4_Quality_Education", label: "SDG 4 – Quality Education" },
  { key: "SDG_5_Gender_Equality", label: "SDG 5 – Gender Equality" },
  { key: "SDG_6_Clean_Water", label: "SDG 6 – Clean Water" },
  { key: "SDG_7_Affordable_Energy", label: "SDG 7 – Energy" },
  { key: "SDG_8_Decent_Work", label: "SDG 8 – Decent Work" },
  { key: "SDG_9_Industry", label: "SDG 9 – Industry" },
  { key: "SDG_10_Reduced_Inequality", label: "SDG 10 – Inequality" },
  { key: "SDG_11_Sustainable_Cities", label: "SDG 11 – Cities" },
  { key: "SDG_12_Responsible_Consumption", label: "SDG 12 – Consumption" },
  { key: "SDG_13_Climate_Action", label: "SDG 13 – Climate Action" },
  { key: "SDG_14_Life_Below_Water", label: "SDG 14 – Oceans" },
  { key: "SDG_15_Life_On_Land", label: "SDG 15 – Life on Land" },
  { key: "SDG_16_Peace_Justice", label: "SDG 16 – Peace" },
  { key: "SDG_17_Partnerships", label: "SDG 17 – Partnerships" },
];

/* =========================================================
   UTILS
========================================================= */

function cn(...c: Array<string | undefined | false | null>) {
  return c.filter(Boolean).join(" ");
}

function clamp(n: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n));
}

function formatNum(x: any) {
  if (x === null || x === undefined) return "—";
  const n = Number(x);
  if (!Number.isFinite(n)) return String(x);
  return n.toLocaleString();
}

function shortText(s: string, max = 220) {
  if (!s) return "";
  const t = s.trim();
  return t.length > max ? t.slice(0, max).trim() + "…" : t;
}

type EvidenceItem = { sentence: string; probability?: number };
type EvidenceByRule = Record<string, EvidenceItem[]>;

function groupEvidenceByLevel(evidenceByRule: EvidenceByRule | null) {
  const out: Record<"OUTPUT" | "OUTCOME" | "IMPACT", EvidenceItem[]> = {
    OUTPUT: [],
    OUTCOME: [],
    IMPACT: [],
  };
  if (!evidenceByRule) return out;

  for (const [rule, items] of Object.entries(evidenceByRule)) {
    const prefix = (rule || "").trim().toUpperCase().slice(0, 1);
    const level =
      prefix === "O"
        ? "OUTPUT"
        : prefix === "R"
          ? "OUTCOME"
          : prefix === "I"
            ? "IMPACT"
            : null;
    if (!level) continue;
    for (const it of items || []) {
      if (!it?.sentence) continue;
      out[level].push(it);
    }
  }

  // sort by probability desc
  (Object.keys(out) as Array<keyof typeof out>).forEach((k) => {
    out[k] = out[k]
      .slice()
      .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0));
  });

  return out;
}

/* =========================================================
   PAGE
========================================================= */

export default function VerraProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSDG, setActiveSDG] = useState(SDGS[0]);
  const [sdgData, setSdgData] = useState<any | null>(null);
  const [sdgLoading, setSdgLoading] = useState(false);

  /* ---------- Load metadata ---------- */

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/projects/verra/${projectId}/metadata`, {
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Metadata not found");
        return r.json();
      })
      .then(setMeta)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  /* ---------- Load SDG data ---------- */

  useEffect(() => {
    if (!projectId || !activeSDG) return;

    setSdgLoading(true);
    setSdgData(null);

    fetch(`${API_BASE}/projects/verra/${projectId}/sdg/${activeSDG.key}`, {
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error("No SDG data");
        return r.json();
      })
      .then(setSdgData)
      .catch(() => setSdgData(null))
      .finally(() => setSdgLoading(false));
  }, [projectId, activeSDG]);

  const center = useMemo(() => {
    if (!meta?.location) return null;
    return [meta.location.latitude, meta.location.longitude] as [
      number,
      number,
    ];
  }, [meta]);

  const topDocs = useMemo(() => {
    const docs: any[] = meta?.documents ?? [];
    // prioritize common types for UI
    const priority = [
      "Project Description",
      "Monitoring Report",
      "Verification Report",
      "Validation Report",
      "CCB Project Description",
      "CCB Monitoring Report",
      "SD VISta Draft Project Description",
    ];
    const rank = (t: string) => {
      const i = priority.indexOf(t);
      return i === -1 ? 999 : i;
    };
    return docs
      .slice()
      .sort((a, b) => rank(a.documentType) - rank(b.documentType))
      .slice(0, 6);
  }, [meta]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen msg={error} />;

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* ================= HERO ================= */}
        <Hero meta={meta} />

        {/* ================= MAIN GRID ================= */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-6 h-fit">
            <GlassCard>
              <h3 className="text-sm font-extrabold text-slate-800 mb-3">
                Project snapshot
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <MiniStat
                  label="Project ID"
                  value={meta?.resourceIdentifier ?? "—"}
                  mono
                />
                <MiniStat
                  label="Status"
                  value={meta?.vcs_project_status ?? "—"}
                />
                <MiniStat
                  label="Category"
                  value={meta?.primary_project_category ?? "—"}
                />
                <MiniStat
                  label="Subcategory"
                  value={meta?.subcategory ?? "—"}
                />
                <MiniStat
                  label="Acreage"
                  value={meta?.project_acreage ?? "—"}
                />
                <MiniStat
                  label="Est. annual ER"
                  value={formatNum(meta?.estimated_annual_emission_reduction)}
                />
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-extrabold text-slate-800 mb-3">
                Location
              </h3>
              {center ? (
                <OSMEmbedMap
                  lat={center[0]}
                  lon={center[1]}
                  name={meta?.resourceName}
                  zoom={9}
                />
              ) : (
                <EmptyNote>No location data.</EmptyNote>
              )}
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-extrabold text-slate-800 mb-3">
                Top documents
              </h3>
              {topDocs?.length ? (
                <div className="space-y-2">
                  {topDocs.map((d, idx) => (
                    <a
                      key={idx}
                      href={d.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="group block rounded-2xl border border-white/40 bg-white/70 p-3 hover:bg-white transition"
                      title={d.documentName}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-700">
                            {d.documentType ?? "Document"}
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 truncate">
                            {d.documentName ?? "—"}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Uploaded:{" "}
                            {d.uploadDate
                              ? new Date(d.uploadDate).toLocaleDateString()
                              : "—"}
                          </div>
                        </div>
                        <span className="mt-1 inline-flex rounded-xl px-2 py-1 text-xs font-bold bg-slate-900 text-white/90 opacity-90 group-hover:opacity-100">
                          Open
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <EmptyNote>No documents listed.</EmptyNote>
              )}
            </GlassCard>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="space-y-6">
            {/* SDG selector + results */}
            <GlassCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500">
                    Impact evaluation
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    SDG Co-Benefit Analysis
                  </h2>
                </div>

                <SDGPicker
                  active={activeSDG}
                  onChange={(k) =>
                    setActiveSDG(SDGS.find((x) => x.key === k) ?? SDGS[0])
                  }
                />
              </div>

              <div className="mt-5">
                {sdgLoading && <InlineLoading label="Running assessment…" />}
                {!sdgLoading && !sdgData && (
                  <div className="rounded-2xl border border-white/50 bg-white/60 p-6">
                    <div className="text-sm font-extrabold text-slate-800">
                      No assessment available
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      Run the pipeline for this SDG or check if outputs exist.
                    </div>
                  </div>
                )}

                {sdgData && <SDGPanel sdg={sdgData} />}
              </div>
            </GlassCard>

            {/* Extra: show raw description in a nice expandable box */}
            <GlassCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Project description
                  </h3>
                  <div className="text-xs text-slate-500">
                    From Verra metadata
                  </div>
                </div>
              </div>
              <Expander text={meta?.description ?? ""} />
            </GlassCard>
          </section>
        </div>
      </div>
    </Shell>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero({ meta }: { meta: any }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/50 bg-white/60 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/40 via-indigo-200/30 to-rose-200/30" />
      <div className="relative p-7 sm:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-bold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Registry: Verra
              <span className="mx-2 h-3 w-px bg-slate-300" />
              Project: {meta?.resourceIdentifier ?? "—"}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {meta?.resourceName ?? "Project"}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              {shortText(meta?.description ?? "", 260)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Pill label="Category" value={meta?.primary_project_category} />
            <Pill label="Subcategory" value={meta?.subcategory} />
            <Pill label="Status" value={meta?.vcs_project_status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 shadow-sm">
      <div className="text-[11px] font-bold text-slate-500">{label}</div>
      <div className="text-sm font-extrabold text-slate-900">
        {value ?? "—"}
      </div>
    </div>
  );
}

/* =========================================================
   SDG PANEL
========================================================= */

function SDGPanel({ sdg }: { sdg: any }) {
  const score100 = Number(sdg?.final_score_0_100 ?? 0);
  const o = sdg?.counts?.by_level_unique_sentences?.OUTPUT ?? 0;
  const r = sdg?.counts?.by_level_unique_sentences?.OUTCOME ?? 0;
  const i = sdg?.counts?.by_level_unique_sentences?.IMPACT ?? 0;

  // IMPORTANT: your backend removed top_evidence
  // so use evidence_by_rule, grouped into OUTPUT/OUTCOME/IMPACT.
  const grouped = useMemo(
    () =>
      groupEvidenceByLevel(
        (sdg?.evidence_by_rule ?? null) as EvidenceByRule | null,
      ),
    [sdg],
  );

  const outputRaw = Number(sdg?.components?.output_raw ?? 0);
  const outcomeRaw = Number(sdg?.components?.outcome_raw ?? 0);
  const impactRaw = Number(sdg?.components?.impact_raw ?? 0);

  return (
    <div className="mt-2 space-y-6">
      {/* Top row: score + quick interpretation */}
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <ScoreCard score={score100} />

        <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500">Interpretation</div>
          <div className="mt-2 text-sm text-slate-700 leading-relaxed">
            This assessment found <b className="text-slate-900">{o}</b>{" "}
            output-level evidence units,
            <b className="text-slate-900"> {r}</b> outcome-level units, and{" "}
            <b className="text-slate-900">{i}</b> impact-level units.
            {r === 0 && i === 0 ? (
              <span>
                {" "}
                That usually means the project shows **activities delivered**
                (outputs) but lacks stronger “change over time” evidence
                (outcomes/impacts) in the extracted documents.
              </span>
            ) : null}
          </div>

          {/* Small stats chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip label="Outputs" value={o} />
            <Chip label="Outcomes" value={r} />
            <Chip label="Impacts" value={i} />
            <Chip label="Penalties" value={(sdg?.penalties ?? []).length} />
          </div>
        </div>
      </div>

      {/* Level contribution bars */}
      <div className="grid gap-4 lg:grid-cols-3">
        <LevelCard
          title="Outputs"
          subtitle="Activities delivered"
          value={outputRaw}
          hint="More is better."
        />
        <LevelCard
          title="Outcomes"
          subtitle="Short/medium-term change"
          value={outcomeRaw}
          hint="Often harder to prove."
        />
        <LevelCard
          title="Impacts"
          subtitle="Long-term change"
          value={impactRaw}
          hint="Strongest evidence."
        />
      </div>

      {/* Evidence grouped by level (no O1/O2 etc shown) */}
      <EvidenceLevels grouped={grouped} />
    </div>
  );
}

/* =========================================================
   EVIDENCE (GROUPED BY OUTPUT / OUTCOME / IMPACT)
========================================================= */

function EvidenceLevels({
  grouped,
}: {
  grouped: Record<"OUTPUT" | "OUTCOME" | "IMPACT", EvidenceItem[]>;
}) {
  const [tab, setTab] = useState<"OUTPUT" | "OUTCOME" | "IMPACT">("OUTPUT");

  const tabs: Array<{ k: typeof tab; label: string; desc: string }> = [
    { k: "OUTPUT", label: "Outputs", desc: "What was done / delivered" },
    { k: "OUTCOME", label: "Outcomes", desc: "Behavior/conditions changed" },
    { k: "IMPACT", label: "Impacts", desc: "Long-term poverty reduction" },
  ];

  const list = grouped[tab] ?? [];
  const top = list.slice(0, 12);

  return (
    <div className="rounded-3xl border border-white/50 bg-white/70 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold text-slate-500">Evidence</div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Evidence highlights by level
          </h3>
          <div className="mt-1 text-sm text-slate-600">
            Showing evidence grouped into Output / Outcome / Impact (rule codes
            hidden).
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const count = grouped[t.k]?.length ?? 0;
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm font-extrabold transition border",
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white/80 text-slate-800 border-white/50 hover:bg-white",
                )}
              >
                {t.label}{" "}
                <span
                  className={cn(
                    "ml-1 text-xs",
                    active ? "text-white/80" : "text-slate-500",
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-slate-900">
              {tabs.find((x) => x.k === tab)?.label}
            </div>
            <div className="text-xs text-slate-600">
              {tabs.find((x) => x.k === tab)?.desc}
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500">
            Sorted by confidence (model probability)
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {top.length === 0 ? (
            <EmptyNote>No evidence found at this level.</EmptyNote>
          ) : (
            top.map((it, idx) => <EvidenceCard key={idx} item={it} />)
          )}
        </div>

        {list.length > top.length ? (
          <div className="mt-4 text-xs text-slate-500">
            Showing top {top.length} of {list.length}. (You can add “Show more”
            paging later.)
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EvidenceCard({ item }: { item: EvidenceItem }) {
  const prob = item?.probability ?? 0;
  const pct = Math.round(prob * 1000) / 10;

  return (
    <div className="group rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm hover:bg-white transition">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-800 leading-relaxed">
          {item.sentence}
        </p>
        <div className="shrink-0 text-right">
          <div className="text-[11px] font-bold text-slate-500">Confidence</div>
          <div className="text-sm font-extrabold text-slate-900">
            {pct.toFixed(1)}%
          </div>
          <div className="mt-2 h-2 w-24 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-2 bg-emerald-500"
              style={{ width: `${clamp(prob) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SCORE UI
========================================================= */

function ScoreCard({ score }: { score: number }) {
  const v = clamp(score / 100);
  return (
    <div className="rounded-3xl border border-white/50 bg-white/70 p-6 shadow-sm">
      <div className="text-xs font-bold text-slate-500">Final score</div>
      <div className="mt-2 flex items-center gap-5">
        <Ring value01={v} label={`${score.toFixed(1)}`} sub="/ 100" />
        <div className="space-y-2">
          <div className="text-sm font-extrabold text-slate-900">
            SDG Co-Benefit Strength
          </div>
          <div className="text-sm text-slate-700">
            A weighted mix of <b>Outputs</b>, <b>Outcomes</b>, and{" "}
            <b>Impacts</b> based on your SDG scoring config.
          </div>
          <div className="text-xs text-slate-500">
            Tip: Improving outcome/impact evidence usually lifts the score
            fastest.
          </div>
        </div>
      </div>
    </div>
  );
}

function Ring({
  value01,
  label,
  sub,
}: {
  value01: number;
  label: string;
  sub?: string;
}) {
  const size = 96;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - clamp(value01));

  return (
    <div className="relative h-[96px] w-[96px]">
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-emerald-500"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div className="text-xl font-extrabold text-slate-900">{label}</div>
        {sub ? (
          <div className="text-[11px] font-bold text-slate-500 -mt-1">
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LevelCard({
  title,
  subtitle,
  value,
  hint,
}: {
  title: string;
  subtitle: string;
  value: number;
  hint: string;
}) {
  // caps are just visual; tune as you like
  const cap = title === "Outputs" ? 40 : title === "Outcomes" ? 30 : 15;
  const w = clamp(value / cap) * 100;

  return (
    <div className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <div className="text-xs text-slate-600">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-slate-500">Raw</div>
          <div className="text-lg font-extrabold text-slate-900">
            {formatNum(value)}
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-2 bg-emerald-500" style={{ width: `${w}%` }} />
      </div>
      <div className="mt-2 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: any }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-bold text-slate-700">
      <span className="text-slate-500">{label}:</span> {value ?? 0}
    </div>
  );
}

/* =========================================================
   SDG PICKER
========================================================= */

function SDGPicker({
  active,
  onChange,
}: {
  active: { key: string; label: string };
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs font-bold text-slate-500">Select SDG</div>
      <select
        value={active.key}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-white/50 bg-white/80 px-3 py-2 text-sm font-extrabold text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-300"
      >
        {SDGS.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   MAP (Leaflet in iframe)
========================================================= */

function OSMEmbedMap({
  lat,
  lon,
  name,
  zoom = 9,
}: {
  lat: number;
  lon: number;
  name?: string;
  zoom?: number;
}) {
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map("map", { zoomControl: true }).setView([${lat}, ${lon}], ${zoom});
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    L.circleMarker([${lat}, ${lon}], {
      radius: 8,
      weight: 2,
      color: "#059669",
      fillColor: "#10b981",
      fillOpacity: 0.9
    }).addTo(map).bindPopup(${JSON.stringify(name ?? "Project location")}).openPopup();
  </script>
</body>
</html>
  `.trim();

  return (
    <div className="h-[280px] rounded-3xl overflow-hidden border border-white/50 bg-white shadow-sm">
      <iframe
        title={name ?? "Project location"}
        srcDoc={html}
        className="h-full w-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}

/* =========================================================
   GENERIC UI
========================================================= */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-100">
      {children}
      <footer className="mt-16 pb-10 text-center text-xs text-slate-500">
        SDG Co-Benefit Intelligence • Evidence-first scoring
      </footer>
    </main>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/50 bg-white/60 p-6 shadow-xl backdrop-blur">
      {children}
    </div>
  );
}

function MiniStat({
  label,
  value,
  mono,
}: {
  label: string;
  value: any;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-3 shadow-sm">
      <div className="text-[11px] font-bold text-slate-500">{label}</div>
      <div
        className={cn(
          "mt-1 text-sm font-extrabold text-slate-900",
          mono && "font-mono",
        )}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 text-sm text-slate-600">
      {children}
    </div>
  );
}

function InlineLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 p-4">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <div className="text-sm font-extrabold text-slate-800">{label}</div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-44 rounded-[28px] bg-white/60 border border-white/50 shadow-xl animate-pulse" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <div className="h-64 rounded-[28px] bg-white/60 border border-white/50 shadow-xl animate-pulse" />
            <div className="h-64 rounded-[28px] bg-white/60 border border-white/50 shadow-xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-80 rounded-[28px] bg-white/60 border border-white/50 shadow-xl animate-pulse" />
            <div className="h-56 rounded-[28px] bg-white/60 border border-white/50 shadow-xl animate-pulse" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ErrorScreen({ msg }: { msg: string }) {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[28px] border border-rose-200 bg-white/70 p-8 shadow-xl">
          <div className="text-sm font-extrabold text-rose-700">Error</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            Couldn’t load project
          </div>
          <div className="mt-3 text-sm text-slate-700">{msg}</div>
          <div className="mt-6 text-xs text-slate-500">
            Check your API server and CORS settings for {API_BASE}.
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* =========================================================
   DESCRIPTION EXPANDER
========================================================= */

function Expander({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const has = (text ?? "").trim().length > 0;
  if (!has) return <EmptyNote>No description.</EmptyNote>;

  return (
    <div className="mt-3">
      <p className="text-sm text-slate-700 leading-relaxed">
        {open ? text : shortText(text, 420)}
      </p>
      {(text?.length ?? 0) > 420 ? (
        <button
          onClick={() => setOpen((x) => !x)}
          className="mt-3 inline-flex items-center rounded-2xl border border-white/50 bg-white/70 px-4 py-2 text-xs font-extrabold text-slate-800 hover:bg-white transition"
        >
          {open ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}
