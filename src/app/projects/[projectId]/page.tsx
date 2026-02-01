import { notFound } from 'next/navigation';
import RatingBadge from '@/components/RatingBadge';
import { log } from 'console';
import { stringify } from 'querystring';
import { carbonProjects } from '../../../../db';
import { SDG_LABEL } from '@/features/constants';
// import ProjectOverview from '@/components/project/ProjectOverview';
// import SDGBreakdown from '@/components/project/SDGBreakdown';
// import EvidencePanel from '@/components/project/EvidencePanel';

function ProjectOverview({ project }: any) {
  return (
    <div className="rounded-2xl shadow-sm border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-extrabold">Project Overview</h2>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-slate-500">Project ID</dt>
          <dd className="font-mono font-bold">{project.project_id}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Status</dt>
          <dd className="font-bold capitalize">{project.status}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Vintage</dt>
          <dd className="font-bold">{project.vintage}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Methodology</dt>
          <dd className="font-bold">{project.methodology}</dd>
        </div>
      </dl>
    </div>
  );
}

function SDGBreakdown({ sdgs }: any) {
  return (
    <div className="rounded-2xl shadow-sm border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-extrabold">SDG Co-benefits</h2>

      <ul className="mt-4 space-y-2">
        {sdgs.map((sdg: any) => (
          <li
            key={sdg.id}
            className="flex items-center justify-between rounded-xl shadow-sm px-4 py-3"
          >
            <span className="font-semibold">
              SDG {sdg.id}: {SDG_LABEL[sdg.id]}
            </span>
            <span className="font-extrabold text-indigo-600">{sdg.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EvidencePanel({ evidence }: any) {
  return (
    <div className="rounded-2xl shadow-sm border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-extrabold">Evidence Highlights</h2>

      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {evidence.map((item: any, i: any) => (
          <li key={i} className="rounded-xl bg-slate-50 p-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Project = {
  id: string;
  name: string;
  registry: 'verra' | 'gs';
  country: string;
  type: string;
  status: string;
  vintage: number;
  methodology: string;
  rating: number; // 0–100
  sdgs: {
    id: number;
    name: string;
    score: number;
  }[];
  evidence: string[];
};

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const projects = carbonProjects;

function getProjectById(projectId: string) {
  console.log(`project id: ${projectId}`);
  return projects.find((project) => project.project_id === projectId);
}

export default async function ProjectPage({ params }: PageProps) {
  const { projectId } = await params;

  console.log('param:', projectId);

  const data = getProjectById(projectId);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">
            {data.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {data.registry.toUpperCase()} · {data.country_code}
          </p>
        </div>

        <RatingBadge score={data.score} />
      </header>

      {/* Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <ProjectOverview project={data} />
          <SDGBreakdown sdgs={data.sdg} />
        </section>

        <aside className="space-y-6">
          {/* <EvidencePanel evidence={data.evidence} /> */}
        </aside>
      </div>
    </main>
  );
}

// export default async function ProjectPage({ params }: PageProps) {
//   console.log(`param: ${stringify(params)}`);

//   const project = getProjectById(params.projectId);

//   if (!project) notFound();

//   return (
//     <main className="mx-auto max-w-6xl px-4 py-10">
//       {/* Header */}
//       <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
//             {project.name}
//           </h1>
//           <p className="mt-2 text-sm text-slate-600">
//             {project.registry.toUpperCase()} · {project.country} ·{' '}
//             {project.type}
//           </p>
//         </div>

//         <RatingBadge score={project.rating} />
//       </header>

//       {/* Content */}
//       <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
//         <section className="space-y-6">
//           <ProjectOverview project={project} />
//           <SDGBreakdown sdgs={project.sdgs} />
//         </section>

//         <aside className="space-y-6">
//           <EvidencePanel evidence={project.evidence} />
//         </aside>
//       </div>
//     </main>
//   );
// }
