"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";
import { Role } from "@/lib/generated/prisma/enums";

export function PropertyFilter({ role }: { role: Role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const statusValue = searchParams.get("status") || "";
  const [query, setQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    if (query) {
      params.set("search", query);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [query, router, searchParamsString]);

  return (
    <div className="flex items-center gap-4">
      <InputGroup>
        <InputGroupInput
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <div className="flex items-center gap-2">
        <Select
          value={statusValue.toUpperCase()}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);

            if (value) params.set("status", value);
            else params.delete("status");

            router.push(`?${params.toString().toLowerCase()}`);
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Property Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="RENTED">Rented</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setQuery("");
            router.push(
              role === "ADMIN"
                ? "/dashboard/admin/properties"
                : "/dashboard/owner/my-properties"
            );
          }}
        >
          <X />
          Clear filter
        </Button>
      </div>
    </div>
  );
}
