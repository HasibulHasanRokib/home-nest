import { FormState } from "@/actions/profile.actions";
import { AccountTypeFields } from "@/components/profile/create/fields/account-type-fields";
import { PersonalInfoFields } from "@/components/profile/create/fields/personal-info-fields";
import { AddressFields } from "@/components/profile/create/fields/address-fields";
import { DeclarationFields } from "@/components/profile/create/fields/declaration-fields";
import { SuccessFiled } from "./fields/success-filed";

interface Props {
  state: FormState;
}

export function StepForms({ state }: Props) {
  switch (state.step) {
    case 1:
      return <AccountTypeFields errors={state.errors} />;
    case 2:
      if (!state.role) return null;
      return <PersonalInfoFields role={state.role} errors={state.errors} />;
    case 3:
      return <AddressFields errors={state.errors} />;
    case 4:
      return <DeclarationFields errors={state.errors} />;
    case 5:
      return <SuccessFiled />;
    default:
      return null;
  }
}
