interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Account type" },
  { id: 2, label: "Personal information" },
  { id: 3, label: "Address information" },
  { id: 4, label: "Declaration" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => (
          <li
            key={step.id}
            className={`flex items-center ${idx !== steps.length - 1 ? "w-full" : ""}`}
          >
            <div className="relative flex flex-col items-center group">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300
                ${
                  currentStep > step.id
                    ? "bg-primary border-primary text-white"
                    : currentStep === step.id
                      ? "border-primary text-primary ring-4 ring-primary/5"
                      : "border-gray-300 text-gray-400"
                }
              `}
              >
                {currentStep > step.id ? (
                  <CheckIcon />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>

              <span
                className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap
                ${currentStep === step.id ? "text-primary" : "text-gray-500"}
              `}
              >
                {step.label}
              </span>
            </div>

            {idx !== steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors duration-500 
                ${currentStep > step.id ? "bg-primary" : "bg-gray-200"}`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
