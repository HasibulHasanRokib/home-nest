"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import { SearchCheck, SearchIcon, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function AdvancedFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [isPending, startTransition] = useTransition();

  const minPriceValue = Number(searchParams.get("min_price")) || 0;
  const maxPriceValue = Number(searchParams.get("max_price")) || 50000;

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceValue,
    maxPriceValue,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`/properties?${params.toString()}`);
  }, [query, router, searchParamsString]);

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`/properties?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setQuery("");
    setPriceRange([0, 50000]);
    router.push("/properties");
  };

  return (
    <Card className="sticky top-20 border-muted-foreground/10 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <SearchCheck className="h-5 w-5 text-primary" />
          Advanced Filters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search property */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <InputGroup>
            <InputGroupInput
              placeholder="Search by title or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Property type  */}
        <div className="space-y-2">
          <Label htmlFor="property_type">Property type</Label>
          <Select
            value={searchParams.get("property_type") || ""}
            onValueChange={(value) => updateParam("property_type", value)}
          >
            <SelectTrigger id="property_type" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="room">Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Property Bedrooms  */}
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select
            value={searchParams.get("bedrooms") || ""}
            onValueChange={(value) => updateParam("bedrooms", value)}
          >
            <SelectTrigger id="bedrooms" className="w-full">
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Property Bathrooms  */}
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Select
            value={searchParams.get("bathrooms") || ""}
            onValueChange={(value) => updateParam("bathrooms", value)}
          >
            <SelectTrigger id="bathrooms" className="w-full">
              <SelectValue placeholder="Select bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bathroom</SelectItem>
              <SelectItem value="2">2 Bathrooms</SelectItem>
              <SelectItem value="3">3 Bathrooms</SelectItem>
              <SelectItem value="4">4+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Sort by  */}
        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort by</Label>
          <Select
            value={searchParams.get("sort_by") || ""}
            onValueChange={(value) => updateParam("sort_by", value)}
          >
            <SelectTrigger id="sortBy" className="w-full">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Low to High</SelectItem>
              <SelectItem value="price-high">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Budget Range</Label>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Monthly
            </span>
          </div>

          <Slider
            min={0}
            max={50000}
            step={1000}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            onValueCommit={(v) => {
              const params = new URLSearchParams(searchParams.toString());

              params.set("min_price", String(v[0]));
              params.set("max_price", String(v[1]));

              router.push(`/properties?${params.toString()}`, {
                scroll: false,
              });
            }}
            className="mt-2"
          />

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-xs font-medium">
            <span className="font-medium">
              ৳ {priceRange[0].toLocaleString()}
            </span>
            <span className="text-muted-foreground">to</span>
            <span className="font-medium">
              ৳ {priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full text-muted-foreground hover:text-destructive"
          onClick={clearFilters}
        >
          <X className="mr-2 h-3 w-3" />
          Clear filter
        </Button>
      </CardContent>
    </Card>
  );
}
