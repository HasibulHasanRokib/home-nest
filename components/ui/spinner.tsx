import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = React.ComponentProps<"svg"> & {
  text?: string;
};

function Spinner({ className, text = "Please wait", ...props }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2">
      <LoaderIcon
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
      <span>{text}</span>
    </div>
  );
}

export { Spinner };
