"use client";


import { useEffect, useMemo, useState } from "react";
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
   SDG-1 RULE LABELS (CLIENT-FRIENDLY)
========================================================= */

const SDG1_RULES: Record<string, string> = {
  O1: "Income-generating assets provided",
  O2: "Employment created",
  O3: "Training or capacity building",
  O4: "Subsidized technology or inputs",
  O5: "Financial assistance or support",
  O6: "Community infrastructure created",
  R1: "Household expenditure reduction",
  R2: "Increase in productive time",
  R3: "Increase in disposable income",
  R4: "Improved livelihood opportunities",
  R5: "Increased access to basic services",
  R6: "Reduced vulnerability of low-income groups",
  I1: "General poverty reduction",
  I2: "Impact on poverty indicators",
  I3: "Empowerment of vulnerable groups",
  I4: "Inclusive economic growth",
  I5: "Long-term resilience building",
};

/* =========================================================
   UTILS
========================================================= */

function cn(...c: Array<string | undefined | false | null>) {
  return c.filter(Boolean).join(" ");
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
      number
    ];
  }, [meta]);

  if (loading)
    return (
      <Shell>
        <Skeleton />
      </Shell>
    );
  if (error)
    return (
      <Shell>
        <ErrorBox msg={error} />
      </Shell>
    );
  
function OSMEmbedMap({
  lat,
  lon,
  name,
  zoom = 12, // ✅ increase this for more zoom
}: {
  lat: number;
  lon: number;
  name?: string;
  zoom?: number;
}) {
  // ✅ CARTO Voyager tiles: typically English labels
  // Note: This is a Leaflet map embedded via a small HTML page in an iframe (no react-leaflet).
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

    L.marker([${lat}, ${lon}]).addTo(map)
      .bindPopup(${JSON.stringify(name ?? "Project location")})
      .openPopup();
  </script>
</body>
</html>
  `.trim();

  const srcDoc = html;

  return (
    <div className="h-[300px] rounded-2xl overflow-hidden border bg-white">
      <iframe
        title={name ?? "Project location"}
        srcDoc={srcDoc}
        className="h-full w-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}


  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        {/* ================= HEADER ================= */}

        <section className="rounded-3xl border bg-white/70 p-6 backdrop-blur shadow">
          <h1 className="text-3xl font-extrabold">{meta.resourceName}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {meta.description}
          </p>
        </section>

        {/* ================= FACTS + MAP ================= */}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Project facts">
            <Grid>
              <Info label="Project ID" value={meta.resourceIdentifier} mono />
              <Info label="Category" value={meta.primary_project_category} />
              <Info label="Subcategory" value={meta.subcategory} />
              <Info label="Acreage" value={meta.project_acreage} />
              <Info
                label="Annual emission reduction"
                value={meta.estimated_annual_emission_reduction}
              />
            </Grid>
          </Card>

          <Card title="Location">
            {center ? (
              <OSMEmbedMap
                lat={center[0]}
                lon={center[1]}
                name={meta.resourceName}
              />
            ) : (
              <p className="text-sm text-slate-500">No location data.</p>
            )}
          </Card>
        </div>

        {/* ================= SDG SECTION ================= */}

        <section className="rounded-3xl border bg-white/70 p-6 backdrop-blur shadow">
          <h2 className="text-xl font-extrabold mb-6">SDG Impact Evaluation</h2>

          <div className="grid grid-cols-[260px_1fr] gap-6">
            {/* ---------- Sidebar ---------- */}
            <aside className="space-y-2">
              {SDGS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSDG(s)}
                  className={cn(
                    "w-full rounded-2xl border px-3 py-2 text-left text-sm font-bold transition",
                    activeSDG.key === s.key
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </aside>

            {/* ---------- SDG Detail ---------- */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              {sdgLoading && (
                <p className="text-sm text-slate-600">Loading SDG analysis…</p>
              )}
              {!sdgLoading && !sdgData && (
                <p className="text-sm text-slate-500">
                  No assessment available.
                </p>
              )}

              {sdgData && <SDGDetail sdg={sdgData} />}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

/* =========================================================
   SDG DETAIL PANEL
========================================================= */

function SDGDetail({ sdg }: { sdg: any }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-extrabold">
          {sdg.sdg.replaceAll("_", " ")}
        </h3>
        <ScoreBadge score={sdg.final_score_0_100} />
      </div>

      <Interpretation counts={sdg.counts} />

      <LevelBars components={sdg.components} />

      <Evidence evidence={sdg.top_evidence} />
    </div>
  );
}

/* =========================================================
   SUPPORT UI
========================================================= */

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-center text-emerald-700 ring-1 ring-emerald-200">
      <div className="text-xs font-bold uppercase">Score</div>
      <div className="text-2xl font-extrabold">{score.toFixed(1)} / 100</div>
    </div>
  );
}

function Interpretation({ counts }: { counts: any }) {
  const o = counts?.by_level_unique_sentences?.OUTPUT ?? 0;
  const r = counts?.by_level_unique_sentences?.OUTCOME ?? 0;
  const i = counts?.by_level_unique_sentences?.IMPACT ?? 0;

  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
      This project demonstrates <b>{o} output-level</b> impacts,
      {r === 0 &&
        i === 0 &&
        " but lacks verified long-term outcome or impact evidence."}
    </div>
  );
}

function LevelBars({ components }: { components: any }) {
  const rows = [
    { k: "OUTPUT", label: "Outputs", v: components.output_raw, cap: 30 },
    { k: "OUTCOME", label: "Outcomes", v: components.outcome_raw, cap: 25 },
    { k: "IMPACT", label: "Impacts", v: components.impact_raw, cap: 10 },
  ];

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.k}>
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>{r.label}</span>
            <span>{r.v}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-emerald-500"
              style={{ width: `${(r.v / r.cap) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Evidence({ evidence }: { evidence: any }) {
  if (!evidence || Object.keys(evidence).length === 0)
    return <p className="text-sm text-slate-500">No evidence extracted.</p>;

  return (
    <div>
      <h4 className="font-extrabold mb-2">Key Evidence</h4>
      <div className="space-y-3">
        {Object.entries(evidence).map(([rule, items]: any) => (
          <div key={rule} className="rounded-2xl border p-4">
            <div className="text-xs font-bold text-emerald-700 mb-2">
              {rule} — {SDG1_RULES[rule] ?? "Unknown rule"}
            </div>
            {items.map((x: any, i: number) => (
              <div key={i} className="rounded-xl bg-slate-50 p-3 mb-2">
                <p className="text-sm">{x.sentence}</p>
                <div className="text-xs text-slate-500 mt-1">
                  Confidence: {(x.probability * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   GENERIC UI
========================================================= */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {children}
    </main>
  );
}

function Card({ title, children }: any) {
  return (
    <section className="rounded-3xl border bg-white/70 p-6 backdrop-blur shadow">
      <h3 className="text-lg font-extrabold mb-4">{title}</h3>
      {children}
    </section>
  );
}

function Grid({ children }: any) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function Info({ label, value, mono }: any) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-xs font-bold text-slate-600">{label}</div>
      <div className={cn("text-sm font-extrabold", mono && "font-mono")}>
        {value ?? "—"}
      </div>
    </div>
  );
}

function Skeleton() {
  return <div className="h-screen animate-pulse bg-white/60" />;
}

function ErrorBox({ msg }: { msg: string }) {
  return <div className="p-10 text-rose-600">{msg}</div>;
}
