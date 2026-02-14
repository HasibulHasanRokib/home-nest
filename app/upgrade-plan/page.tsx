import { UpgradePlan } from "./upgrade-plan";

export const metadata = {
  title: "Upgrade Plan",
};

export default function Page() {
  return (
    <div className="min-h-screen flex justify-center items-center p-2">
      <UpgradePlan />
    </div>
  );
}
