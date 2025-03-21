import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface StepsProps {
  currentStep: number;
}

export function Steps({ currentStep }: StepsProps) {
  const steps = [
    { id: 1, name: "Organization" },
    { id: 2, name: "Admin" },
    { id: 3, name: "Profile Image" },
    { id: 4, name: "Complete" },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative flex-1 ${
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            }`}
          >
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 flex items-center",
                stepIdx === steps.length - 1 ? "hidden" : "flex"
              )}
            >
              <div
                className={`h-0.5 w-full ${
                  stepIdx < currentStep - 1 ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                step.id < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.id === currentStep
                  ? "border-2 border-primary bg-background"
                  : "border-2 border-muted bg-background"
              }`}
            >
              {step.id < currentStep ? (
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
              <span className="sr-only">{step.name}</span>
            </div>
            <div className="mt-2 text-center text-sm font-medium">
              {step.name}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
