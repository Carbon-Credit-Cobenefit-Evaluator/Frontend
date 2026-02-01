import { cn } from './cn';

export function StatusPill({
  status,
}: {
  status: 'completed' | 'running' | 'pending' | 'failed';
}) {
  const map = {
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    running: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    pending: 'bg-slate-50 text-slate-600 ring-slate-100',
    failed: 'bg-rose-50 text-rose-700 ring-rose-100',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ring-1',
        map[status]
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'completed' && 'bg-emerald-500',
          status === 'running' && 'bg-indigo-500',
          status === 'pending' && 'bg-slate-400',
          status === 'failed' && 'bg-rose-500'
        )}
      />
      {status}
    </span>
  );
}
