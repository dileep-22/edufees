import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyState,
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-ocid="data-table">
          <thead>
            <tr className="bg-secondary border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => `skel-${i}`).map((id) => (
                <tr key={id} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-muted-foreground"
                >
                  {emptyState ?? "No data available"}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  data-ocid="table-row"
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ")
                            onRowClick(row);
                        }
                      : undefined
                  }
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                  className={cn(
                    "border-b border-border last:border-0 bg-card hover:bg-secondary/50 transition-colors",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-foreground", col.className)}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
