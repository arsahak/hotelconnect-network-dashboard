/** Grey blocks while a form's data loads. */
export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[4, 2].map((fields, i) => (
        <div key={i} className="rounded border border-gray-200 bg-white p-6">
          <div className="mb-5 h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: fields }).map((_, j) => (
              <div key={j} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
