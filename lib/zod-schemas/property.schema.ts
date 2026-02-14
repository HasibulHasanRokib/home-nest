import z from "zod";
import { PetPolicy, PropertyType } from "@/lib/generated/prisma/enums";

export const PropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().min(1, "Price is required"),
  bedrooms: z.number().min(1, "Bedrooms is required"),
  bathrooms: z.number().min(1, "Bathrooms is required"),
  sqft: z.number().min(100, "Square footage must be at least 100"),
  availableFrom: z.coerce.date({ error: "Date  is required" }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be at most 500 characters"),
  propertyType: z.enum(PropertyType, {
    error: "PropertyType is required",
  }),
  petPolicy: z.enum(PetPolicy, {
    error: "Pet Policy is required",
  }),
  leaseTerm: z.string().min(1, "Lease Term is required"),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});
