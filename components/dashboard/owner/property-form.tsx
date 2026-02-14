"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { Property } from "@/lib/generated/prisma/client";
import { AlertMessage } from "@/components/alert-message";
import { propertyAction } from "@/actions/property.action";
import { PetPolicy, PropertyType } from "@/lib/generated/prisma/enums";

const amenitiesList = [
  "WiFi",
  "Parking",
  "Gym",
  "Elevator",
  "Generator",
  "CCTV",
  "Security",
  "Water 24/7",
  "Shared Kitchen",
  "Private Garden",
  "Solar Power",
  "Maid Room",
  "LPG Gas",
  "Balcony",
  "Furnished",
  "Microwave",
  "Washing Machine",
  "Smart Home System",
  "4 Car Parking",
  "Staff Quarter",
  "Independent Utility",
  "Open Terrace",
  "Filtered Water",
  "Gas Connection",
  "Large Balcony",
];

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
  const [state, action, isPending] = useActionState(propertyAction, {});
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center space-y-2 mb-10">
        <h3 className="font-bold text-3xl">
          {mode === "add" ? "Add New Property" : "Edit Property"}
        </h3>
        <p className="text-muted-foreground text-sm">
          Adding or editing a property will cost 2 credits. Please make sure you
          have enough credits before proceeding.
        </p>
      </div>
      <div>
        <form action={action} className="space-y-6">
          <input type="hidden" name="mode" value={mode} />
          {propertyId && (
            <input type="hidden" name="propertyId" value={propertyId} />
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title*</Label>
            <Input
              type="text"
              name="title"
              placeholder="e.g.Modern Downtown Apartment"
              defaultValue={initialData?.title}
            />
            {state.errors?.title && (
              <p className="text-destructive text-sm">
                {state.errors.title[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              type="text"
              name="location"
              placeholder="e.g.Manhattan, New York"
              defaultValue={initialData?.location}
            />
            {state.errors?.location && (
              <p className="text-destructive text-sm">
                {state.errors.location[0]}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms*</Label>
              <Input
                type="number"
                name="bedrooms"
                placeholder="0"
                defaultValue={initialData?.bedrooms}
              />
              {state.errors?.bedrooms && (
                <p className="text-destructive text-sm">
                  {state.errors.bedrooms[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms*</Label>
              <Input
                type="number"
                name="bathrooms"
                placeholder="0"
                defaultValue={initialData?.bathrooms}
              />
              {state.errors?.bathrooms && (
                <p className="text-destructive text-sm">
                  {state.errors.bathrooms[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet*</Label>
              <Input
                type="number"
                name="sqft"
                placeholder="e.g.100sqft"
                defaultValue={initialData?.sqft}
              />
              {state.errors?.sqft && (
                <p className="text-destructive text-sm">
                  {state.errors.sqft[0]}
                </p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From*</Label>
              <Input
                type="date"
                name="availableFrom"
                defaultValue={
                  initialData?.availableFrom
                    ? new Date(initialData.availableFrom)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
              {state.errors?.availableFrom && (
                <p className="text-destructive text-sm">
                  {state.errors.availableFrom[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Monthly Rent (৳)*</Label>
              <Input
                type="number"
                name="price"
                placeholder="৳"
                defaultValue={initialData?.price}
              />
              {state.errors?.price && (
                <p className="text-destructive text-sm">
                  {state.errors.price[0]}
                </p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type*</Label>
              <Select
                name="propertyType"
                defaultValue={initialData?.propertyType}
              >
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PropertyType).map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.propertyType && (
                <p className="text-destructive text-sm">
                  {state.errors.propertyType[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="petPolicy">Pet Policy*</Label>
              <Select name="petPolicy" defaultValue={initialData?.petPolicy}>
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PetPolicy).map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.petPolicy && (
                <p className="text-destructive text-sm">
                  {state.errors.petPolicy[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaseTerm">Lease Term*</Label>
              <Select name="leaseTerm" defaultValue={initialData?.leaseTerm}>
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select term" />
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
              {state.errors?.leaseTerm && (
                <p className="text-destructive text-sm">
                  {state.errors.leaseTerm[0]}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="leaseTerm">Amenities*</Label>
            <div className="grid md:grid-cols-3 gap-3 mt-2">
              {amenitiesList.map((amenity) => (
                <Label
                  key={amenity}
                  className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer"
                >
                  <Checkbox
                    name="amenities"
                    value={amenity}
                    defaultChecked={initialData?.amenities?.includes(amenity)}
                  />
                  <span>{amenity}</span>
                </Label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <input type="hidden" name="images" value={JSON.stringify(images)} />
            <Label htmlFor="images">Property images</Label>
            <ImageUpload
              multiple={true}
              onUploadSuccess={(urls) => setImages(urls)}
              defaultFiles={images}
            />
            {state.errors?.images && (
              <p className="text-destructive text-sm">
                {state.errors.images[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              className="min-h-40"
              placeholder="Type your description here."
              defaultValue={initialData?.description}
            />
            <p className="text-muted-foreground text-sm">
              Write description within 500 characters
            </p>
            {state.errors?.description && (
              <p className="text-destructive text-sm">
                {state.errors.description[0]}
              </p>
            )}
          </div>
          {credits < 2 ? (
            <Button type="button" size="lg" className="w-full" asChild>
              <Link href={"/upgrade-plan"}>
                <Crown />
                Upgrade your plan
              </Link>
            </Button>
          ) : (
            <div>
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
              {state?.message && (
                <AlertMessage title={state.message} variant="destructive" />
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
