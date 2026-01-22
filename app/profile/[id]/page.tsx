import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  CalendarDays,
  Phone,
  Mail,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatBDPhone, formatDate, getInitials } from "@/lib/utils";
import Image from "next/image";
import { getCurrentUser } from "@/lib/get-current-user";
import { VerificationManagement } from "@/components/profile/verification";
import Logo from "@/components/logo";
import { UserStatus } from "@/lib/generated/prisma/enums";
import { ProfileReview } from "@/components/profile/profile-review";
import { StarRating } from "@/components/star-rating";

const getUserStatusBadge = (status: UserStatus) => {
  switch (status) {
    case UserStatus.OPEN:
      return (
        <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
          Open
        </Badge>
      );

    case UserStatus.NOT_VERIFIED:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
          Not Verified
        </Badge>
      );

    case UserStatus.VERIFIED:
      return (
        <Badge className="bg-green-100 text-green-700 border border-green-200">
          Verified
        </Badge>
      );

    case UserStatus.SUSPENDED:
      return (
        <Badge className="bg-red-100 text-red-700 border border-red-200">
          Suspended
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const VerificationBadge = ({ verified }: { verified?: boolean }) => {
  return verified ? (
    <Badge className="text-xs bg-green-100 text-green-700 border border-green-200">
      Verified
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-xs bg-red-50 text-red-600 border border-red-200"
    >
      Not Verified
    </Badge>
  );
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [user, userRating] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        declaration: true,
        address: true,
        profile: true,
        validation: true,
      },
    }),
    prisma.profileReview.findFirst({ where: { userId: id } }),
  ]);

  const currentUser = await getCurrentUser();
  const totalProperty = await prisma.property.count({
    where: {
      ownerId: id,
    },
  });

  if (!user) return notFound();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="relative rounded-xl border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/20">
                  <AvatarImage src={user.image || "/user.png"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-1">
                {/* Name */}
                <h1 className="text-2xl md:text-3xl font-bold capitalize">
                  {user.name}
                </h1>

                {/* Contact Info */}
                <div className="text-sm text-muted-foreground">
                  <div className="space-y-2">
                    <StarRating rating={userRating?.rating || 0} />
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                      <VerificationBadge verified={user.emailVerified} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{formatBDPhone(user.mobileNumber)}</span>
                      <VerificationBadge
                        verified={user.validation?.mobileNumberVerified}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>Member since {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Account Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold capitalize">{user.role}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>{getUserStatusBadge(user.status)}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Credits Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{user.credits}</p>
              </CardContent>
            </Card>

            {user.role === "OWNER" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Total Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{totalProperty}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Personal Information
            <span className="ml-2">
              <VerificationBadge
                verified={user.validation?.personalInfoVerified}
              />
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Date of Birth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground capitalize">
                  {formatDate(user.profile?.dateOfBirth || new Date())}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Gender</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground capitalize">
                  {user.profile?.gender.toLowerCase()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Religion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground capitalize">
                  {user.profile?.religion.toLowerCase()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Occupation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground capitalize">
                  {user.profile?.occupation}
                </p>
              </CardContent>
            </Card>

            {user.role === "TENANT" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Household Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground capitalize">
                      {user.profile?.householdType?.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Family Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground capitalize">
                      {user.profile?.familySize} Members
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Address Information
          </h2>
          <div className="grid grid-cols-1  gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Present Address
                  <span className="ml-2">
                    <VerificationBadge
                      verified={user.validation?.presentAddressVerified}
                    />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Division
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.presentDivision}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      District
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.presentDistrict}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Upazila
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.presentUpazila}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Post Office
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.presentPostOffice}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Post Code
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.presentPostCode}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Details
                  </p>
                  <p className="text-foreground capitalize">
                    {user.address?.presentDetails}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Permanent Address
                  <span className="ml-2">
                    <VerificationBadge
                      verified={user.validation?.permanentAddressVerified}
                    />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Division
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.permanentDivision}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      District
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.permanentDistrict}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Upazila
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.permanentUpazila}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Post Office
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.permanentPostOffice}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Post Code
                    </p>
                    <p className="text-foreground capitalize">
                      {user.address?.permanentPostCode}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Details
                  </p>
                  <p className="text-foreground capitalize">
                    {user.address?.permanentDetails}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Social Links
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="text-foreground">
                    {user.profile?.facebook}
                  </span>
                </div>
                <span className="ml-2">
                  <VerificationBadge
                    verified={user.validation?.facebookVerified}
                  />
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span className="text-foreground">
                    {user.profile?.twitter}
                  </span>
                </div>
                <span className="ml-2">
                  <VerificationBadge
                    verified={user.validation?.twitterVerified}
                  />
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  <span className="text-foreground">
                    {user.profile?.linkedin}
                  </span>
                </div>
                <span className="ml-2">
                  <VerificationBadge
                    verified={user.validation?.linkedinVerified}
                  />
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-foreground">
                    {user.profile?.whatsapp}
                  </span>
                </div>
                <span className="ml-2">
                  <VerificationBadge
                    verified={user.validation?.whatsappVerified}
                  />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {(currentUser?.id === id || currentUser?.role === "ADMIN") && (
          <>
            {/* Declaration */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Declaration
                <span className="ml-2">
                  <VerificationBadge
                    verified={user.validation?.declarationVerified}
                  />
                </span>
              </h2>
              <Card>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-2">
                        Photo
                      </p>
                      {user.declaration?.photo ? (
                        <div className="relative w-full h-52 border border-border rounded-lg">
                          <Image
                            src={user.declaration?.photo}
                            alt="Uploaded image"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 border border-border rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                          Photo not provide
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-2">
                        Signature
                      </p>
                      {user.declaration?.signature ? (
                        <div className="relative w-full h-52 border border-border rounded-lg">
                          <Image
                            src={user.declaration?.signature}
                            alt="Uploaded image"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 border border-border rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                          Signature not provide
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Attachments  */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Document Attachments
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        NID Number
                      </p>
                      <p className={`text-foreground font-mono`}>
                        {user.profile?.nidNumber || "N/A"}
                        <span className="ml-2">
                          <VerificationBadge
                            verified={user.validation?.nidSmartCardVerified}
                          />
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Passport Number
                      </p>
                      <p className="text-foreground font-mono">
                        {user.profile?.passportNumber || "N/A"}
                        <span className="ml-2">
                          <VerificationBadge
                            verified={user.validation?.passportVerified}
                          />
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Birth Certificate
                      </p>
                      <p className="text-foreground font-mono">
                        {user.profile?.birthCertificateNumber || "N/A"}
                        <span className="ml-2">
                          <VerificationBadge
                            verified={user.validation?.birthCertificateVerified}
                          />
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-2">
                          {user.profile?.attachmentType}
                        </p>
                        {user.profile?.attachment1 ? (
                          <div className="relative w-full h-52 border border-border rounded-lg">
                            <Image
                              src={user.profile?.attachment1}
                              alt="Uploaded image"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-24 border border-border rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                            {user.profile?.attachmentType} not provide
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-2">
                          {user.profile?.attachmentType}
                        </p>
                        {user.profile?.attachment2 ? (
                          <div className="relative w-full h-52 border border-border rounded-lg">
                            <Image
                              src={user.profile?.attachment2}
                              alt="Uploaded image"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-24 border border-border rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                            {user.profile?.attachmentType} not provide
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {currentUser?.role === "ADMIN" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Verification
            </h2>
            <VerificationManagement userId={id} />
          </div>
        )}

        {currentUser?.id !== id && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">Review</h2>
            <ProfileReview userId={id} />
          </div>
        )}

        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </div>
    </div>
  );
}
