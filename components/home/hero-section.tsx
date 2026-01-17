"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "../ui/spinner";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Find Your Perfect Rental Home
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Discover thousands of verified properties. Connect directly with
            owners. Move into your dream home with confidence and ease.
          </p>

          {/* Search Bar  */}
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search">Location</Label>
                <InputGroup>
                  <InputGroupInput
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="City, neighborhood, or ZIP code"
                  />
                  <InputGroupAddon>
                    <MapPin />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <InputGroup>
                  <InputGroupInput
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Max monthly rent"
                  />
                  <InputGroupAddon>
                    <InputGroupText>৳</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    const params = new URLSearchParams();

                    if (query) params.set("search", query);
                    if (budget) params.set("max_price", budget);

                    router.push(`/properties?${params.toString()}`);
                  });
                }}
              >
                {isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
