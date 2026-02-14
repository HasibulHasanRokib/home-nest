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
import { Spinner } from "@/components/ui/spinner";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (budget) params.set("max_price", budget);

      router.push(`/properties?${params.toString()}`);
    });
  };

  return (
    <section className="relative overflow-hidden border-b border-border  min-h-[80vh] flex justify-center items-center bg-custom">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Find Your Perfect Rental Home
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Discover thousands of verified properties. Connect directly with
            owners. Move into your dream home with confidence and ease.
          </p>

          <div className="mx-auto mt-10 max-w-4xl">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-2 text-left">
                <Label htmlFor="location">Location</Label>
                <InputGroup>
                  <InputGroupInput
                    id="location"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="City, neighborhood, or ZIP code"
                  />
                  <InputGroupAddon>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex-1 space-y-2 text-left">
                <Label htmlFor="budget">Budget</Label>
                <InputGroup>
                  <InputGroupInput
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Max monthly rent"
                  />
                  <InputGroupAddon>
                    <InputGroupText>৳</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isPending}
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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
