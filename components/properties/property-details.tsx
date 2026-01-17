"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  MapPin,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Wind,
  Dumbbell,
  UtensilsCrossed,
  Tv,
  Star,
  Mail,
  Phone,
  Calendar,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  BookingStatus,
  Property,
  PropertyReview,
  Role,
  User,
} from "@/lib/generated/prisma/client";
import { formatBDPhone, formatDate, getInitials } from "@/lib/utils";
import { unlockProperty } from "@/app/(pages)/properties/actions";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { StatusDropdown } from "./status-dropdown";
import Link from "next/link";
import { PropertyReviewSection } from "./property-review";
import { requestBooking } from "@/app/dashboard/tenant/actions";
import { ProceedToPayment } from "../dashboard/tenant/proceed-to-payment";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  AC: Wind,
  Gym: Dumbbell,
  Kitchen: UtensilsCrossed,
  TV: Tv,
};

type PropertyWithOwner = Property & {
  owner: {
    name: string | null;
    email: string;
    mobileNumber: string | null;
    image: string | null;
  };
};
type PropertyReviewWithReviewer = PropertyReview & {
  reviewer: User;
};
export function PropertyDetails({
  property,
  credits,
  isUnlocked,
  role,
  ownerRating,
  propertyReviews,
  currentUser,
  bookingStatus,
}: {
  property: PropertyWithOwner;
  credits: number;
  isUnlocked: boolean;
  role: Role | undefined;
  ownerRating: number | undefined;
  currentUser: User | null;
  propertyReviews: PropertyReviewWithReviewer[];
  bookingStatus: BookingStatus | undefined;
}) {
  const [isPending, startTransition] = useTransition();
  const [isInfoUnlocked, setIsInfoUnlocked] = useState(isUnlocked);
  const [currentCredits, setCurrentCredits] = useState(credits);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = property.images;

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleUnlockedInfo = () => {
    if (currentCredits < 2) return toast("❌ Not enough credits");

    startTransition(async () => {
      const res = await unlockProperty(property.id);

      if (res.error) {
        toast(`❌ ${res.error}`);
        return;
      }

      setIsInfoUnlocked(true);
      setCurrentCredits(res.creditsLeft ?? currentCredits);
      toast(`✅ ${res.success}`);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}

          <div className="relative mb-4">
            <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-primary/10">
              <img
                src={images[currentIndex]}
                alt="Property image"
                className="h-full w-full object-cover"
              />

              <Button
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
                variant={"outline"}
                size={"icon"}
                onClick={prevImage}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
                variant={"outline"}
                size={"icon"}
                onClick={nextImage}
              >
                <ChevronRightIcon />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative aspect-video overflow-hidden rounded-lg border-2 ${
                    currentIndex === index
                      ? "border-primary/10"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Info */}
          <Card>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold leading-tight text-balance">
                    {property.title}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ৳ {property.price.toLocaleString("en-BD")}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-6">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />

                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">Bedrooms</div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />

                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">Bathrooms</div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-muted-foreground" />

                  <div className="font-semibold">
                    {property.sqft.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Square Feet
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />

                  <div className="font-semibold">Available</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(property.availableFrom)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.amenities.map((amenity) => {
                    const Icon =
                      amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 rounded-lg border border-border p-3"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <PropertyReviewSection
            propertyReviews={propertyReviews}
            propertyId={property.id}
            currentUser={currentUser}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Owner Info Card */}
            <Card className="relative overflow-hidden">
              <div
                className={
                  isInfoUnlocked
                    ? ""
                    : "blur-sm select-none pointer-events-none"
                }
              >
                <CardHeader>
                  <CardTitle className="mb-3">Property Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={property.owner.image || "/placeholder.svg"}
                        alt="Owner Avatar"
                      />
                      <AvatarFallback>
                        {getInitials(property.owner.name || "Owner")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold capitalize">
                        {property.owner.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{ownerRating?.toFixed(1)} rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <a
                      href={`mailto:${property.owner.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{property.owner.email}</span>
                    </a>
                    <a
                      href={`tel:${property.owner.mobileNumber}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>
                        {formatBDPhone(property.owner.mobileNumber || "N/A")}
                      </span>
                    </a>
                  </div>
                  <Link href={`/profile/${property.ownerId}`}>
                    <Button variant={"outline"} className="w-full mt-2">
                      View profile
                    </Button>
                  </Link>
                </CardContent>
              </div>
              {!isInfoUnlocked && (
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2">
                  <div className="text-sm font-semibold">
                    Unlock to view owner & rent request
                  </div>
                  <Button
                    size="sm"
                    onClick={handleUnlockedInfo}
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : "Unlock for 2 credits"}
                  </Button>
                </div>
              )}
            </Card>

            {/* Request Booking Card */}
            {isInfoUnlocked && (
              <Card>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold">
                      ৳ {property.price.toLocaleString("en-BD")}/month
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available from {formatDate(property.availableFrom)}
                    </div>
                  </div>
                  {role === "ADMIN" ? (
                    <StatusDropdown
                      id={property.id}
                      propertyStatus={property.status}
                    />
                  ) : bookingStatus === "APPROVED" ? (
                    <ProceedToPayment property={property} />
                  ) : bookingStatus === "PENDING" ? (
                    <Button disabled className="w-full">
                      Request Sent
                    </Button>
                  ) : bookingStatus === "REJECTED" ? (
                    <Button disabled className="w-full">
                      Request Rejected
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          const res = await requestBooking(property.id);

                          if (res?.error) toast(res.error);
                          else toast(res.success);
                        })
                      }
                    >
                      {isPending ? <Spinner /> : "Request Booking"}
                    </Button>
                  )}

                  <div className="mt-4 text-center text-xs text-muted-foreground">
                    {role === "ADMIN"
                      ? "You’re reviewing this property as an admin. Update the status once everything meets the platform rules."
                      : "You won't be charged yet. The owner will review your request."}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium capitalize">
                      {property.propertyType.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Lease Term</span>
                    <span className="font-medium capitalize">
                      {property.leaseTerm.replace("_", " ").toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pet Policy</span>
                    <span className="font-medium capitalize">
                      {property.petPolicy.toLowerCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
