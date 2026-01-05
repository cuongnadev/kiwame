interface StepperProgressBarProps {
    currentStep: number,
    handleStepClick: (stepId: number) => void,
    error: string
}

export default function StepperProgressBar({ currentStep, handleStepClick, error}: StepperProgressBarProps) {
    const steps = [
        { id: 1, label: 'Chi tiết', type:"detail" },
        // { id: 2, label: 'Các thành phần của video', type:"component"},
        { id: 2, label: 'Chế độ hiển thị', type:"visibility" },
    ]

    return (
        <>
            <div className="w-full p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex items-center justify-between">
                        {/* Progress line */}
                        <div className="absolute top-11 h-0.5 bg-neutral-700" style={{ left: '210px', right: '210px' }}>
                            <div
                                className="h-full bg-white transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                        

                        {/* Steps */}
                        {steps.map((step, index) => {
                            const isCompleted = step.id < currentStep;
                            const isCurrent = step.id === currentStep;
                            const isUpcoming = step.id > currentStep;
                            const isError = error === step.type;

                            return (
                                <div
                                    key={step.id}
                                    className="relative flex flex-col items-center cursor-pointer group"
                                    style={{ width: `${100 / steps.length}%` }}
                                    onClick={() => handleStepClick(step.id)}
                                >
                                    {/* Labels */}
                                    <div className=" text-center">
                                        <div
                                            className={`
                                              text-sm font-semibold transition-colors
                                              ${isError ? 'text-red-400' : isCurrent || isCompleted ? 'text-white' : 'text-neutral-500'}
                                            `}
                                        >
                                            {step.label}
                                        </div>
                                    </div>
                                    {/* Circle indicator */}
                                    <div
                                        className={`
                                          w-5 h-5 rounded-full flex items-center justify-center 
                                          transition-all duration-300 relative z-10 mt-4
                                          ${isCompleted ? 'bg-white' : ''}
                                          ${isError ? 'bg-red-400 ring-4 ring-red-400 ring-opacity-30' :isCurrent ? 'bg-white ring-4 ring-white ring-opacity-30' : ''}
                                          ${isUpcoming ? 'bg-neutral-900 border-2 border-neutral-600' : ''}
                                        `}
                                    >
                                        {isCompleted && (
                                            <svg className="w-6 h-6 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {(isCurrent || isError) && (
                                            <div className="w-3 h-3 bg-neutral-900 rounded-full" />
                                        )}
                                        {isUpcoming && (
                                            <div className="w-3 h-3 bg-neutral-600 rounded-full" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    
                </div>
            </div>
        </>
    )
}