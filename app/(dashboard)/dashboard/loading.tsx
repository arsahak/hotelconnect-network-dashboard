function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <div className="rounded border border-gray-200 bg-white p-6">
        <Pulse className="h-8 w-64" />
        <Pulse className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="rounded border border-gray-200 bg-white p-6">
        <Pulse className="mb-5 h-4 w-28" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border border-gray-200 p-5">
              <Pulse className="h-11 w-11 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Pulse className="h-5 w-32" />
                <Pulse className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
