import { ConfirmActionButton } from "@/components/confirm-action-button";
import { signOutAction } from "./actions";

export function SignOut() {
  return (
    <form action={signOutAction}>
      <ConfirmActionButton variant="ghost" text="Sign out" />
    </form>
  );
}
