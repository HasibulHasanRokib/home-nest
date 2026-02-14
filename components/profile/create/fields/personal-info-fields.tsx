import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Gender,
  HouseholdType,
  Religion,
  Role,
} from "@/lib/generated/prisma/enums";
import { useState } from "react";

interface Props {
  role: Role;
  errors?: Record<string, string[]>;
}

export function PersonalInfoFields({ role, errors }: Props) {
  const [attachmentTypeOne, setAttachmentTypeOne] = useState<string[]>([]);
  const [attachmentTypeTwo, setAttachmentTypeTwo] = useState<string[]>([]);
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95  py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold capitalize">
          {role.toLowerCase()} personal information
        </h2>
        <p className="text-gray-500">
          Please provide your personal information below.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="nidNumber">NID Number*</Label>
          <Input id="nidNumber" name="nidNumber" placeholder="Enter NID" />
          {errors?.nidNumber && (
            <p className="text-destructive text-sm">{errors.nidNumber[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Phone Number*</Label>
          <Input
            id="mobileNumber"
            name="mobileNumber"
            placeholder="Enter Phone Number"
          />
          {errors?.mobileNumber && (
            <p className="text-destructive text-sm">{errors.mobileNumber[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth*</Label>
          <Input type="date" id="dateOfBirth" name="dateOfBirth" />
          {errors?.dateOfBirth && (
            <p className="text-destructive text-sm">{errors.dateOfBirth[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation*</Label>
          <Input
            id="occupation"
            name="occupation"
            placeholder="Your occupation"
          />
          {errors?.occupation && (
            <p className="text-destructive text-sm">{errors.occupation[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender*</Label>
          <Select name="gender">
            <SelectTrigger className="w-full capitalize">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>

            <SelectContent>
              {Object.values(Gender).map((g) => (
                <SelectItem key={g} value={g} className="capitalize">
                  {g.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.gender && (
            <p className="text-destructive text-sm">{errors.gender[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion*</Label>
          <Select name="religion">
            <SelectTrigger className="w-full capitalize">
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>

            <SelectContent>
              {Object.values(Religion).map((r) => (
                <SelectItem key={r} value={r} className="capitalize">
                  {r.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.religion && (
            <p className="text-destructive text-sm">{errors.religion[0]}</p>
          )}
        </div>
        {role === "TENANT" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="householdType">Household Type*</Label>
              <Select name="householdType">
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(HouseholdType).map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.householdType && (
                <p className="text-destructive text-sm">
                  {errors.householdType[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="familySize">Family member*</Label>
              <Input
                id="familySize"
                name="familySize"
                placeholder="Your family member"
              />
              {errors?.familySize && (
                <p className="text-destructive text-sm">
                  {errors.familySize[0]}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                name="bankAccount"
                placeholder="Enter number"
              />
              {errors?.bankAccount && (
                <p className="text-destructive text-sm">
                  {errors.bankAccount[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileBanking">Bkash/Nagad number</Label>
              <Input
                id="mobileBanking"
                name="mobileBanking"
                placeholder="Enter number"
              />
              {errors?.mobileBanking && (
                <p className="text-destructive text-sm">
                  {errors.mobileBanking[0]}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <div className="grid md:grid-cols-2 gap-2">
          <Input
            type="hidden"
            name="attachment1"
            value={attachmentTypeOne[0] ?? []}
          />
          <Input
            type="hidden"
            name="attachment2"
            value={attachmentTypeTwo[0] ?? []}
          />
          <div className="space-y-2">
            <Label htmlFor="attachment1">Nid front side*</Label>
            <ImageUpload
              onUploadSuccess={(urls) => setAttachmentTypeOne(urls)}
              defaultFiles={attachmentTypeOne}
            />
            {errors?.attachment1 && (
              <p className="text-destructive text-sm">
                {errors.attachment1[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachment2">Nid back side*</Label>
            <ImageUpload
              onUploadSuccess={(urls) => setAttachmentTypeTwo(urls)}
              defaultFiles={attachmentTypeTwo}
            />
            {errors?.attachment2 && (
              <p className="text-destructive text-sm">
                {errors.attachment2[0]}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            placeholder="Enter Facebook URL"
          />
          {errors?.facebook && (
            <p className="text-destructive text-sm">{errors.facebook[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">Whatsapp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            placeholder="Enter Whatsapp Number"
          />
          {errors?.whatsapp && (
            <p className="text-destructive text-sm">{errors.whatsapp[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
}
