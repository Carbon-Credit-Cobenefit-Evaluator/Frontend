export default function LoadingSpinner() {
  return (
    <div className="flex h-40 items-center justify-center my-10">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600" />
    </div>
  );
}
