interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <span className="text-sm font-medium text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-colors ${
              i < currentStep ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
