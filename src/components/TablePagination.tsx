type TablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};
type PageButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function PageButton({ children, active, disabled, onClick }: PageButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        min-w-9 rounded-lg px-3 py-1 text-sm font-medium transition
        ${active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-100'}
        border
      `}
    >
      {children}
    </button>
  );
}

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center px-2 py-4">
      {/* Left: info */}
      {/* <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </div> */}

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        <PageButton
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </PageButton>

        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <PageButton
              key={p}
              active={p === page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PageButton>
          );
        })}

        <PageButton
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </PageButton>
      </div>
    </div>
  );
}
