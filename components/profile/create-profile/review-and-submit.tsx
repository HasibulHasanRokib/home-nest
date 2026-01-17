"use client";

import Image from "next/image";
import { useState } from "react";
import { ProfileDataType } from "@/lib/types/profile-data-type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Role } from "@/lib/generated/prisma/enums";
import { reviewAndSubmitAction } from "@/app/profile/create/actions";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";

interface ReviewAndSubmitProps {
  profileData?: ProfileDataType;
  role: Role;
}

export function ReviewAndSubmit({ profileData, role }: ReviewAndSubmitProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await reviewAndSubmitAction();
      if (res.error) {
        toast(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const profile = profileData?.profile;
  const address = profileData?.address;
  const declaration = profileData?.declaration;

  const renderText = (label: string, value?: string | number | null) => (
    <div className="space-y-2">
      <h5 className="text-sm font-medium">{label}</h5>
      <Input className="capitalize" value={value || "N/A"} readOnly />
    </div>
  );
  const renderLinkField = (label: string, value?: string | null) => (
    <div className="space-y-2">
      <h5 className="text-sm font-medium">{label}:</h5>
      <Input className="text-sm" value={value || "N/A"} readOnly />
    </div>
  );

  const renderImageField = (label: string, value?: string | null) => (
    <div className="space-y-2">
      <h5 className="text-sm font-medium">{label}</h5>
      {value ? (
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative h-44 w-full cursor-pointer rounded-md border">
              <Image src={value} alt={label} fill className="object-contain" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <div className="relative h-[70vh] w-full">
              <Image src={value} alt={label} fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Input value="Not Provided" readOnly />
      )}
    </div>
  );

  const renderDeclaration = () => (
    <Card>
      <CardHeader>
        <CardTitle>Declaration & Acknowledgment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          I hereby confirm that all information provided is correct and
          complete.
        </p>

        <div className="flex items-start gap-2">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(v) => setConfirmed(!!v)}
          />
          <label htmlFor="confirm" className="text-sm text-muted-foreground">
            I acknowledge that once submitted, this information cannot be
            changed.
          </label>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          disabled={isLoading}
          variant="outline"
          onClick={() => {
            const step = params.step ? Number(params.step) : 1;
            router.push(`/profile/create/${step - 1}`);
          }}
        >
          Previous
        </Button>
        <Button
          type="submit"
          disabled={!confirmed || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? <Spinner /> : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );

  if (profile && address) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderText("Nid Number", profile.nidNumber)}
            {renderText("Passport Number", profile.passportNumber)}
            {renderText(
              "Birth Certificate Number",
              profile.birthCertificateNumber
            )}
            {renderText("Occupation", profile.occupation)}
            {role === "TENANT" &&
              renderText(
                "Household Type",
                profile.householdType?.toLowerCase()
              )}
            {role === "TENANT" && renderText("Family Size", profile.familySize)}

            {renderText("Gender", profile.gender.toLowerCase())}
            {renderText("Religion", profile.religion.toLowerCase())}
            {renderText("Date of Birth", formatDate(profile.dateOfBirth))}
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {renderText("Present Division", address.presentDivision)}
              {renderText("Present District", address.presentDistrict)}
              {renderText("Present Upazila", address.presentUpazila)}
              {renderText("Present Post Office", address.presentPostOffice)}
              {renderText("Present Post Office code", address.presentPostCode)}
            </div>

            <div className="space-y-2">
              {renderText("Permanent Division", address.permanentDivision)}
              {renderText("Permanent District", address.permanentDistrict)}
              {renderText("Permanent Upazila", address.permanentUpazila)}
              {renderText("Permanent Post Office", address.permanentPostOffice)}
              {renderText(
                "Permanent Post Office code",
                address.permanentPostCode
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Social media Information</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderLinkField("Facebook", profile?.facebook)}
            {renderLinkField("Twitter", profile?.twitter)}
            {renderLinkField("Linkedin", profile?.linkedin)}
            {renderLinkField("Whatsapp", profile?.whatsapp)}
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderImageField("Attachment 1", profile.attachment1)}
            {renderImageField("Attachment 2", profile.attachment2)}
            {renderImageField("Profile Picture", declaration?.photo)}
            {renderImageField("Signature", declaration?.signature)}
          </CardContent>
        </Card>

        {renderDeclaration()}
      </div>
    );
  }

  return null;
}
