/** Loading / error / empty rows inside a table body. Renders nothing when there are rows. */
export function TableStatus({
  colSpan,
  loading,
  error,
  empty,
  emptyText,
}: {
  colSpan: number;
  loading: boolean;
  error?: string;
  empty: boolean;
  emptyText: string;
}) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, i) => (
          <tr key={i}>
            <td colSpan={colSpan} className="px-5 py-3">
              <div className="h-10 animate-pulse rounded bg-gray-100" />
            </td>
          </tr>
        ))}
      </>
    );
  }
  if (error || empty) {
    return (
      <tr>
        <td colSpan={colSpan} className="px-5 py-16 text-center text-sm text-gray-500">
          {error || emptyText}
        </td>
      </tr>
    );
  }
  return null;
}
