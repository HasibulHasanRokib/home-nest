import { Label } from "@/components/ui/label";

interface Props {
  errors?: Record<string, string[]>;
}
export function AccountTypeFields({ errors }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95  py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Welcome!</h2>
        <p className="text-gray-500">How will you be using the platform?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Label
          htmlFor="owner-radio"
          className="relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-primary/5 has-checked:border-primary has-checked:bg-primary/5"
        >
          <input
            type="radio"
            id="owner-radio"
            name="role"
            value="OWNER"
            className="sr-only"
          />
          <span className="text-4xl mb-2">🏠</span>
          <span className="font-bold ">Property Owner</span>
          <span className="text-xs text-gray-500 text-center mt-1">
            I want to list and manage my properties
          </span>
        </Label>

        <Label
          htmlFor="tenant-radio"
          className="relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all hover:bg-primary/5 has-checked:border-primary has-checked:bg-primary/5"
        >
          <input
            type="radio"
            id="tenant-radio"
            name="role"
            value="TENANT"
            className="sr-only"
          />
          <span className="text-4xl mb-2">🔑</span>
          <span className="font-bold">Tenant</span>
          <span className="text-xs text-gray-500 text-center mt-1">
            I am looking for a place to rent
          </span>
        </Label>
      </div>

      {errors?.role && (
        <p className="text-destructive text-center text-sm font-medium">
          {errors.role[0]}
        </p>
      )}
    </div>
  );
}
