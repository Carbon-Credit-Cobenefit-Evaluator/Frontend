type Registry = 'verra' | 'gs';
type JobStatus = 'queued' | 'running' | 'completed' | 'failed';
type ModeUsed = 'full' | 'inference_only';

type RunResponse = {
  job_id: string;
  project_id: string;
};

type JobResponse = {
  job_id: string;
  project_id: string;
  status: JobStatus;
  mode_used?: ModeUsed;
  step?: string | null;
  message?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  error?: string | null;
};

type Project = {
  registry: 'verra' | 'gs';
  project_id: string;
  project_type: 'reforestation' | 'renewable energy' | 'cookstove' | 'waste';
  name: string;
  rating?: string;
  country_code?: string;
  score?: number;
  vintage: string;
  sdg?: { id: number; score: number }[];
  status: 'completed' | 'running' | 'failed';
  last_run_at?: string;
  image?: string;
};

type ProjectCardProps = {
  registry?: string;
  project_id?: string;
  name?: string;
  rating?: string;
  score?: number;
  country?: string;
  status?: string;
  last_run_at?: string;
};

type ProjectsTableProps = {
  projects?: Project[];
};

type RatingBadgeProps = {
  score?: number; // 0 – 100
};
