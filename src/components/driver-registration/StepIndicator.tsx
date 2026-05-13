interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className="flex items-center gap-1.5">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              currentStep > step
                ? 'bg-green-500 text-white'
                : currentStep === step
                ? 'bg-[#F4D03F] text-[#1E1E2F]'
                : 'bg-[#0F0B1A] text-[#A0A0B0] border border-white/10'
            }`}
          >
            {currentStep > step ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              step
            )}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-5 h-0.5 rounded ${currentStep > step ? 'bg-green-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}