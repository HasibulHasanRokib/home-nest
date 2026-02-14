"use client";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Mail,
  Phone,
  Calendar,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusDropdown } from "./property-status";
import { Prisma } from "@/lib/generated/prisma/client";
import { requestBooking } from "@/actions/booking.action";
import { unlockProperty } from "@/actions/property.action";
import { BookingStatus } from "@/lib/generated/prisma/enums";
import { formatBDPhone, formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyReview } from "@/components/properties/property-review";
import { ProceedToPayment } from "@/components/dashboard/tenant/proceed-to-payment";
import Image from "next/image";
import { amenityIcons, DefaultAmenityIcon } from "./amenity-icons";

type PropertyRelation = Prisma.PropertyGetPayload<{
  include: {
    propertyUnlocks: true;
    owner: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        profile: {
          select: {
            mobileNumber: true;
          };
        };
      };
    };
  };
}>;

type PropertyReview = Prisma.PropertyReviewGetPayload<{
  include: { reviewer: true };
}>;

type User = typeof auth.$Infer.Session.user;

interface PropertyDetailsProps {
  user: User;
  credits: number;
  isUnlocked: boolean;
  property: PropertyRelation;
  bookingStatus: BookingStatus | undefined;
  propertyReviews: PropertyReview[];
}

export function PropertyDetails({
  bookingStatus,
  credits,
  isUnlocked,
  property,
  propertyReviews,
  user,
}: PropertyDetailsProps) {
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
    if (currentCredits < 2) return toast.error("Not enough credits");

    startTransition(async () => {
      const res = await unlockProperty(property.id);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      setIsInfoUnlocked(true);
      setCurrentCredits(res.creditsLeft ?? currentCredits);
      toast.success(res.success);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-4">
            <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-primary/10">
              <Image
                src={images[currentIndex]}
                alt="Property image"
                fill
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
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
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
                      amenityIcons[amenity as keyof typeof amenityIcons] ||
                      DefaultAmenityIcon;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 rounded-lg border border-border p-3"
                      >
                        {Icon && (
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <PropertyReview
            propertyReviews={propertyReviews}
            propertyId={property.id}
            user={user}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
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
                      href={`tel:${property.owner.profile?.mobileNumber}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>
                        {formatBDPhone(
                          property.owner.profile?.mobileNumber || "N/A",
                        )}
                      </span>
                    </a>
                  </div>
                  <Button variant={"secondary"} className="w-full mt-2" asChild>
                    <Link href={`/profile/${property.ownerId}`}>
                      View profile <ArrowUpRightIcon />
                    </Link>
                  </Button>
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
                  {user.role === "ADMIN" ? (
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

                          if (res?.error) toast.error(res.error);
                          else toast.success(res.success);
                        })
                      }
                    >
                      {isPending ? <Spinner /> : "Request Booking"}
                    </Button>
                  )}

                  <div className="mt-4 text-center text-xs text-muted-foreground">
                    {user.role === "ADMIN"
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
