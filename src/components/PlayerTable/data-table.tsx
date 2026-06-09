"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./table-skeleton";

interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  skeletonCols?: number;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  skeletonCols,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  if (isLoading) return <TableSkeleton cols={skeletonCols} />;

  return (
    <div className="rounded-md border border-white/8 overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow
              key={hg.id}
              className="border-white/8 bg-transparent hover:bg-transparent h-9"
            >
              {hg.headers.map((header) => {
                const meta = header.column.columnDef.meta as Record<string, unknown> | undefined;
                const isNumeric = meta?.numeric === true;
                return (
                  <TableHead
                    key={header.id}
                    className={`text-text-secondary text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap px-4 ${isNumeric ? "text-right" : "text-left"}`}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className={`inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer ${isNumeric ? "flex-row-reverse" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-30" />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-text-secondary text-[13px] py-10"
              >
                No players found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                className="border-white/8 h-11 transition-colors"
                style={{
                  backgroundColor: i % 2 === 0 ? "transparent" : "rgba(28,28,30,0.35)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(28,28,30,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "transparent" : "rgba(28,28,30,0.35)")
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as Record<string, unknown> | undefined;
                  const isNumeric = meta?.numeric === true;
                  const isCentered = meta?.centered === true;
                  return (
                    <TableCell
                      key={cell.id}
                      className={`py-3 px-4 whitespace-nowrap text-[13px] ${
                        isNumeric ? "text-right" : isCentered ? "text-center" : "text-left"
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
