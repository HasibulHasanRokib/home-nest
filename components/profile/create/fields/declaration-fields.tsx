import { ImageUpload } from "@/components/image-upload";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Props {
  errors?: Record<string, string[]>;
}

export function DeclarationFields({ errors }: Props) {
  const [profileImage, setProfileImage] = useState<string[]>([]);
  const [signature, setSignature] = useState<string[]>([]);
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95  py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold capitalize">Declaration</h2>
        <p className="text-gray-500">Please provide your documents below.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <input type="hidden" name="photo" value={profileImage[0]} />
        <input type="hidden" name="signature" value={signature[0]} />
        <div className="space-y-2">
          <Label htmlFor="photo">Your Image*</Label>
          <ImageUpload
            onUploadSuccess={(urls) => setProfileImage(urls)}
            defaultFiles={profileImage}
          />
          {errors?.photo && (
            <p className="text-destructive text-sm">{errors.photo[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signature">Your Signature*</Label>
          <ImageUpload
            removeBg={true}
            onUploadSuccess={(urls) => setSignature(urls)}
            defaultFiles={signature}
          />
          {errors?.signature && (
            <p className="text-destructive text-sm">{errors.signature[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
}
