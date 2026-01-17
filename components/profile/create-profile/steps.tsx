"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

type StepData = {
  title: string;
  description: string;
  required: boolean;
  url: string;
};

type StepsProps = {
  steps: StepData[];
};

const BATCH_SIZE = 3;

export function Steps({ steps }: StepsProps) {
  const pathname = usePathname();

  const currentIndex = steps.findIndex((step) => pathname.endsWith(step.url));

  const batchStart =
    currentIndex >= 0 ? Math.floor(currentIndex / BATCH_SIZE) * BATCH_SIZE : 0;

  const batchEnd = Math.min(batchStart + BATCH_SIZE, steps.length);

  const visibleSteps = steps.slice(batchStart, batchEnd);

  return (
    <Card className="mb-3 p-0">
      <ol className="overflow-x-auto rounded-md shadow lg:flex lg:rounded-none">
        {visibleSteps.map((step, i) => {
          const globalIndex = batchStart + i;
          const isCompleted = globalIndex < currentIndex;
          const isCurrent = globalIndex === currentIndex;

          return (
            <li
              key={step.title}
              className="relative min-w-50 overflow-hidden lg:flex-1"
            >
              <div>
                <span
                  className={cn(
                    "absolute top-0 left-0 h-full w-1 rounded-2xl lg:top-auto lg:bottom-0 lg:h-1 lg:w-full",
                    isCompleted
                      ? "bg-primary"
                      : isCurrent
                      ? "bg-primary/60"
                      : "bg-gray-200"
                  )}
                  aria-hidden="true"
                />

                <span
                  className={cn(
                    i !== 0 ? "lg:pl-9" : "",
                    "flex items-center px-6 py-4 font-medium"
                  )}
                >
                  <span className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="text-primary h-6 w-6" />
                    ) : isCurrent ? (
                      <Circle className="h-6 w-6 text-gray-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </span>
                  <span className="mt-0.5 ml-4 flex h-full min-w-0 flex-col justify-center">
                    <span
                      className={cn("text-sm font-semibold", {
                        "text-gray-500": isCurrent && !isCompleted,
                        "text-primary": isCompleted,
                      })}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </span>
                {i !== 0 ? (
                  <div className="absolute inset-0 hidden w-3 lg:block">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 12 82"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0V31L10.5 41L0.5 51V82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
