import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex md:min-h-screen justify-center items-center">
      <Spinner className="size-8" />
    </div>
  );
}
