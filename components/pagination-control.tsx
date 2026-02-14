"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface PaginationControlProps {
  page: number;
  limit: number;
  total: number;
  pathname: string;
}

export function PaginationControl({
  page,
  limit,
  total,
  pathname,
}: PaginationControlProps) {
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const createUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    params.set("limit", String(limit));
    return `${pathname}?${params.toString()}`;
  };

  const getPages = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (total === 0) return null;

  return (
    <div className="flex w-full items-center justify-between">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createUrl(currentPage - 1)}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {getPages().map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href={createUrl(p)} isActive={p === currentPage}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={createUrl(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
