// import { useState } from 'react';
// import { JobResponse, RunResponse, Registry } from "./types";
// import { API_BASE } from "@/lib/config";

export const API_BASE = 'http://127.0.0.1:8000';

// const [registry, setRegistry] = useState<Registry>('verra');
// const [id, setId] = useState('1566');

// const [jobId, setJobId] = useState<string | null>(null);
// const [job, setJob] = useState<JobResponse | null>(null);
// const [loading, setLoading] = useState(false);
// const [uiError, setUiError] = useState<string | null>(null);

// async function startJob() {
//   setUiError(null);
//   setLoading(true);
//   setJob(null);
//   setJobId(null);

//   try {
//     const res = await fetch(`${API_BASE}/run`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ registry, id }),
//     });

//     if (!res.ok) throw new Error(await res.text());
//     const data = (await res.json()) as RunResponse;
//     setJobId(data.job_id);
//   } catch (e: any) {
//     setUiError(e.message ?? 'Failed to start job');
//     setLoading(false);
//   }
// }

// async function fetchJob(jid: string) {
//   const res = await fetch(`${API_BASE}/jobs/${jid}`, { cache: 'no-store' });
//   if (!res.ok) throw new Error(await res.text());
//   return (await res.json()) as JobResponse;
// }
