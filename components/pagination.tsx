import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  totalPages: number;
  page: number;
  limit: number;
  total: number;
}

export default function PaginationControl({
  page,
  limit,
  total,
  totalPages,
}: PaginationControlProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
      <Pagination className="w-full sm:w-auto">
        <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href={page > 1 ? `?page=${page - 1}&limit=${limit}` : ""}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={`?page=${p}&limit=${limit}`}
                isActive={p === page}
                className="text-sm sm:text-base"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href={
                page < totalPages ? `?page=${page + 1}&limit=${limit}` : "#"
              }
              className={
                page >= totalPages || total === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Showing X to Y of Z */}
      <p className="text-muted-foreground text-xs sm:text-sm mt-2 sm:mt-0">
        Showing {startItem} to {endItem} of {total}
      </p>
    </div>
  );
}
