"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CalendarIcon, Crown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PetPolicy, PropertyType } from "@/lib/generated/prisma/enums";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ErrorMessage } from "@/components/error-message";
import { Spinner } from "@/components/ui/spinner";
import { MultipleImageUpload } from "@/components/multiple-image-upload";
import { useRouter } from "next/navigation";
import {
  addPropertyAction,
  editPropertyAction,
} from "@/app/dashboard/owner/actions";
import { propertySchema } from "@/lib/zod-schema/property-schema";
import { Property } from "@/lib/generated/prisma/client";

const amenitiesList = ["WiFi", "Parking", "AC", "Gym", "Kitchen", "TV"];

type PropertyFormValues = z.infer<typeof propertySchema>;

type Props = {
  mode?: "add" | "edit";
  initialData?: Property;
  propertyId?: string;
  credits: number;
};

export function PropertyForm({
  mode = "add",
  initialData,
  propertyId,
  credits,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      title: "",
      location: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 0,
      availableFrom: undefined,
      description: "",
      propertyType: undefined,
      petPolicy: undefined,
      leaseTerm: undefined,
      amenities: [],
      images: [],
    },
  });

  const onSubmit = (values: PropertyFormValues) => {
    setError(null);

    startTransition(async () => {
      const res =
        mode === "add"
          ? await addPropertyAction({ values })
          : await editPropertyAction({
              propertyId: propertyId!,
              values,
            });

      if (res?.error) {
        setError(res.error);
      } else {
        form.reset();
        router.push("/dashboard/owner/my-properties");
        toast(
          mode === "add"
            ? "✅ Property added successfully"
            : "✅ Property updated successfully"
        );
      }
    });
  };

  return (
    <div className="p-5">
      <div className=" mb-8 space-y-2">
        <h3 className="font-bold text-3xl">
          {mode === "add" ? "Add New Property" : "Edit Property"}
        </h3>
        <p className="text-muted-foreground">
          Adding or editing a property will cost 2 credits. Please make sure you
          have enough credits before proceeding.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl>
                  <Input placeholder="Modern Downtown Apartment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Manhattan, New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sqft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Feet</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Available From */}
            <FormField
              control={form.control}
              name="availableFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available From</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rent (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Selects */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PropertyType).map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="petPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Policy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PetPolicy).map((p) => (
                        <SelectItem key={p} value={p} className="capitalize">
                          {p.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaseTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lease Term</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2_MONTHS">2 Months</SelectItem>
                      <SelectItem value="4_MONTHS">4 Months</SelectItem>
                      <SelectItem value="6_MONTHS">6 Months</SelectItem>
                      <SelectItem value="8_MONTHS">8 Months</SelectItem>
                      <SelectItem value="10_MONTHS">10 Months</SelectItem>
                      <SelectItem value="12_MONTHS">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <div className="grid md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={field.value?.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value || []), amenity]);
                          } else {
                            field.onChange(
                              (field.value || []).filter((a) => a !== amenity)
                            );
                          }
                        }}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property images</FormLabel>
                <FormControl>
                  <MultipleImageUpload
                    onUploadSuccess={(file) => field.onChange(file)}
                    defaultFiles={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-40"
                    {...field}
                    placeholder="Type your description here."
                  />
                </FormControl>
                <p className="text-muted-foreground text-sm">
                  Write description within 500 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <ErrorMessage error={error} />

          {credits < 2 ? (
            <Link href={"/upgrade-plan"}>
              <Button type="button" className="w-full">
                <Crown />
                Upgrade your plan
              </Button>
            </Link>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Link href={"/dashboard/owner/my-properties"}>
                <Button
                  variant={"outline"}
                  type="button"
                  className="w-full"
                  size="lg"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                disabled={isPending}
                type="submit"
                className="w-full"
                size="lg"
              >
                {isPending ? (
                  <Spinner />
                ) : mode === "add" ? (
                  "Add Property"
                ) : (
                  "Update Property"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
