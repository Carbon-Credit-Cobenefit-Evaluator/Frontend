import { useState } from 'react';
import ProjectCard from './ProjectCard';
import TablePagination from './TablePagination';

export default function ProjectsTable(props: ProjectsTableProps) {
  const projects = props.projects;
  const [page, setPage] = useState(1);
  return (
    <>
      <div className=" flex mb-4 flex-wrap items-center justify-between gap-3">
        <div className=" text-gray-500 text-sm">
          Showing 100 project(s) out of 150
        </div>
        {/* Sort */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          Sort by
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100">
            <option value="last_run_desc">Last run (newest)</option>
            <option value="last_run_asc">Last run (oldest)</option>
            <option value="name_asc">Project name (A–Z)</option>
            <option value="name_desc">Project name (Z–A)</option>
          </select>
        </label>
      </div>
      <div className="flex px-3 gap-4 rounded-2xl mb-0 w-full text-sm font-extralight text-center items-center justify-between">
        <div className="w-1/12">Rating</div>
        <div className="w-1/3 text-left">Project</div>
        {/* <div className="w-1/4">{pid}</div> */}
        <div className="w-1/12 ">Project Type</div>
        <div className="w-1/12">Registry</div>
        <div className="w-1/12 text-left">Vintage</div>
        <div className="w-1/12 ">Country</div>
        {/* <div className="w-1/12">Status</div> */}
        <div className="w-1/12 ">Status</div>
        {/* <hr className=" text-gray-300 mb-2" /> */}
      </div>
      <hr className=" text-gray-300" />
      {projects &&
        projects.map((project, idx) => (
          <div key={idx}>
            <ProjectCard {...project} />
          </div>
        ))}
      {projects &&
        projects.map((project, idx) => (
          <div key={idx}>
            <ProjectCard {...project} />
          </div>
        ))}
      <TablePagination
        page={3}
        pageSize={10}
        total={20}
        onPageChange={setPage}
      />
    </>
  );
}
