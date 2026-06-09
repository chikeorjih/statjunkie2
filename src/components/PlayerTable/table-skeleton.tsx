import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton({ cols = 9 }: { cols?: number }) {
  return (
    <div className="rounded-md border border-white/8 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8 bg-transparent hover:bg-transparent h-9">
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i} className="px-4">
                <Skeleton className="h-3 w-12 bg-white/8" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIdx) => (
            <TableRow
              key={rowIdx}
              className="border-white/8 h-11"
              style={{
                backgroundColor:
                  rowIdx % 2 === 0 ? "transparent" : "rgba(28,28,30,0.35)",
              }}
            >
              <TableCell className="px-4">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-full bg-white/8 flex-shrink-0" />
                  <Skeleton className="h-3 w-28 bg-white/8" />
                </div>
              </TableCell>
              {Array.from({ length: cols - 1 }).map((_, colIdx) => (
                <TableCell key={colIdx} className="px-4 text-right">
                  <Skeleton className="h-3 w-8 bg-white/8 ml-auto" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
