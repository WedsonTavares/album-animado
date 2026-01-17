import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Voltar',
  nextButtonText = 'Continuar',
  disableStepIndicators = false,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="w-full" {...rest}>
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1;
          const isNotLastStep = index < totalSteps - 1;
          return (
            <React.Fragment key={stepNumber}>
              <StepIndicator
                step={stepNumber}
                disableStepIndicators={disableStepIndicators}
                currentStep={currentStep}
                onClickStep={(clicked) => {
                  setDirection(clicked > currentStep ? 1 : -1);
                  updateStep(clicked);
                }}
              />
              {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <StepContentWrapper
        isCompleted={isCompleted}
        currentStep={currentStep}
        direction={direction}
      >
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>

      {/* Navigation Buttons */}
      {!isCompleted && (
        <div className={`flex mt-6 ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
          {currentStep !== 1 && (
            <button
              onClick={handleBack}
              type="button"
              className="btn btn-secondary"
            >
              {backButtonText}
            </button>
          )}
          <button
            onClick={isLastStep ? handleComplete : handleNext}
            type="button"
            className="btn btn-primary"
          >
            {isLastStep ? 'Finalizar' : nextButtonText}
          </button>
        </div>
      )}
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      className="relative overflow-hidden"
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="absolute left-0 right-0 top-0"
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div>{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators = false }: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`cursor-pointer ${disableStepIndicators ? 'cursor-default' : ''}`}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { 
            scale: 1, 
            backgroundColor: '#27272a',
          },
          active: { 
            scale: 1, 
            backgroundColor: '#8b5cf6',
          },
          complete: { 
            scale: 1, 
            backgroundColor: '#8b5cf6',
          },
        }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
      >
        {status === 'complete' ? (
          <CheckIcon className="w-5 h-5 text-white" />
        ) : status === 'active' ? (
          <div className="w-3 h-3 bg-white rounded-full" />
        ) : (
          <span className="text-muted-foreground">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  return (
    <div className="w-12 h-0.5 bg-border relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-primary"
        initial={false}
        animate={{ width: isComplete ? '100%' : '0%' }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
