import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  Shield,
  CreditCard,
  Facebook,
  MessageCircle,
  FileText,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getRequiredSession } from "@/lib/session";

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </p>
      <p className="text-[15px] font-semibold text-foreground/90">
        {value || "Not Provided"}
      </p>
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

async function Profile({ params }: Props) {
  const { id } = await params;
  const session = await getRequiredSession();
  const user = await db.user.findUnique({
    where: { id },
    include: {
      declaration: true,
      address: true,
      profile: true,
    },
  });

  if (!user) return notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-card p-8 rounded-3xl border shadow-sm">
        <div className="relative">
          <Avatar className="h-40 w-40 border-4 border-background shadow-2xl">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {user.status === "VERIFIED" && (
            <div className="absolute bottom-2 right-2 bg-background rounded-full p-1">
              <BadgeCheck className="h-8 w-8 text-blue-500 fill-blue-50" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight">
                {user.name}
              </h1>
              <Badge className="px-3 py-1 text-sm uppercase tracking-wider">
                {user.role}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-5 w-5" /> {user.email}
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-muted px-4 py-2 rounded-2xl flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Status: {user.status.replace("_", " ")}
              </span>
            </div>
            <div className="bg-yellow-500/10 text-yellow-700 px-4 py-2 rounded-2xl flex items-center gap-2 border border-yellow-200">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-bold">
                {user.credits} Credits Available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal & Contact */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <UserIcon className="h-5 w-5 text-primary" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <InfoBlock label="Occupation" value={user.profile?.occupation} />
              <InfoBlock label="Gender" value={user.profile?.gender} />
              <InfoBlock label="Religion" value={user.profile?.religion} />
              <InfoBlock
                label="Household"
                value={user.profile?.householdType}
              />
              <InfoBlock
                label="Member Since"
                value={formatDate(user.createdAt)}
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 ">
                <Phone className="h-5 w-5 text-primary" /> Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <InfoBlock
                label="Mobile Number"
                value={user.profile?.mobileNumber}
              />
              <InfoBlock label="WhatsApp" value={user.profile?.whatsapp} />
              <div className="pt-2 flex gap-4">
                {user.profile?.facebook && (
                  <a
                    href={user.profile.facebook}
                    className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {user.profile?.whatsapp && (
                  <a
                    href={`https://wa.me/${user.profile.whatsapp}`}
                    className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Address, Finance & Verification */}
        <div className="lg:col-span-2 space-y-8">
          {/* Address Card */}
          <Card className="rounded-2xl shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Permanent Address
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Details</p>
                  <p className="font-medium text-lg leading-relaxed">
                    {user.address?.details}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoBlock label="Upazila" value={user.address?.upazila} />
                  <InfoBlock label="District" value={user.address?.district} />
                  <InfoBlock label="Division" value={user.address?.division} />
                  <InfoBlock label="Post Code" value={user.address?.postCode} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity & Finance */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                  <Landmark className="h-4 w-4 text-primary" /> Financial Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoBlock
                  label="Bank Account"
                  value={user.profile?.bankAccount || "N/A"}
                />
                <InfoBlock
                  label="Mobile Banking"
                  value={user.profile?.mobileBanking || "N/A"}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                  <Shield className="h-4 w-4 text-primary" /> Verification IDs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoBlock label="NID Number" value={user.profile?.nidNumber} />
              </CardContent>
            </Card>
          </div>

          {/* Legal Declarations */}
          {(session.user.id === user.id || session.user.role === "ADMIN") && (
            <Card className="rounded-2xl overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Declaration &
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-x divide-y md:divide-y-0">
                  <div className="p-6 space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Self Photo
                    </p>
                    <div className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-muted shadow-inner">
                      <Image
                        fill
                        src={user.declaration?.photo || ""}
                        alt="Official Photo"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                      E-Signature
                    </p>
                    <div className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-muted bg-white">
                      <Image
                        fill
                        src={user.declaration?.signature || ""}
                        alt="Signature"
                        className="object-contain p-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 divide-x divide-y md:divide-y-0">
                  <div className="p-6 space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Nid Front Side
                    </p>
                    <div className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-muted shadow-inner">
                      <Image
                        fill
                        src={user.profile?.attachment1 || ""}
                        alt="Nid Front Side"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Nid Back Side
                    </p>
                    <div className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-muted bg-white">
                      <Image
                        fill
                        src={user.profile?.attachment2 || ""}
                        alt="Nid Back Side"
                        className="object-contain p-4"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: Props) {
  return (
    <div className="bg-accent">
      <Suspense
        fallback={
          <div className="min-h-screen flex justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <Profile params={params} />
      </Suspense>
    </div>
  );
}
