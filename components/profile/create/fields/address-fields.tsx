import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  errors?: Record<string, string[]>;
}

export function AddressFields({ errors }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95  py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold capitalize">Address Information</h2>
        <p className="text-gray-500">
          Please provide your address information below.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="division">Division*</Label>
          <Input
            id="division"
            name="division"
            placeholder="Enter division name"
          />
          {errors?.division && (
            <p className="text-destructive text-sm">{errors.division[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District*</Label>
          <Input
            id="district"
            name="district"
            placeholder="Enter district name"
          />
          {errors?.district && (
            <p className="text-destructive text-sm">{errors.district[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="upazila">Upazila*</Label>
          <Input id="upazila" name="upazila" placeholder="Enter upazila name" />
          {errors?.upazila && (
            <p className="text-destructive text-sm">{errors.upazila[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postOffice">Post Office*</Label>
          <Input
            id="postOffice"
            name="postOffice"
            placeholder="Enter postOffice name"
          />
          {errors?.postOffice && (
            <p className="text-destructive text-sm">{errors.postOffice[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postCode">Post Code*</Label>
          <Input id="postCode" name="postCode" placeholder="Enter postCode" />
          {errors?.postCode && (
            <p className="text-destructive text-sm">{errors.postCode[0]}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="details">Details*</Label>
        <Textarea
          id="details"
          name="details"
          placeholder="Enter details about your address"
        />
        {errors?.details && (
          <p className="text-destructive text-sm">{errors.details[0]}</p>
        )}
      </div>
    </div>
  );
}
