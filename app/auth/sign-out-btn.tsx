import { signoutAction } from "@/actions/auth.actions";
import { ActionButton } from "@/components/action-button";

export function SignOut() {
  return (
    <form action={signoutAction}>
      <ActionButton variant="ghost" text="Sign out" />
    </form>
  );
}
