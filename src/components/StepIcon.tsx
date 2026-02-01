import { cn } from './cn';

export function StepIcon({
  state,
}: {
  state: 'done' | 'current' | 'pending' | 'failed';
}) {
  return (
    <div
      className={cn(
        'grid h-8 w-8 place-items-center rounded-full ring-1',
        state === 'done' && 'bg-emerald-600 text-white ring-emerald-200',
        state === 'current' && 'bg-indigo-600 text-white ring-indigo-200',
        state === 'pending' && 'bg-white text-slate-500 ring-slate-200',
        state === 'failed' && 'bg-rose-600 text-white ring-rose-200'
      )}
    >
      {state === 'done' ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M20 6L9 17l-5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : state === 'failed' ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M18 6L6 18M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <div
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            state === 'current' ? 'bg-white' : 'bg-slate-400'
          )}
        />
      )}
    </div>
  );
}
