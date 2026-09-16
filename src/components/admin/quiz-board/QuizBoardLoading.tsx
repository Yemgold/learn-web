




export default function QuizBoardLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ),
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />

          <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>

        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white" />

          <div className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}