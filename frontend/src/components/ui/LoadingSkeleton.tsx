export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="skeleton h-4 w-24 mb-3 rounded" />
    <div className="skeleton h-8 w-16 mb-2 rounded" />
    <div className="skeleton h-3 w-32 rounded" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 animate-pulse">
        <div className="skeleton h-4 w-8 rounded" />
        <div className="skeleton h-4 flex-1 rounded" />
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="skeleton h-8 w-48 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1,2,3].map(i => <CardSkeleton key={i} />)}
    </div>
    <TableSkeleton />
  </div>
);
